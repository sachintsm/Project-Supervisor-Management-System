const express = require("express");
const router = express.Router();
const CourseTypes = require("../models/courseTypes");
const verify = require("../authentication");
const { json } = require("express");

//? add new course type
router.post("/add", verify, async (req, res) => {
  // checking if the course code is already in the database
  const codeExists = await CourseTypes.findOne({
    courseCode: req.body.courseCode.toUpperCase(),
  });
  if (codeExists)
    return res.json({ state: false, msg: "This course code already exist..!" });

  const newCourse = new CourseTypes({
    courseCode: req.body.courseCode.toUpperCase(),
    courseName: req.body.courseName,
  });

  newCourse
    .save()
    .then((data) => {
      res.json({ state: true, msg: "Course Added Successfully..!" });
    })
    .catch((error) => {
      console.log(error);
      res.json({ state: false, msg: "Course Registering Failed..!" });
    });
});

//? get all the course details
router.get("/get", (req, res) => {
  CourseTypes.find()
    .exec()
    .then((data) => {
      res.json({ state: true, msg: "Data Transfer Successful..!", data: data });
    })
    .catch((err) => {
      res.json({ state: false, msg: "Data Transfer Failed..!" });
    });
});

router.delete("/:id", verify, (req, res) => {
  CourseTypes.remove({ _id: req.params.id })
    .then((result) => {
      res.json({ state: true, msg: "Course Deleted Successfully..!" });
    })
    .catch((error) => {
      res.json({ state: false, msg: "Course Deleting Failed..!" });
    });
});
module.exports = router;
