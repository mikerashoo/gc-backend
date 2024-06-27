const jwt = require('jsonwebtoken');

// Usually I keep the token between 5 minutes - 15 minutes
function generateCashierAccessToken(cashier) {
  return jwt.sign({ cashierId: cashier.id, branchId: cashier.branchId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '30d',
  });
}

// I chose 8h because I prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days and make him login again after 7 days of inactivity.
function generateCashierRefreshToken(cashier, jti) {
  return jwt.sign({
    cashierId: cashier.id,
    branchId: cashier.branchId,
    jti
  }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '365d',
  });
}

function verifyJwt(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

function generateCashierTokens(cashier, jti) {
  console.log("Cashier to generate token", cashier);
  const accessToken = generateCashierAccessToken(cashier);
  const refreshToken = generateCashierRefreshToken(cashier, jti);

  const daysToExpire = 30 * 24 * 60 * 60 * 1000;
  const accessTokenExpires = Date.now() + daysToExpire;
  return {
    accessToken,
    refreshToken,
    accessTokenExpires,
  };
}

export {
  generateCashierAccessToken,
  generateCashierRefreshToken,
  generateCashierTokens,
  verifyJwt
};
