const express = require('express');
const router = express.Router();
const verify = require('../authentication');
const ProjectSupervisors = require('../models/projectSupervisors');

//? add supervisor to project
//? (AssignSupervisor.js)
router.post('/add', verify, async (req, res) => {
    console.log(req.body)
    const isExists = await ProjectSupervisors.findOne({ projectId: req.body.projectId })
    if (isExists) {
        const existSupervisor = await ProjectSupervisors.findOne({ projectId: req.body.projectId, supervisors: req.body.supervisors })
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

//? get all supervisors with respect to the one project
//? (AssignSupervisor.js)
router.get('/get/:id', verify, (req, res) => {
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

//? Remove supervisor from the project
//? (AssignSupervisor.js)
router.post('/delete', verify, async (req, res) => {
    const projectId = req.body.projectId
    const supervisor = req.body.supervisor

    console.log(req.body)
    await ProjectSupervisors
        .find({ projectId: projectId })
        .update(
            { $pull: { supervisors: supervisor } }
        )
        .exec()
        .then(data => {
            res.json({ state: true, msg: 'Index successfully deleted..!' })
        })
        .catch(err => {
            res.send({ state: false, msg: err.message })
        })
})


module.exports = router