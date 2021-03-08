const User = require("../model/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "feddynamiskweb@gmail.com",
    pass: "FedDynamiskWeb.2021",
  },
});

const resetRender = (req, res) => {
  res.render("resetEmail.ejs", { err: "" });
};

const resetSubmit = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  console.log(user);

  if (!user) return res.redirect("/register");

  const token = await crypto.randomBytes(32).toString("hex");

  user.token = token;
  user.tokenExpiration = Date.now() + 3600000;
  await user.save();

  transport.sendMail({
    from: "feddynamiskweb@gmail.com",
    to: user.email,
    subject: "Request to reset password",
    html: `<h2>Reset Password<a href="http://localhost:8000/reset/${user.token}">Here</a></h2>`,
  });

  res.render("checkMail.ejs");
};

const resetParams = async (req, res) => {
  const token = req.params.token;
  console.log(token);

  try {
    const validUser = await User.findOne({
      token: token,
      tokenExpiration: { $gt: Date.now() },
    });
    console.log(validUser.email);

    if (!validUser) return res.redirect("/register");
    res.render("resetPasswordForm.ejs", {
      err: "",
      validUser: validUser.email,
    });
  } catch (err) {
    res.render("resetEmail.ejs", { err: err });
  }
};

const resetFormSubmit = async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.findOne({ email: email });
  user.password = hashedPassword;
  await user.save();
  res.redirect("/login");
};

module.exports = {
  resetRender,
  resetSubmit,
  resetParams,
  resetFormSubmit,
};
