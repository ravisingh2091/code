import { model, Schema, Model, Document } from 'mongoose';
import {RequestResponseLogType} from '../controllers/RequestResponseLog/RequestResponseLogInterface';
import datetime from '../config/datetime.config';

export interface IRequestResponseLog extends RequestResponseLogType, Document {}
export interface RequestResponseLogModel extends Model<IRequestResponseLog> {}

export class RequestResponseLog {

  private _model: Model<IRequestResponseLog>;

  constructor() {
    const schema = new Schema(
      {
        request_url: { 
          type: String
        },
        method: { 
          type: String
        },
        request_IP: {
          type: String
        },
        request_header: {
          type: Object
        },
        request_body: {
          type: Object
        },
        response: {
          type: Object
        },
        status_code: {
          type: Number
        },
        createdAt: {
          type: Number,
          default: datetime.getDateUnixTimestamp
        }
      },
      { 
        timestamps: { createdAt: false, updatedAt: true } 
      });

      this._model = model<IRequestResponseLog>('request_response_log', schema);
  }

  //@ts-ignore
  public get model(): Model<IRequestResponseLog> {
    return this._model
  }
}