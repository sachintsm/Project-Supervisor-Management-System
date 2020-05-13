const express = require('express');
const router = express.Router();
const CreateGroups = require('../models/createGroups');


// ?create new group
router.post('/add', (req, res) => {
    console.log(req.body);
    const newGroup = new CreateGroups({
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
router.get('/group/:groupId', (req, res) => {
    const projectId = req.params.projectId

})

module.exports = router