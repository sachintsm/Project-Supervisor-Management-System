const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var proposel = Schema({
     userType:{type:String},
     userId:{type:String},
     projectId : {type: String},
     date: { type: String },
     time:{type:String},
     projectId:{type:String},
     proposelTittle : {type : String},
     proposelDiscription:{type:String},
     deadDate : {type : String},
     deadTime : {type : String},
     filePath: { type: String },
     toLateSubmision:{type: Boolean},


     
});

const Proposel = mongoose.model('propsel', proposel);

module.exports = Proposel;

