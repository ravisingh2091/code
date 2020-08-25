import {Request, Response, NextFunction} from 'express';
import {CommonUtils} from '../../utils/common';
import * as XLSX from 'xlsx';
import CONSTANT from '../../config/env.config';
import QueryBuilder from '../../models/QueryBuilder';
import {DataUtils} from '../../utils/data';
import {ValidationUtils} from '../../utils/validation';
import DocumentController from './../Document/DocumentController';
import * as fs from 'fs';
import * as util from 'util';

const readFile = util.promisify(fs.readFile);

export default class DataController { 
    
    /**
     * Main data handler
     *  
     * @param req 
     * @param res 
     * @param next 
     */
    static async handleFileData(req: Request, res: Response, next: NextFunction) {
      try {
        const dataInfo = await DataUtils.getSftpFileData(CONSTANT.CLIENT);
        console.log(dataInfo)
      } catch (error) {
        const errorOject = CommonUtils.generateErrorObject('DEFAULT_ERROR', error);
        next(errorOject);
        return;
      }
    }

    /**
     * Main data handler
     * This function is mainly for testing 
     * This is for handling data but get file in request instead get file from SFTP server.
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    static async getFileData(req: Request, res: Response, next: NextFunction) {
      try {
        //@ts-ignore
        global.request = req.body;
        
        // Get sample format that define for client data file
        const format = await QueryBuilder.Find('SampleFormat', {client: CONSTANT.CLIENT})
        if(!format) {
          const errorOject = CommonUtils.generateErrorObject('RESOURCE_NOT_FOUND');
          next(errorOject);
          return;
        }

        if(!req.file){
          const errorOject = CommonUtils.generateErrorObject('FILE_REQUIRED');
          next(errorOject);
          return;
        }

        let appBufferData, sellerBufferData, s3Key
        const isZip = CommonUtils.checkFileExtension(req.file.originalname, 'zip')
        if(isZip){
          const tempDir = await CommonUtils.extractZip(req.file);

          // Check file exist in temp directory
          try{
            appBufferData = await readFile(`${tempDir}/${format.mapping.file}`)
            if(format.mapping.seller){
              sellerBufferData = await readFile(`${tempDir}/${format.mapping.seller.file}`)
            }

            await CommonUtils.removeFilesinDirectory()
          } catch(err) {
            console.log("err #-- ", err)
            const errorOject = CommonUtils.generateErrorObject('INVALID_FILE', err);
            next(errorOject);
            return;
          }

        }else{
          appBufferData = sellerBufferData = req.file.buffer;
          
          // Check for the file type
          const isTypeMatch: boolean = CommonUtils.checkFileExtension(req.file.originalname, format.file_type);
          if(!isTypeMatch){
            const errorOject = CommonUtils.generateErrorObject('INVALID_FILE');
            next(errorOject);
            return;
          }
        }
        
        if(CONSTANT.SAVE_FILE === '1'){
          // Save in zip format if is zip file
          let fileLogData: any = await CommonUtils.uploadFileToS3(req.file.buffer, req.file.originalname)
          s3Key = fileLogData.key
        }
        
        // Return Response instantly
        if(req.body.instant == 'true') CommonUtils.createSuccessResponse(req, res, null)
    
        // Read XLSX file
        const jsonData: Array<any> = await CommonUtils.readFromXlsx(appBufferData, format.mapping.sheet);
        
        // Get seller data
        let sellerJsonData: Array<any>;
        if(req.body.backend != 'true' && format.mapping.seller){
          const {sheet: sellerFileSheet} = format.mapping.seller;
          sellerJsonData = await CommonUtils.readFromXlsx(sellerBufferData, sellerFileSheet);
        }

        let dataInfo: any;
        // Handle file data
        if(req.body.backend == 'true') dataInfo = await DataUtils.handleBackendData(jsonData, format)
        else dataInfo = await DataUtils.handleData(jsonData, format, 'file', sellerJsonData)

        // Save file processing result against s3 file upload
        if(CONSTANT.SAVE_FILE === '1') await DocumentController.updateResultForDocumentKey(s3Key, dataInfo)
        
        // Return Response 
        if(req.body.instant == 'true') CommonUtils.saveResponse(req, res, dataInfo)
        else CommonUtils.createSuccessResponse(req, res, dataInfo)
          
      } catch (error) {
        console.log("err - ", error)
        const errorOject = CommonUtils.generateErrorObject('DEFAULT_ERROR');
        next(errorOject);
        return;
      }
    }

    /**
     * Main data handler
     *  
     * @param req 
     * @param res 
     * @param next 
     */
    static async handleJsonData(req: Request, res: Response, next: NextFunction) {
      try {
        const { backend, instant, data } = req.body;
        // Get sample format that define for client data file
        QueryBuilder.Find('SampleFormat', {client: CONSTANT.CLIENT}).then( async (format: any) => {
          if(!format) {
            const errorOject = CommonUtils.generateErrorObject('RESOURCE_NOT_FOUND');
            next(errorOject);
            return;
          }

          // Return Response
          if(instant == 'true') CommonUtils.createSuccessResponse(req, res, null)

          let dataInfo: any;
          // Handle file data
          if(backend == 'true') dataInfo = await DataUtils.handleBackendData(data, format);
          else dataInfo = await DataUtils.handleData(data, format, 'json');
          
          // Return Response 
          if(instant == 'true') CommonUtils.saveResponse(req, res, dataInfo)
          else CommonUtils.createSuccessResponse(req, res, dataInfo)
          
        });

      } catch (error) {
        const errorOject = CommonUtils.generateErrorObject('DEFAULT_ERROR', error);
        next(errorOject);
        return;
      }
    }

