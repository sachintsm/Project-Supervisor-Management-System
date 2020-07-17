const express = require('express');
const router = express.Router();
const RequsetMeeting = require('../models/RequestMeeting');

router.post('/add', (req, res) => {
  const newRequsetMeeting = new RequsetMeeting({
    groupId: req.body.groupId,
    purpose: req.body.purpose,
    date: req.body.date,
    time: req.body.time,
    supervisor: req.body.supervisor,
    state: req.body.state,
  })

  newRequsetMeeting.save()
    .then(result => {
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
  RequsetMeeting.find({ groupId: id, state:"confirmed" })
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

router.get('/getmeet/:id', function (req, res) {
  let id = req.params.id;
  RequsetMeeting.find({ _id: id })
    .exec()
    .then(result => {
      res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
    })
    .catch(error => {
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })
});


router.post('/updateMeet/:id', function (req, res) {
  let id = req.params.id;

  RequsetMeeting.update({ _id: id }, { 
    $set: {
      date: req.body.date,
      time: req.body.time,
      state:"confirmed"
    }
  })
    .exec()
    .then(data => {
      res.json({ state: true, msg: "Data Update Success..!" });

    })
    .catch(error => {
      res.json({ state: false, msg: "Data Updating Unsuccessfull..!" });
    })
});
module.exports = router