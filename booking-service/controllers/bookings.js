var express = require("express");
var router = express.Router();
var Booking = require("../models/booking");
const { requestQueue } = require("../utils/Queue");
const { publish } = require("../utils/MqttController");

const processedReqs = [];

// POST
router.post("/", async function (req, res, next) {
  try {
    let request = req.body;
    if (processedReqs.includes(request.slotId)) {
      console.log(request.slotId);
      return res.status(204).json({ message: "slot not available" });
    } else {
      processedReqs.push(request.slotId);

      console.log(request.slotId);
      let job = await requestQueue.add(request);
      let result = await job.finished();
      if (result === true) {
        let booking = await Booking.create(request);
        publish("toothfix/notifications/booking", JSON.stringify(booking));
        publish("toothfix/logging/newbooking", "New booking created"); //publish for logging
        return res.status(201).json(booking);
      } else {
        return res.status(204).json({ message: "slot not available" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const booking = await Booking.find({ patientId: id });
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
    const booking = await Booking.findOneAndDelete({ _id: id });
    console.log(booking);
    if (booking !== null) {
      processedReqs.splice(processedReqs.indexOf(booking.slotId));
      publish("toothfix/notifications/cancellation", JSON.stringify(booking));
      publish("toothfix/logging/bookingcancelled"); //for logging
      res.status(200).json(booking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    res.status(404).json({ message: "Booking not found" });
  }
});

module.exports = router;
