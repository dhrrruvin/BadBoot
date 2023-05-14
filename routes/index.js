const router = require("express").Router();
const path = require("path");
const authMiddleWare = require("../lib/utils").authMiddleWare;
const register = require("../controller/register");
const login = require("../controller/login");

router.get("/protected", authMiddleWare, (req, res, next) => {
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

router.post("/login", login);

router.post("/register", register);

module.exports = router;
