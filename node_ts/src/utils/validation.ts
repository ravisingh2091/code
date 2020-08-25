import QueryBuilder from '../models/QueryBuilder';
import CONSTANT from '../config/env.config';
import ERROR from '../config/error.config';

export class ValidationUtils {

    static validateData(jsonData: any, validation: any, sumupValidation: any = {}, errorFormat: string = 'string'){

      let validationArr: Array<any> = [];
      
      jsonData.map((data: any, idx: any) => {
        const res = ValidationUtils.checkValidation(validation, data, '', errorFormat)
        if(res.length > 0){
          validationArr = [...validationArr, ...res]
        }
      })
      
      // Check for Owner percentage sum equals to 100
      if(sumupValidation.field){
        const ownership = sumupValidation.field
        const sum = jsonData.reduce((sum: number, data: any) => {
          return sum + Number(data[ownership])
        }, 0)
        if(sum !== 100) validationArr = [...validationArr, `${ownership} must be 100 in total`]
      }

      const validationset = new Set(validationArr)
      return Array.from(validationset);
    }    

    static checkValidation(validation: any, data: any, parentKey: string = '', errorFormat: string = 'string'){
      let errorData: Array<any> = [];
      for(let fld in validation){
        let fieldValidation: Array<any>;
        
        if(validation[fld]?.type === 'group'){
          if(data[fld]){
            let groupErrorData = ValidationUtils.checkValidation(validation[fld]?.fields, data[fld], `${parentKey}${(parentKey) ? ".": ""}${fld}`, errorFormat)
            errorData = [...errorData, ...groupErrorData]
          }else{
            errorData.push(`${fld} is required`)
          }
        }
        if(validation[fld]?.type === 'multiple-group'){
          if(data[fld]){
            if(Array.isArray(data[fld])){
              data[fld].map((data: any) => {
                let groupErrorData = ValidationUtils.checkValidation(validation[fld]?.fields, data, `${parentKey}${(parentKey) ? ".": ""}${fld}`, errorFormat)
                errorData = [...errorData, ...groupErrorData]
              })
            }else{
              errorData.push(`${fld} is invalid`)
            }
          }else{
            errorData.push(`${fld} is required`)
          }
        }

        fieldValidation = validation[fld]?.fields || validation[fld];
        let isFieldError: Boolean = false;
        for (let val of fieldValidation) {  
          
          if(isFieldError === true) break;
          
          switch(val.name){
            case 'required':
              if(data[fld] == null || data[fld] == undefined || data[fld] == "") { 
                if(errorFormat === 'json'){
                  errorData.push(ValidationUtils.formatValidationError('REQUIRED', `${parentKey}${(parentKey) ? ".": ""}${fld}`))
                }else{
                  errorData.push(`${parentKey}${(parentKey) ? ".": ""}${fld} is required`)
                }
                isFieldError = true
              }  
              break
            case 'pattern':
              let regPatternStr = val.validation;
              regPatternStr = regPatternStr.substring(1, regPatternStr.length-1);
              const regPattern = new RegExp(regPatternStr);
              const result = regPattern.test(data[fld]);
              if(result === false) {
                if(errorFormat === 'json'){
                  errorData.push(ValidationUtils.formatValidationError('INVALID', `${parentKey}${(parentKey) ? ".": ""}${fld}`))
                }else{
                  errorData.push(`${parentKey}${(parentKey) ? ".": ""}${fld} is invalid`)
                }
                isFieldError = true
              }  
              break
            case 'minlength':
              if(data[fld].length < val.validation) {
                if(errorFormat === 'json'){
                  errorData.push(ValidationUtils.formatValidationError('INVALID', `${parentKey}${(parentKey) ? ".": ""}${fld}`))
                }else{
                  errorData.push(`${parentKey}${(parentKey) ? ".": ""}${fld} must has min length ${val.validation}`)
                }
                isFieldError = true
              }
              break
            case 'maxlength':
              if(data[fld].length > val.validation) {
                if(errorFormat === 'json'){
                  errorData.push(ValidationUtils.formatValidationError('INVALID', `${parentKey}${(parentKey) ? ".": ""}${fld}`))
                }else{
                  errorData.push(`${parentKey}${(parentKey) ? ".": ""}${fld} must has max length ${val.validation}`)
                }
                isFieldError = true
              }
              break
          }
        }
      }

      return errorData;
    }

    static formatValidationError(errorType: string, parameter: string){
      let type, message;

      switch(errorType){
        case 'REQUIRED':
          type = ERROR.REQUIRED.TYPE
          message = ERROR.REQUIRED.MESSAGE
          break;
        case 'INVALID':
          type = ERROR.INVALID.TYPE
          message = ERROR.INVALID.MESSAGE
          break;
      }

      return {
        type,
        message,
        parameter
      }
    }
}