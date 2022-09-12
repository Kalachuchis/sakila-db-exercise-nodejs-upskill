const mysql = require("mysql");
const { connect } = require("../routes/auth");
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

let filmRepo = {
  getAll: function (resolve, reject) {
    let sql = "SELECT * FROM film";
    let query = connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  },

  getByTitle: function (searchKeyWord, resolve, reject) {
    let sql = "SELECT * FROM film WHERE title LIKE ?";
    let query = connection.query(sql, searchKeyWord, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  },

  getByCategory: function (searchKeyWord, resolve, reject) {
    let sql = `SELECT * , COUNT(inventory.film_id) AS itemsInStock FROM film LEFT JOIN film_category ON film.film_id = film_category.film_id LEFT JOIN category ON film_category.category_id = category.category_id RIGHT JOIN inventory ON film.film_id = inventory.film_id LEFT JOIN rental ON inventory.inventory_id = rental.inventory_id WHERE rental.return_date IS NOT NULL AND category.name LIKE ?  GROUP BY film.film_id;`;
    let query = connection.query(sql, searchKeyWord, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  },

  getByActorLastName: function (searchKeyWord, resolve, reject) {
    let sql = `SELECT * , COUNT(inventory.film_id) AS itemsInStock FROM film LEFT JOIN film_actor ON film.film_id = film_actor.film_id LEFT JOIN actor ON film_actor.actor_id = actor.actor_id RIGHT JOIN inventory ON film.film_id = inventory.film_id LEFT JOIN rental ON inventory.inventory_id = rental.inventory_id WHERE rental.return_date IS NOT NULL AND actor.last_name LIKE ?  GROUP BY film.film_id;`;
    let query = connection.query(sql, searchKeyWord, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  },

  // STAFF ONLY

  createFilm: function (film, resolve, reject) {
    let sql =
      "INSERT INTO film (title, language_id, rental_duration, rental_rate, replacement_cost) VALUES (?, ?, ?, ?, ?)";
    console.log(film);
    let query = connection.query(
      sql,
      [
        film.title,
        film.language_id,
        film.rental_duration,
        film.rental_rate,
        film.replacement_cost,
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

module.exports = filmRepo;
