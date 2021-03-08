const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginRender = (req, res) => {
  res.render("login.ejs", { err: "" });
};

const loginSubmit = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) return res.render("login.ejs", { err: "Email doesn't exist" });

  const validUser = await bcrypt.compare(password, user.password);

  if (!validUser) return res.render("login.ejs", { err: "Wrong password" });
  const jwtToken = await jwt.sign({ user: user }, process.env.SECRET_KEY);

  if (jwtToken) {
    const cookie = req.cookies.jwtToken;
    if (!cookie) {
      res.cookie("jwtToken", jwtToken, { maxAge: 3600000, httpOnly: true });
    }

    return res.redirect("/");
  }

  return res.redirect("/login");
};

module.exports = {
  loginRender,
  loginSubmit,
};
