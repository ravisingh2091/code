import { model, Schema, Model, Document } from 'mongoose';
import {validationType} from '../controllers/Data/DataInterface';
import datetime from '../config/datetime.config';

export interface IValidation extends validationType, Document {}
export interface ValidationModel extends Model<IValidation> {}

export class Validation {

    private _model: Model<IValidation>;

    constructor() {
        const schema: Schema  = new Schema({
            client: { 
                type: String,
                required: true 
            },
            sumup_validation: {
              type: Object
            },
            user_validation: {
              type: Object
            },
            app_validation: {
                type: Object,
                required: true 
            },
            seller_validation: {
                type: Object
            },
            createdAt: {
              type: Number,
              default: datetime.getDateUnixTimestamp
            }
          },
          { 
            timestamps: { createdAt: false, updatedAt: true } 
          });

        this._model = model<IValidation>('validation', schema);
    }

    //@ts-ignore
    public get model(): Model<IValidation> {
        return this._model
    }
 }