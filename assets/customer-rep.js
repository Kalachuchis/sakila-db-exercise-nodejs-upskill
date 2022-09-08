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

let customerRepo = {
  findCustomer: function (customerObject, resolve, reject) {
    console.log(customerObject.firstName);
    let sql =
      "SELECT * FROM customer WHERE first_name LIKE ? AND last_name LIKE ? AND email LIKE ?";
    let query = connection.query(
      sql,
      [customerObject.firstName, customerObject.lastName, customerObject.email],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  },
};

module.exports = customerRepo;
