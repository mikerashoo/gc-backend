import {  Router } from "express";     
import { addProviderAdmin, getProviderAdmins } from "../../../controllers/admin/provider/ProviderUsersController"; 
import { validateData } from "../../../middlewares/validationMiddleware";
import { providerAdminSchema } from "../../../utils/schemas/providerSchema";
const providerAdminRoutes = Router();  

// Game
providerAdminRoutes.get('/', getProviderAdmins); 
providerAdminRoutes.post('/', validateData(providerAdminSchema), addProviderAdmin); 

export default providerAdminRoutes;
 