import { Router } from 'express';

import { sendResponse } from '../utils/sendResponse';

import userRoutes from './user.routes';
import adminRoutes from './admin.routes';

const routes = Router();

routes.get('/', (req, res) => {
    sendResponse(res, 200, { message: 'Welcome to User Module' }, 'Good to go!');
});
routes.get('/loaderio-2eb99aca93f5b9e0c565da9a89486bc2', (req, res) => {
    // sendResponse(res, 200, { message: 'Welcome to User Module' }, 'Good to go!');
    var fs = require('fs');
    fs.readFile('loaderio-d3b86388b942dbf03a4299abffb2b348.txt', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
});
routes.use('/', userRoutes);
routes.use('/admin', adminRoutes);
export default routes;
