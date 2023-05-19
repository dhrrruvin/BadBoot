const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  hash: String,
  salt: String,
});

mongoose.model("User", UserSchema);
