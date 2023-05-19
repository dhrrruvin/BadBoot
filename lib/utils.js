const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pri_path = path.join(__dirname, "..", "id_rsa_pri.pem");
const pub_path = path.join(__dirname, "..", "id_rsa_pub.pem");
const PRIV_KEY = fs.readFileSync(pri_path, "utf-8");
const PUB_KEY = fs.readFileSync(pub_path, "utf8");

const validPassword = (password, salt, hash) => {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash == hashVerify;
};

const parseJwt = (token) => {
  token = token[1].split(".")[1];
  return JSON.parse(Buffer.from(token, "base64").toString());
};

const genPassword = (password) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return {
    salt: salt,
    hash: genHash,
  };
};

const issueJwt = (user) => {
  const _id = user._id;
  const expiresIn = "1d";

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};

const authMiddleWare = (req, res, next) => {
  // const tokenParts = req.headers.authorization.split(" ");

  let tokenParts;
  try {
    tokenParts = req.cookies.jwt.split(" ");
  } catch (e) {
    res.status(401).send("You are not authorized yet, please log in");
  }
  // console.log(tokenParts);

  if (
    tokenParts[0] === "Bearer" &&
    tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
  ) {
    console.log("Got the authorization header");
    try {
      const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
        algorithms: ["RS256"],
      });
      req.jwt = verification;
      console.log("user verified");
      next();
    } catch (error) {
      res.status(401).json({ success: false, msg: "You are not authorized!" });
    }
  }
};

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJwt = issueJwt;
module.exports.authMiddleWare = authMiddleWare;
module.exports.parseJwt = parseJwt;
