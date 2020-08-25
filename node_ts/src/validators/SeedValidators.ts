import { body, param } from 'express-validator';

export class SeedValidators {
    /**
     * Define validation for seed request
     */
    static seed() {
        return [
            param('model','Model is required').exists().custom( (model) => {
                if(['cron','api'].includes(model)){
                    return true;
                }else{
                    throw new Error('Model is invalid'); 
                }
            }),
            body('data','Data is required').exists()
        ];
    }

}


