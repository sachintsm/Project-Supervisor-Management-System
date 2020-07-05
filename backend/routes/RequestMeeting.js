const express = require('express');
const router = express.Router();
const RequsetMeeting = require('../models/RequestMeeting');

router.post('/add', (req, res) => {
    console.log(req.body);
    const newRequsetMeeting = new RequsetMeeting({
      groupId:req.body.groupId,
      purpose: req.body.purpose,
      date: req.body.date,
      time: req.body.time,
      supervisor: req.body.supervisor,
    })

    newRequsetMeeting.save()
        .then(result => {
            console.log(result)
            res.json({ state: true, msg: "Request sent Successfully..!" });
        })
        .catch(error => {
            console.log(error)
            res.json({ state: false, msg: "Request Sending Failed..!" });
        })
})

//get details to user profile
router.get('/get/:id', function (req, res) {
    let id = req.params.id;
    RequsetMeeting.find({ groupId: id })
      .exec()
      .then(result => {
        res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
      })
      .catch(error => {
        res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
      })
  });

  router.get('/getsupervisor/:id', function (req, res) {
    let id = req.params.id;
    RequsetMeeting.find({ supervisor: id })
      .exec()
      .then(result => {
        res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
      })
      .catch(error => {
        res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
      })
  });

module.exports = router