import QueryBuilder from '../models/QueryBuilder';
import ApplicationController from '../controllers/Application/ApplicationController';
import {addOnData} from '../controllers/Application/ApplicationInterface';
import {requestTypeValue, result} from '../controllers/Data/DataInterface';
import UserController from '../controllers/User/UserController';
import OwnerController from '../controllers/Owner/OwnerController';
import DocumentController from '../controllers/Document/DocumentController';
import SellerController from '../controllers/Seller/SellerController';
import CommunicationController from '../controllers/Communication/CommunicationController';
import {CommonUtils} from './common';
import CONSTANT from '../config/env.config';
import {ValidationUtils} from '../utils/validation';

export class DataUtils {

   /**
     * Get sample format that define for client data file
     * 
     * @param client 
     */
    static async getClientFormat(client: string){
      return QueryBuilder.Find('SampleFormat', {client: client})
        .then( async (format: any) => {
          if(format){
            return format
          }
          return false
        })
        .catch( (error: any) => {
          throw error
        })
    }

    /**
     * Get distinct application from given file data
     * 
     * @param filedata
     * @param identifierKey 
     */
    static getDistinctApplication(filedata: Array<any>, identifierKey: string){
      let application: Array<any> = [];
      filedata.filter((item: any) => {
        var i = application.findIndex((x: any) => x[identifierKey] == item[identifierKey]);
        if(i <= -1 && item[identifierKey]){
          application.push(item);
        }
        return null;
      });
      return application;
    }

    /**
     * Get distinct owners of the application from given file data
     * Because multiple rows defines multiple owners of the same application
     * 
     * @param filedata 
     * @param identifierKey 
     * @param identifierValue 
     */
    static getAllApplicationOwners(filedata: Array<any>, identifierKey: string, identifierValue: string){
      let owners: Array<any> = filedata.filter((item: any) => {
        return item[identifierKey] === identifierValue
      });

      return owners;
    }

    /**
     * Function read file from SFTP server and use that data to create and save applications
     * 
     * @param client 
     */
    static async getSftpFileData(client: string) {
      try {
        // Get sample format that define for client data file
        const format = await DataUtils.getClientFormat(client);
        if(format){
          // If file is in XLSX format 
          if(format.file_type === 'xlsx' && format.convert_to_json === true){

            const {file: appFile, file_path: appFilePath, sheet: appFileSheet, seller} = format.mapping
            // Get and read file from SFTP server
            const {bufferData: appBufferData, s3Key} = await CommonUtils.getFileFromSftp(appFilePath, appFile)
            console.log("bufferData -- ", appBufferData)
            const jsonData: Array<any> = await CommonUtils.readFromXlsx(<Buffer>appBufferData, appFileSheet);
            console.log("jsonData -- ", jsonData)

            // Get seller data
            let sellerJsonData: Array<any>;
            if(seller){
              const {file: sellerFile, file_path: sellerFilePath, sheet: sellerFileSheet} = format.mapping.seller;

              if(sellerFile){
                console.log("file exist - ")
                // Means seller data is in another file, so get and read file from SFTP server
                const {bufferData: sellerBufferData} = await CommonUtils.getFileFromSftp(sellerFilePath, sellerFile, 'seller')
                console.log("sellerBufferData -- ", sellerBufferData)
                sellerJsonData = await CommonUtils.readFromXlsx(<Buffer>sellerBufferData, sellerFileSheet);
                console.log("sellerJsonData -- ", sellerJsonData)
              }else{
                sellerJsonData = await CommonUtils.readFromXlsx(<Buffer>appBufferData, sellerFileSheet);
              }
            }
            
            // Handle file data to create application
            let dataInfo: any = await DataUtils.handleData(jsonData, format, 'file', sellerJsonData)
            // Save file processing status of file
            await DocumentController.updateResultForDocumentKey(s3Key, dataInfo)
            return dataInfo;
          }
          return false;
        } else {
          throw new Error('client format is missing');
        }
      } catch (error) {
        throw error
      }
    }

