import * as dotenv from 'dotenv';
dotenv.config();

import DataController from '../controllers/Data/DataController';
import {CommonUtils} from "../utils/common";

describe('testing common functions', () => {
    test('isJson() return empty', () => {
        expect(CommonUtils.isJson('')).toBe('');
    });

    test('isJson() return null', () => {
        expect(CommonUtils.isJson(null)).toBeNull();
    });

    test('isJson() return string when input is normal string', () => {
        const param = 'simple string';
        const response = CommonUtils.isJson(param);
        expect(response).toEqual('simple string');
    });

    test('isJson() return string when input is json string', () => {
        const param = '{"result":true, "count":42}';
        const response = CommonUtils.isJson(param);
        expect(response).toMatchObject({
            result: true,
            count: 42
        })
    });

    test('getFileFromSftp() return correct result for file exist on server', async (done) => {
        const filePath = '/hsbcin-sftp-nonprod';
        const fileName = 'test_app_form.xlsx';
        return CommonUtils.getFileFromSftp(filePath, fileName).then(data => {
            const {bufferData, s3Key} = data;
            expect(bufferData).not.toBeNull();
            expect(s3Key).not.toBeNull();
            done();
        });
    }, 30000);

    test('getFileFromSftp() throw error if file not exist on server', async () => {
        const filePath = '/hsbcin-sftp-nonprod';
        const fileName = 'test_app_formm.xlsx';
        return CommonUtils.getFileFromSftp(filePath, fileName).catch(e => {
            expect(e);
        });
    });

    test('getFileFromSftp() throw error file path and name is blank', async () => {
        return CommonUtils.getFileFromSftp('', '').catch(e => {
            expect(e);
        });
    });

    test('generateApiDataFromMappedData() give values in result object if that is in input', async () => {
        const rawData = {
            "First_Name": "Sunil",
            "Last_Name": "Kumar"
        };
        const format = {
            "owner_first_name": "First_Name",
            "owner_last_name": "Last_Name"
        };
        return CommonUtils.generateApiDataFromMappedData(rawData, format).then(data => {
            expect(data).toMatchObject({
                owner_first_name: "Sunil",
                owner_last_name: "Kumar"
            });
        });
    });

    test('generateApiDataFromMappedData() give "all values seprated by space" in result object if their format is of type array', async () => {
        const rawData = {
            "Street": "10",
            "Locality": "xyz"
        };
        const format = {
            "address_line": ["Street", "Locality"]
        };
        return CommonUtils.generateApiDataFromMappedData(rawData, format).then(data => {
            expect(data).toMatchObject({
                address_line: "10 xyz"
            })
        });
    });

    test('generateApiDataFromMappedData() gives blank values in result object if value is undefined in input', async() => {
        const rawData = {};
        const format = {
            "owner_first_name": "First_Name"
        };
        return CommonUtils.generateApiDataFromMappedData(rawData, format).then(data => {
            const { owner_first_name } = data
            expect(data).toMatchObject({
                owner_first_name: ""
            })
        });
    });

    test('generateApiDataFromMappedData() gives blank object for blank format', async() => {
        const rawData = {};
        const format = {};
        return CommonUtils.generateApiDataFromMappedData(rawData, format).then(data => {
            expect(data).toMatchObject({})
        });
    });
});

describe('read file from server and create applications', () => {
    test('getClientFormat() return client sample format if client exist in db', async() => {
        const client = "hsbc_india";
        return DataController.getClientFormat(client).then((data: any) => {
            expect(data._id).not.toBeNull()
        });
    });

    test('getClientFormat() return false if client not exist in db', async() => {
        const client = "wrong_client";
        return DataController.getClientFormat(client).then((data) => {
            expect(data).toBe(false)
        });
    });

    test('getClientFormat() return false if passing null value to client', async() => {
        return DataController.getClientFormat(null).then((data) => {
            expect(data).toBe(false)
        });
    });

    test('getClientFormat() return false if passing empty value to client', async() => {
        return DataController.getClientFormat(null).then((data) => {
            expect(data).toBe(false)
        });
    });

    test('getSftpFileData() return status of each applications for client exist in db', async(done) => {
        const client = "hsbc_india";
        return DataController.getSftpFileData(client).then((data) => {
            expect(Array.isArray(data)).toBe(true);
            done();
        })
    }, 150000);

    test('getSftpFileData() throw error for client not exist in db', async() => {
        const client = "wrong_value";
        return DataController.getSftpFileData(client).catch(e => {
            expect(e)
        })
    });

});

// afterAll(async () => {
//     await mongoConnect.clearDatabase();
//     await mongoConnect.closeDatabase();
// });
