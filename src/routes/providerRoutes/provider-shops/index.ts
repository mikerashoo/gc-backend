import {  Router } from "express";     
import { getProviderShops, addShop, getShopReports } from "../../../controllers/provider/ProviderShopController"; 
import { validateData } from "../../../middlewares/validationMiddleware"; 
import shopManagementRoutes from "./shopManagementRoutes";
import { shopCreateSchema } from "../../../utils/shared/schemas/provider/shop-information-schema";
import { ticketReportSchema } from "../../../utils/shared/schemas/reportSchema";   

 
const providerShopRoutes = Router({mergeParams: true});



// Define the route with parameter

// Game
providerShopRoutes.get('/list', getProviderShops); 
providerShopRoutes.post('/add',  validateData(shopCreateSchema), addShop); 
providerShopRoutes.post('/shop-report',  validateData(ticketReportSchema), getShopReports); 




providerShopRoutes.use('/:shopId', shopManagementRoutes); 


export default providerShopRoutes;
 