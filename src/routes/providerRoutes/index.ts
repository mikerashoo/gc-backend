import {  Router } from "express";       
import providerCashierManagementRoutes from "./cashiers/providerCashierManagementRoutes"; 
import providerSuperAgentRoutes from "./super-agents/providerSuperAgentRoutes";
import providerReportRoutes from "./providerReportRoutes";
import providerShopRoutes from "./provider-shops";
import providerAgentRoutes from "./super-agents/providerAgentRoutes";
// const providerRoutes = Router(); 
const providerRoutes = Router({mergeParams: true}); 

providerRoutes.use('/shops', providerShopRoutes);
providerRoutes.use('/super-agents', providerSuperAgentRoutes);
providerRoutes.use('/agents', providerAgentRoutes);
providerRoutes.use('/cashiers/:cashierId',  providerCashierManagementRoutes); 
providerRoutes.use('/reports',  providerReportRoutes); 

  

export default providerRoutes;
 