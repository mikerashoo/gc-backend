 

export enum IUserType {
  USER = "USER",
  PROVIDER = "PROVIDER",
  CASHIER = "CASHIER",
}
const jwt = require("jsonwebtoken");

const getUserJWTSignInOption = (user, type: IUserType) => {
  switch (type) {
    case IUserType.PROVIDER:
      return { adminId: user.id, role: user.role, providerId: user.providerId, status: user.status };

    case  IUserType.CASHIER:
      return { cashierId: user.id, branchId: user.branchId, status: user.status };
    default:
      return { userId: user.id, role: user.role, status: user.status };
  }
};

// Usually I keep the token between 5 minutes - 15 minutes
function generateAccessToken(user, type: IUserType) {
  const signInOption = getUserJWTSignInOption(user, type); 
  return jwt.sign(
    {
      ...signInOption,
      userType: type,
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
function generateRefreshToken(user, type: IUserType, jti) {
  const signInOption = getUserJWTSignInOption(user, type);

  return jwt.sign(
    {
      ...signInOption,
      userType: type,
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

function generateTokens(user, type: IUserType, jti) { 
  const accessToken = generateAccessToken(user, type);
  const refreshToken = generateRefreshToken(user, type, jti);

  const daysToExpire = 30 * 24 * 60 * 60 * 1000;
  const accessTokenExpires = Date.now() + daysToExpire;
  return {
    accessToken,
    refreshToken,
    accessTokenExpires,
  };
}

export { generateAccessToken, generateRefreshToken, generateTokens, verifyJwt };
