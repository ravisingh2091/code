import { query, body } from 'express-validator';
import QueryBuilder from '../models/QueryBuilder';

export class DocumentValidators {
    /**
     * Define validation for request to download document
     */
    static downloadDocument() {
        return [
            query('s3_key','s3 key is required').exists().custom( async (key: string) => {
                return QueryBuilder.Find('DocumentLog', {doc_key: key})
                .then((doc: any) => {
                    if (doc) {
                        return true;
                    } else {
                        throw new Error('s3 key is invalid');
                    }
                })
            })
        ];
    }

    /**
     * Define validation for request to download document
     */
    static jsonApplicationData() {
        return [
            body('data','data is required').exists(),
            body('data.*.owners','data is invalid').isArray()
        ];
    }

    /**
     * Define validation for request to download document
     */
    static jsonBackendUserData() {
        return [
            body('data','data is required').exists(),
            body('data.*.email_address','data is invalid').exists()
        ];
    }
}


