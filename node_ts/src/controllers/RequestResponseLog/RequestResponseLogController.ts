import {Request, Response} from 'express';
import {ResponseType} from './RequestResponseLogInterface'
import QueryBuilder from '../../models/QueryBuilder';
import {CommonUtils} from '../../utils/common';

export default class RequestResponseLogController { 
    
  /**
   * Log all request and their response in database
   *  
   * @param req 
   * @param response 
   * @param request_type 
   */
    static async saveRequestResponseLog(req: Request, response: ResponseType, request_type = 'request') {
        try {
          response = CommonUtils.replaceKeysDeep(response)

          QueryBuilder.Create('RequestResponseLog', {
            request_url: req.baseUrl + req.url,
            method: req.method,
            request_IP: req.ip,
            request_header: req.headers,
            request_body: req.body,
            response,
            status_code: response.code,
            request_type
          });
          return true;
        } catch (error) {
          console.log(error);
        }
      }

}
