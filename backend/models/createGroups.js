const mongoose = require("mongoose");
const Schema = mongoose.schema;

var createGroupsSchema = mongoose.Schema({
    projectId: { type: String },
    groupName: { type: String },
    supervisors:  [{type: String}],
    groupMembers : [{type: String}],
    groupState: {type: String},
})

const CreateGroups = (module.exports = mongoose.model("CreateGroups", createGroupsSchema));

