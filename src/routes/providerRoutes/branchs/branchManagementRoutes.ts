import {  Router } from "express";     
import { getBranchDetail } from "../../../controllers/provider/ProviderBranchController";  
import { registerCashierToBranch } from "../../../controllers/provider/CashierController";
const branchManagementRoutes = Router({mergeParams: true});


 
branchManagementRoutes.get('/', getBranchDetail); 
branchManagementRoutes.post('/cashier', registerCashierToBranch); 


export default branchManagementRoutes;
 