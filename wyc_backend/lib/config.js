require('dotenv').config();

module.exports = {
    environment: process.env.NODE_ENV,
    apiPort: process.env.API_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: process.env.DB_CONNECTIONLIMIT,
    debug: process.env.DB_POOLDEBUG,
    webBaseUrl: process.env.WEB_BASE_URL,
    poolMax: process.env.DB_POOL_MAX || 10,
    poolMin: process.env.DB_POOL_MIN || 1,
    idle: process.env.DB_POOL_IDLE || 1000,
    defaultApiKey: process.env.DEFAULT_API_KEY,
    splitURL: process.env.SPLIT_URL,
    releaseURL: process.env.RELEASE_URL
};
