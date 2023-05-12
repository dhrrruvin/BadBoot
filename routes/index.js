// const router = require("express").Router();

// router.use("/users", require("./users"));

// module.exports = router;

const router = require("express").Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
// const passport = require("passport");
const path = require("path");
const utils = require("../lib/utils");

router.get("/protected", utils.authMiddleWare, (req, res, next) => {
  res.status(200).json({ success: true, msg: "You are authorized!" });
});

router.get("/", (req, res, next) => {
  res.send("Hello");
});

router.get("/login", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

router.get("/register", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, msg: "could not find user!" });
      }

      const isValid = utils.validPassword(
        req.body.password,
        user.salt,
        user.hash
      );

      if (isValid) {
        console.log("user found and validated");
        const tokenObj = utils.issueJwt(user);
        res.status(200).json({
          success: true,
          user: user,
          token: tokenObj.token,
          expiresIn: tokenObj.expires,
        });
        res.redirect("/protected");
      } else {
        res
          .status(401)
          .json({ success: false, msg: "you entered the wrong password" });
      }
    })
    .catch((err) => next(err));
});

router.post("/register", (req, res, next) => {
  const saltHash = utils.genPassword(req.body.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    hash: hash,
    salt: salt,
  });

  console.log("new user registered");
  newUser
    .save()
    .then((user) => {
      const jwt = utils.issueJwt(user);
      console.log(jwt.token);
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
