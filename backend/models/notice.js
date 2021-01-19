const mongoose = require("mongoose");
const Schema = mongoose.schema;

var noticeSchema = mongoose.Schema({
  userType:{ type: String},
  userId:{ type: String },
  projectId:{type:String},
  noticeTittle: { type: String },
  notice: { type: String },
  filePath: { type: String },
  date: { type: String },
  time:{type:String},
  toCordinator: { type: Boolean },
  toSupervisor: { type: Boolean },
  toStudent: { type: Boolean },
});

const Notice = (module.exports = mongoose.model("Notice", noticeSchema));
