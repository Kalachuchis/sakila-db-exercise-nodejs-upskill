const express = require("express");
const router = express.Router();
const customerRepo = require("../assets/customer-rep");
const filmRepo = require("../assets/film-repo");
const actorRepo = require("../assets/actor-repo");
const rentalRepo = require("../assets/rental-repo");
const {
  verifyJWT,
  verifyAudienceFromToken,
  getSubjectFromToken,
} = require("../controllers/verifyJWT");
const constants = require("../assets/roles");
const { application } = require("express");
const { route } = require("./auth");

// verifies if token has an audience option of staff
router.use(verifyAudienceFromToken);

// CUSTOMER ROUTES
router.get("/all", (req, res) => {
  customerRepo.getAll(
    function (result) {
      res.status(200).json({
        staus: 200,
        data: result,
      });
    },
    (err) => {
      throw err;
    }
  );
});

router.get("/searchCustomer", (req, res) => {
  const customerToSearch = {
    first_name: `%${req.body.first_name}%`,
    last_name: `%${req.body.last_name}%`,
    country: `%${req.body.country}%`,
  };
  console.log(customerToSearch);
  customerRepo.searchCustomer(
    customerToSearch,
    (result) => {
      res.status(200).send({
        data: result,
      });
    },
    (err) => {
      throw err;
    }
  );
});

// FILM ROUTES

// create new film
router.post("/newFilm", (req, res) => {
  const film = {
    title: req.body.title,
    language_id: req.body.language_id,
    rental_duration: req.body.rental_duration,
    rental_rate: req.body.rental_rate,
    replacement_cost: req.body.replacement_cost,
  };
  filmRepo.createFilm(
    film,
    (result) => {
      res.status(201).send({
        status: 201,
        message: "post created",
      });
    },
    (err) => {
      throw err;
    }
  );
});

// get all films
router.get("/films/all", (req, res) => {
  filmRepo.getAll(
    function (result) {
      res.status(200).json({
        staus: 200,
        data: result,
      });
    },
    (err) => {
      throw err;
    }
  );
});

// search film by title
router.get("/film/title/:title", (req, res, next) => {
  let search = `${req.params.title}`;
  filmRepo.getFilm(
    search,
    (result) => {
      if (result.length) {
        res.status(200).json({
          staus: 200,
          data: result,
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: "not found",
        });
      }
    },
    (err) => {
      next(err);
    }
  );
});

// delete film by title
router.delete("/deleteFilm", async (req, res) => {
  let search = `${req.body.search}`;
  filmRepo.getFilm(
    search,
    (result) => {
      const filmToDelete = JSON.parse(JSON.stringify(result))[0];
      console.log(!filmToDelete);
      if (!filmToDelete) {
        return res.status(404).send({
          status: 404,
          message: "could not find film",
        });
      }
      filmRepo.deleteFilm(
        filmToDelete.film_id,
        (result) => {
          res.status(200).send({
            status: 200,
            message: `${filmToDelete.title} with id of ${filmToDelete.film_id} has been deleted`,
          });
        },
        (err) => {
          return res.status(500).send({
            status: 500,
            message: "oh no",
            err: err,
          });
        }
      );
    },
    (err) => {
      throw err;
    }
  );
});

// TODO: UPDATE FILM
router.put("/updateFilm", (req, res) => {
  const filmToSearch = req.body.search;
  filmRepo.getFilm(
    filmToSearch,
    (result) => {
      //update by id
      const foundFilm = JSON.parse(JSON.stringify(result))[0];
      const updateFilm = {
        title: req.body.update.title || foundFilm.title,
        language_id: req.body.update.language_id || foundFilm.language_id,
        rental_duration:
          req.body.update.rental_duration || foundFilm.rental_duration,
        rental_rate: req.body.update.rental_rate || foundFilm.rental_duration,
        replacement_cost:
          req.body.update.replacement_cost || foundFilm.rental_duration,
      };
      if (!foundFilm) {
        return res.status(404).send({
          status: 404,
          message: "could not find film",
        });
      }
      console.log(updateFilm);
      filmRepo.updateFilm(
        foundFilm.film_id,
        updateFilm,
        (result) => {
          return res.status(200).send({
            status: 200,
            message: `Updated film to:`,
            foundFilm: foundFilm,
            updatedfilm: updateFilm,
          });
        },
        (err) => {
          throw err;
        }
      );
    },
    (err) => {
      throw err;
    }
  );
});

