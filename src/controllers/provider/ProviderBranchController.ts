import { ProviderBranchService } from "../../services/providers/branch-info-services";
import { ProviderTicketReportService } from "../../services/providers/provider-ticket-report-service";


export const getProviderBranches = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;


    const branchList = await ProviderBranchService.list(providerId);
    if(branchList.error){
      return res.status(403).json({ error:branchList.error });

    }

    return res.status(200).json(branchList.data);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};



export const addBranch = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;

    const addBranchService = await ProviderBranchService.add(providerId, req.body);
    if(addBranchService.error){
      return res.status(403).json({ error:addBranchService.error });

    } 

    return res.status(200).json(addBranchService.data);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};

export const getBranchDetail = async (req: any, res: any) => {
  try {
    const branchId = req.params.branchId;
    const { start, end } = req.query;
    const branch = await ProviderBranchService.detail(branchId, start, end);
    if (branch.error) {
      return res.status(403).json({ error: branch.error});
    } 

    
    return res.status(200).json(branch.data);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};

export const getBranchReports = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;
    const data = req.body;
     
    const branch = await ProviderTicketReportService.reportOfBranch([providerId], data);
    if (branch.error) {
      return res.status(403).json({ error: branch.error});
    } 

    
    return res.status(200).json(branch.data);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};


export const updateBranch = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;
    const branchId = req.params.branchId;
    const branch = await ProviderBranchService.update(req.body, branchId, providerId);
    if (branch.error) {
      return res.status(403).json({ error: branch.error});
    } 
    return res.status(200).json(branch.data);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};


export const deleteBranch = async (req: any, res: any) => {
  try { 
    const branchId = req.params.branchId;
    const branch = await ProviderBranchService.delete( branchId);
    if (branch.error) {
      return res.status(403).json({ error: branch.error});
    } 
    return res.status(200).json(branch);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to dele branches" });
  }
};



 