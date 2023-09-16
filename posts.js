const { Router } = require("express");
const jwt = require("jsonwebtoken");
const database = require("./database");
const e = require("express");
require("dotenv").config();

const router = Router();
router.get("/main", Authmid, async (req, res) => {
  email = req.body.user.email;
  if (!email) return res.sendStatus(403);

  database
    .getPosts(email)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});
router.get("/yourPosts", Authmid, async (req, res) => {
  email = req.body.user.email;
  if (!email) return res.sendStatus(403);
  database
    .getMyposts(email)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});
router.post("/addPost", Authmid, async (req, res) => {
  email = req.body.user.email;
  if (!email) return res.sendStatus(403);
  const { title, content } = req.body;
  database
    .addPost(title, content, email)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

function Authmid(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
    if (err) {
      return res.status(403).send("token expired");
    }
    req.body.user = user;
  });
  next();
}
module.exports = router;
