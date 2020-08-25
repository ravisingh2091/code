import * as dotenv from 'dotenv';
dotenv.config();

import mongoConnection from '../client/mongo.client';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as Glob from 'glob';
import QueryBuilder from '../models/QueryBuilder';
import CONSTANT from '../config/env.config';

const readFile = util.promisify(fs.readFile);

import {SampleFormat} from '../models/SampleFormat';
import {Validation} from '../models/Validation';

class Seeder {
    
    constructor() {
        this.connectMongoDb();
        this.seedData();
    }

    /**
     * Connection to db
     */
    connectMongoDb() {
        mongoConnection.getInstance;
    }

    /**
     * import data from file to db
     */
    async seedData(){
        try {
            const files = Glob.sync(`assets/*.json`);
            for await (const file of files) {
                let fileName = path.basename(file,'.json');
                let fileData = await this.readFileData(`../../assets/${fileName}.json`)
        
                const model = (fileName === 'validation') ? 'Validation' : 'SampleFormat'
                for(let data of fileData){
                    const { _id, ...value } = data;
                    if(value.client === CONSTANT.CLIENT){
                        if (_id) {
                        const updated = await QueryBuilder.Update(model, { _id }, value, '', { upsert: true, new: true, setDefaultsOnInsert: true });
                        } else {
                        const inserted = await QueryBuilder.Create(model, data);
                        }
                    }
                }
            }
            
            process.exit(0);
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Read file data
     * 
     * @param filePath 
     */
    async readFileData(filePath: string){
        try{
            const content: string = await readFile(path.join(__dirname, filePath), 'utf8');
            if (content) {
                return JSON.parse(content);
            }
        }catch (err) {
            throw new Error(err);
        }
    }
    
}

const seed = new Seeder();
export default seed;