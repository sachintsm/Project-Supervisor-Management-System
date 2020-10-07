const express = require('express');
const router = express.Router();
const RequsetMeeting = require('../models/RequestMeeting');

 
router.post('/add', (req, res) => {
  const newRequsetMeeting = new RequsetMeeting({
    gId: req.body.gId,
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
  RequsetMeeting.find({ gId: id, state: "confirmed" })
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
      state: "confirmed"
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

// create urgent meeting
// Urgent Meeting.js Supervisor
router.post('/urgentMeeting', (req, res) => {
  const newRequsetMeeting = new RequsetMeeting({
    groupId: req.body.groupId,
    groupNumber: req.body.groupNumber,
    purpose: req.body.purpose,
    date: req.body.date,
    time: req.body.time,
    supervisor: req.body.supervisor,
    meetingType: 'Urgent'
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

 



// gett uegent meetings
//  ViewMeetings.js
router.get('/geturgent/:id', function (req, res) {
  console.log("my id : " + req.params.id);

  let id = req.params.id;
  RequsetMeeting.find({ supervisor: id, meetingType: "Urgent" })
    .exec()
    .then(result => {
      res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
    })
    .catch(error => {
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })
});


//cancel urgent meetings
//delete user
router.route('/cancelMeeting/:id').post(function (req, res) {
  RequsetMeeting.findById(req.params.id, function (err, urgentm) {
    if (!urgentm) {
      res.status(404).send("data is not found");
    }
    else {
      urgentm.meetingType = "cancel";

      urgentm.save().then(user => {
        res.send({ state: true, msg: "Successfully deleted!" })
      })
        .catch(err => {
          res.status(400).send({ msg: "Delete not possible", state: false });
        });
    }
  });
});

module.exports = router