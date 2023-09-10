const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const database = require("./database");
const app = express();
app.use(cors());
app.use(express.json());
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

app.listen(4000, () => {
  console.log("the server is listening on port 4000 sir");
});
