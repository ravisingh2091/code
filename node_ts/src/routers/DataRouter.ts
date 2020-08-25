import {Router} from 'express';
import DataController from '../controllers/Data/DataController';
import DocumentController from '../controllers/Document/DocumentController';
import {DocumentValidators} from '../validators/DocumentValidators';

import {GlobalMiddleware} from '../middlewares/GlobalMiddleware';

import * as multer from 'multer';
const upload = multer();

class DataRouter {
    public router: any;

    constructor(ExpressRouter: Router) {
        this.router = ExpressRouter;
        this.postRoutes();
        this.getRoutes();
    }

    postRoutes() {
        this.router.post('/applications/upload', upload.single('file'), DataController.getFileData);
        this.router.post('/applications', DocumentValidators.jsonApplicationData(), GlobalMiddleware.checkError, DataController.handleJsonData);
        this.router.post('/user', DataController.handleUserData);
        this.router.post('/application', DataController.handleApplicationData);
        this.router.post('/backend/users/upload', upload.single('file'), GlobalMiddleware.addBackendFlag, DataController.getFileData);
        this.router.post('/backend/users', DocumentValidators.jsonBackendUserData(), GlobalMiddleware.checkError, GlobalMiddleware.addBackendFlag, DataController.handleJsonData);
    }

    getRoutes() {
        this.router.get('/get-document', DocumentValidators.downloadDocument(), GlobalMiddleware.checkError, DocumentController.downloadDocument);
        this.router.get('/create-data', DataController.handleFileData);
    }

}

export default DataRouter;
