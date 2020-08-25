import * as AWS from 'aws-sdk';
import CONSTANT from '../config/env.config';

export default class S3 {
    private static instance: S3;
    _client: AWS.S3;
    
    private constructor() {
        this.createClient();
    }

    createClient() {
        this._client = new AWS.S3({
            accessKeyId: CONSTANT.AWS_ACCESS_KEY,
            secretAccessKey: CONSTANT.AWS_SECRET_ACCESS_KEY,
            region: CONSTANT.S3_REGION
        })
    }

    //@ts-ignore
    public static get getClient() {
        if (!S3.instance) {
            S3.instance = new S3();
        }

        return S3.instance._client;
    }

}
