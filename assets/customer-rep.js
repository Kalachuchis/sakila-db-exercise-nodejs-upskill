const mysql = require("mysql");
const { customer } = require("./roles");
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
  getAll: function (resolve, reject) {
    let sql = `Select * FROM customer`;
    let qurey = connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  },
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

  searchCustomer: function (customerObject, resolve, reject) {
    // let sql = `SELECT * FROM customer JOIN address ON customer.address_id = address.address_id JOIN city ON address.city_id = city.city_id JOIN country ON city.country_id = country.country_id WHERE customer.first_name LIKE ? AND customer.last_name LIKE ? AND country.country LIKE ? ORDER BY customer_id;`;
    let sql = `SELECT customer_id, first_name, last_name, address, city, country FROM customer JOIN address ON customer.address_id = address.address_id JOIN city ON address.city_id = city.city_id JOIN country ON city.country_id = country.country_id
     WHERE customer.first_name LIKE ? AND customer.last_name LIKE ? AND country.country LIKE ? ORDER BY customer_id;`;
    let query = connection.query(
      sql,
      [
        customerObject.first_name,
        customerObject.last_name,
        customerObject.country,
      ],
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
