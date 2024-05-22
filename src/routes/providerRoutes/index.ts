import {  Router } from "express";      
import providerBranchRoutes from "./branchs";
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const { isProviderAdmin } = require('../../middlewares/providerAdminMiddleware');
// const providerRoutes = Router(); 
const providerRoutes = Router({mergeParams: true});
providerRoutes.use(isAuthenticated, isProviderAdmin);

providerRoutes.use('/branches', providerBranchRoutes);
  

export default providerRoutes;
 