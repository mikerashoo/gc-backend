import { ProviderAgentManagementService } from "../../services/providers/provider-agent-services";
import { CommonUserManagementService } from "../../services/user-services";


export const getProviderAgents = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;


    const superAgentsData = await ProviderAgentManagementService.list(providerId);
    if(superAgentsData.error){
      return res.status(403).json({ error:superAgentsData.error });

    }

    return res.status(200).json(superAgentsData.data);
  } catch (error) {
    console.error("Error fetching shops", error);
    return res.status(500).json({ error: "Failed to fetch shops" });
  }
};

export const getProviderAgentsSimpleInfoList = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;


    const superAgentsData = await ProviderAgentManagementService.agentsAndSuperAgents(providerId);
    if(superAgentsData.error){
      return res.status(403).json({ error:superAgentsData.error });

    }

    return res.status(200).json(superAgentsData.data);
  } catch (error) {
    console.error("Error fetching shops", error);
    return res.status(500).json({ error: "Failed to fetch shops" });
  }
};

export const getSuperAgentInfo = async (req: any, res: any) => {
  try { 
    const superAgentId = req.params.superAgentId;
    const providerId = req.payload.providerId;

    const superAgentInfo = await ProviderAgentManagementService.info( superAgentId, providerId);
    if (superAgentInfo.error) {
      return res.status(403).json({ error: superAgentInfo.error});
    } 
    return res.status(200).json(superAgentInfo.data);
  } catch (error) {
    console.error("Error super agent info", error);
    return res.status(500).json({ error: "Failed to get shop info" });
  }
};



export const getSuperAgentReport = async (req: any, res: any) => {
  try { 
    const superAgentId = req.params.superAgentId; 

    const superAgentInfo = await ProviderAgentManagementService.reports( superAgentId, req.query);
    if (superAgentInfo.error) {
      return res.status(403).json({ error: superAgentInfo.error});
    } 
    return res.status(200).json(superAgentInfo.data);
  } catch (error) {
    console.error("Error fetching shops", error);
    return res.status(500).json({ error: "Failed to dele shops" });
  }
};

export const addAgent = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;

    const addAgentData = await ProviderAgentManagementService.add(providerId, req.body);
 
    if(addAgentData.error){
      return res.status(403).json({ error:addAgentData.error });

    }  

    return res.status(200).json(addAgentData.data);
  } catch (error) {
    console.error("Error fetching shops", error);
    return res.status(500).json({ error: "Failed to fetch shops" });
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
    console.error("Error fetching shops", error);
    return res.status(500).json({ error: "Failed to fetch shops" });
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
    console.error("Error fetching shops", error);
    return res.status(500).json({ error: "Failed to fetch shops" });
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
    console.error("Error fetching shops", error);
    return res.status(500).json({ error: "Failed to fetch shops" });
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



 