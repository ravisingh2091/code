import {CommonUtils} from '../../utils/common';
import {applicationData, addOnData, applicationStatusData} from './ApplicationInterface';
import {httpRequestUtils} from '../../utils/http_requests';
import {AxiosRequestConfig} from 'axios';
import CONSTANT from '../../config/env.config';
import URL from '../../config/url.config';
import ENV from '../../config/env.config';

export default class ApplicationController { 

    /**
     * Handling cases to create application and save business details 
     * Create application if don't exist
     * Save business details if not get saved for application
     * 
     * return business data 
     * 
     * @param rawData 
     * @param format 
     * @param userId 
     */
    static async saveApplication(rawData: any, format: any, userId: string) {
      try {

        // Create new application
        let appData: applicationData = {
          user_id: userId
        }

        //@ts-ignore
        const reqBody = global.request;
        appData = {...appData, ...reqBody}

        const apiMapping = format.slug_api_mapping
        let addOn: addOnData;
        const result = await httpRequestUtils.handleOrchestratorRequest(appData, format.application_slug)
        let applicationInfo = result?.[apiMapping.inbound_get_application]?.data?.data || result?.[apiMapping.inbound_get_application]?.data
        if(Array.isArray(applicationInfo) && applicationInfo.length > 0) applicationInfo = applicationInfo[0]
        
        if(applicationInfo.id || applicationInfo._id){
          // If application exists, check that business details get saved or not
          if(applicationInfo.business && applicationInfo.business.length > 0){
            return {businessInfo: applicationInfo, duplicate: true};
          }else if(applicationInfo.business_info && applicationInfo.business_info.length > 0){
            applicationInfo.business = applicationInfo.business_info
            applicationInfo.owners = applicationInfo.owner_details
            delete applicationInfo.business_info
            delete applicationInfo.owner_details
            return {businessInfo: applicationInfo, duplicate: true};
          }else{
            // If business details doesn't exists, save business data
            addOn = {
              app_id: applicationInfo.id || applicationInfo._id,
              user_id: userId
            }
            
            const businessInfo: any = await ApplicationController.saveBusiness(rawData, format, addOn)
            return {businessInfo, duplicate: false};
          }
        }else if(result && result?.[apiMapping.inbound_create_application]?.data){

          // Save business data
          const applicationInfo = result?.[apiMapping.inbound_create_application]?.data?.data || result?.[apiMapping.inbound_create_application]?.data
          addOn = {
            app_id: applicationInfo.id || applicationInfo._id,
            user_id: userId
          }
          
          const businessInfo: any = await ApplicationController.saveBusiness(rawData, format, addOn)
          return {businessInfo, duplicate: false};
        }
        
        return false
      } catch (error) {
        throw error;
      }
    }

    /**
     * Save business details for the application
     * 
     * @param rawData 
     * @param format 
     * @param addOn 
     */
    static async saveBusiness(rawData: any, format: any, addOn: addOnData) {
      try {
        const data = await CommonUtils.generateApiDataFromMappedData(rawData, format.application)
        const businessData = { ...data, ...addOn }
        const apiMapping = format.slug_api_mapping

        const result = await httpRequestUtils.handleOrchestratorRequest(businessData, format.business_slug)
        if(result?.[apiMapping.inbound_save_business_info]?.data){
          const businessInfo = result?.[apiMapping.inbound_save_business_info]?.data?.data || result?.[apiMapping.inbound_save_business_info]?.data
          if(businessInfo.id || businessInfo._id) return businessInfo;
        }

        return false;
      } catch (error) {
        throw error;
      }
    }

}
