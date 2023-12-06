var express = require('express');
var router = express.Router();
var Booking = require('../models/booking')
const { mqtt, mqttClient, publish, subscribe } = require('../utils/MqttController');
// const mqtt = require('mqtt');
const { EventEmitter } = require('events');

// Create an event emitter instance
const eventEmitter = new EventEmitter();

subscribe('toothfix/booking/confirmation');

mqttClient.on('message', function (topic, message) {
    eventEmitter.emit("message", topic, message);
  });

// Function to get confirmation from the other service -- TODO FIIIIIIXXXX THIIIIIIISSSSSS
async function getConfirmation(slotId) {
    return new Promise((resolve, reject) => {
        eventEmitter.once("message", function (t, m) {
            if (t === "toothfix/booking/confirmation") {
                console.log("Received message from topic: ", t);
                console.log("Message: ", m.toString());
                const objConfirmation = JSON.parse(m.toString());
                console.log(objConfirmation);
                resolve(true);
                // if (objConfirmation.slotId === slotId) {
                //     if (objConfirmation.approved === "true") {
                //         console.log("Booking approved");
                //         resolve(true);
                //     } else {
                //         reject();
                //     }
                // }else{
                //     reject();
                // }
            }else{reject();}
        });
    });
}
//subscribe to the confirmation topic

// Set up the event listener for MQTT messages

// helper function


// POST
router.post("/", async function (req, res, next) {
    try {
        //PART 1  --  publish so that the availability service sends a confirmation
        const slotIdMessage = {
            "slotId": req.body.slotId
          }

        publish('toothfix/booking/pending', JSON.stringify(slotIdMessage));
        const slotId = req.body.slotId;

        // Wait for the confirmation
        const confirmationResult = await getConfirmation(slotId)
            
        //Logic for handling TRUE/FALSE from getConfirmation(slotId) goes here
        if (confirmationResult) {
            const booking = Booking.create(req.body);
            res.status(200).json(booking);
        } else {
            res.status(400).json({ message: 'Booking canceled. Slot not available.' });
        }
    }catch (error) {
        res.status(500).json(error);
    }finally{
        mqttClient.unsubscribe('toothfix/booking/confirmation');
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
        const booking = await Booking.findOne({ _id: id });
        res.status(200).json(booking);
    } catch (error) {
        res.status(404).json({ message: "Booking not found" });
    }
});

//GET bookings by patient
router.get("/patient/:id", async function (req, res) {
    try {
        var id = req.params.id;
        const booking = await Booking.find({ patient: id });
        res.status(200).json(booking);
    } catch (error) {
        res.status(404).json({ message: "Booking not found" });
    }
});

//GET bookings by dentist
router.get("/dentist/:id", async function (req, res) {
    try {
        var id = req.params.id;
        const booking = await Booking.find({ dentist: id });
        res.status(200).json(booking);
    } catch (error) {
        res.status(404).json({ message: "Booking not found" });
    }
});

//DELETE
router.delete("/:id", async function (req, res) {
    try {
        var id = req.params.id;
        const booking = await Booking.findById({ _id: id });
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
        } else {
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