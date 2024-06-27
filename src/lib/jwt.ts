 
const jwt = require('jsonwebtoken');

// Usually I keep the token between 5 minutes - 15 minutes
function generateAccessToken(user) {
  return jwt.sign({ userId: user.id, role: user.role, accountId: user.account ? user.account.id : null  }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '30d',
  });
}
 


// I choosed 8h because i prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
function generateRefreshToken(user, jti) {
  return jwt.sign({
    userId: user.id,
    role: user.role,
    accountId: user.account ? user.account.id : null,
    jti
  }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '365d',
  });
}

function verifyJwt(token:string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}




function generateTokens(user, jti) {
  console.log("User to generate token", user)
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);
 
  const daysToExpire = 30 * 24 * 60 * 60 * 1000;
const accessTokenExpires =  Date.now() + daysToExpire; 
  return {
    accessToken,
    refreshToken,
    accessTokenExpires,
  };
}



export {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyJwt
};