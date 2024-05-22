import {  Router } from "express";      
import { getProviders, addProvider, getProviderDetailByIdentifier } from "../../../controllers/admin/provider/ProviderCrudController";
import { validateData } from "../../../middlewares/validationMiddleware";
import { providerCreateSchema } from "../../../utils/schemas/providerSchema";
const providerCrudRoutes = Router();  

// Game
providerCrudRoutes.get('/', getProviders); 
providerCrudRoutes.post('/', validateData(providerCreateSchema), addProvider); 
providerCrudRoutes.get('/detail', getProviderDetailByIdentifier); 

export default providerCrudRoutes;
 