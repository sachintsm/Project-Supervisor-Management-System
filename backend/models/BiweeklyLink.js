const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var biweekly = Schema({
  userType: { type: String },
  userId: { type: String },
  projectId: { type: String },
  date: { type: String },
  time: { type: String },
  projectId: { type: String },
  biweeklyNumber: { type: String },
  biweeklyDiscription: { type: String },
  deadDate: { type: String },
  deadTime: { type: String },
  filePath: { type: String },
  file: { type: String },
  toLateSubmision: { type: Boolean },
  submssionFileSize: { type: String },
  setFileLimit: { type: String },
});

const BiweeklyLink = mongoose.model("biweeekly", biweekly);

module.exports = BiweeklyLink;
