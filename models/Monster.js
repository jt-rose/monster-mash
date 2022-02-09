const mongoose = require("mongoose");

const monsterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  hobby: { type: String, required: true },
});

const Monster = mongoose.model("Monster", monsterSchema);

module.exports = Monster;
