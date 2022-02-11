require("dotenv").config();

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const v4 = require("uuid");
const sendEmail = require("../utils/sendEmail");
const argon2 = require("argon2");

/* -------------------------------------------------------------------------- */
/*                            authentication routes                           */
/* -------------------------------------------------------------------------- */

// GET - register form
router.get("/register", (req, res) => {
  res.render("register.ejs", {
    title: "Sign Up",
  });
});

// POST - register form
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // validate username, email, and password
  // ! set up later

  // check for unique username / email
  const sameUser = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (sameUser) {
    res.send("Error! Same user found");
    return;
  }

  // encrypt password
  const encryptedPassword = await argon2.hash(password);

  // create new user in database
  const newUser = await new User({
    username,
    email,
    password: encryptedPassword,
  }).save();

  // set up logged in status in cookie-session
  req.session.user = newUser;

  // redirect to index
  res.redirect("/monster-mash");

  // ! add error handling
});

// GET - login page
router.get("/login", (req, res) => {
  res.render("login.ejs", {
    title: "Login",
  });
});

// POST - set login / cookies+session
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // attempt to find user in database
  const user = await User.findOne({ username });

  if (!user) {
    res.redirect("/monster-mash/login" /*, {errorMessage: 'wrong info!'} */);
    return;
  }

  // check that deencrypted passwords match
  const passwordsMatch = await argon2.verify(user.password, password);

  if (!passwordsMatch) {
    res.redirect("/monster-mash/login" /*, {errorMessage: 'wrong info!'} */);
    return;
  }

  // set user cookie if succesful and redirect to index
  req.session.user = user;
  res.redirect("/monster-mash");

  // ! add error handling
});

// DELETE - logout
router.delete("/logout", async (req, res) => {
  await req.session.destroy();
  res.redirect("/monster-mash");
});

// POST - forgot password link set up
router.post("/forgot-password/:username", async (req, res) => {
  // confirm valid username
  const foundUser = await User.find({ username: req.body.username });
  if (!foundUser) {
    // ! change later
    res.redirect("/monster-mash");
    return;
  }

  // generate unique token
  const genKey = await v4();
  const token = `RESET-PASSWORD-${genKey}-USERNAME-${req.body.username}`;
  console.log(token);

  // store token in redis with expiration
  await redis.set(token, user.id, "ex", 1000 * 60 * 60);

  // email user a reset password link that uses the token and username
  const resetLink = `<a href="http://localhost:3000/change-password/${resetKey}">reset password</a>`;
  await sendEmail(
    email,
    resetLink,
    process.env.ETHEREAL_USER,
    process.env.ETHEREAL_PASS
  ).catch((err) => console.error(err));

  // redirect to page confirming password reset link sent
  res.redirect("/passwordReset");
  // ! add error handling
});

// GET - show reset password page if token matches redis db
router.get("/reset-password/:token", async (req, res) => {
  // check for redis entry matching token and username

  // show reset password form if found

  // show "no such page" otherwise
  res.send("Scram!");
});

// UPDATE - reset password
router.put("/reset-password/:token", async (req, res) => {
  // check for redis entry matching token and username

  // encrypt new password and save it

  // log in user and redirect them to index
  res.redirect("/monster-mash");
});

module.exports = router;
