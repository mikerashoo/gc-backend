import {  Router } from "express";     
import { getProviderBranches, addBranch, getBranchReports } from "../../../controllers/provider/ProviderBranchController"; 
import { validateData } from "../../../middlewares/validationMiddleware"; 
import branchManagementRoutes from "./branchManagementRoutes";
import { branchCreateSchema } from "../../../utils/shared/schemas/provider/branch-information-schema";
import { ticketReportSchema } from "../../../utils/shared/schemas/reportSchema";  
const  {isValidBranchForProvider}  = require("../../../middlewares/provider/isValidBranchForProvider"); 

 
const providerBranchRoutes = Router({mergeParams: true});



// Define the route with parameter

// Game
providerBranchRoutes.get('/list', getProviderBranches); 
providerBranchRoutes.post('/add',  validateData(branchCreateSchema), addBranch); 
providerBranchRoutes.post('/branch-report',  validateData(ticketReportSchema), getBranchReports); 




providerBranchRoutes.use('/:branchId', isValidBranchForProvider,  branchManagementRoutes); 


export default providerBranchRoutes;
 