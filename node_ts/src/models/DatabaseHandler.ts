import { DocumentLog, DocumentLogModel } from './DocumentLog';
import { RequestResponseLog, RequestResponseLogModel } from './RequestResponseLog';
import { SampleFormat, SampleFormatModel } from './SampleFormat';
import { Validation, ValidationModel } from './Validation';

import mongoose from '../client/mongo.client';

export interface IModels {
    DocumentLog: DocumentLogModel;
    RequestResponseLog: RequestResponseLogModel;
    SampleFormat: SampleFormatModel;
    Validation: ValidationModel;
}

export class DatabaseHandler {
    private static instance: DatabaseHandler;

    private _models: IModels;

    private constructor() {
        mongoose.getInstance();

        this._models = {
            DocumentLog: new DocumentLog().model,
            RequestResponseLog: new RequestResponseLog().model,
            SampleFormat: new SampleFormat().model,
            Validation: new Validation().model
        }
    }

    //@ts-ignore
    public static get Models() {
        if (!DatabaseHandler.instance) {
            DatabaseHandler.instance = new DatabaseHandler();
        }
        return DatabaseHandler.instance._models;
    }

}