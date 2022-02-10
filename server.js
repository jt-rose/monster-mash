require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const Redis = require("ioredis");
const connectRedis = require("connect-redis");
const mongoose = require("mongoose");

const crud = require("./controllers/crud");
const auth = require("./controllers/auth");

const main = async () => {
  //   await sendEmail(
  //     "jtr219@outlook.com",
  //     "<h1>Hello<?h1>",
  //     process.env.ETHEREAL_USER,
  //     process.env.ETHEREAL_PASS
  //   );
  // initialize app
  const app = express();

  // connect to redis
  const RedisStore = connectRedis(session);
  const redis = new Redis(); // auto connect if running on localhost

  // set up middleware
  app.use(express.static("public"));
  app.use(methodOverride("_method"));
  app.use(express.urlencoded({ extended: true }));
  // set up sessions
  app.use(
    session({
      name: "cid",
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: false, // __PROD__, // disable for dev in localhost
        // add domain when in prod
      },
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  // connect to Mongoose
  await mongoose.connect("mongodb://localhost:27017/monster-mash");
  console.log("connected to mongoose");

  app.use("/auth", auth);
  app.use("/monster-mash", crud);

  /* -------------------------------------------------------------------------- */
  /*                                start server                                */
  /* -------------------------------------------------------------------------- */

  // start server
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
};

main().catch((err) => console.log(err));
