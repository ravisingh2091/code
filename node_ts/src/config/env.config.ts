const CONSTANT = {
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    APP_ENV: process.env.APP_ENV,
    ACCESSDOMAIN: process.env.ACCESSDOMAIN,
    CLIENT: process.env.CLIENT || process.env.REGION,
    VERSION: process.env.ORCH_VERSION,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET: process.env.S3_BUCKET,
    SFTP_CONNECTION: process.env.SFTP_CONNECTION,
    SFTP_HOST: process.env.SFTP_HOST,
    SFTP_USER: process.env.SFTP_USER,
    COMMON_HASH_SALT: process.env.COMMON_HASH_SALT || '!1@2#3$4%5^6&7*8',
    CASE_API: process.env.CASE_API,
    USER_API: process.env.USER_API,
    MASTER_API: process.env.MASTER_API,
    ORCH_API: process.env.ORCH_API,
    TAXES_API: process.env.TAXES_API,
    COMMUNICATION_API: process.env.COMMUNICATION_API,
    FRONTEND_URL: process.env.FRONTEND_URL,
    SAVE_FILE: process.env.SAVE_FILE || 0,
    NON_MANDATORY_FIELDS: ['password','orch_url','is_verified','is_phone_verified','system_password','action_type','parent_id','level','consent','other','is_deleted']
}

export default CONSTANT;