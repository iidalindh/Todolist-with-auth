const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./router/userRouter");
const homeRoute = require("./router/homeRoute");
require("dotenv").config();
const app = express();

//Middlewares
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static("public"));
app.use(userRouter);
app.use(homeRoute);

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
      return;
    }
    app.listen(8000, () => {
      console.log("App is running");
    });
  }
);
