const jwt = require("jsonwebtoken");

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader;
  if (token == null) {
    return res.status(401).json({ message: "Missing token" });
  }
  jwt.verify(token, process.env.JWT_SECRET_CODE, (err, user) => {

    if (err) return res.status(403).json({ message: "Jwt expired" });
    req.user = user;
    next();
  });
};
