const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sakila",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

let staffRepo = {
  findStaff: function (staffObject, resolve, reject) {
    console.log(staffObject.username);
    let sql = "SELECT * FROM staff WHERE username = ?";
    let query = connection.query(sql, [staffObject.username], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  },
};

module.exports = staffRepo;
