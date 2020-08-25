import { sns } from './../config/aws'
export const sendSms = (text, number) => {
    let smsParams = {
        Message: text, /* required */
        PhoneNumber: number,
    };
    return sns.publish(smsParams).promise();
}

