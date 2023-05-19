const mongoose = require("mongoose");
const User = mongoose.model("User");
const utils = require("../lib/utils");

const register = async (req, res, next) => {
  const saltHash = utils.genPassword(req.body.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  let user;
  try {
    user = await User.findOne({ email: req.body.email });
  } catch (err) {
    console.error(err);
    res.send(500);
  }

  if (!user) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      hash: hash,
      salt: salt,
    });

    console.log("new user registered");
    newUser.save().catch((err) => {
      console.log(err);
      res.status(403).json("email is alredy registered!");
    });

    res.redirect("/login");

    // .then((user) => {
    //   const jwt = utils.issueJwt(user);

    //   res.status(200).json({
    //     success: true,
    //     user: user,
    //     token: jwt.token,
    //     expiresIn: jwt.expires,
    //   });
    // })
  } else {
    res.status(403).json("user alredy exist!");
  }
};

module.exports = register;
