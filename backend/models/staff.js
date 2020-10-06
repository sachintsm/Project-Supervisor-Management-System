const mongoose = require('mongoose');
const Schema = mongoose.schema;

var staffSchema = mongoose.Schema({
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
  isGuest: { type: Boolean },
});

const Staff = (module.exports = mongoose.model('users', staffSchema));
