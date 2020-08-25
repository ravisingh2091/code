import * as _ from 'lodash';
import * as CryptoJS from 'crypto-js';
import CONSTANT from '../config/env.config';

class CryptionUtils{

  /**
   * Encrypt string on basis of the hash
   * 
   * @param
   */
  encrypt = (val: string) => {
    const enkey = CryptoJS.enc.Utf8.parse(CONSTANT.COMMON_HASH_SALT);
    const iv = CryptoJS.enc.Utf8.parse(CONSTANT.COMMON_HASH_SALT);

    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(val), enkey, {
      keySize: 128,
      iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
  
    try {
      const encoded = Buffer.from(encrypted.toString());
      return encoded.toString('base64');
    } catch (ex) {
      return val;
    }
  }  

}

export default new CryptionUtils();