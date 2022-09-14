const customerRepo = require("../assets/customer-rep");
const roles = require("../assets/roles");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const customer = {
    firstName: `${req.body.firstName}`,
    lastName: `${req.body.lastName}`,
    email: `${req.body.email}`,
  };
  console.log(!customer.firstName || !customer.lastName || !customer.email);
  if (!req.body.firstName || !req.body.lastName || !req.body.email) {
    return res
      .status(400)
      .json({ message: "First name, last name and email are required" });
  } else {
    const foundUser = customerRepo.findCustomer(
      req.body,
      (result) => {
        console.log(result);
        const options = {
          expiresIn: "1h",
          audience: roles.customer,
        };
        if (result.length) {
          const accessToken = jwt.sign(
            { username: result.email },
            process.env.ACCESS_TOKEN_SECRET,
            options
          );
          const refreshToken = jwt.sign(
            { username: result.email },
            process.env.ACCESS_TOKEN_REFRESH,
            options
          );
          res.cookie("token", refreshToken, { httpOnly: true });
          res.json({
            accessToken,
          });
        } else {
          return res.sendStatus(500);
        }
      },
      (err) => {
        next(err);
      }
    );
  }

  //   if (!foundUser) {
  //     return res.sendStatus(401);
  //   } else {
  //     // create JWT
  //     res.json({
  //       success: "User is logged in",
  //     });
  //   }
};

module.exports = { handleLogin };
