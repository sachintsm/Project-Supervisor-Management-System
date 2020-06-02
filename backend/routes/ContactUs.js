const express = require('express');
const router = express.Router();
const ContactUs = require('../models/contactUs');

router.post('/add', (req, res) => {
    console.log(req.body);
    const newContactUs = new ContactUs({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      message: req.body.message,
    })

    newContactUs.save()
        .then(result => {
            console.log(result)
            res.json({ state: true, msg: "Message sent Successfully..!" });
        })
        .catch(error => {
            console.log(error)
            res.json({ state: false, msg: "Message Sending Failed..!" });
        })
})

module.exports = router