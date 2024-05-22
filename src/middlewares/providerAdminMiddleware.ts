import db from "../lib/db";

 

async function isProviderAdmin(req, res, next) {

  
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
  const userId = req.payload.userId;
  

  const isAdmin = await db.provider.findFirst({
    where: {
      id: providerId,
      admins: {
        some: {
          id: userId,
        },
      },
    },
  });

  if (!isAdmin) { 
    return res.status(403).json({error: 'Invalid provider id', message: "Provider id is invalid for given user"}); 
 
  }

  // User is authenticated, has the role of PROVIDER_ADMIN, and is an admin of the specified provider
  return next();
}

module.exports = { 
  isProviderAdmin
};
