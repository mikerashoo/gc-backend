import {  Router } from "express";       
import { getReportForCashier } from "../../controllers/cashier/CashierReportController"; 
import gamePlayRoutes from "./games";

const cashierRoutes = Router({mergeParams: true});


cashierRoutes.get('/todays-report', getReportForCashier);  
cashierRoutes.use('/games',  gamePlayRoutes);




export default cashierRoutes;
 