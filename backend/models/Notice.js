const mongoose = require("mongoose");
const Schema = mongoose.schema;

var noticeSchema = mongoose.Schema({

    noticeTittle : {type:String},
    notice : {type:String},
    filePath : {type:String}


})

const Notice = (module.exports = mongoose.model("Notice", noticeSchema));
