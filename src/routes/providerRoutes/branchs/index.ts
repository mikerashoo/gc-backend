import {  Router } from "express";     
import { getProviderBranches, addBranch, getBranchDetail } from "../../../controllers/provider/ProviderBranchController"; 
import { validateData } from "../../../middlewares/validationMiddleware"; 
import { isValidBranch } from "../../../middlewares/providerBranchMiddleware";  
import branchManagementRoutes from "./branchManagementRoutes";
import { branchCreateSchema } from "../../../utils/schemas/providerSchema";
const providerBranchRoutes = Router({mergeParams: true});



// Define the route with parameter

// Game
providerBranchRoutes.get('/', getProviderBranches); 
providerBranchRoutes.post('/',  validateData(branchCreateSchema), addBranch); 

providerBranchRoutes.use('/:branchId', isValidBranch, branchManagementRoutes); 


export default providerBranchRoutes;
 