const mongoose = require('mongoose');
const Schema = mongoose.schema;

var ImageSchema = mongoose.Schema({
    imageName: {
        type: String,
    }
});

const Img = (module.exports = mongoose.model('Img', ImageSchema));
