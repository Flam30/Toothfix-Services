var express = require('express');
var router = express.Router();
var Slot = require('../models/slots')
var mqttClient = require('../utils/MqttController')


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
router.get("/", async function (req, res, next) {
    try {
        const slots = await Slot.find({});
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;