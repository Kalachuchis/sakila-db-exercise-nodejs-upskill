const express = require("express");
const router = express.Router();
const customerRepo = require("../assets/customer-rep");
const filmRepo = require("../assets/film-repo");
const actorRepo = require("../assets/actor-repo");
const {
  verifyJWT,
  verifyAudienceFromToken,
} = require("../controllers/verifyJWT");
const constants = require("../assets/roles");
const { application } = require("express");

// router.use(verifyAudienceFromToken);

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
module.exports = router;
