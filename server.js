const express = require("express");
const methodOverride = require("method-override");

const main = async () => {
  // initialize app
  const app = express();

  // set up middleware
  app.use(express.static("public"));
  app.use(methodOverride("_method"));
  app.use(express.urlencoded({ extended: true }));

  // start server
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
};

main().catch((err) => console.log(err));
