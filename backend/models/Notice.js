const mongoose = require("mongoose");
const Schema = mongoose.schema;

var noticeSchema = mongoose.Schema({
  noticeTittle: { type: String },
  notice: { type: String },
  filePath: { type: String },
  date: { type: String },
  isViewType: { type: Boolean },
  isCordinator: { type: Boolean },
  isSupervisor: { type: Boolean },
  isStudent: { type: Boolean },
});

const Notice = (module.exports = mongoose.model("Notice", noticeSchema));
