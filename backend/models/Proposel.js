const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var proposel = Schema({

     projectId : {type: String},
     proposelTittle : {type : String},
     deadDate : {type : String},
     deadTime : {type : String},
     filePath: { type: String },
     state:{type:String},


     
});

const Proposel = mongoose.model('propsel', proposel);

module.exports = Proposel;

