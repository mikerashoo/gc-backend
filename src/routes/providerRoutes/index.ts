import {  Router } from "express";       
import providerCashierManagementRoutes from "./cashiers/providerCashierManagementRoutes";
import providerBranchRoutes from "./provider-branches";
// const providerRoutes = Router(); 
const providerRoutes = Router({mergeParams: true}); 

providerRoutes.use('/branches', providerBranchRoutes);
providerRoutes.use('/cashiers/:cashierId',  providerCashierManagementRoutes); 

  

export default providerRoutes;
 