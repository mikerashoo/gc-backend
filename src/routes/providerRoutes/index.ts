import {  Router } from "express";       
import providerCashierManagementRoutes from "./cashiers/providerCashierManagementRoutes";
import providerBranchRoutes from "./provider-branches";
import providerSuperAgentRoutes from "./super-agents/providerSuperAgentRoutes";
import providerReportRoutes from "./providerReportRoutes";
// const providerRoutes = Router(); 
const providerRoutes = Router({mergeParams: true}); 

providerRoutes.use('/branches', providerBranchRoutes);
providerRoutes.use('/super-agents', providerSuperAgentRoutes);
providerRoutes.use('/cashiers/:cashierId',  providerCashierManagementRoutes); 
providerRoutes.use('/reports',  providerReportRoutes); 

  

export default providerRoutes;
 