var express = require("express");
var router = express.Router();
var Log = require("../models/log");

//POST
router.post("/", async function (req, res, next) {
  try {
    const log = await Log.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    return next(error);
  }
});

//GET
router.get("/", async function (req, res, next) {
  try {
    const logs = await Log.find({});
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET specific
router.get("/:id", async function (req, res) {
  try {
    var id = req.params.id;
    const log = await Log.findOne({ _id: id });
    res.status(200).json(log);
  } catch (error) {
    res.status(404).json({ message: "Log not found" });
  }
});

//DELETE
router.delete("/:id", async function (req, res) {
  try {
    var id = req.params.id;
    await Log.deleteOne({ _id: id });
    res.status(200).json({ message: "Log deleted" });
  } catch (error) {
    res.status(404).json({ message: "Log not found" });
  }
});

module.exports = router;
