 
import { Router } from "express"; 
import { getProviderSuperAgents, addSuperAgent } from "../../../controllers/provider/ProviderSuperAgentsController";
import { validateData } from "../../../middlewares/validationMiddleware";
import { superAgentRegistrationSchema } from "../../../utils/shared/schemas/userSchemas";
import { isValidAgentForProvider } from "../../../middlewares/provider/isValidAgentForProvider";
import providerSpecificSuperAgentRoutes from "./providerSpecificSuperAgentRoutes";
 

const providerSuperAgentRoutes = Router({mergeParams: true});
 
providerSuperAgentRoutes.get('/list', getProviderSuperAgents);   
providerSuperAgentRoutes.post('/add', validateData(superAgentRegistrationSchema), addSuperAgent);  
providerSuperAgentRoutes.use('/:superAgentId', providerSpecificSuperAgentRoutes)  
export default providerSuperAgentRoutes;


 