const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var proposel = Schema({

     projectId : {type: String},
     proposelTittle : {type : String},
     deadDate : {type : String},
     deadTime : {type : String},
     filePath: { type: String },
     isopen : {type : Boolean},
     ispending : {type : Boolean},
     isclose : {type : Boolean}


     
});

const Proposel = mongoose.model('propsel', proposel);

module.exports = Proposel;