    /**
     * User data handler for json data
     *  
     * @param req 
     * @param res 
     * @param next 
     */
    static async handleUserData(req: Request, res: Response, next: NextFunction) {
      try {
        let data = req.body;
        // Get sample format that define for client data file
        QueryBuilder.Find('SampleFormat', {client: CONSTANT.CLIENT}).then( async (format: any) => {
          if(!format) {
            const errorOject = CommonUtils.generateErrorObject('RESOURCE_NOT_FOUND');
            next(errorOject);
            return;
          }

          // Handle file data
          let {userInfo, duplicate, error}: any = await DataUtils.handleUserData(data, format)
          if(error){
            const errorOject = CommonUtils.generateErrorObject('VALIDATION', error.errors || error);
            next(errorOject);
            return;
          }

          // Return Response 
          CommonUtils.createSuccessResponse(req, res, {...userInfo, duplicate});
        });

      } catch (error) {
        const errorOject = CommonUtils.generateErrorObject('DEFAULT_ERROR', error);
        next(errorOject);
        return;
      }
    }

    /**
     * Application data handler for json data
     *  
     * @param req 
     * @param res 
     * @param next 
     */
    static async handleApplicationData(req: Request, res: Response, next: NextFunction) {
      try {
        let data = req.body;
        // Get sample format that define for client data file
        QueryBuilder.Find('SampleFormat', {client: CONSTANT.CLIENT}).then( async (format: any) => {
          if(!format) {
            const errorOject = CommonUtils.generateErrorObject('RESOURCE_NOT_FOUND');
            next(errorOject);
            return;
          }

          // Handle file data
          let {applicationInfo, error}: any = await DataUtils.handleApplicationData(data, format)
          if(error){
            const errorOject = CommonUtils.generateErrorObject('VALIDATION', error.errors || error);
            next(errorOject);
            return;
          }

          // Return Response 
          CommonUtils.createSuccessResponse(req, res, applicationInfo);
        });

      } catch (error) {
        const errorOject = CommonUtils.generateErrorObject('DEFAULT_ERROR', error);
        next(errorOject);
        return;
      }
    }

}
