const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not Authenticated.");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  // Validating token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      return next(err);
    }
    req.userId = decodedToken.userId;
    req.vaultId = decodedToken.vaultId;
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }

  next();
};
