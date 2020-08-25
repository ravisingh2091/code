import * as _ from 'lodash';
import * as uuidv1 from 'uuid/v1';
import {Request, Response} from 'express';
import {ResponseType} from '../controllers/RequestResponseLog/RequestResponseLogInterface'
import RequestResponseLogController from '../controllers/RequestResponseLog/RequestResponseLogController'
import s3 from '../client/s3.client';
import DocumentController from '../controllers/Document/DocumentController';
import * as sftpClient from 'ssh2-sftp-client';
import sftpConfig from '../client/sftp.client';
import * as XLSX from 'xlsx';
import {httpRequestUtils} from './http_requests';
import {AxiosRequestConfig} from 'axios';
import CONSTANT from '../config/env.config';
import STATUS from '../config/status.config';
import CryptionUtils from './cryption';
import * as extract from 'extract-zip';
import * as fs from 'fs';
import * as path from 'path';

export class CommonUtils{

  /**
   * Return success response
   */
  static createSuccessResponse = (req: Request, res: Response, data: object | string | null, code: number = 200, addOn: object = {}) => {
    let response: ResponseType = {
      status: 'success',
      code: code
    };

    if(data != null) response.data = CommonUtils.transformResponse(data)
    
    if(!_.isEmpty(addOn)){
      response = { ...response, ...addOn }
    }
    
    RequestResponseLogController.saveRequestResponseLog(req, response);
    return res.status(code).send(response);
  }

  /**
   * save request response log
   */
  static saveResponse = (req: Request, res: Response, data: object | string | null, code: number = 200, addOn: object = {}) => {
    let response: ResponseType = {
      status: 'success',
      code: code,
      data
    };

    if(!_.isEmpty(addOn)){
      response = { ...response, ...addOn }
    }
    
    RequestResponseLogController.saveRequestResponseLog(req, response);
  }

