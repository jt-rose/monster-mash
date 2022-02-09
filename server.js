const express = require("express");
const methodOverride = require("method-override");

const main = async () => {
  // initialize app
  const app = express();

  // set up middleware
  app.use(express.static("public"));
  app.use(methodOverride("_method"));
  app.use(express.urlencoded({ extended: true }));

  /* -------------------------------------------------------------------------- */
  /*                                set up routes                               */
  /* -------------------------------------------------------------------------- */

  // GET - show all monsters
  app.get("/monster-mash", (req, res) => {
    res.render("index.ejs", {
      title: "Monster Mash",
    });
  });

  // GET - show monster add form
  app.get("/monster-mash/add", (req, res) => {
    res.render("add.ejs", {
      title: "Add Monster",
    });
  });

  // GET - show individual monster
  app.get("/monster-mash/:monsterid", (req, res) => {
    res.render("show.ejs", {
      title: "Show Monster",
    });
  });

  // GET - show monster edit form
  app.get("/monster-mash/edit/:monsterid", (req, res) => {
    res.render("edit.ejs", {
      title: "Edit Monster",
    });
  });

  // POST - add new monster
  app.post("/monster-mash", (req, res) => {
    res.redirect("/monster-mash");
  });

  // PUT - update monster
  app.put("/monster-mash", (req, res) => {
    res.redirect("/monster-mash");
  });

  // DELETE - remove monster
  app.delete("/monster-mash", (req, res) => {
    res.redirect("/monster-mash");
  });

  // start server
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
};

main().catch((err) => console.log(err));
