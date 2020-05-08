const mongoose = require('mongoose');
const Schema = mongoose.schema;

var userSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  birthday: { type: String },
  nic: { type: String },
  mobile: { type: String },
  isDeleted: { type: Boolean },
  userLevel: { type: String },
  isStudent: { type: Boolean },
  isAdmin: { type: Boolean },
  isCoordinator: { type: Boolean },
  isSupervisor: { type: Boolean },
});

const Users = (module.exports = mongoose.model('Users', userSchema));
