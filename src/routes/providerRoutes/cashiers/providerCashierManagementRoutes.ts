 
import { Router } from "express"; 
import { deleteCashier, changeStatusOfCashier, changeCashierPassword, updateCashier } from "../../../controllers/provider/CashierController";
import { getShopDetail } from "../../../controllers/provider/ProviderShopController";  

const  {isValidCashierForProvider}  = require("../../../middlewares/provider/isValidCashierForProvider"); 

const providerCashierManagementRoutes = Router({mergeParams: true});

providerCashierManagementRoutes.post('/update', isValidCashierForProvider, updateCashier);  
providerCashierManagementRoutes.get('/detail', isValidCashierForProvider, getShopDetail);  
providerCashierManagementRoutes.delete('/delete', isValidCashierForProvider, deleteCashier); 
providerCashierManagementRoutes.get('/change-status', isValidCashierForProvider, changeStatusOfCashier); 
providerCashierManagementRoutes.post('/change-password', isValidCashierForProvider, changeCashierPassword); 
 
export default providerCashierManagementRoutes;
