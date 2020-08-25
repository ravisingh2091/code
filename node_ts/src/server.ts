import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
import * as cors from "cors";
import DataRouter from './routers/DataRouter';
import bodyParser = require('body-parser');
import RequestResponseLogController from './controllers/RequestResponseLog/RequestResponseLogController';
import {ResponseType} from './controllers/RequestResponseLog/RequestResponseLogInterface';
import CONSTANT from './config/env.config';

export class Server {
    public app: express.Application = express();
    public port: string = CONSTANT.PORT;
    public router: express.Router = express.Router();
    
    constructor() {
        this.setConfigurations();
        this.setCors();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();
    }

    /**
     * Set configuration for the service
     */
    setConfigurations() {
        this.configureBodyParser();
    }

    /**
     * Set cross origin configuration
     */
    setCors() {
        const corsOptions = {
            origin: CONSTANT.ACCESSDOMAIN,
            methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS']
        };
        this.app.use(cors(corsOptions));
    }

    /**
     * Configure request body parsing
     */
    configureBodyParser() {
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(bodyParser.json({ limit: '50mb' }));
    }

    /**
     * Set routes
     */
    setRoutes() {
        this.app.use('/api/v1', new DataRouter(this.router).router);
    }

    /**
     * Handling non mentioned URL
     */
    error404Handler() {
        this.app.use((req, res) => {
            res.status(404).json({
                message: 'Not Found',
                status_code: 404
            });
        })
    }

    /**
     * Error handling middleware
     */
    handleErrors() {
        this.app.use((error: any, req: any, res: any, next: any) => {
            const errorStatus = error.status;
            const errResonse: ResponseType = {
                status: 'error',
                code: errorStatus,
                error: error.message
            }
            RequestResponseLogController.saveRequestResponseLog(req, errResonse);
            res.status(errorStatus).json(errResonse);
        })
    }
}
