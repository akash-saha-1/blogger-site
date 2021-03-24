const User = require("./../database/models/User");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, matched) => {
        if (matched) {
          req.session.userId = user._id;
          return res.redirect("/");
        } else {
          console.log(err);
          return res.redirect("/login");
        }
      });
    } else {
      return res.redirect("/login");
    }
  });
};
