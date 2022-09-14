const jwt = require("jsonwebtoken");
const constants = require("../assets/roles");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  //     const token = authHeader.split("")[1];
  //   console.log(token);

  jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).send({
        status: 403,
        message: "invalid",
      });
    else {
      next();
    }
  });
};

const verifyAudienceFromToken = (req, res, next) => {
  const jwtToken = req.headers["authorization"];
  const tokenAudience = jwt.decode(jwtToken)["aud"];
  const isStaff = tokenAudience.includes(constants.staff);
  if (!isStaff) {
    return res.status(403).send({
      message: "You are not authorized to view this page",
    });
  } else {
    next();
  }
};

const getSubjectFromToken = (token) => {
  // const jwtToken = req.headers["authorization"];
  const tokenSubject = jwt.decode(token)["sub"];

  return tokenSubject;
};
module.exports = { verifyJWT, verifyAudienceFromToken, getSubjectFromToken };
