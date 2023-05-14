const mongoose = require("mongoose");
const User = mongoose.model("User");
const utils = require("../lib/utils");

const login = async (req, res, next) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
  } catch (err) {
    console.error("error checking existing user!");
    console.log(err);
    res.status(500);
  }

  if (!user) {
    res.status(404).json({ success: false, msg: "could not find user!" });
  }

  let isValidPassword = false;
  try {
    isValidPassword = utils.validPassword(
      req.body.password,
      user.salt,
      user.hash
    );
  } catch (error) {
    console.error("Error comparing hashed password");
    console.log(error);
    res.status(500).send("Log in failed");
  }

  if (!isValidPassword) {
    return res.status(401).send("invalid credentials");
  }
  console.log("user found and validated");
  const tokenObj = utils.issueJwt(user);
  res.status(200).json({
    success: true,
    user: user,
    token: tokenObj.token,
    expiresIn: tokenObj.expires,
  });
  return res.redirect("/protected");
};

module.exports = login;
