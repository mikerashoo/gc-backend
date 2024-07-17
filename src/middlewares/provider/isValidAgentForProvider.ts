import db from "../../lib/db"; 
import { isProvider } from "../../lib/helper/userRoleHelpers";
import { ProviderUserRole } from "../../utils/shared/shared-types/prisma-enums";

export async function isValidAgentForProvider(req, res, next) {
  // Check if the user is authenticated first
  if (!req.payload || !req.payload.role || !req.payload.providerId) {
    return res.status(401).json({ error: "Un-Authorized" });
  }

  if (!isProvider(req.payload.role)) {
    return res
      .status(403)
      .json({ error: "Forbidden", message: "User is not valid Provider" });
  }

  const providerId = req.payload.providerId; // Assuming the providerId is in the request params
  const agentId = req.params.agentId; // Assuming the providerId is in the request params
  const superAgentId = req.params.superAgentId; // Assuming the providerId is in the request params
  console.log("Agent id on isValidAgentForProvider", agentId)

  if (!agentId && !superAgentId) {
    return res
      .status(403)
      .json({ error: "Agent Id Not Found", message: "Agent or Super Agent Id is required" });
  }
  if(agentId){
    const validAgent = await db.user.findFirst({
      where: {
        OR: [
          {
            id: agentId
          },
          {
            userName: agentId
          }
        ],
      agentProviderId: providerId, 
      },
    });
  
    if (!validAgent) {
      return res
        .status(403)
        .json({
          error: "Invalid Agent id",
          message: "Agent doesn't exist under given provider",
        });
    }
   
  }

  if(superAgentId){
    const validSuperAgent = await db.user.findFirst({
      where: {
        OR: [
          {
            id: superAgentId
          },
          {
            userName: superAgentId
          }
        ],
      agentProviderId: providerId, 
      },
    });
  
    if (!validSuperAgent) {
      return res
        .status(403)
        .json({
          error: "Invalid Agent id",
          message: "Super Agent doesn't exist under given provider",
        });
    }
   
  }
 
  // User is authenticated, has the role of PROVIDER_ADMIN, and is an admin of the specified provider
  return next();
}
