const parseJwt = require("../lib/utils").parseJwt;
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { ObjectId } = require("mongodb");

const getData = async (req, res, next) => {
  let token;
  try {
    token = req.cookies.jwt.split(" ");
  } catch (err) {
    res.status(401).send("Not authorized, log in");
    next();
  }
  const id = parseJwt(token).sub;

  User.findOne({ _id: ObjectId.createFromHexString(id) })
    .then((user) => {
      res.status(200).json({ name: user.username, email: user.email });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("server internal error");
    });
};

module.exports = getData;
