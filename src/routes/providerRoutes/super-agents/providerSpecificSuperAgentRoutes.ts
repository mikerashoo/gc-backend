 
import { Router } from "express"; 
import { updateSuperAgent, deleteSuperAgent, changeSuperAgentStatus, changeSuperAgentPassword, getSuperAgentInfo, getSuperAgentReport } from "../../../controllers/provider/ProviderSuperAgentsController";
 
 
const providerSpecificSuperAgentRoutes = Router({mergeParams: true});
 
providerSpecificSuperAgentRoutes.get('/info',  getSuperAgentInfo); 
providerSpecificSuperAgentRoutes.get('/report',  getSuperAgentReport); 

providerSpecificSuperAgentRoutes.post('/update',  updateSuperAgent);  
// providerSpecificSuperAgentRoutes.get('/detail',  getBranchDetail);  
providerSpecificSuperAgentRoutes.delete('/delete',  deleteSuperAgent); 
providerSpecificSuperAgentRoutes.get('/change-status',  changeSuperAgentStatus); 
providerSpecificSuperAgentRoutes.post('/change-password',  changeSuperAgentPassword);    

export default providerSpecificSuperAgentRoutes;
