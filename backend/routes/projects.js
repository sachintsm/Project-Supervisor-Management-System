const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const verify = require('../authentication');
const ProjectType = require('../models/projectType');
const Projects = require('../models/projects');
const User = require('../models/users');
const CreateGroups = require('../models/createGroups')

//create project category
router.post('/projecttype', async (req, res, next) => {
  // console.log(req.body)
  try {

    if (!req.body.isAcademicYear) {
      req.body.isFirstYear = false;
      req.body.isSecondYear = false;
      req.body.isThirdYear = false;
      req.body.isFourthYear = false;
    }

    if (!(req.body.isFirstYear || req.body.isSecondYear || req.body.isThirdYear || req.body.isFourthYear)) {
      req.body.isAcademicYear = false;
    }

    const type = new ProjectType(req.body);
    type.isDeleted = false;
    const result = await type.save();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

//get project categories
router.get('/projecttype', verify, async (req, res, next) => {
  try {
    const types = await ProjectType.find({ "isDeleted": false });
    res.send(types);
  } catch (error) {
    console.log(error)
  }
})

//Delete project category
router.patch("/projecttype/delete/:id", async (req, res, next) => {
  try {


    const id = req.params.id;
    const result = await ProjectType.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
    res.send(result)
  } catch (err) {
    console.log(err)
  }
})

//Delete Project API
router.patch("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Projects.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
    res.send(result)
  } catch (err) {
    console.log(err)
  }
})

// Update Project API
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const idList = []
    req.body.selectedStaffList.map(item => {
      idList.push(item.value)
    })

    const update = {
      projectYear: req.body.year,
      projectType: req.body.type,
      academicYear: req.body.academicYear,
      coordinatorList: idList,
    };
    const result = await Projects.findByIdAndUpdate(id, update, { new: true })
    res.send(result)
  } catch (err) {
    console.log(err)
  }
})

//Edit Project category
router.patch("/projecttype/:id", async (req, res, next) => {
  try {

    if (!req.body.isAcademicYear) {
      req.body.isFirstYear = false;
      req.body.isSecondYear = false;
      req.body.isThirdYear = false;
      req.body.isFourthYear = false;
    }

    if (!(req.body.isFirstYear || req.body.isSecondYear || req.body.isThirdYear || req.body.isFourthYear)) {
      req.body.isAcademicYear = false;
    }


    const id = req.params.id;
    const update = req.body;
    const result = await ProjectType.findByIdAndUpdate(id, update, { new: true })
    res.send(result)
  } catch (err) {
    console.log(err)
  }
})


//Insert Project API
router.post('/', async (req, res, next) => {
  try {
    const project = new Projects(req.body);
    project.isDeleted = false;
    project.projectState = true;
    const result = await project.save();
    res.send(result);
  }
  catch (err) {
    console.log(err)
  }
})

// ?get all the active projects fot coordinator
router.get('/active&projects/:coordinatorId', (req, res) => {
  const coordinatorId = req.params.coordinatorId;
  Projects
    .find({ projectState: true, isDeleted: false, coordinatorList: coordinatorId })
    .then(data => {
      // console.log(data)
      res.send({ state: true, data: data, msg: 'Data Transfer Success..!' })
    })
    .catch(err => {
      res.send({ state: false, msg: err.message })
      console.log(err)
    })
})

//get all the projects API
router.get('/', async (req, res, next) => {
  try {
    const projects = await Projects.find({"isDeleted": false}).sort({ projectYear: -1 });
    res.send(projects);
  }
  catch (err) {
    console.log(err)
  }
})

//get projects of a student by student userID
router.get('/studentprojects/:studentId',async(req, res, next) => {
  try {
    const id = req.params.studentId;
    const result = await User.findOne({ _id: id }).select('indexNumber');
    if (result.length == 0) {
      res.send([])
    }
    else {
      const index = result.indexNumber
      const projectList = await CreateGroups.find({groupMembers: index}).select('projectId');
      let projectIdList = []
      // console.log(projectList)
      if (projectList.length > 0) {
        for (let i in projectList) {
          projectIdList.push(projectList[i].projectId)
        }
        const projects = await Projects.find({ _id: projectIdList });
        res.send(projects)
      }
      else {
        res.send([])
      }
    }
  }
  catch (err) {
    console.log(err)
  }
})


