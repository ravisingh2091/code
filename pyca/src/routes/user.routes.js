import { Router } from 'express';
import { isAuthenticated } from '../middlewares';

import * as auth from '../controllers/auth';
import { listCarModel } from '../controllers/admin';
import * as user from './../controllers/user'
import * as staticContent from './../controllers/staticContent'

const userRoutes = Router();
userRoutes.post('/register', auth.registerUsers);
userRoutes.post('/login', auth.loginUser);
userRoutes.post('/checkNumber', auth.checkNumber);
userRoutes.post('/forgetPassword', auth.forgetPassword);
userRoutes.post('/changePassword', isAuthenticated, auth.changePassword);
userRoutes.get('/carmodel/list', listCarModel);
userRoutes.get('/user/get', isAuthenticated, user.getProfileDetails);
userRoutes.post('/user/update', isAuthenticated, user.updateProfile);
userRoutes.get('/notification', isAuthenticated, user.notificationList);

userRoutes.get('/getContent', isAuthenticated, staticContent.getContent);
userRoutes.post('/contact-us', isAuthenticated, staticContent.contactUs);

userRoutes.post('/youth', isAuthenticated, user.youthAdd);
userRoutes.get('/youth', isAuthenticated, user.youthList);
userRoutes.put('/youth', isAuthenticated, user.youthUpdate);

userRoutes.get('/memberlist', isAuthenticated, user.memeberList);
userRoutes.get('/connectMember', isAuthenticated, user.connectMember);


userRoutes.post('/offerRide', isAuthenticated, user.offerRide);
userRoutes.post('/rideSearch', isAuthenticated, user.requestedRideSearch);
userRoutes.post('/requestRide', isAuthenticated, user.requestRide);

userRoutes.get('/myRide', isAuthenticated, user.myRide);
userRoutes.get('/rideDetails', isAuthenticated, user.rideDetails);
userRoutes.post('/rideStatus', isAuthenticated, user.rideStatus);
userRoutes.post('/rideStatusByOfferedId', isAuthenticated, user.rideStatusByOfferedId);

userRoutes.post('/schedule', isAuthenticated, user.scheduleCreate);
userRoutes.get('/schedule', isAuthenticated, user.scheduleList);
userRoutes.put('/schedule', isAuthenticated, user.scheduleUpdate);
userRoutes.delete('/schedule', isAuthenticated, user.scheduleDelete);

// chat url
userRoutes.get('/chatList', isAuthenticated, user.chatList);
userRoutes.get('/chatUserList', isAuthenticated, user.chatUserList);



export default userRoutes;
