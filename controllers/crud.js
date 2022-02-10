const express = require("express");
const router = express.Router();
const Monster = require("../models/Monster");

/* -------------------------------------------------------------------------- */
/*                                set up routes                               */
/* -------------------------------------------------------------------------- */

// GET - show all monsters
router.get("/", async (req, res) => {
  console.log(req.session.user);
  const monsters = await Monster.find();
  res.render("index.ejs", {
    title: "Monster Mash",
    monsters,
  });
});

// GET - show monster add form
router.get("/add", (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  res.render("add.ejs", {
    title: "Add Monster",
  });
});

// GET - show individual monster
router.get("/:monsterid", async (req, res) => {
  const id = req.params.monsterid;
  const monster = await Monster.findById(id);
  res.render("show.ejs", {
    title: "Show Monster",
    monster,
  });
});

// GET - show monster edit form
router.get("/edit/:monsterid", async (req, res) => {
  const id = req.params.monsterid;
  const monster = await Monster.findById(id);
  res.render("edit.ejs", {
    title: "Edit Monster",
    monster,
  });
});

// POST - add new monster
router.post("/add", async (req, res) => {
  await new Monster(req.body).save();
  res.redirect("/monster-mash");
});

// PUT - edit monster
router.put("/edit/:monsterid", async (req, res) => {
  const id = req.params.monsterid;
  await Monster.findByIdAndUpdate(id, req.body);
  res.redirect("/monster-mash");
});

// DELETE - remove monster
router.delete("/:monsterid", async (req, res) => {
  const id = req.params.monsterid;
  await Monster.findByIdAndDelete(id);
  res.redirect("/monster-mash");
});

module.exports = router;
