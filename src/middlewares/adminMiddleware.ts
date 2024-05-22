
function isAdmin(req, res, next) {
  // Check if the user is authenticated first
  if (!req.payload) {
    res.status(401);
    throw new Error('Un-Authorized');
  }

   
  // Check if the user's role is ADMIN
  if (req.payload.role !== 'ADMIN') {
    res.status(403);
    throw new Error('Forbidden');
  }

  // User is authenticated and has the role of ADMIN, proceed to the next middleware
  return next();
}


module.exports = { 
  isAdmin
};