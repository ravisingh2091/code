import { Router } from 'express';
import { isAdminAuthenticated } from '../middlewares';

import * as admin from '../controllers/admin';

const userRoutes = Router();
userRoutes.post('/loginAdmin', admin.loginAdmin);
userRoutes.post('/changePassword', isAdminAuthenticated, admin.adminChangePassword);

userRoutes.get('/userList', isAdminAuthenticated, admin.userList)
userRoutes.get('/userDetails/:id', isAdminAuthenticated, admin.userDetails)
userRoutes.get('/contList', isAdminAuthenticated, admin.contList)
userRoutes.get('/contDetails/:id', isAdminAuthenticated, admin.contDetails)

userRoutes.put('/updatePricingEngine', isAdminAuthenticated, admin.updatePricingEngine)






export default userRoutes;
