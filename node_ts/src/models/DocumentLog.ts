import { model, Schema, Model, Document } from 'mongoose';
import {DocumentData} from '../controllers/Document/DocumentInterface';
import datetime from '../config/datetime.config';

export interface IDocumentLog extends DocumentData, Document {}
export interface DocumentLogModel extends Model<IDocumentLog> {}

export class DocumentLog {

    private _model: Model<IDocumentLog>;

    constructor() {

        const schema: Schema  = new Schema({
            doc_key: { 
                type: String,
                required: true 
            },
            type: { 
                type: String,
                required: true 
            },
            result: {
                type: Schema.Types.Mixed
            },
            processing: {
                type: Boolean,
                default: true
            },
            createdAt: {
              type: Number,
              default: datetime.getDateUnixTimestamp
            }
          },
          { 
            timestamps: { createdAt: false, updatedAt: true } 
          });

        this._model = model<IDocumentLog>('document_log', schema);
    }

    //@ts-ignore
    public get model(): Model<IDocumentLog> {
        return this._model
    }
}