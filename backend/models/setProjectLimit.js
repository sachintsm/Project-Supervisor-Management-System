const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var limits = Schema({
  projectId: { type: String },
  academicYear: { type: String },
  projectType: { type: String },
  supervisorId: { type: String },
  noProjects: { type: Number },
  projYear: { type: String },
});

const Limits = mongoose.model("setLimits", limits);

module.exports = Limits;
