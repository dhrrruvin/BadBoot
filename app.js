const express = require("express");
const cors = require("cors");
const path = require("path");
// const passport = require("passport");
const parser = require("cookie-parser");

require("dotenv").config();

const app = express();

require("./config/database");

require("./models/user");

// require("./config/passport")(passport);

// app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(parser());

app.use(cors());

app.use(express.static("public"));

app.use(require("./routes"));

app.listen(9979);
