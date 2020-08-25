// encrype the string
export const encrypt = (str) => {
    for (let i = 0; i < 5; i++) {
        let buff = new Buffer.from(str);
        str = buff.toString('base64');
    }
    return str;
}
// decrypt the string
export const decrypt = (str) => {
    for (let i = 0; i < 5; i++) {
        let buff = new Buffer.from(str, 'base64');
        str = buff.toString('ascii');
    }
    return str;
}