    /**
     * Handle client file data
     * Create user, application and save business, owner details for application
     * 
     * @param jsonData 
     * @param format 
     * @param dataFrom
     * @param sellerJsonData
     */
    static async handleData(jsonData: Array<any>, format: any, dataFrom: string = 'file', sellerJsonData?: Array<any>): Promise<any>{ 
      try{

        const validation = await QueryBuilder.Find('Validation', {client: CONSTANT.CLIENT});
        // Get distinct applications
        let applications: Array<any> = (dataFrom === 'file') ? DataUtils.getDistinctApplication(jsonData, format.mapping.identifier) : jsonData;
        
        let resultCount: result = {
          total: applications.length,
          success: 0,
          fail: 0,
          duplicate: 0,
          details: {}
        }

        const requests: any = applications.map(async (data: any) => {
            
            let appData: Array<any>
            let ownersData: Array<any>
            let sellerData: Array<any>
            let validationError: any = {}

            if(dataFrom === 'json') {
              let { owners, ...businessData } = data;
              appData = { ...owners[0], ...businessData }
            } else {
              appData = data;
            }

            // Get distinct owners of application
            ownersData = (dataFrom === 'file') ? DataUtils.getAllApplicationOwners(jsonData, format.mapping.identifier, data[format.mapping.identifier]) : data.owners
            
            // Check for validation
            if(validation){
              // App data validation
              const isValidate = ValidationUtils.validateData(ownersData, validation.app_validation, validation.sumup_validation)
              if(isValidate.length > 0){
                validationError.app_data = isValidate
              }
            }

            if(format.mapping.seller && sellerJsonData){
              const {identifier, identifier_value: identifierValue, sheet} = format.mapping.seller
              const sellerId: string = (identifierValue) ? data[identifierValue] : data[identifier];
              sellerData = await DataUtils.getSellerData(sellerJsonData, identifier, sellerId);
              
              // Check for validation
              if(validation){
                sellerData.map((jsonData: any, idx: any) => {
                  const sheetName = sheet[idx].substr(sheet[idx].lastIndexOf(':') + 1)
                  const isSellerValidate = ValidationUtils.validateData(jsonData, validation.seller_validation[idx])
                  if(isSellerValidate.length > 0 || jsonData.length == 0){
                    if(!validationError.seller_data) validationError.seller_data = {}
                    validationError.seller_data[sheetName] = (isSellerValidate.length > 0) ? isSellerValidate : "No Data" 
                  }
                })
              }
            }

            const identifier: string = appData[format.mapping.identifier];

            // Skip processing of application if there is validation error
            if(Object.keys(validationError).length > 0){
              resultCount.details[identifier] = validationError;
              resultCount.fail = resultCount.fail + 1
              return;
            }

            // Create user
            const { userInfo, error }: any = await UserController.saveUser(appData, format.mapping)
            if(!userInfo){
              resultCount.details[identifier] = error || 'Internal Reason';
              resultCount.fail = resultCount.fail + 1
              return;
            }
            const userId: string = userInfo.id

            // Create application and save business data
            const {businessInfo, duplicate: businessDuplicate}: any = await ApplicationController.saveApplication(appData, format.mapping, userId)
            if(!businessInfo){
              resultCount.details[identifier] = 'Internal Reason';
              resultCount.fail = resultCount.fail + 1
              return;
            }
                  
            const appId: string = (businessInfo.business && businessInfo.business.length > 0) ? businessInfo.business[0].app_id : businessInfo.app_id
            const requestType: requestTypeValue = (businessInfo.owners && businessInfo.owners.length > 0) ? requestTypeValue.UPDATE : requestTypeValue.CREATE;
            const addOn: addOnData = {
              app_id: appId,
              user_id: userId,
              slug: format.mapping.owner_slug
            }

            // Save owners
            let ownerInfo: any;
            if(format.mapping.owner) ownerInfo = await OwnerController.saveOwners(ownersData, format.mapping, addOn, requestType)
            if(format.mapping.owner && !ownerInfo){
              resultCount.details[identifier] = 'Internal Reason';
              resultCount.fail = resultCount.fail + 1
              return;
            }
                    
            // Save seller details
            if(sellerData){
              const isSellerRefExist = CommonUtils.findKeyByGivenKeyInArr(businessInfo.business_references, "seller-info", "type", "ref_id");
              const requestType: requestTypeValue = (isSellerRefExist) ? requestTypeValue.UPDATE : requestTypeValue.CREATE;
              const addOn: addOnData = {
                app_id: appId,
                user_id: userId,
                slug: format.mapping.seller_slug
              }
              await SellerController.saveSeller(sellerData, format.mapping.seller, addOn, requestType)
            }

            // Only returns true if owner is already saved
            if(format.mapping.owner && ownerInfo === true) {
              resultCount.details[identifier] = "Duplicate";
              resultCount.duplicate = resultCount.duplicate + 1
            }else if(!format.mapping.owner && businessDuplicate === true) {
              resultCount.details[identifier] = "Duplicate";
              resultCount.duplicate = resultCount.duplicate + 1
            }else{
              if(format.mapping.notify) await CommunicationController.notify(appData, format.mapping.notify, format.mapping.notify_slug)
              resultCount.details[identifier] = "Success";
              resultCount.success = resultCount.success + 1
            }
            return;
        })
        
        await Promise.all(requests);
        return resultCount;
      }catch(error){
        throw error
      }
    }

