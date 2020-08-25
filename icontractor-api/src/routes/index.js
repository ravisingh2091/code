import { Router } from 'express';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import contractorRoutes from './contractor.routes';
const routes = Router();


routes.use('/', userRoutes);
routes.use('/admin', adminRoutes);
routes.use('/contractor', contractorRoutes);
export default routes;
