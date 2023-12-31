var express = require('express');
var router = express.Router();
var Booking = require('../models/booking')
const { mqttClient, publish, subscribe } = require('../utils/MqttController');
const { EventEmitter } = require('events');

// Create an event emitter instance
const eventEmitter = new EventEmitter();

subscribe('toothfix/booking/confirmation');

//Set up Queue
const Queue = require('bull');
const redisConfig = {
    redis: {
        password: 'qtN6Ok1gmRDmPe0UP5sFQCmNhJEg5JPv',
        host: 'redis-15929.c250.eu-central-1-1.ec2.cloud.redislabs.com',
        port: 15929,
    },
};


const requestQueue = new Queue('requestQueue', redisConfig);

//MQTT listener for messages (all topics)
mqttClient.on('message', function (topic, message) {
    console.log("Emitted event from mqttClient");
    eventEmitter.emit("message", topic, message);
});

// POST
router.post("/", async function (req, res, next) {
    let request = req.body;
    try {
        let job = await requestQueue.add(request);
        let result = await job.finished()
        if (result === true) {
            let booking = await Booking.create(request);
            // publish("toothfix/notifications/booking", JSON.stringify(booking));
            return res.status(200).json(booking);
        } else {
            return res.status(422).json({ message: "slot not available" })
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// Process jobs from the queue
requestQueue.process(async function (job) {
    console.log('Processing job:', job.data);
    let slotIdMessage = { "slotId": job.data.slotId } 

    let confirmationResult = await new Promise((resolve) => {
        publish('toothfix/booking/pending', JSON.stringify(slotIdMessage));

        eventEmitter.on("message", function (t, m) {
            if (t === "toothfix/booking/confirmation") {
                console.log("Received message from topic: ", t);
                console.log("Message: ", m.toString());
                const objConfirmation = JSON.parse(m.toString());
                console.log(objConfirmation);
                if(objConfirmation.available === true){
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        })
    });
    return confirmationResult
});

// Event listener for failed jobs
requestQueue.on('failed', (job, err) => {
    console.error(`Job ID ${job.id} failed with error:`, err);
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