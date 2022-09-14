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
      [nameObject.last_name, nameObject.first_name],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  },

  createActor: function (actor, resolve, reject) {
    let sql = "INSERT INTO actor (first_name, last_name) VALUES (?, ?)";
    console.log(actor);
    let query = connection.query(
      sql,
      [actor.first_name, actor.last_name],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  },

  // getActor: async function (actor, resolve, reject) {
  //   let sql = "SELECT * FROM actor WHERE title = ? ";
  //   let search = actor;
  //   let query = connection.query(sql, [actor], (err, result) => {
  //     if (err) {
  //       reject(err);
  //     } else {
  //       resolve(result);
  //     }
  //   });
  // },

  deleteActor: function (actorId, resolve, reject) {
    let sql = "DELETE FROM actor WHERE actor_id = ?";
    let query = connection.query(sql, actorId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  },

  updateActor: function (actorId, updateActor, resolve, reject) {
    //TODO: UPDATE actor
    let sql = "UPDATE actor SET ? WHERE actor_id = ?";
    let query = connection.query(sql, [updateActor, actorId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  },
};

module.exports = actorRepo;
