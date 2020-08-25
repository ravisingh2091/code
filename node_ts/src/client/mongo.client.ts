import * as mongoose from 'mongoose';
import CONSTANT from '../config/env.config';

export default class Mongoose {

    private static instance: Mongoose;
    mongoUrl = CONSTANT.MONGO_URL;

    private constructor() {
        this.connect();
    }

    public static getInstance(): Mongoose {
        if (!Mongoose.instance) {
            Mongoose.instance = new Mongoose();
        }

        return Mongoose.instance;
    }

    connect() {
        mongoose.set('useFindAndModify', false);
        mongoose.connect(this.mongoUrl, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("connected to database")
        })
	}
}