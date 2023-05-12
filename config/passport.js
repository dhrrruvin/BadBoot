const fs = require("fs");
const User = require("mongoose").model("User");
const path = require("path");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf-8");

const option = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithm: ["RS256"],
};

const strategy = new JwtStrategy(option, (payload, done) => {
  User.findOne({ _id: payload.sub })
    .then((user) => {
      if (!user) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
    .catch((err) => done(err, null));
});

module.exports = (passport) => {
  passport.use(strategy);
};
