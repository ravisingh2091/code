import {CommonUtils} from '../../utils/common';
import {addOnData} from '../Application/ApplicationInterface';
import {httpRequestUtils} from '../../utils/http_requests';
import {requestTypeValue} from '../Data/DataInterface';

export default class OwnerController { 
    
  /**
   * Handling owners
   * Create owners for the application, if not created 
   * 
   * @param rawData 
   * @param format 
   * @param addOn 
   * @param requestType 
   */
  static async saveOwners(rawData: Array<any>, format: any, addOn: addOnData, requestType: requestTypeValue) {
      try {
        let owners: Array<object> = [];
        const requests = rawData.map(async (item: any) => {
          return await CommonUtils.generateApiDataFromMappedData(item, format.owner)
        });

        owners = await Promise.all(requests)
        const {slug, ...others} = addOn
        const ownerData = {
          owners: owners,
          ...others
        }

        if(requestType === requestTypeValue.CREATE){
          const apiMapping = format.slug_api_mapping
          const result = await httpRequestUtils.handleOrchestratorRequest(ownerData, slug)

          const ownerInfo = result?.[apiMapping.inbound_save_owner_info]?.data?.data || result?.[apiMapping.inbound_save_owner_info]?.data
          if(ownerInfo) return ownerInfo;
        }else{
          //return true if owners already saved
          return true
        }
        
        return false;
      } catch (error) {
        throw error;
      }
  }

}
