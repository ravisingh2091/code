import {DocumentData} from './DocumentInterface';
import {getDocumentParamsType} from '../Data/DataInterface';
import CONSTANT from '../../config/env.config';
import QueryBuilder from '../../models/QueryBuilder';
import {CommonUtils} from '../../utils/common';

import s3 from '../../client/s3.client';
const s3Client = s3.getClient;

import {Request, Response, NextFunction} from 'express';

export default class DocumentController { 
       
    /**
     * Log document data that read from SFTP server and upload to s3 bucket
     * 
     * @param data 
     */
    static async saveLog(data: DocumentData) {
        try {
          if(data.type !== 'application') data.processing = false; 
          let result: any = await QueryBuilder.Create('DocumentLog', data);
          return result;
        } catch (error) {
          throw error;
        }
    }

    /**
     * Download document from s3 bucket
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    static async downloadDocument(req: Request, res: Response, next: NextFunction) {
      try {

        const s3_key = <string>req.query.s3_key;

        let params: getDocumentParamsType = {
          Bucket: CONSTANT.S3_BUCKET,
          Key: s3_key
        }

        s3Client.getObject(params, (err, data) => {
            if (err) {
              const errorOject = CommonUtils.generateErrorObject('DEFAULT_ERROR');
              next(errorOject);
              return;
            }
            res.attachment(params.Key);
            res.send(data.Body); 
        });

      } catch (error) {
        throw error;
      }
  }

  /**
   * Update file processing result against document that how many applications get failed or successfully created for the given document
   * 
   * @param key 
   * @param data 
   */
  static async updateResultForDocumentKey(key: string, data: any) {
    try {
      const result: any = await QueryBuilder.Update('DocumentLog', {doc_key: key}, {result: data, processing: false});
      return result
    } catch (error) {
      throw error;
    }
  }

}