    /**
     * Handle backend file data
     * Create backend user
     * 
     * @param jsonData 
     * @param format 
     */
    static async handleBackendData(jsonData: Array<any>, format: any): Promise<any>{ 
      try{

        let resultCount = {
          total: jsonData.length,
          success: 0,
          fail: 0,
          duplicate: 0,
        }

        const requests: any = jsonData.map(async (data: any) => {
            const identifier: string = data[format.mapping.backend_user_identifier];
            // Create user
            const { duplicate, userInfo }: any = await UserController.saveUser(data, format.mapping, 'backend')
            if(duplicate === true){
              resultCount.duplicate = resultCount.duplicate + 1
            }else if(userInfo){
              resultCount.success = resultCount.success + 1
            }else{
              resultCount.fail = resultCount.fail + 1
            }
            return;
        })

        await Promise.all(requests);
        return resultCount;
      }catch(error){
        throw error
      }
    }

    /**
     * Get seller data for given seller id from file data
     * 
     * @param fileData
     * @param identifierKey
     * @param identifierValue 
     */
    static async getSellerData(fileData: Array<any>, identifierKey: string, identifierValue: string){
      let sellerData: any;

      // To check if seller data is in multiple sheets
      if(Array.isArray(fileData[0])){
        sellerData = [];
        const requests = fileData.map((sheetData: Array<any>) => {
          const sellerSheetData = sheetData.filter((item: any) => {
            return item[identifierKey] === identifierValue
          });
          sellerData.push(sellerSheetData);
        })
        await Promise.all(requests);
      } else {
        sellerData = fileData.filter((item: any) => item[identifierKey] === identifierValue);
      }
      
      return sellerData;
    }

    /**
     * Handle user json data
     * Create user
     * 
     * @param jsonData 
     * @param format 
     */
    static async handleUserData(data: any, format: any): Promise<any>{ 
      try{

        const validation = await QueryBuilder.Find('Validation', {client: CONSTANT.CLIENT});

        // Check for validation
        if(validation && validation?.user_validation){
          // App data validation
          const isValidate = ValidationUtils.validateData([data], validation.user_validation, '', 'json')
          if(isValidate.length > 0){
            return {
              error: isValidate 
            };
          }
        }

        // Create user
        const userInfo = await UserController.saveUser(data, format.mapping)
        return userInfo;
      }catch(error){
        throw error
      }
    }

    /**
     * Handle application json data
     * Create application, business and owner
     * 
     * @param jsonData 
     * @param format 
     */
    static async handleApplicationData(data: any, format: any): Promise<any>{ 
      try{

        const validation = await QueryBuilder.Find('Validation', {client: CONSTANT.CLIENT});

        // Check for validation
        if(validation && validation?.app_validation){
          const isValidate = ValidationUtils.validateData([data], validation.app_validation, '', 'json')
          if(isValidate.length > 0){
            return {
              error: isValidate 
            };
          }
        }

        const {user_id: userId, ...appData} = data;
        
        // Create application and save business data
        const {businessInfo}: any = await ApplicationController.saveApplication(appData, format.mapping, userId)
        if(!businessInfo){
          return {
            error: 'Internal Reason'
          }
        }

        const appId: string = (businessInfo.business && businessInfo.business.length > 0) ? businessInfo.business[0].app_id : businessInfo.app_id
        const requestType: requestTypeValue = (businessInfo.owners && businessInfo.owners.length > 0) ? requestTypeValue.UPDATE : requestTypeValue.CREATE;
        const addOn: addOnData = {
          app_id: appId,
          user_id: userId,
          slug: format.mapping.owner_slug
        }

        // Save owners
        let ownerInfo: any = await OwnerController.saveOwners(appData.owners, format.mapping, addOn, requestType)
        if(!ownerInfo){
          return {
            error: 'Internal Reason'
          }
        }

        let businessData = (businessInfo.business && businessInfo.business.length > 0) ? businessInfo.business[0] : businessInfo

        return {
          applicationInfo: {
            ...businessData,
            owners: businessInfo?.owners || ownerInfo
          }
        }
      }catch(error){
        throw error
      }
    }

}