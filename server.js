const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Monster = require("./models/Monster");

const main = async () => {
  // initialize app
  const app = express();

  // set up middleware
  app.use(express.static("public"));
  app.use(methodOverride("_method"));
  app.use(express.urlencoded({ extended: true }));

  // connect to Mongoose
  await mongoose.connect("mongodb://localhost:27017/monster-mash");
  console.log("connected to mongoose");

  /* -------------------------------------------------------------------------- */
  /*                                set up routes                               */
  /* -------------------------------------------------------------------------- */

  // GET - show all monsters
  app.get("/monster-mash", async (req, res) => {
    const monsters = await Monster.find();
    res.render("index.ejs", {
      title: "Monster Mash",
      monsters,
    });
  });

  // GET - show monster add form
  app.get("/monster-mash/add", (req, res) => {
    res.render("add.ejs", {
      title: "Add Monster",
    });
  });

  // GET - show individual monster
  app.get("/monster-mash/:monsterid", async (req, res) => {
    const id = req.params.monsterid;
    const monster = await Monster.findById(id);
    res.render("show.ejs", {
      title: "Show Monster",
      monster,
    });
  });

  // GET - show monster edit form
  app.get("/monster-mash/edit/:monsterid", async (req, res) => {
    const id = req.params.monsterid;
    const monster = await Monster.findById(id);
    res.render("edit.ejs", {
      title: "Edit Monster",
      monster,
    });
  });

  // POST - add new monster
  app.post("/monster-mash/add", async (req, res) => {
    await new Monster(req.body).save();
    res.redirect("/monster-mash");
  });

  // PUT - edit monster
  app.put("/monster-mash/edit/:monsterid", async (req, res) => {
    const id = req.params.monsterid;
    await Monster.findByIdAndUpdate(id, req.body);
    res.redirect("/monster-mash");
  });

  // DELETE - remove monster
  app.delete("/monster-mash/:monsterid", async (req, res) => {
    const id = req.params.monsterid;
    await Monster.findByIdAndDelete(id);
    res.redirect("/monster-mash");
  });

  // start server
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
};

main().catch((err) => console.log(err));
