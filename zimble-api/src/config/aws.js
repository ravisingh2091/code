import AWS from 'aws-sdk';
import {
    ACCESSKEYID,
    REGION,
    SECRETACCESSKEY
} from '../config/index'

const config = {
    accessKeyId: ACCESSKEYID,
    secretAccessKey: SECRETACCESSKEY,
    region: REGION,
}


export const sns = new AWS.SNS({
    ...config, apiVersion: '2010-03-31'
});