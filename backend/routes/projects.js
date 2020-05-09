const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const verify = require('../authentication');
const ProjectType = require('../models/projectType');

router.post('/projecttype', async (req, res, next) => {
  try {
    const type = new ProjectType(req.body);
    const result = await type.save();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
