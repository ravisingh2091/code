import jwt from 'jsonwebtoken';
import uuid4 from 'uuid/v4';
import moment from 'moment';
import {
    TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    ACCESS_TOKEN_ALGO,
} from '../config'


if (
    !TOKEN_SECRET ||
    !ACCESS_TOKEN_EXPIRY ||
    !ACCESS_TOKEN_ALGO
) {
    throw new Error('JWT settings not found in env');
}

// generate  the jwt
export async function issueJWT({ payload }) {
    const token = await jwt.sign(payload, TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
        algorithm: ACCESS_TOKEN_ALGO
    });
    return token;
}

// genereate tempory token
export async function generateTemporaryTokens({ activeDays }) {
    const token = uuid4();
    const expiry = moment()
        .add(activeDays, 'd')
        .valueOf();
    return {
        token,
        expiry
    };
}

// verify the jwt token
export async function verifyJWT({ token }) {
    const isValid = await jwt.verify(token, TOKEN_SECRET);
    return isValid;
}

// decode the jwt token
export async function decodeJWT({ token }) {
    const decoded = await jwt.decode(token, TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
        algorithm: ACCESS_TOKEN_ALGO
    });
    return decoded;
}