//? add supervisor to project
//? (AssignSupervisor.js)
router.post('/addSupervisor', verify, async (req, res) => {
  // console.log(req.body)
  const existSupervisor = await Projects.findOne({ _id: req.body.projectId, supervisorList: req.body.supervisors })
  if (existSupervisor) return res.json({ state: false, msg: "Already Exists..!" })
  else {
    Projects
      .find({ _id: req.body.projectId })
      .update({
        $push: { supervisorList: req.body.supervisors }
      })
      .exec()
      .then(data => {
        res.json({ state: true, msg: 'Data successfully updated..!' })
      })
      .catch(err => {
        res.send({ state: false, msg: err.message })
      })
  }
})

//? get all supervisors with respect to the one project
//? (AssignSupervisor.js)
router.get('/getSupervisors/:id', verify, (req, res) => {
  const id = req.params.id
  Projects
    .find({ _id: id })
    .exec()
    .then(data => {
      res.json({ state: true, msg: "Data Transfered Successfully..!", data: data[0] });
    })
    .catch(error => {
      console.log(error)
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })
})

//? Remove supervisor from the project
//? (AssignSupervisor.js)
router.post('/deletesupervisorGroup', verify, async (req, res) => {
  const projectId = req.body.projectId
  const supervisor = req.body.supervisor

  console.log(req.body)
  await Projects
    .find({ _id: projectId })
    .update(
      { $pull: { supervisorList: supervisor } }
    )
    .exec()
    .then(data => {
      res.json({ state: true, msg: 'Index successfully deleted..!' })
    })
    .catch(err => {
      res.send({ state: false, msg: err.message })
    })
})

//? get all the project data with spesific coordinator
//? (CoodinatorHome.js)
router.get('/getAllActiveProjectData/:id', async (req, res) => {
  const coId = req.params.id
  await Projects
    .find({ coordinatorList: coId, projectState: true })
    .exec()
    .then(data => {
      res.json({ state: true, msg: "Data Transfered Successfully..!", data: data });
    })
    .catch(error => {
      console.log(error)
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })
})

//? get all the project data with spesific coordinator
//? (CoodinatorHome.js)
router.get('/getAllEndProjectData/:id', async (req, res) => {
  const coId = req.params.id
  const dt = new Date
  const year = dt.getFullYear()

  await Projects
    .find({ coordinatorList: coId, projectState: false, projectYear: { $gte: year - 2 } })
    .exec()
    .then(data => {
      res.json({ state: true, msg: "Data Transfered Successfully..!", data: data });
    })
    .catch(error => {
      console.log(error)
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })
})

//? update the project state to false
//? (CoodinatorHome.js)
router.get('/endProject/:id', verify, async (req, res) => {
  const id = req.params.id
  await Projects
    .findOne({ _id: id })
    .update({ projectState: false })
    .exec()
    .then(data => {
      res.json({ state: true, msg: 'Project successfully ended..!' })
    })
    .catch(err => {
      res.json({ state: false, msg: 'Project ending failed..!' })
    })
})

//? get project name
//? (supervisors.js)
router.get('/getProjectName/:id', async (req, res) => {
  const id = req.params.id
  Projects
    .findOne({ _id: id })
    .select('projectYear projectType academicYear')
    .exec()
    .then(data => {
      res.json({ state: true, msg: "Data Transfered Successfully..!", data: data });
    })
    .catch(error => {
      console.log(error)
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })
})

//? get all the project data with spesific supervisor
//? (SupervisorHome.js)
router.get('/getAllActiveProjectDataS/:id', async (req, res) => {
  const coId = req.params.id
  await Projects
    .find({ supervisorList: coId, projectState: true })
    .select('projectYear projectType academicYear _id')
    .exec()
    .then(data => {
      res.json({ state: true, msg: "Data Transfered Successfully..!", data: data });
    })
    .catch(error => {
      console.log(error)
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })
})

module.exports = router;
