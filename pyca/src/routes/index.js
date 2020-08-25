import { Router } from 'express';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import { sendResponse } from './../utils/sendResponse'

const routes = Router();

routes.get('/', (req, res) => {
    sendResponse(res, 200, { message: 'Welcome to User Module' }, 'Good to go!');
});
routes.get('/loaderio-19bb7064787761d1f14380718f18dd37', (req, res) => {
    var fs = require('fs');
    fs.readFile('loaderio.txt', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
});
routes.use('/', userRoutes);
routes.use('/admin', adminRoutes);
export default routes;
