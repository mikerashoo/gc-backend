 
import { Router } from "express";  
import { getReportForCashier } from "../../controllers/cashier/CashierReportController";
import { getCashReportForProvider } from "../../controllers/provider/ProviderReportController";

const providerReportRoutes = Router({mergeParams: true});
 
providerReportRoutes.get('/cash', getCashReportForProvider);    
export default providerReportRoutes;


 