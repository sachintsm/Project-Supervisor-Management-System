const express = require("express");
const router = express.Router();
const verify = require("../authentication");
const BiWeekComments = require("../models/biweekcomments");

// add new comment
router.post("/addcomment", verify, async (req, res, next) => {
  try {
    const comment = new BiWeekComments(req.body);
    const result = await comment.save();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

// get comments by biweeksubmission id
router.get("/getcomments/:id", verify, async (req, res, next) => {
  try {
    const id = req.params.id;
    const comments = await BiWeekComments.find({ biweekId: id }).sort({
      timestamp: -1,
    });
    res.send(comments);
  } catch (err) {
    console.log(err);
  }
});

// delete comment by comment id
router.get("/deletecomment/:id", verify, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await BiWeekComments.findOneAndDelete({ _id: id });
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