// ACTOR ROUTES

// create new actor
router.post("/newActor", (req, res) => {
  const actor = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  };
  console.log(actor);
  //
  actorRepo.createActor(
    actor,
    (response) => {
      res.status(201).send({
        status: 201,
        message: "actor created",
      });
    },
    (err) => {
      throw err;
    }
  );
});

// delete actor by name
router.delete("/deleteActor", (req, res) => {
  const actorToSearch = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  };
  console.log(actorToSearch);
  actorRepo.getByName(
    actorToSearch,
    (result) => {
      const foundActor = JSON.parse(JSON.stringify(result))[0];
      console.log(foundActor);
      if (!foundActor) {
        return res.status(401).send({
          status: 401,
          message: "actor not found",
        });
      } else {
        actorRepo.deleteActor(
          foundActor.actor_id,
          (result) => {
            return res.status(200).send({
              status: 200,
              message: `${foundActor.first_name} ${foundActor.last_name} with id of ${foundActor.actor_id}has been deleted`,
            });
          },
          (err) => {
            throw err;
          }
        );
      }
    },
    (err) => {
      throw err;
    }
  );
});

// update actor
router.put("/updateActor", (req, res) => {
  const actorToSearch = {
    first_name: req.body.search.first_name,
    last_name: req.body.search.last_name,
  };
  actorRepo.getByName(
    actorToSearch,
    (result) => {
      const foundActor = JSON.parse(JSON.stringify(result))[0];
      const updateActor = {
        first_name: req.body.update.first_name || foundActor.first_name,
        last_name: req.body.update.last_name || foundActor.last_name,
      };
      console.log(updateActor);
      if (!foundActor) {
        return res.status(401).send({
          status: 401,
          message: "actor not found",
        });
      } else {
        actorRepo.updateActor(
          foundActor.actor_id,
          updateActor,
          (result) => {
            return res.status(201).send({
              status: 200,
              message: `${foundActor.first_name} ${foundActor.last_name} has been replaced with ${updateActor.first_name} ${updateActor.last_name}`,
            });
          },
          (err) => {
            throw err;
          }
        );
      }
    },
    (err) => {
      throw err;
    }
  );
});

// For rent

// get rental by film title
router.get("/getRental", (req, res) => {
  let search = `%${req.body.search}%`;
  console.log(search);
  rentalRepo.getByFilm(
    search,
    (result) => {
      console.log(res);
      if (!result.length) {
        return res.status(401).send({
          status: 401,
          message: "film not found",
        });
      }
      return res.status(200).send({
        status: 200,
        message: "films retrieved",
        data: result,
      });
    },
    (err) => {
      throw err;
    }
  );
});

// out of stock
router.get("/outOfStock", (req, res) => {
  rentalRepo.filmsNotInStock(
    (result) => {
      return res.status(200).send({
        status: 200,
        message: "retrieved films not in stock",
        data: result,
      });
    },
    (err) => {
      throw err;
    }
  );
});

// overdue films currently rented
router.get("/overdue", (req, res) => {
  rentalRepo.filmNotReturned((result) => {
    return res.status(200).send({
      status: 200,
      message: "retrieved overdue films",
      data: result,
    });
  });
});

// add a row into rentals with new rental
router.post("/rentFilm", (req, res) => {
  const staffId = getSubjectFromToken(req.headers["authorization"]);
  const rentDetails = {
    inventory_id: req.body.inventory_id,
    customer_id: req.body.customer_id,
  };
  rentalRepo.rentFilm(
    rentDetails.inventory_id,
    rentDetails.customer_id,
    staffId,
    (result) => {
      return res.status(200).send({
        message: "rental added",
      });
    },
    (err) => {
      throw err;
    }
  );
});

// update rental when returning a film
router.put("/returnFilm", (req, res) => {
  const rentDetails = {
    inventory_id: req.body.inventory_id,
    customer_id: req.body.customer_id,
  };
  rentalRepo.returnFilm(
    rentDetails.inventory_id,
    rentDetails.customer_id,
    (result) => {
      return res.status(200).send({
        message: "rental returned",
      });
    },
    (err) => {
      throw err;
    }
  );
});

module.exports = router;
