const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const verify = require('../authentication');
const ProjectType = require('../models/projectType');

router.post('/projecttype', async (req, res, next) => {
  try {
    const type = new ProjectType(req.body);
    type.isDeleted = false;
    const result = await type.save();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.get('/projecttype', async (req, res, next) => {
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
    const id = req.params.id;
    const update = req.body;
    const result = await ProjectType.findByIdAndUpdate(id, update, { new: true })
    res.send(result)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
