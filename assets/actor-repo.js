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

let actorRepo = {
  getAll: function (resolve, reject) {
    let sql = "SELECT * FROM actor;";
    let query = connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  },
  getByName: function (nameObject, resolve, reject) {
    let sql = `SELECT * FROM actor WHERE last_name LIKE ? AND first_name LIKE ?`;
    console.log(nameObject);
    let query = connection.query(
      sql,
      [nameObject.lastName, nameObject.firstName],
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

module.exports = actorRepo;
