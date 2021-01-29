const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var individualmarks = Schema({
  biweekId: { type: String },
  biweekLinkId: { type: String },
  studentList: [{ type: String }],
  individualMarks: [{ type: String }],
});

const IndividualMarks = mongoose.model("individualmarks", individualmarks);

module.exports = IndividualMarks;
