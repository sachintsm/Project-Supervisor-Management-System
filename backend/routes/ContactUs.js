const express = require('express');
const router = express.Router();
const ContactUs = require('../models/contactUs');

//Get all
router.route('/').get(function(req, res) {
    console.log("Message requested");
    ContactUs.find(function(err, message) {
        if (err) {
            console.log(err);
        } else {
            res.json(message);
            
        }
    });
});

//Post
router.post('/add', (req, res) => {
    console.log(req.body);
    const newContactUs = new ContactUs({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      message: req.body.message,
    //   messageState : true
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

// mail delete

router.delete('/Mail_delete/:_id', async (req,res) =>{

    const mail_id = req.params._id;

    ContactUs.remove({_id:mail_id})
    .exec()
    .then((result) => {
        res.status(200).json({
          message: "Deleted Successfully..",
        });
      })
      .catch((error) => {
        res.status(500).json({
          massage: "Deleted Unsuccessfull",
        });
      });

});

module.exports = router