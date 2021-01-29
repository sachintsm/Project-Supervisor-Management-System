const express = require("express");
const router = express.Router();
const ContactUs = require("../models/contactUs");

//Get all
router.get("/", (req, res) => {
  ContactUs.find()
    .sort({ date: -1 })
    .exec()
    .then((docs) => {
      console.log("Data Transfer is Successful.!");
      res.status(200).json(docs);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

//Post
router.post("/add", (req, res) => {
  const newContactUs = new ContactUs({
    date: req.body.date,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    message: req.body.message,
  });

  newContactUs
    .save()
    .then((result) => {
      res.json({ state: true, msg: "Message sent Successfully..!" });
    })
    .catch((error) => {
      console.log(error);
      res.json({ state: false, msg: "Message Sending Failed..!" });
    });
});

//Delete mail
router.delete("/Mail_delete/:_id", async (req, res) => {
  const mail_id = req.params._id;

  ContactUs.remove({ _id: mail_id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Deleted Successfully..",
      });
    })
    .catch((error) => {
      res.status(500).json({
        massage: "Deleting Unsuccessfull",
      });
    });
});
module.exports = router;
