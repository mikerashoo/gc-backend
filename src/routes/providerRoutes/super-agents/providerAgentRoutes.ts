 
import { Router } from "express"; 
import { getProviderSuperAgents, addSuperAgent } from "../../../controllers/provider/ProviderSuperAgentsController";
import { validateData } from "../../../middlewares/validationMiddleware";
import { agentRegistrationSchema } from "../../../utils/shared/schemas/userSchemas"; 
import providerSpecificSuperAgentRoutes from "./providerSpecificSuperAgentRoutes";
import { addAgent, getProviderAgentsSimpleInfoList, getProviderAgents } from "../../../controllers/provider/ProviderAgentsController";
 

const providerAgentRoutes = Router({mergeParams: true});
 
providerAgentRoutes.get('/list', getProviderAgents);   
providerAgentRoutes.get('/both', getProviderAgentsSimpleInfoList);   
providerAgentRoutes.post('/add', validateData(agentRegistrationSchema), addAgent);  
providerAgentRoutes.use('/:superAgentId', providerSpecificSuperAgentRoutes)  
export default providerAgentRoutes;


 