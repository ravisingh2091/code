import { DatabaseHandler } from './DatabaseHandler'; 

export default class QueryBuilder {
    
    /**
     * Insert data into model
     * 
     * @param model 
     * @param data 
     */
    static Create(model: any, data: any) {
        //@ts-ignore
        return new DatabaseHandler.Models[model](data).save()
        .then((result: any) => {
            return result;
        })
        .catch((error: any) => {
            throw error;
        })
    }
    
    /**
     * Find data on basis of given condition
     * 
     * @param model 
     * @param condition 
     */
    static Find(model: any, condition: any, sort: any = {}, populateData: any = '') {
        //@ts-ignore
        return DatabaseHandler.Models[model].findOne(condition).populate(populateData).sort(sort)
        .then((result: any) => {
            return result;
        })
        .catch((error: any) => {
            throw error;
        })
    }

    /**
     * Update Model data on basis of condition
     * 
     * @param model 
     * @param condition 
     * @param data 
     */
    static Update(model: any, condition: any, data: any, populateData: any = '', options: any = { upsert: false, new: true }) {
        //@ts-ignore
        return DatabaseHandler.Models[model].findOneAndUpdate(condition, data, options).populate(populateData)
        .then((result: any) => {
            return result;
        })
        .catch((error: any) => {
            throw error;
        })
    }

}