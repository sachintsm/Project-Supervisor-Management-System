const mongoose = require("mongoose");
const Schema = mongoose.schema;

var groupChatSchema = mongoose.Schema({
    groupId: { type: String },
    messages: [{
        userId : { type: String},
        profileImage : { type: String},
        userName: { type:String},
        message : { type: String}
    }]
});

const GroupChat = (module.exports = mongoose.model("GroupChat", groupChatSchema));
