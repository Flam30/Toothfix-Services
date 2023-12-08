var express = require('express');
var router = express.Router();
var Slot = require('../models/slots')


//POST
router.post("/", async function (req, res, next) {
    try {
        const slots = await Slot.create(req.body);
        res.status(201).json(slots);
    } catch (error) {
        return next(error);
    }
});

//PATCH
router.patch("/:_id", async function (req, res, next) {
    try {
        const slots = await Slot.findById(req.params._id);
        slots.available = req.body.available;
        slots.save();
        res.status(200).json(slots);
    } catch (error) {
        return next(error);
    }
});


//GET
router.get("/", async function (res, next) {
    try {
        const slots = await Slot.find({});
        res.status(200).json(slots);
    } catch (error) {
        return next(error);
    }
});

//GET available bookings by week number
router.get("/weekNumber/:weekNumber/dentist/:dentist", async function (req, res, next) {
    try {
        const slots = await Slot.find({
            weekNumber: req.params.weekNumber,
            dentist: req.params.dentist,
            available: true
        })
        res.status(200).json(slots);
    } catch (error) {
        return next(error);
    }
})

module.exports = router;