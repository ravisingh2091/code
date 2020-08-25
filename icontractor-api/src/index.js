import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import expressValidator from 'express-validator';
global.__basedir = __dirname;

const app = express();
import { handleCustomThrow } from './utils/sendResponse';
import apiRoutes from './routes';
import './db';

app.disable('x-powered-by');
app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
        body: req.body
    })
    next();
})

// Routes
app.use('/', apiRoutes);

// Catch 404 and forward to error handler
app.use((err, req, res, next) => {
    handleCustomThrow(res, err);
});

const { PORT = 4000 } = process.env;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // 
