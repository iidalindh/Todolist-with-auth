const User = require("../model/user");
const bcrypt = require("bcrypt");

const registerRender = (req, res) => {
  res.render("register.ejs", { err: "" });
};

const registerSubmit = async (req, res) => {
  const { name, email, password } = req.body;

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.render("register.ejs", { err: "Email already exist" });

  const usernameExist = await User.findOne({ name: req.body.name });
  if (usernameExist)
    return res.render("register.ejs", { err: "Username already exist" });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await new User({
      name: name,
      email: email,
      password: hashedPassword,
    }).save();
    res.redirect("/login");
  } catch (error) {
    if (err) return res.render("register.ejs", { err: err });
  }
};

module.exports = {
  registerRender,
  registerSubmit,
};
