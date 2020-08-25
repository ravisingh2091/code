import * as _ from 'lodash';
import AxiosInstance from '../config/axios.config';
import {AxiosRequestConfig} from 'axios';
import CONSTANT from '../config/env.config';
import URL from '../config/url.config';

export class  httpRequestUtils {

 /**
  * Make get request
  * 
  * @param reqUrl 
  * @param config 
  */ 
 static async get(reqUrl: string, config?: AxiosRequestConfig): Promise<any> {
    console.log("get reqUrl - ", reqUrl, "config - ", config);
    return AxiosInstance
      .get(reqUrl, config)
      .then(response => {
        console.log("response  ===== ", response)
        return response
      })
      .catch(error => {
        console.log("error - ", error)
        throw error
      });
  }

/**
 * Make post request
 * 
 * @param reqUrl 
 * @param data 
 * @param config 
 */
  static async post(reqUrl: string, data: any, config?: AxiosRequestConfig): Promise<any> {
    console.log("post reqUrl - ", reqUrl, "data - ", data, "config - ", config);
    return AxiosInstance
      .post(reqUrl, data, config)
      .then(response => {
        console.log("response  ===== ", response)
        return response
      })
      .catch(error => {
        if(error.code === 404 && error.errors){
          return {
            status: "success",
            code: 200,
            data: error.errors
          }
        }
        console.log("error - ", error)
        throw error
      })
  }

  /**
   * Make put request
   * 
   * @param reqUrl 
   * @param data 
   * @param config 
   */
  static async put(reqUrl: string, data: any, config?: AxiosRequestConfig): Promise<any> {
    console.log("put reqUrl - ", reqUrl, "data - ", data, "config - ", config);
    return AxiosInstance
      .put(reqUrl, data, config)
      .then(response => {
        console.log("response  ===== ", response)
        return response
      })
      .catch(error => {
        console.log("error - ", error)
        throw error
      })
  }

  /**
   * Orchestrator common request
   * 
   * @param rawData 
   * @param format 
   */  
  static async handleOrchestratorRequest(data: any, slug: any) {
    try {

      const SAVETASK = (CONSTANT.VERSION === 'v2') ? URL.SAVETASK_V2 : URL.SAVETASK
      const url = `${CONSTANT.ORCH_API}${SAVETASK}`
      const config: AxiosRequestConfig = {
        params: {
          slug,
          internal: true
        }
      }

      return httpRequestUtils
        .post(url, data, config)
        .then(result => {
          return result?.data?.response_data
        })
        .catch(error => {
          return error?.errors?.response_data || error
        })
      
    } catch (error) {
      throw error
    }
  }

}