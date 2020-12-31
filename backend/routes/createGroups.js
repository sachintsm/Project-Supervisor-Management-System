const express = require('express');
const router = express.Router();
const CreateGroups = require('../models/createGroups');
const User = require('../models/users');
const verify = require('../authentication');
const Projects = require('../models/projects');
const GroupRequests = require('../models/grouprequests');

//create a new group
router.post('/add', async (req, res) => {
    const maxNumber = await CreateGroups
        .find({ projectId: req.body.projectId })
        .select('groupId')

    var maxId;
    if (maxNumber.length === 0) {
        maxId = 0;
    }
    else {
        var dataArray = new Array(); //all data is pushed to this array
        for (var i = 0; i < maxNumber.length; i++) {
            dataArray.push(maxNumber[i].groupId) //push data to the dataArray
        }

        //sort max value
        function getMaxOfArray(dataArray) {
            return Math.max.apply(null, dataArray);
        }
        maxId = getMaxOfArray(dataArray)
    }
    const newGroup = new CreateGroups({
        groupId: maxId + 1,
        projectId: req.body.projectId,
        groupMembers: req.body.groupMembers,
        groupState: true
    })

    newGroup.save()
        .then(result => {
            res.json({ state: true, msg: "Data Inserted Successfully..!" });
        })
        .catch(error => {
            console.log(error)
            res.json({ state: false, msg: "Data Insertion Unsuccessfull..!" });
        })
})

//get all the groups
router.get('/get/', (req, res) => {
    const projectId = req.params.projectId
    CreateGroups
        .find()
        .exec()
        .then(data => {
            res.json({ state: true, data: data, msg: 'Data successfully sent..!' })
        })
        .catch(err => {
            res.send({ state: false, msg: err.message })
        })
})

//get all the groups on spesific project
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

//delete a group by idList
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

//get group data by id
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

//add student index to a group
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
//add supervisor index to a group
router.post('/addSupervisorIndex', verify, async (req, res) => {
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


//delete index from the groupMembers
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

//delete supervisor from the project
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


//get projects for spesific supervisor
//(AssignSupervisor.js)
router.post('/getsupervisorGroup', async (req, res) => {
    const projectId = req.body.projectId
    const supervisor = req.body.supervisor
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

//remove supervisor from the all the groups with respect to the one project
//(AssignSupervisor.js)
router.post('/remove-supervisor', verify, async (req, res) => {
    const projectId = req.body.projectId
    const supervisorId = req.body.supervisor
    const groupId = req.body.groupId
    await CreateGroups
        .find({ projectId: projectId, groupId: groupId })
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

//get all the active projects of a supervisor
router.post('/active&groups', async (req, res) => {
    const supervisorId = req.body.supervisorId
    const projectId = req.body.projectId
    await CreateGroups
        .find({ supervisors: supervisorId, projectId: projectId, groupState: true })
        .exec()
        .then(data => {
            res.json({ state: true, msg: 'Data successfully Transfered..!', data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: err.message })
        })
})

//get the group count for a project
//(CoodinatorHome.js)
router.get('/groupCount/:id', async (req, res) => {
    const projectId = req.params.id
    await CreateGroups
        .find({ projectId: projectId, groupState: true })
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

//getGroup details by userId & projectId
router.post("/groupDetails/:studentId", async (req, res, next) => {

    try {
        const id = req.params.studentId;
        const projectId = req.body.projectId;
        const indexNumber = await User.findOne({ _id: id }).select('indexNumber')
        const result = await CreateGroups.findOne({ groupMembers: indexNumber.indexNumber, projectId: projectId })

        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

//get form group notification
router.get("/groupformnotification/:studentId", async (req, res, next) => {
    try {
        const id = req.params.studentId;
        const index = await User.findOne({ _id: id }).select('indexNumber');
        const groups = await CreateGroups.find({ groupMembers: index.indexNumber }, { '_id': false }).select("projectId")


        var projectIds = []
        groups.map(id => projectIds.push(JSON.stringify(id.projectId)))
        const projects = await Projects.find({ studentList: index.indexNumber, projectState: true, })
        let projectList = []
        projects.map(project => {
            if (!projectIds.includes(JSON.stringify(project._id))) {
                projectList.push(project)
            }
        })
        res.send(projectList)
    }
    catch (e) {
        console.log(e)
    }
})

//add group request
router.post("/grouprequest", async (req, res, next) => {
    try {
        const data = req.body;
        data.allStudentList.push(data.leaderIndex)
        const request = new GroupRequests(data);
        const result = await request.save();
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

//get request details by user Id ( Not sending leader request )
router.post("/allgrouprequest/:userId", async (req, res, next) => {
    try {
        const userId = req.params.userId
        const projectId = req.body.project.projectId
        let userIndex = await User.findOne({ _id: userId }).select("indexNumber")
        let result1 = await GroupRequests.findOne({ pendingList: userIndex.indexNumber, projectId: projectId })
        let result2 = await GroupRequests.findOne({ acceptedList: userIndex.indexNumber, projectId: projectId })
        let result = null
        if (result1) {
            result = result1
        }
        if (result2) {
            result = result2
        }
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

//get request details by user Id & project Id
router.post("/grouprequest/:userId", async (req, res, next) => {
    try {
        const userId = req.params.userId
        const projectId = req.body.id
        let userIndex = await User.findOne({ _id: userId }).select("indexNumber")
        let result = await GroupRequests.findOne({ projectId: projectId, allStudentList: userIndex.indexNumber })
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

//edit request details
router.patch("/grouprequest/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        let result = await GroupRequests.findByIdAndUpdate(id, req.body, { new: true })
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

//get group accepting request by studentId
router.get("/groupacceptingrequest/:userId", async (req, res, next) => {
    try {

        const userId = req.params.userId
        const index = await User.findOne({ _id: userId }).select("indexNumber")
        const result = await GroupRequests.find({ pendingList: index.indexNumber })
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

//get group accepting request by coordinatorId
router.get("/coordinatorgrouprequests/:userId",async(req,res,next)=> {
    try{

        const userId = req.params.userId
        const projects = await Projects.find({coordinatorList:userId})
        let projectIdArray = []
        projects.map(project=>{
            projectIdArray.push(project._id)
        })

        const groupRequests = await GroupRequests.find({pendingList:[],declinedList:[],projectId:projectIdArray})

        res.send(groupRequests)
    }
    catch (e) {
        console.log(e)
    }
})

router.delete("/grouprequests/:id",async (req,res)=> {
    try{
        const id= req.params.id;
        console.log(id)
        const result = await GroupRequests.findOneAndDelete({_id:id})
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

//update group name and group email
router.patch("/groupDetails/:groupId", async (req, res, next) => {
    try {
        const id = req.params.groupId;
        const update = req.body;
        const result = await CreateGroups.findByIdAndUpdate(id, update, { new: true })
        res.send(result)
    } catch (err) {
        console.log(err)
    }
})

//request group Email
//Confirm meeting.js
router.get('/requestemail/:id', (req,res)=>{
    console.log(req.params.id);
    try{
        const id = req.params.id;

        CreateGroups
        .find({ _id: id })
        .select('groupEmail')
        .exec()
        .then(data => {
            res.json({ state: true, data: data, msg: 'Data successfully sent..!' })
        })
        .catch(err => {
            res.send({ state: false, msg: err.message })
        })
    }
    catch(e){
        console.log(e);
    }
})

module.exports = router


