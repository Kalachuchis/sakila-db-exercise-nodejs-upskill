const staffEmployeeRepo = require("../assets/staff-repo");
const roles = require("../assets/roles");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const staffEmployee = {
    username: `${req.body.username}`,
    password: `${req.body.password}`,
  };
  console.log(staffEmployee);
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Username and Email are required" });
  }
  const foundUser = await staffEmployeeRepo.findStaff(
    req.body,
    (result) => {
      const foundStaff = JSON.parse(JSON.stringify(result));
      console.log(foundStaff);
      const staffPassword = foundStaff[0].password;
      const staffUsername = foundStaff[0].username;

      const options = {
        expiresIn: "1h",
        audience: roles.staff,
      };
      console.log(options.audience);
      let match =
        staffPassword === staffEmployee.password &&
        staffEmployee.username === staffUsername;
      console.log(match);
      if (match) {
        const accessToken = jwt.sign(
          { username: result.username },
          process.env.ACCESS_TOKEN_SECRET,
          options
        );
        const refreshToken = jwt.sign(
          { username: result.username },
          process.env.ACCESS_TOKEN_REFRESH,
          options
        );
        res.cookie("token", refreshToken, { httpOnly: true });
        res.json({
          accessToken,
        });
      } else {
        return res.sendStatus(401);
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
