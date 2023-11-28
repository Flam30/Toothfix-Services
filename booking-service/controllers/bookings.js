var express = require('express');
var router = express.Router();
var Booking = require('../models/booking');

//No editing ergo no patch or put
// POST
router.post("/", async function (req, res, next) {
    try {
        const booking = await Booking.create(req.body);
        res.status(201).json(booking); 
    } catch (error) {
        return next(error);
    }
});


//GET
/* TODO: Filter by clinic */
router.get("/", async function (req, res, next) { 
    try {
        const bookings = await Booking.find({});
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//GET specific
router.get("/:id", async function (req, res) {
    try {
        var id = req.params.id;
        const booking = await Booking.findOne({_id:id});
        res.status(200).json(booking);
    } catch (error) {
        res.status(404).json({ message: "Booking not found" });
    }
});

//GET bookings by patient
router.get("/patient/:id", async function (req, res) {
    try {
        var id = req.params.id;
        const booking = await Booking.find({patient:id});
        res.status(200).json(booking);
    } catch (error) {
        res.status(404).json({ message: "Booking not found" });
    }
});

//GET bookings by dentist
router.get("/dentist/:id", async function (req, res) {
    try {
        var id = req.params.id;
        const booking = await Booking.find({dentist:id});
        res.status(200).json(booking);
    } catch (error) {
        res.status(404).json({ message: "Booking not found" });
    }
});

//DELETE
router.delete("/:id", async function (req, res) {
    try {
        var id = req.params.id;
        const booking = await Booking.findById({_id:id});
        if(!booking){
            res.status(404).json({ message: "Booking not found" });
        }else{
            res.status(200).json(booking);
        }
        
    } catch (error) {
        
    }
    Booking.findOneAndDelete(req.params.id, req.body, function (err, booking) {
        if (err) return next(err);
        res.json(booking);
    });
});


module.exports = router;