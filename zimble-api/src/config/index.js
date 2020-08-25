import dotenv from 'dotenv'
dotenv.config()


export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const ACCESS_TOKEN_ALGO = process.env.ACCESS_TOKEN_ALGO;
export const PASS_HASH_ROUNDS = process.env.PASS_HASH_ROUNDS;
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_SECURE = process.env.EMAIL_SECURE;
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const SMS_AWS_TOPIC = process.env.SMS_AWS_TOPIC;
export const ACCESSKEYID = process.env.ACCESSKEYID;
export const SECRETACCESSKEY = process.env.SECRETACCESSKEY;
export const REGION = process.env.REGION;

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const AMDIN_PASSWORD = process.env.AMDIN_PASSWORD;
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
export const ADMIN_NAME = process.env.ADMIN_NAME;


export const MATCH_MOVE_URL = process.env.MATCH_MOVE_URL
export const MATCH_MOVE_KEY = process.env.MATCH_MOVE_KEY