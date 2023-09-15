const { Router } = require("express");
const jwt = require("jsonwebtoken");
const database = require("./database");
const e = require("express");
require("dotenv").config();

const router = Router();
router.get("/main", async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
    if (err) {
      return res.status(403).send("token expired");
    }
    email = user.email;
    if (!user.email) return res.sendStatus(403);

    database
      .getPosts(email)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.sendStatus(500);
      });
  });
});

module.exports = router;
