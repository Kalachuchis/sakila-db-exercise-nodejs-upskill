const express = require("express");
const filmRepo = require("./assets/film-repo");
const actorRepo = require("./assets/actor-repo");
const { verifyJWT, getAudienceFromToken } = require("./controllers/verifyJWT");

const cookieParser = require("cookie-parser");
const app = new express();
const router = express.Router();

app.use(cookieParser());
app.use(express.json());
app.use("/auth", require("./routes/auth"));

// Everything under verifyJWT will need token / authorization header
app.use(verifyJWT);

// routes used by staff
app.use("/staffroutes", require("./routes/staffRoutes"));
// GET FILMS BY TITLE
router.get("/film/title/:title", (req, res, next) => {
  let search = `%${req.params.title}%`;
  filmRepo.getByTitle(
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

// GET FILMS BY CATEGORY
router.get("/film/category/:category", (req, res, next) => {
  let search = `%${req.params.category}%`;
  filmRepo.getByCategory(
    search,
    (result) => {
      console.log(result);
      res.status(200).json({
        status: 200,
        statusText: "OK",
        films: result,
      });
    },
    (err) => {
      next(err);
    }
  );
});

// GET FILMS BY CHARACTER LASTNAME
router.get("/film/actor/:actorln", (req, res, next) => {
  let search = `%${req.params.actorln}%`;
  filmRepo.getByActorLastName(
    search,
    (results) => {
      if (results.length) {
        res.status(200).json({
          status: 200,
          statusText: "OK",
          films: results,
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

router.get("/actor", (req, res, next) => {
  actorRepo.getAll(
    (results) => {
      if (results.length) {
        res.status(200).json({
          status: 200,
          statusText: "OK",
          actors: results,
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

// http://localhost:3000/api/actor/search/?lastname={lastname}&firstname={firstname}
// bugs:
// if there is no lastname or firstname in query string becomes undefined
//    example: http://localhost:3000/api/actor/search/?lastname=
//        name.firstname = '%undefined%'
//        name.lastname = '%%'
router.get("/actor/search", (req, res, next) => {
  let name = {
    last_name: `%${req.query.lastname}%`,
    first_name: `%${req.query.firstname}%`,
  };
  actorRepo.getByName(
    name,
    (results) => {
      if (results.length) {
        console.log(results);
        res.status(200).json({
          status: 200,
          statusText: "OK",
          actors: results,
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

app.use("/api/", router);

app.listen("3000", () => {
  console.log("Server started on http://localhost:3000 ..");
});
