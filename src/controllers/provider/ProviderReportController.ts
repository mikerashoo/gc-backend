import { ProviderSuperAgentManagementService } from "../../services/providers/provider-super-agent-service";
import { ProviderTicketReportService } from "../../services/providers/provider-ticket-report-service";
 

export const getCashReportForProvider = async (req: any, res: any) => {
    try {
      const providerId = req.payload.providerId; 
       
      const branch = await ProviderTicketReportService.reportOfBranch(providerId, req.query);
      if (branch.error) {
        return res.status(403).json({ error: branch.error});
      } 
  
      
      return res.status(200).json(branch.data);
    } catch (error) {
      console.error("Error fetching branches", error);
      return res.status(500).json({ error: "Failed to fetch branches" });
    }
  };
  