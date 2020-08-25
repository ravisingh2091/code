import {CommonUtils} from '../../utils/common';
import {httpRequestUtils} from '../../utils/http_requests';

export default class CommunicationController { 
    
  /**
   * Handling seller data
   * Create seller for the application and save their reference
   * 
   * @param rawData 
   * @param format 
   * @param requestType 
   */
  static async notify(rawData: any, format: any, slug: string) {
      try {
        let notifyData = await CommonUtils.generateApiDataFromMappedData(rawData, format)
        const {email_address, phone_number} = notifyData
        
        if(email_address) {
          notifyData.to = email_address
          delete notifyData.email_address
        }  

        if(phone_number){
          notifyData.mobile = [phone_number]
          delete notifyData.phone_number
        }

        await httpRequestUtils.handleOrchestratorRequest(notifyData, slug)
      } catch (error) {
        throw error;
      }
  }

}
