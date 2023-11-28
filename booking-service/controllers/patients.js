var express = require('express');
var router = express.Router();
var Patient = require('../models/patient');

//POST
router.post("/", async function (req, res, next) {
    try {
        const patient = await Patient.create(req.body);
        res.status(201).json(patient); 
    } catch (error) {
        return next(error);
    }
});


//GET 
router.get("/", async function (req, res, next) { 
    try {
        const patients = await Patient.find({});
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//GET specific
router.get("/:id", async function (req, res) {
    try {
        var id = req.params.id;
        const patient = await Patient.findOne({_id:id});
        res.status(200).json(patient);
    } catch (error) {
        res.status(404).json({ message: "Patient not found" });
    }
});

module.exports = router;
