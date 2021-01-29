const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var supervisorRequests = Schema({
  supervisorId: { type: String },
  groupId: { type: String },
  projectId: { type: String },
  description: { type: String },
  timestamp: { type: String },
  date: { type: String },
  time: { type: String },
});

const supervisorRequests = mongoose.model(
  "supervisorRequests",
  supervisorRequests
);

module.exports = supervisorRequests;
