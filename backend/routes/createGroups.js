const express = require('express');
const router = express.Router();
const CreateGroups = require('../models/createGroups');
const verify = require('../authentication');


// ?create new group
router.post('/add', verify, (req, res) => {
    const newGroup = new CreateGroups({
        groupId: req.body.groupId,
        projectId: req.body.projectId,
        groupMembers: req.body.groupMembers,
        groupState : true
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
router.post('/addSupervisorIndex',verify, async (req, res) => {
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
//? (GroupData.js)
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
//? (GroupData.js)
router.post('/removeSupervisorIndex', (req, res) => {
    const id = req.body._id
    const index = req.body.index
    // console.log(req.body)
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
//? (AssignSupervisor.js)
router.post('/getsupervisorGroup', async (req, res) => {
    const projectId = req.body.projectId
    const supervisor = req.body.supervisor
    // console.log(supervisor)
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

//? remove supervisor from the all the groups with respect to the one project
//? (AssignSupervisor.js)
router.post('/remove-supervisor', verify, async (req, res) => {
    const projectId = req.body.projectId
    const supervisorId = req.body.supervisor
    const groupId = req.body.groupId
    // console.log(req.body)
    await CreateGroups
        .find({ projectId: projectId, groupId: groupId})
        .update(
            { $pull: { supervisors: supervisorId } }
        )
        .exec()
        .then(data => {
            res.json({ state: true, msg: 'Index successfully deleted..!' })
        })
        .catch(err => {
            res.send({ state: false, msg: err.message })
        })
})

//? get one supervisor active all projects
router.post('/active&groups', async (req, res) => {
    const supervisorId = req.body.supervisorId
    const projectId  = req.body.projectId
    // console.log(req.body)
    await CreateGroups
        .find({supervisors : supervisorId, projectId : projectId, groupState : true})
        .exec()
        .then(data => {
            res.json({ state: true, msg: 'Data successfully Transfered..!' , data : data})
        })
        .catch(err => {
            res.send({ state: false, msg: err.message })
        })
})
//? get all group count for a project
//? (CoodinatorHome.js)
router.get('/groupCount/:id', async (req, res) => {
    const projectId = req.params.id
    await CreateGroups
      .find({ projectId: projectId , groupState: true })
      .count()
      .exec()
      .then(data => {
        res.json({ state: true, msg: "Data Transfered Successfully..!", data: data });
      })
      .catch(error => {
        console.log(error)
        res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
      })
  })
module.exports = router