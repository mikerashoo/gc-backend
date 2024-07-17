import { ProviderSuperAgentManagementService } from "../../services/providers/provider-super-agent-service";
import { CommonUserManagementService } from "../../services/user-services";


export const getProviderSuperAgents = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;


    const superAgentsData = await ProviderSuperAgentManagementService.list(providerId);
    if(superAgentsData.error){
      return res.status(403).json({ error:superAgentsData.error });

    }

    return res.status(200).json(superAgentsData.data);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};


export const getSuperAgentInfo = async (req: any, res: any) => {
  try { 
    const superAgentId = req.params.superAgentId;
    const providerId = req.payload.providerId;

    const superAgentInfo = await ProviderSuperAgentManagementService.info( superAgentId, providerId);
    if (superAgentInfo.error) {
      return res.status(403).json({ error: superAgentInfo.error});
    } 
    return res.status(200).json(superAgentInfo.data);
  } catch (error) {
    console.error("Error super agent info", error);
    return res.status(500).json({ error: "Failed to get branch info" });
  }
};



export const getSuperAgentReport = async (req: any, res: any) => {
  try { 
    const superAgentId = req.params.superAgentId; 

    const superAgentInfo = await ProviderSuperAgentManagementService.reports( superAgentId, req.query);
    if (superAgentInfo.error) {
      return res.status(403).json({ error: superAgentInfo.error});
    } 
    return res.status(200).json(superAgentInfo.data);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to dele branches" });
  }
};

export const addSuperAgent = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;

    const addSuperAgentsData = await ProviderSuperAgentManagementService.add(providerId, req.body);
 
    if(addSuperAgentsData.error){
      return res.status(403).json({ error:addSuperAgentsData.error });

    } 

    console.log("Add super agent data", addSuperAgentsData)

    return res.status(200).json(addSuperAgentsData.data);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};



export const updateSuperAgent = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;
    const superAgentId = req.params.superAgentId;

    const updateSuperAgentData = await CommonUserManagementService.update(superAgentId, req.body);
 
    if(updateSuperAgentData.error){
      return res.status(403).json({ error:updateSuperAgentData.error });

    } 

    console.log("Add super agent data", updateSuperAgentData)

    return res.status(200).json(updateSuperAgentData.data);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};


export const changeSuperAgentPassword = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;
    const superAgentId = req.params.superAgentId;

    const changePassword = await CommonUserManagementService.changePassword({
      id: superAgentId,
      passwordData: req.body
    });
 
    if(changePassword.error){
      return res.status(403).json({ error:changePassword.error });

    } 

    console.log("Add super agent data", changePassword)

    return res.status(200).json(changePassword.data);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};



export const changeSuperAgentStatus = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;
    const superAgentId = req.params.superAgentId;

    const changeStatusData = await CommonUserManagementService.changeStatus(superAgentId);
 
    if(changeStatusData.error){
      return res.status(403).json({ error:changeStatusData.error });

    } 

    console.log("Add super agent data", changeStatusData)

    return res.status(200).json(changeStatusData.data);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};
 

export const deleteSuperAgent = async (req: any, res: any) => {
  try { 
    const superAgentId = req.params.superAgentId;
    const deleteRequest = await CommonUserManagementService.delete( superAgentId);
    if (deleteRequest.error) {
      return res.status(403).json({ error: deleteRequest.error});
    } 
    return res.status(200).json(deleteRequest.data);
  } catch (error) {
    console.error("Error Deleting super agent", error);
    return res.status(500).json({ error: "Failed to dele super agent" });
  }
};



 