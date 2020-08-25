
const fs = require('fs');
var AWS = require('aws-sdk');
AWS.config = {
    "accessKeyId": 'AKIAVXG4APM32HFUR3EK',
    "secretAccessKey": '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',
    "region": 'ap-south-1',

};
const s3 = new AWS.S3({ region: 'ap-south-1' })

const upload = (file, imageName, path) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: 'wyc-school-bucket',
            Key: path + imageName,
            ACL: 'public-read',
            Body: file,
            ContentEncoding: 'base64',
            ContentType: `image/${imageName.split(".")[1]}`
        };
        s3.putObject(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                let url = "https://s3.ap-south-1.amazonaws.com/wyc-school-bucket/" + imageName;
                resolve(url);
            }
        })
    })

}

module.exports = {
    upload
}