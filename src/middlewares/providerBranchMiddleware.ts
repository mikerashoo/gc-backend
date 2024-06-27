import db from "../lib/db";

 

export async function isValidBranch(req, res, next) {

  
  // Check if the user is authenticated first
  if (!req.payload) { 
  return res.status(401).json({error: 'Un-Authorized'}); 
  }

  // Check if the user's role is PROVIDER_ADMIN
  if (req.payload.role !== 'PROVIDER_ADMIN') { 
  return res.status(403).json({error: 'Forbidden', message: "User is not valid provider admin"}); 
 
  }

  // Check if the user is an admin of the specified provider
  const providerId = req.params.providerId; // Assuming the providerId is in the request params
  const branchId = req.payload.branchId; // Assuming the providerId is in the request params 
  

  const validBranch = await db.branch.findUnique({
    where: {
      id: branchId,
      providerId
      
    },
  });

  if (!validBranch) { 
    return res.status(403).json({error: 'Invalid branch id', message: "Branch doesn't exist under given provider"}); 
 
  }

  // User is authenticated, has the role of PROVIDER_ADMIN, and is an admin of the specified provider
  return next();
}
 
