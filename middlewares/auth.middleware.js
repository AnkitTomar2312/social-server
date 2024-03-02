const jwt = require("jsonwebtoken");
const config = require("../config/config");
const userModel = require("../modles/user.model");
const verifyToken = (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      config.secretkey,
      (err, decode) => {
        if (err) {
          return res.status(403).send({ message: "Invalid JWT Token" });
        }
        userModel
          .findById(decode.id)
          .then((data) => {
            req.user = data;
            next();
          })
          .catch((e) => {
            return res.status(403).send({ message: e.message });
          });
      }
    );
  } else {
    return res.status(403).send({ message: "Invalid Token please login" });
  }
};

module.exports = { verifyToken };
