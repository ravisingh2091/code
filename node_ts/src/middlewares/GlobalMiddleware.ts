import {validationResult} from 'express-validator';
import {Request, Response, NextFunction} from 'express';
import CODE from '../config/status.config';
import {CommonUtils} from '../utils/common';

export class GlobalMiddleware {

    /**
     * check validations error
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    static checkError(req: Request, res: Response, next: NextFunction) {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            const errorOject = CommonUtils.generateErrorObject('VALIDATION', new Error(error.array()[0].msg));
            next(errorOject);
        } else {
            next();
        }
    }

    /**
     * add flag for backend in request
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
