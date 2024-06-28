import {  Router } from "express";     
import { addProviderAdmin, getProviderAdmins } from "../../../controllers/admin/provider/ProviderUsersController"; 
import { validateData } from "../../../middlewares/validationMiddleware"; 
import { providerUserRegistrationSchema } from "../../../utils/shared/schemas/provider/provider-users-schema";
const providerAdminRoutes = Router();  

// Game
providerAdminRoutes.get('/', getProviderAdmins); 
providerAdminRoutes.post('/', validateData(providerUserRegistrationSchema), addProviderAdmin); 

export default providerAdminRoutes;
 