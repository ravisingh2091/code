import {CommonUtils} from '../../utils/common';
import {addOnData} from '../Application/ApplicationInterface';
import {httpRequestUtils} from '../../utils/http_requests';
import {requestTypeValue} from '../Data/DataInterface';
import CONSTANT from '../../config/env.config';
import URL from '../../config/url.config';

export default class SellerController { 
    
  /**
   * Handling seller data
   * Create seller for the application and save their reference
   * 
   * @param rawData 
   * @param format 
   * @param requestType 
   */
  static async saveSeller(rawData: any, format: any, addOn: addOnData, requestType: requestTypeValue) {
      try {
        if(requestType === requestTypeValue.CREATE){
          const {sheet, ...reformat} = format
          let isSellerInfoExist: Boolean = true; 
          let sellerData: any = {};

          if(Array.isArray(sheet)){
            const requests = sheet.map(async (sheetData: string, sheetNo: number) => {
              const sheetLabel: string = sheetData.substr(sheetData.lastIndexOf(':') + 1)

              // Return false if any sheet data is blank for the application seller i.e seller data is partially or completely missing
              if(rawData[sheetNo].length === 0){
                isSellerInfoExist = false;
                return false;
              }

              const requests = rawData[sheetNo].map(async (item: any) => {
                return await CommonUtils.generateApiDataFromMappedData(item, reformat.mapping[sheetLabel])
              });
      
              sellerData[sheetLabel] = await Promise.all(requests)
            })
            await Promise.all(requests);
          }else{

            // Return false if any sheet data is blank for the application seller i.e seller data is partially or completely missing
            if(rawData.length === 0){
              isSellerInfoExist = false;
              return false;
            }

            const requests = rawData.map(async (item: any) => {
              return await CommonUtils.generateApiDataFromMappedData(item, reformat.mapping)
            });
    
            sellerData = await Promise.all(requests)
          }

          if(!isSellerInfoExist){
            return false;
          }

          const {slug, ...others} = addOn
          await httpRequestUtils.handleOrchestratorRequest({sellerData, ...others}, slug)
        }else{
          //return true if seller info already saved
          return true;
        }

        return false;

      } catch (error) {
        throw error;
      }
  }

  /**
   * Create Seller
   * 
   * @param offerData 
   */
  static async createSeller(sellerData: any) {
    try {
      const url = `${CONSTANT.TAXES_API}${URL.TAXES}`
        
      return httpRequestUtils
        .post(url, sellerData)
        .then(result => {
          return result
        })
        .catch(error => {
          return error
        })
     
    } catch (error) {
      throw error
    }
  }


}
