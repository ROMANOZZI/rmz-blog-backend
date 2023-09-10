const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const database = require("./database");
const app = express();
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(express.json());
// registering new users
/* The code block `app.post("/signup", async (req, res) => { ... })` is defining a route handler for
the HTTP POST request to "/signup". */
app.post("/signup", async (req, res) => {
  if (!req.body.email) return res.sendStatus(403);
  const result = await database.checkUserByEmail(req.body.email);
  if (result[0].length > 0) return res.status(500).send("user already exists");
  try {
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(req.body.password, salt);
    database
      .addUser(req.body.name, req.body.email, hashed)
      .then(res.status(204).send("account created succesfully "));
  } catch {
    return res.sendStatus(500);
  }
});

app.post("/login", async (req, res) => {
  if (!req.body.user) return res.sendStatus(403);
  const user = req.body.user;
  if (!user.email || !user.password) return res.sendStatus(500);
  const data = await database.checkUserByEmail(user.email);
  if (data[0].length < 1) return res.status(500).send("wrong creditnials");
  if (await bcrypt.compare(user.password, data[0][0].password)) {
    const accessToken = jwt.sign(
      { name: data[0][0].name, email: data[0][0].email },
      process.env.PRIVATE_KEY,
      {
        expiresIn: "10m",
      }
    );

    const refreshToken = jwt.sign(
      { name: data[0][0].name, email: data[0][0].email },
      process.env.REFRESH_KEY
    );
    return res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  return res.status(500).send("something went wrong");
});
app.listen(4000, () => {
  console.log("the server is listening on port 4000 sir");
});