  /**
   * Generate request data to send for API on basis of the mapping defined in db
   * 
   * @param rawData 
   * @param format 
   */
  static async generateApiDataFromMappedData(rawData: any, format: any): Promise<any> {
    try {
      //@ts-ignore
      const reqBody = global.request;
      rawData = {...rawData, ...reqBody}
      
      let apiData: any = {}
      for (let [key, value] of Object.entries(format)) {
        if(Array.isArray(value)){
          apiData[key] = value.map((item: string) => {

            if(item.includes("@env")){
              const envParam = item.replace("@env","");
              //@ts-ignore
              item = CONSTANT[envParam];
            }

            //if string starts with double hash i.e. ##, it means we need to encrypt their value
            const doubleHash = item.substr(0,2);
            if(doubleHash === "##") item = item.substr(2,item.length-2);
            let returnVal = (rawData[<string>item]) ? rawData[<string>item] : item;
            return (doubleHash === "##") ? CryptionUtils.encrypt(returnVal) : returnVal;
          }).join("")
        }
        else if(typeof value === "object"){
          const obj = <any>value;
          if(obj.master && obj.master === true){
            const value = (obj?.capitalize === true) ? CommonUtils.capitalizeFirstLetter(rawData[<string>obj.label]) : rawData[<string>obj.label];
            if(value){
              const params = {
                [obj.check_key]: value
              }

              let masterData: any;
              let masterValue: any;

              if(obj.check_within_key){
                masterData = await CommonUtils.getValueByMaster(obj.type, params)
                masterValue = CommonUtils.findKeyByGivenKeyInArr(masterData[obj.check_within_key], rawData[obj.check_within_label], obj.check_key, "_id")
                masterValue = masterValue[0]
              }else{
                masterData = await CommonUtils.getValueByMaster(obj.type, params)
                masterValue = masterData.id
              }
              
              apiData[key] = masterValue
            }else{
              apiData[key] = false;
            }
          }else if(obj.static && obj.static === true){
            apiData[key] = obj.value
          }else if(obj.multiple && obj.multiple === true){
            delete obj.multiple
            apiData[key] = [await CommonUtils.generateApiDataFromMappedData(rawData, obj)];
          }else{
            apiData[key] = await CommonUtils.generateApiDataFromMappedData(rawData, obj);
          }
        }
        else{
          apiData[key] = (rawData[<string>value]) ? rawData[<string>value] : ''
        }
      }
      
      return apiData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get master id on basis of the master value for the given type
   * 
   * @param type 
   * @param params 
   */
  static async getValueByMaster(type: string, params: any){
    try {

      const url = `${CONSTANT.MASTER_API}/v1/${type}`;
      const config: AxiosRequestConfig = { params: params }

      return httpRequestUtils
        .get(url, config)
        .then(result => {
          if(result.code && result.code === 200 && result.data.length > 0){
            return result.data[0]
          }

          return false
        })
        .catch(error => {
          return false
        })
      
    } catch (error) {
      throw error
    }
  }

  /**
   * Parse JSON string
   * 
   * @param str 
   */
  static isJson(str: string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }

  /**
   * Read XLSX file data and convert it to JSON format
   * 
   * @param fileBuffer 
   * @param sheetNo 
   */
  static async readFromXlsx(fileBuffer: Buffer, sheet: number | Array<string>){
    try{
      let jsonData: Array<any>;
      const workbook = XLSX.read(fileBuffer, {type:"buffer", cellDates: true})
      if(Array.isArray(sheet)){
        jsonData = [];
        let requests = sheet.map((sheetData: string) => {
          const sheetNo: number = parseInt(sheetData)
          jsonData.push(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[sheetNo]]))
        })
        await Promise.all(requests);
      }else{
        jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[sheet]])
      }
      return jsonData;  
    } catch (error) {
      throw error;
    }    
  }

  /**
   * Upload file to s3 bucket
   * 
   * @param fileBuffer 
   * @param fileName
   * @param type 
   */
  static async uploadFileToS3(fileBuffer: any, fileName: string, type: string = 'application') {
    try {

      const s3Client = s3.getClient;
      const params: any = { Bucket: CONSTANT.S3_BUCKET }

      params.Key = uuidv1() + '-' + fileName;
      params.Body = fileBuffer;

      const s3client = await s3Client.upload(params).promise()
      const logdata = { 
        doc_key: params.Key,
        type: type 
      }
      await DocumentController.saveLog(logdata)
      return s3client;

    } catch (error) {
      throw error
    }
  }

  /**
   * Read file from SFTP server and upload to s3 bucket
   * 
   * @param filePath 
   * @param fileName 
   * @param type
   */
  static async getFileFromSftp(filePath: string, fileName: string, type: string = 'application') {
    try {
      let sftp = new sftpClient()
      return sftp.connect(sftpConfig)
      .then(() => {
        return sftp.get(`${filePath}/${fileName}`)
      })
      .then( async (data) => {
        let fileLogData: any = await CommonUtils.uploadFileToS3(data, fileName, type)
        return {
          bufferData: data,
          s3Key: fileLogData.key
        }
      })
      .catch(err => {
        throw err
      });

    } catch (error) {
      throw error
    }
  }

  /**
   * Get extension from file name and compare with the accepted type
   * 
   * @param fileName 
   * @param acceptedType 
   */
  static checkFileExtension(fileName: string, acceptedType: string) {
    const fileType = fileName.split('.').pop();
    return (fileType === acceptedType) ? true : false;
  }

  /**
   * Generate error object on basis of error type
   * 
   * @param errorType 
   * @param err
   */
  static generateErrorObject(errorType: any, err?: any) {
    //@ts-ignore
    const error = STATUS[errorType] || STATUS.DEFAULT_ERROR;
    return {
      status: error.STATUS,
      message: (err) ? err.message || err : error.MESSAGE
    }
  }

  /**
   * Find key on basis of other key in array of object
   * 
   * @param arr 
   * @param givenValue 
   * @param givenKey 
   * @param findKey 
   */
  static findKeyByGivenKeyInArr(arr: Array<object>, givenValue: Array<string> | string, givenKey: string, findKey: string) {
    if(!arr) return false;
    
    const result: any = arr.filter((x: any) => givenValue.includes(x[givenKey])).map((x: any) => x[findKey]);
    if(result.length > 0) return result
    else return false;
  }

  /**
   * Capitalize first letter of every word in a string
   * 
   * @param str 
   */
  static capitalizeFirstLetter(str: string) { 
    try{
      return str.split(' ').map((word: string) => {
        return word[0].toUpperCase() +  word.slice(1).toLowerCase();
      }).join(' ');
    }catch{
      return str;
    }
  } 

  /**
   * Extract zip file
   * 
   * @param file 
   */
  static async extractZip(file: any) { 
    try{
      const tempDir = path.join(__dirname, '../../assets/temp')
      if (!fs.existsSync(tempDir)){
        fs.mkdirSync(tempDir)
        fs.chmodSync(tempDir, '0777')
      }

      const filePath = `${tempDir}/${file.originalname}`
      fs.writeFileSync(filePath, file.buffer)

      await extract(filePath, { dir: tempDir})
      return tempDir
      
    } catch (err) {
      throw err;
    }
  } 

  /**
   * Remove files in directory
   */
  static async removeFilesinDirectory() { 
    try{
      const tempDir = path.join(__dirname, '../../assets/temp')
      await CommonUtils.removeDir(tempDir)
      fs.rmdirSync(tempDir)
    } catch (err) {
      throw err;
    }
  } 

  static async removeDir(path: any) {
    try{
      const requests = fs.readdirSync(path).map(async function(filename){
        if (fs.statSync(path + "/" + filename).isDirectory()) {
          await CommonUtils.removeDir(path + "/" + filename)
          fs.rmdirSync(path + "/" + filename)
        } else {
          fs.unlinkSync(path + "/" + filename)
        }
      });
      await Promise.all(requests)
    } catch (err) {
      throw err;
    }
  }

  static transformResponse(data: any) {
    try{
      if(typeof data === 'object'){
        if(data._id){
          data.id = data._id;
          delete data._id;
        }
        
        CONSTANT.NON_MANDATORY_FIELDS.forEach((val: string) => {
          delete data[val];
        })
        
        if(data.owners){
          data.owners.forEach((owner: any) => {
            CommonUtils.transformResponse(owner)
          })
        }
      }
      return data
    } catch (err) {
      throw err;
    }
  }

  static replaceKeysDeep(obj: any) {
    return _.transform(obj, function(result: any, value: any, key: any) {
      let currentKey = key.replace(/\./g, '[dot]');
      result[currentKey] = (_.isObject(value) && !Array.isArray(value)) ? CommonUtils.replaceKeysDeep(value) : value;
    });
  }

}