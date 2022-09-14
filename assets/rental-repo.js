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

let rentalRepo = {
  // should return rentals with rental date plus film rental duration
  filmNotReturned: function (resolve, reject) {
    let sql = `SELECT title, rental.inventory_id, rental_date, return_date FROM rental 
    JOIN inventory ON rental.inventory_id = inventory.inventory_id 
    JOIN film ON inventory.film_id = film.film_id 
    WHERE rental.return_date IS NULL AND rental_date + INTERVAL film.rental_duration DAY < CURRENT_DATE()
    ORDER BY title`;
    let query = connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  },

  filmsNotInStock: function (inventory_id, resolve, reject) {
    let sql = `SELECT title, inventory.inventory_id,  inventory.last_update FROM inventory
                JOIN film ON inventory.film_id = film.film_id 
                WHERE inventory.inventory_id IN (SELECT inventory_id FROM inventory
                    join film using(film_id)
                    JOIN rental USING (inventory_id)
                    WHERE return_date IS NULL
                    order by inventory_id)
                    AND inventory.inventory_id = ?
                    GROUP BY film.film_id
                    ORDER BY film.film_id;`;

    let query = connection.query(sql, [inventory_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  },

  rentFilm: function (inventory_id, customer_id, staff_id, resolve, reject) {
    let sql = `INSERT INTO rental(rental_date, inventory_id, customer_id, staff_id) VALUES (NOW(), ?, ?, ? )`;
    let query = connection.query(
      sql,
      [inventory_id, customer_id, staff_id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  },

  returnFilm: function (inventory_id, customer_id, resolve, reject) {
    let sql = `UPDATE rental 
                SET return_date = NOW()
                WHERE rental_id = ( SELECT rental_id FROM rental
                                    WHERE inventory_id = ?
                                    AND customer_id = ?
                                    AND return_date IS NULL)`;
    let query = connection.query(
      sql,
      [inventory_id, customer_id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  },

  getByFilm: function (search, resolve, reject) {
    // add rental_id
    let sql = `SELECT title, inventory.inventory_id, rental_date, return_date
        FROM film
        JOIN inventory
        ON film.film_id = inventory.film_id
        JOIN rental
        ON inventory.inventory_id = rental.inventory_id
        WHERE film.title LIKE ?`;

    let query = connection.query(sql, [search], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  },
};

module.exports = rentalRepo;
