const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const verify = require('../authentication');
const ProjectType = require('../models/projectType');
const Projects = require('../models/projects');

router.post('/projecttype', async (req, res, next) => {
  console.log(req.body)
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

router.get('/projecttype', verify, async (req, res, next) => {
  try {
    const types = await ProjectType.find({ "isDeleted": false });
    res.send(types);
  } catch (error) {
    console.log(error)
  }
})

// router.post('/projecttype', async (req, res, next) => {
//   try {
//     const result = await ProjectType.findByIdAndUpdate({ "_id": req._id });
//     res.send(result);
//   } catch (error) {
//     console.log(error)
//   }
// })

router.patch("/projecttype/delete/:id", async (req, res, next) => {
  try {


    const id = req.params.id;
    const result = await ProjectType.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
    res.send(result)
  } catch (err) {
    console.log(err)
  }
})

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

router.post('/', async (req, res, next) => {
  try {
    console.log(req.body)
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

// ?get all the active projects
router.get('/active&projects/:coordinatorId', (req, res) => {
  const coordinatorId = req.params.coordinatorId;
  Projects
    .find({ projectState: true, coordinatorList: coordinatorId })
    .then(data => {
      // console.log(data)
      res.send({ state: true, data: data, msg: 'Data Transfer Success..!' })
    })
    .catch(err => {
      res.send({ state: false, msg: err.message })
      console.log(err)
    })
})

module.exports = router;
