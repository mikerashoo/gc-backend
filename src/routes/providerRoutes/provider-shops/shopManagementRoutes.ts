
import { Router } from "express";
import { getCashiersShop, addCashierToShop } from "../../../controllers/provider/CashierController";
import { updateShop, getShopDetail, deleteShop } from "../../../controllers/provider/ProviderShopController";
import { validateData } from "../../../middlewares/validationMiddleware";
import { shopUpdateSchema } from "../../../utils/shared/schemas/provider/shop-information-schema";

 
const shopManagementRoutes = Router({mergeParams: true});


 

shopManagementRoutes.get('/cashiers', getCashiersShop); 
shopManagementRoutes.post('/add-cashier', addCashierToShop);  
shopManagementRoutes.post('/update',  validateData(shopUpdateSchema), updateShop);  
shopManagementRoutes.get('/detail', getShopDetail); 
shopManagementRoutes.delete('/delete', deleteShop);  
 


export default shopManagementRoutes;
  