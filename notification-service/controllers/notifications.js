var express = require("express");
var router = express.Router();
var Notification = require("../models/notification");

//POST
router.post("/", async function (req, res, next) {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    return next(error);
  }
});

//GET notifications
router.get("/", async function (req, res, next) {
  try {
    const notifications = await Notification.find({});
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET specific notification
router.get("/:id", async function (req, res) {
  try {
    var id = req.params.id;
    const notification = await Notification.findOne({ _id: id });
    res.status(200).json(notification);
  } catch (error) {
    res.status(404).json({ message: "Notification not found" });
  }
});

module.exports = router;
