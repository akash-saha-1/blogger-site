const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide your Username"],
  },
  email: {
    type: String,
    required: [true, "Please provide your Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide your Password"],
  },
});

UserSchema.pre("save", function (next) {
  const user = this;
  //12 means number of times encryption and the higher number will take much time.
  bcrypt.hash(user.password, 12, (err, encrypted) => {
    user.password = encrypted;
    next();
  });
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
