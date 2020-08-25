import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressValidator from 'express-validator';
import helmet from 'helmet'

import { sendResponse } from './utils/sendResponse';
import apiRoutes from './routes';
import './db';

global.__basedir = __dirname;

const app = express();


app.disable('x-powered-by');
app.set("view engien", 'ejs');
app.use(helmet());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cors());
app.use(
    expressValidator({
        customValidators: {
            isDate: value => !isNaN(Date.parse(value))
        }
    })
);


app.use((req, res, next) => {
    console.log({
        URL: req.url,
        body: req.body,
        date: new Date()
    })
    next();
})

// Routes
app.use('/', apiRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('URL Not Found');
    sendResponse(res, 404, {}, err.message);
    next();
});

app.use((error, req, res, next) => {
    console.error(error)
})

const { PORT = 3000 } = process.env;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




