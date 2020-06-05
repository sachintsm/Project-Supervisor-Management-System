const express = require('express');
const router = express.Router();
const CreateGroups = require('../models/createGroups');
const verify = require('../authentication');


// ?create new group
router.post('/add', verify, (req, res) => {
    const newGroup = new CreateGroups({
        groupId: req.body.groupId,
        projectId: req.body.projectId,
        groupMembers: req.body.groupMembers
    })

    newGroup.save()
        .then(result => {
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
    CreateGroups
        .find({ projectId: projectId })
        .exec()
        .then(data => {
            res.json({ state: true, data: data, msg: 'Data successfully sent..!' })
        })
        .catch(err => {
            res.send({ state: false, msg: err.message })
        })
})

//? delete a group by idList
router.delete('/delete/:id', verify, async (req, res) => {
    const id = req.params.id

    CreateGroups
        .remove({ _id: id })
        .exec()
        .then(result => {
            res.send({ state: true, msg: 'Group successfully deleted..!' })
        })
        .catch(err => {
            res.send({ state: false, msg: 'Group does not delete successfully..!' })
        })
})

//? get group data by id
router.get('/getGroupData/:id', verify, (req, res) => {
    const id = req.params.id;

    CreateGroups
        .find({ _id: id })
        .exec()
        .then(data => {
            res.json({ state: true, data: data[0], msg: 'Data successfully sent..!' })
        })
        .catch(err => {
            res.send({ state: false, msg: err.message })
        })
})

//? add student index to a group
router.post('/addStudentIndex', async (req, res) => {
    const id = req.body._id
    const index = req.body.index

    const existing = await CreateGroups.findOne({ _id: id, groupMembers: index });
    if (existing) return res.json({ state: false, msg: "This Index is already added..!" })
    else {
        CreateGroups
            .find({ _id: id })
            .update(
                { $push: { groupMembers: index } }
            )
            .exec()
            .then(data => {
                res.json({ state: true, msg: 'Data successfully updated..!' })
            })
            .catch(err => {
                res.send({ state: false, msg: err.message })
            })
    }
})
//? add supervisor index to a group
router.post('/addSupervisorIndex', async (req, res) => {
    console.log(req.body)
    const id = req.body._id
    const index = req.body.index

    const existing = await CreateGroups.findOne({ _id: id, supervisors: index });
    if (existing) return res.json({ state: false, msg: "This Index is already added..!" })
    else {
        CreateGroups
            .find({ _id: id })
            .update(
                { $push: { supervisors: index } }
            )
            .exec()
            .then(data => {
                res.json({ state: true, msg: 'Data successfully updated..!' })
            })
            .catch(err => {
                res.send({ state: false, msg: err.message })
            })
    }
})


//? delete index from the groupMembers
router.post('/removeStudentIndex', async (req, res) => {
    const id = req.body._id
    const index = req.body.index

    CreateGroups
        .find({ _id: id })
        .update(
            { $pull: { groupMembers: index } }
        )
        .exec()
        .then(data => {
            res.json({ state: true, msg: 'Index successfully deleted..!' })
        })
        .catch(err => {
            res.send({ state: false, msg: err.message })
        })

})

//? delete supervisor from the project
router.post('/removeSupervisorIndex', (req, res) => {
    const id = req.body._id
    const index = req.body.index

    CreateGroups
        .find({ _id: id })
        .update(
            { $pull: { supervisors: index } }
        )
        .exec()
        .then(data => {
            res.json({ state: true, msg: 'Index successfully deleted..!' })
        })
        .catch(err => {
            res.send({ state: false, msg: err.message })
        })
})


//? get projects for spesific supervisor
router.post('/getsupervisorGroup', async (req, res) => {
    const projectId = req.body.projectId
    const supervisor = req.body.supervisor
    console.log(supervisor)
    CreateGroups
        .find({ projectId: projectId, supervisors: supervisor })
        .exec()
        .then(data => {
            res.json({ state: true, data: data, msg: 'Data successfully sent..!' })
        })
        .catch(err => {
            res.send({ state: false, msg: err.message })
        })
})

module.exports = router