const express = require('express');
const router = express.Router();
const CreateGroups = require('../models/createGroups');


// ?create new group
router.post('/add', (req, res) => {
    console.log(req.body);
    const newGroup = new CreateGroups({
        groupId : req.body.groupId,
        projectId: req.body.projectId,
        groupMembers: req.body.groupMembers
    })

    newGroup.save()
        .then(result => {
            console.log(result)
            res.json({ state: true, msg: "Data Inserted Successfully..!" });
        })
        .catch(error => {
            console.log(error)
            res.json({ state: false, msg: "Data Inserting Unsuccessfull..!" });
        })
})

//? get all the groups on spesific project
router.get('/get/:projectId', (req, res) => {
    const projectId = req.params.projectId
    console.log(projectId);
    CreateGroups
        .find({ projectId : projectId })
        .exec()
        .then(data => {
            res.json({state : true, data : data , msg : 'Data successfully sent..!'})
        })
        .catch(err =>{
            res.send({ state : false, msg : err.message})
        })
})

module.exports = router