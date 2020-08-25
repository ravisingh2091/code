import {validationResult} from 'express-validator';
import {Request, Response, NextFunction} from 'express';
import CODE from '../config/status.config';
import {CommonUtils} from '../utils/common';

export class RequestModifier {

    /**
     * check validations error
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    static addBackendFlag(req: Request, res: Response, next: NextFunction) {
        req.body.backend = 'true';
        next();
    }
}
