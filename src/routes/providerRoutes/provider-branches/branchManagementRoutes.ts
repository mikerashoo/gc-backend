import {  Router } from "express";     
import { deleteBranch, getBranchDetail, updateBranch } from "../../../controllers/provider/ProviderBranchController";   
import { validateData } from "../../../middlewares/validationMiddleware";
import { branchUpdateSchema } from "../../../utils/shared/schemas/provider/branch-information-schema"; 
import { getCashiersBranch, addCashierToBranch } from "../../../controllers/provider/CashierController";
const branchManagementRoutes = Router({mergeParams: true});


 

branchManagementRoutes.get('/cashiers', getCashiersBranch); 
branchManagementRoutes.post('/add-cashier', addCashierToBranch);  
branchManagementRoutes.post('/update',  validateData(branchUpdateSchema), updateBranch);  
branchManagementRoutes.get('/detail', getBranchDetail); 
branchManagementRoutes.delete('/delete', deleteBranch);  
 


export default branchManagementRoutes;
  