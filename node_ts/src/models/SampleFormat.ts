import { model, Schema, Model, Document } from 'mongoose';
import {SampleFormatType} from '../controllers/Data/DataInterface';
import datetime from '../config/datetime.config';

export interface ISampleFormat extends SampleFormatType, Document {}
export interface SampleFormatModel extends Model<ISampleFormat> {}

export class SampleFormat {

    private _model: Model<ISampleFormat>;

    constructor() {
        const schema: Schema  = new Schema({
            client: { 
                type: String,
                required: true 
            },
            file_type: { 
                type: String,
                required: true 
            },
            convert_to_json: {
                type: Boolean,
                default: false
            },
            mapping: { 
                type: Object,
                required: true 
            },
            createdAt: {
              type: Number,
              default: datetime.getDateUnixTimestamp
            }
          },
          { 
            timestamps: { createdAt: false, updatedAt: true } 
          });

        this._model = model<ISampleFormat>('sample_format', schema);
    }

    //@ts-ignore
    public get model(): Model<ISampleFormat> {
        return this._model
    }
 }