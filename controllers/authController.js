const customerRepo = require("../assets/customer-rep");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const customer = {
    firstName: `${req.body.firstName}`,
    lastName: `${req.body.lastName}`,
    email: `${req.body.email}`,
  };
  console.log(customer.firstName);
  if (!customer.firstName || !customer.lastName || !customer.email) {
    return res
      .status(400)
      .json({ message: "First name, last name and email are required" });
  }
  const foundUser = customerRepo.findCustomer(
    req.body,
    (result) => {
      console.log(result);
      if (result.length) {
        const accessToken = jwt.sign(
          { username: result.email },
          process.env.ACCESS_TOKEN_SECRET
        );
        const refreshToken = jwt.sign(
          { username: result.email },
          process.env.ACCESS_TOKEN_REFRESH
        );
        res.json({
          accessToken,
        });
      }
    },
    (err) => {
      next(err);
    }
  );

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
