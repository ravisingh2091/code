import { Router } from 'express';

import { isAuthenticated } from '../middlewares';
import * as user from './../controllers/user'

const userRoutes = Router();

userRoutes.post('/authUser', user.authUser)
userRoutes.post('/verifyOtp', user.verifyOtp)

userRoutes.post('/addProject', isAuthenticated, user.addProject)

userRoutes.post('/addRoom', isAuthenticated, user.addRoom)
userRoutes.post('/addWindow', isAuthenticated, user.addWindow)

userRoutes.get('/roomList/:projectId', isAuthenticated, user.roomList)
userRoutes.get('/projectDoneStatus/:projectId', isAuthenticated, user.projectDoneStatus)

userRoutes.get('/roomDetail/:roomId', isAuthenticated, user.roomDetail)
userRoutes.get('/roomDoneStatus/:roomId', isAuthenticated, user.roomDoneStatus)

export default userRoutes;
