import { Router } from 'express';
import { isAdminAuthenticated } from '../middlewares';

import * as card from '../controllers/card';
import * as admin from '../controllers/admin';

const adminRoutes = Router();

adminRoutes.post('/loginAdmin', admin.loginAdmin);

adminRoutes.get('/card', isAdminAuthenticated, card.listCard);
adminRoutes.post('/card/create', isAdminAuthenticated, card.createCard);

adminRoutes.post('/category/create', isAdminAuthenticated, admin.addCategory);
adminRoutes.get('/category', isAdminAuthenticated, admin.listCategory);

adminRoutes.get('/user', isAdminAuthenticated, admin.listUser)
adminRoutes.get('/user/:id', isAdminAuthenticated, admin.userDetail)
adminRoutes.post('/user/search', admin.seachParent)
adminRoutes.get('/user/dispute/:id', isAdminAuthenticated, admin.disputeFee)
adminRoutes.get('/user/dispute-fee/list', isAdminAuthenticated, admin.disputeFeeList)
adminRoutes.get('/user/dispute-fee/update/:id', isAdminAuthenticated, admin.disputeStatus)

adminRoutes.get('/referral/list', admin.referralDetails)

adminRoutes.get('/subscription', isAdminAuthenticated, admin.userSubscriptionList)

adminRoutes.get('/child', isAdminAuthenticated, admin.childlist)
adminRoutes.get('/child/:id', isAdminAuthenticated, admin.childDetail)

adminRoutes.get('/task', isAdminAuthenticated, admin.listTask)
adminRoutes.get('/task/:id', isAdminAuthenticated, admin.taskDetail)

adminRoutes.get('/event', isAdminAuthenticated, admin.listEvent)

adminRoutes.get('/transaction', isAdminAuthenticated, admin.listTransaction)

adminRoutes.get('/dashboard', isAdminAuthenticated, admin.dashboard)

// education route
adminRoutes.post('/education', isAdminAuthenticated, admin.createEducation)
adminRoutes.put('/education', isAdminAuthenticated, admin.updateEducation)
adminRoutes.get('/education', isAdminAuthenticated, admin.listEducation)
adminRoutes.get('/education/:id', isAdminAuthenticated, admin.educationDetail)
adminRoutes.post('/education/topic', isAdminAuthenticated, admin.createEducationTopic)

//review
adminRoutes.get('/review', isAdminAuthenticated, admin.listReview)
adminRoutes.put('/review/:id', isAdminAuthenticated, admin.updateReview)
export default adminRoutes;
