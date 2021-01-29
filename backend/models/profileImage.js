const mongoose = require("mongoose");
const Schema = mongoose.schema;

var ImageSchema = mongoose.Schema({
  imageName: {
    type: String,
    default: "none",
    required: true,
  },
  imageData: {
    type: String,
    required: true,
  },
});

const Img = (module.exports = mongoose.model("Img", ImageSchema));
