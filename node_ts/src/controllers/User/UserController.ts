import {CommonUtils} from '../../utils/common';
import {httpRequestUtils} from '../../utils/http_requests';

export default class UserController { 

    /**
     * Handle user
     * 
     * @param rawData 
     * @param format 
     */
    static async saveUser(rawData: any, format: any, type: string = 'frontend') {
      try {
        const userData = await CommonUtils.generateApiDataFromMappedData(rawData, format[`${type}_user`]);
        let slug = format[`${type}_user_slug`]
        const apiMapping = format.slug_api_mapping
        const getUserApi = (type === 'backend') ? apiMapping.inbound_get_backend_user : apiMapping.inbound_get_user
        const saveUserApi = (type === 'backend') ? apiMapping.inbound_save_backend_user : apiMapping.inbound_save_user
        const result = await httpRequestUtils.handleOrchestratorRequest(userData, slug)
        
        if(result){
          
          // Check for app Identifier already exist
          if(apiMapping.inbound_get_user_by_identifier){
            const getuserInfoByIdentifier = result?.[apiMapping.inbound_get_user_by_identifier]?.data?.data || result?.[apiMapping.inbound_get_user_by_identifier]?.data
            if(getuserInfoByIdentifier && (getuserInfoByIdentifier?.id || getuserInfoByIdentifier[0]?.id)){
              // App Id duplicate
              return {error: 'already exist'}
            }
          }

          const getuserInfo = result?.[getUserApi]?.data?.data || result?.[getUserApi]?.data
          if(getuserInfo && (getuserInfo?.id || getuserInfo[0]?.id)){
            // User already exist
            return { duplicate: true, userInfo: getuserInfo[0] || getuserInfo }
          }else if(result?.[saveUserApi]?.data){
            // Create new user
            const saveuserInfo = result?.[saveUserApi]?.data?.data || result?.[saveUserApi]?.data
            if(saveuserInfo.id) return { duplicate: false, userInfo: saveuserInfo }
          }

          if(result?.[saveUserApi]?.errors || result?.[getUserApi]?.errors){
            const error = result?.[saveUserApi]?.errors || result?.[getUserApi]?.errors;
            return {error}
          }
        }
        
        return false
      } catch (error) {
        throw error
      }
    }

}
