const mongoose = require("mongoose");
const Schema = mongoose.schema;

var userSessionSchema = mongoose.Schema({
  userId: {
    type: String,
    default: "",
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Users = (module.exports = mongoose.model(
  "UserSession",
  userSessionSchema
));
