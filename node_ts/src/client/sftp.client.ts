import * as path from 'path';
import * as fs from 'fs';
import CONSTANT from '../config/env.config';

interface sftpConnectionType {
    host: string,
    port: number,
    username: string,
    privateKey: any
}

let sftp: sftpConnectionType;

if(CONSTANT.SFTP_CONNECTION){
    let keyFile = path.resolve(__dirname, '../../assets/id_rsa');
    let privateKey  = fs.readFileSync(keyFile);

    sftp = {
        host: CONSTANT.SFTP_CONNECTION,
        port: Number(CONSTANT.SFTP_HOST),
        username: CONSTANT.SFTP_USER,
        privateKey: privateKey
    }
}

export default sftp;
