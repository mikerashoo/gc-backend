 
import { Router } from "express"; 
import { getProviderSuperAgents, addSuperAgent } from "../../../controllers/provider/ProviderSuperAgentsController";
import { validateData } from "../../../middlewares/validationMiddleware";
import { agentRegistrationSchema } from "../../../utils/shared/schemas/userSchemas"; 
import providerSpecificSuperAgentRoutes from "./providerSpecificSuperAgentRoutes";
 

const providerSuperAgentRoutes = Router({mergeParams: true});
 
providerSuperAgentRoutes.get('/list', getProviderSuperAgents);   
providerSuperAgentRoutes.post('/add', validateData(agentRegistrationSchema), addSuperAgent);  
providerSuperAgentRoutes.use('/:superAgentId', providerSpecificSuperAgentRoutes)  
export default providerSuperAgentRoutes;


 