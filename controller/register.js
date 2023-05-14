const mongoose = require("mongoose");
const User = mongoose.model("User");
const utils = require("../lib/utils");

const register = async (req, res, next) => {
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
      res.status(200).json({
        success: true,
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    })
    .catch((err) => {
      console.log("error");
      next(err);
    });
};

module.exports = register;
