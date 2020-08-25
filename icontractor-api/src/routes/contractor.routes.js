import { Router } from 'express';
import { isContractorAuthenticated } from '../middlewares';

import * as contractor from '../controllers/contractor';

const userRoutes = Router();

userRoutes.post('/registerCont', contractor.registerCont);
userRoutes.post('/loginCont', contractor.loginCont);
userRoutes.post('/forgetPassword', contractor.forgetPassword);
userRoutes.post('/forgetPasswordVerify', contractor.forgetPasswordVerify);
userRoutes.post('/forgetChangePassword', contractor.forgetChangePassword);
userRoutes.get('/logout', isContractorAuthenticated, contractor.logout);

userRoutes.get('/contDetail', isContractorAuthenticated, contractor.contDetail);
userRoutes.put('/contUpdate', isContractorAuthenticated, contractor.contUpdate);





export default userRoutes;
