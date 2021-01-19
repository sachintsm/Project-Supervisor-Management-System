const mongoose = require('mongoose');
const Schema = mongoose.schema;

var customRegSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  birthday: { type: String },
  nic: { type: String },
  mobile: { type: String },
  indexNumber: { type:String},
  regNumber: { type:String },
  isDeleted: { type: Boolean },
  userLevel: { type: String },
  isSupervisor: { type: Boolean },
  imageName: { type: String },
});

const customReg = (module.exports = mongoose.model('customReg', customRegSchema));