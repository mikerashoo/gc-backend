// kenoRoutes.ts
import { Router } from "express";  
import { isValidCashierAndBranch } from "../../middlewares/cashierBranchMiddleware";
import kenoGameRoutes from "./kenoGameRoutes";
import { getKenoGameConfigurations } from "../../controllers/keno/KenoGameController";

const kenoRoutes = Router({mergeParams: true}); 
// kenoRoutes.use(isAuthenticated, isProviderAdmin);


kenoRoutes.use('/configurations', getKenoGameConfigurations);
kenoRoutes.use('/games/:branchId', isValidCashierAndBranch, kenoGameRoutes);
 

export default kenoRoutes;
