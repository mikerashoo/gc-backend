import { User, UserRole } from "@prisma/client"; 

  
const jwt = require("jsonwebtoken");

const getUserJWTSignInOption = (user:User) => {
   return {
    accountId: user.id,
    role: user.role,
    status: user.status,
    shopId: user.cashierShopId,
    agentProviderId: user.agentProviderId,
    providerId: user.providerId,  
    
  }
  
};

// Usually I keep the token between 5 minutes - 15 minutes
function generateAccessToken(user: User) {
  const signInOption = getUserJWTSignInOption(user); 
  return jwt.sign(
    {
      ...signInOption, 
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "30d",
    }
  );
}

// I choosed 8h because i prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
function generateRefreshToken(user: User, jti) {
  const signInOption = getUserJWTSignInOption(user);

  return jwt.sign(
    {
      ...signInOption, 
      jti,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "365d",
    }
  );
}

function verifyJwt(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

function generateTokens(user: User, jti) { 
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  const daysToExpire = 30 * 24 * 60 * 60 * 1000;
  const accessTokenExpires = Date.now() + daysToExpire;
  return {
    accessToken,
    refreshToken,
    accessTokenExpires,
  };
}

export { generateAccessToken, generateRefreshToken, generateTokens, verifyJwt };
