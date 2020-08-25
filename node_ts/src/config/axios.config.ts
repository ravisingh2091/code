import axios, {AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig} from 'axios';
import * as https from 'https';
import {CommonUtils} from '../utils/common';

class Axios {
    public axiosInstance: AxiosInstance;

    constructor(){
      this.createInstance();
      this.interceptors();
    }

    createInstance(){
      this.axiosInstance = axios.create({
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: { 'Content-Type': 'application/json' },
        transformResponse: [data => data]
      });
    }

    interceptors(){
      this.axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
          const parseResponse = CommonUtils.isJson(response.data);
          return parseResponse;
        },
        (error: AxiosError) => {
          let parseError = error;
          if(error.response && error.response.data){
            parseError = CommonUtils.isJson(error.response.data);
          }
          return Promise.reject(parseError);
        }
      )
    }

    //@ts-ignore
    get getAxiosInstance() {
      return { ...this.axiosInstance };
    }

}

export default new Axios().getAxiosInstance;
