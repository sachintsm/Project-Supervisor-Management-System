const express = require('express');
const router = express.Router();
const RequsetMeeting = require('../models/RequestMeeting');

router.post('/add', (req, res) => {
    console.log(req.body);
    const newRequsetMeeting = new RequsetMeeting({
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

module.exports = router