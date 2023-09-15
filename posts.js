const { Router } = require("express");
const jwt = require("jsonwebtoken");
const posts = require("./examples");
const e = require("express");
require("dotenv").config();

const router = Router();
router.get("/main", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
    if (err) {
      return res.status(403).send("token expired");
    }
    email = user.email;
    if (!user.email) return res.sendStatus(403);
    res.status(200).send(randomPosts(posts, email));
  });
});

function randomPosts(posts, email) {
  const res = posts
    .filter((post) => post.ownerEmail != email)
    .sort(() => Math.random() - 0.5);
  return res;
}
module.exports = router;
