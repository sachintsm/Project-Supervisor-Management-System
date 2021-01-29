const mongoose = require("mongoose");
const Schema = mongoose.schema;

var courseTypesSchema = mongoose.Schema({
  courseCode: { type: String },
  courseName: { type: String },
});

const CourseTypes = (module.exports = mongoose.model(
  "CourseTypes",
  courseTypesSchema
));
