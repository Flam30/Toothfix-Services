var express = require('express');
var router = express.Router();
var Booking = require('../models/booking')
const { mqtt, mqttClient, publish, subscribe } = require('../utils/MqttController');
// const mqtt = require('mqtt');
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

const jobQueue = new Queue('bookingQueue', redisConfig);

//MQTT listener for messages (all topics)
mqttClient.on('message', function (topic, message) {
    console.log("Emitted event from mqttClient");
    eventEmitter.emit("message", topic, message);
});

// POST
router.post("/", async function (req, res, next) {
    try {
        // Add a job to the queue
        const request = req.body;
        jobQueue.add(request);
        
        // Event listener for completed jobs
        jobQueue.on('completed', (job, result) => {
            console.log(`Job ID ${job.id} completed with result:`, result);
            const booking = Booking.create(request);
            // publish("toothfix/notifications/booking", JSON.stringify(booking));
            res.status(200).json(request);
        });
    }catch (error) {
        res.status(500).json(error);
    }
});

// Process jobs from the queue
 jobQueue.process(async function (job, done) {
    console.log('Processing job:', job.data);
    const slotIdMessage = { "slotId": job.data.slotId }
    console.log(slotIdMessage);

    const confirmationResult = await new Promise((resolve) => {
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

    // const confirmationResult = await getConfirmation(job.data.slotId);

    if (confirmationResult) {
        // const booking = Booking.create(job.data);
        // console.log("Booking created");
        // publish("toothfix/notifications/booking", JSON.stringify(booking));
        done();
    } else {
        console.log("Booking failed");
        return done(err)
    }

});




// Event listener for failed jobs
jobQueue.on('failed', (job, err) => {
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