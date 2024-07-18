import { ProviderSuperAgentManagementService } from "../../services/providers/provider-super-agent-service";
import { ProviderTicketReportService } from "../../services/providers/provider-ticket-report-service";
 

export const getCashReportForProvider = async (req: any, res: any) => {
    try {
      const providerId = req.payload.providerId; 
       
      const report = await ProviderTicketReportService.cashReport(providerId, req.query);
      if (report.error) {
        return res.status(403).json({ error: report.error});
      } 
  
      
      return res.status(200).json(report.data);
    } catch (error) {
      console.error("Error fetching branches", error);
      return res.status(500).json({ error: "Failed to fetch branches" });
    }
  };
  