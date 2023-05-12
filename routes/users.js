const router = require("express").Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
// const passport = require("passport");
const path = require("path");

router.get("/protected", (req, res, next) => {});

router.get("/", (req, res, next) => {
  res.send("Hello");
});

router.get("/login", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

router.get("/register", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

router.post("/login", (req, res, next) => {});

router.post("/register", (req, res, next) => {
  const saltHash = utils.genPassword(req.body.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
  });

  newUser
    .save()
    .then((user) => {
      const jwt = utils.issueJwt;
      res.json({
        success: true,
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    })
    .catch((err) => next(err));
});

module.exports = router;
