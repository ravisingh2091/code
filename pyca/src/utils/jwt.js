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

export async function issueJWT( phone ) {
    const token = await jwt.sign({
        exp: ACCESS_TOKEN_EXPIRY,
        algorithm: ACCESS_TOKEN_ALGO,
        data: phone
    }, TOKEN_SECRET);
    return token;

}

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

export async function verifyJWT({ token }) {
    const isValid = await jwt.verify(token, TOKEN_SECRET);
    return isValid;
}

export async function decodeJWT({ token }) {
    const decoded = await jwt.decode(token, TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
        algorithm: ACCESS_TOKEN_ALGO
    });
    return decoded;
}
