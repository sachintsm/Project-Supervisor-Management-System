const express = require('express');
const router = express.Router();
const verify = require('../authentication');
const ProjectSupervisors = require('../models/projectSupervisors');

//? add supervisor to project
router.post('/add', verify, async (req, res) => {
    const isExists = await ProjectSupervisors.findOne({ projectId: req.body.projectId })
    if (isExists) {
        const existSupervisor = await ProjectSupervisors.findOne({ supervisors: req.body.supervisors })
        if (existSupervisor) return res.json({ state: false, msg: "Already Exists..!" })
        else {
            ProjectSupervisors
                .find({ projectId: req.body.projectId })
                .update({
                    $push: { supervisors: req.body.supervisors }
                })
                .exec()
                .then(data => {
                    res.json({ state: true, msg: 'Data successfully updated..!' })
                })
                .catch(err => {
                    res.send({ state: false, msg: err.message })
                })
        }
    }
    else {
        const data = new ProjectSupervisors({
            projectId: req.body.projectId,
            supervisors: req.body.supervisors
        })
        data.save()
            .then(result => {
                res.json({ state: true, msg: "Data Inserted Successfully..!" });
            })
            .catch(error => {
                console.log(error)
                res.json({ state: false, msg: "Data Inserting Unsuccessfull..!" });
            })

    }
})

router.get('/get/:id',verify, (req, res) => {
    const id = req.params.id
    ProjectSupervisors
        .find({ projectId: id })
        .exec()
        .then(data => {
            res.json({ state: true, msg: "Data Transfered Successfully..!", data: data[0] });
        })
        .catch(error => {
            console.log(error)
            res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
        })
})

router.get("/getProjectId", (req, res, next) => {
 
    ProjectSupervisors.find()
      .sort({ date: 1 })
      .select("projectId")
      .exec()
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: error,
        });
      });
  });


module.exports = router