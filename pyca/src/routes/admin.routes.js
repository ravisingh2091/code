import { Router } from 'express';
import { isAdminAuthenticated } from '../middlewares';

import * as admin from '../controllers/admin';
import * as staticContent from './../controllers/staticContent'

const userRoutes = Router();
userRoutes.post('/loginAdmin', admin.loginAdmin);
userRoutes.post('/changePassword', isAdminAuthenticated, admin.adminChangePassword);
userRoutes.post('/carmodel/create', isAdminAuthenticated, admin.createCarMode);
userRoutes.get('/userList', isAdminAuthenticated, admin.userList)
userRoutes.get('/userDetails', isAdminAuthenticated, admin.userDetails)
userRoutes.put('/userStatusManage', isAdminAuthenticated, admin.userStatusManage)
userRoutes.get('/activeRide', isAdminAuthenticated, admin.activeRide)
userRoutes.get('/offeredRide', isAdminAuthenticated, admin.offeredRide)
userRoutes.get('/scheduleRide', isAdminAuthenticated, admin.scheduleRide)
userRoutes.get('/rideDetail', isAdminAuthenticated, admin.rideDetails)
userRoutes.get('/dashboardData', isAdminAuthenticated, admin.dashboardData)


//static content 
userRoutes.post('/content/create', isAdminAuthenticated, staticContent.createContent);
userRoutes.get('/content', isAdminAuthenticated, staticContent.listContent);
userRoutes.put('/content/:id', isAdminAuthenticated, staticContent.updateContent);
userRoutes.get('/contact-us', isAdminAuthenticated, staticContent.contactUsList)





export default userRoutes;
