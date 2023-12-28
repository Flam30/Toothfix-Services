var express = require("express");
var router = express.Router();
var Clinic = require("../models/clinic");

//POST
router.post("/", async function (req, res, next) {
  try {
    const clinic = await Clinic.create(req.body);
    res.status(201).json(clinic);
  } catch (error) {
    return next(error);
  }
});

//GET
router.get("/", async function (req, res, next) {
  try {
    const clinics = await Clinic.find({});
    res.status(200).json(clinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET specific
router.get("/:id", async function (req, res) {
  try {
    var id = req.params.id;
    const clinic = await Clinic.findOne({ _id: id });
    res.status(200).json(clinic);
  } catch (error) {
    res.status(404).json({ message: "Clinic not found" });
  }
});

//DELETE
router.delete("/:id", async function (req, res) {
    try {
        var id = req.params.id;
        const clinic = await Booking.findOneAndDelete({_id:id});
        if(!clinic){
            res.status(404).json({ message: "Clinic not found" });
        }else{
            res.status(200).json(clinic);
        }
        
    } catch (error) {
        
    }
    Clinic.findByIdAndRemove(req.params.id, req.body, function (err, clinic) {
        if (err) return next(err);
        res.json(clinic);
    });
});

//PATCH opening hours
router.patch("/:id", async function (req, res) {
  try {
    var clinic = await Clinic.findOne({ _id: req.params.id });
    const newClinic = { openHours: req.body.openHours || clinic.openHours };

    clinic = await Clinic.findOneAndUpdate({ _id: req.params.id }, newClinic, {
      new: true,
    });
    res.status(200).json(clinic);
  } catch (error) {
    res.status(404).json({ message: "Clinic not found" });
  }
});

module.exports = router;
