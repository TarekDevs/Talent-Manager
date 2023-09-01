const mongoose = require("mongoose");

const Skill = mongoose.model(
  "Skill",
  new mongoose.Schema({
    level: String
  })
);

module.exports = Skill;