var express = require("express");
var router = express.Router();
var Dentist = require("../models/dentist");

//POST
router.post("/", function (req, res, next) {
  Dentist.create(req.body)
    .then(function (dentist) {
      res.status(201).json(dentist);
    })
    .catch(next);
});

//GET
router.get("/", async function (req, res, next) {
  try {
    const dentist = await Dentist.find({});
    res.status(200).json(dentist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET specific
router.get("/:id", async function (req, res) {
  try {
    var id = req.params.id;
    const dentist = await Dentist.findOne({ personnummer: id });
    res.status(200).json(dentist);
  } catch (error) {
    res.status(404).json({ message: "Dentist not found" });
  }
});

//PATCH
router.patch("/:id", async function (req, res) {
  try {
    var dentist = await Dentist.findOne({ _id: req.params.id });
    if (!dentist) return res.status(404).json({ message: "Dentist not found" });

    const newDentist = {
      personnummer: req.body.personnummer || dentist.personnummer,
      name: req.body.name || dentist.name,
      email: req.body.email || dentist.email,
      phone: req.body.phone || dentist.phone,
    };

    dentist = await Dentist.findOneAndUpdate(
      { _id: req.params.id },
      newDentist,
      { new: true },
    );
    res.status(200).json(dentist);
  } catch (error) {
    res.status(404).json({ message: "Dentist not found" });
  }
});

//DELETE
router.delete("/:id", async function (req, res) {
  try {
    var id = req.params.id;
    Dentist.findByIdAndDelete(id, function (err, dentist) {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(200).json(dentist);
      }
    });
  } catch (error) {
    res.status(404).json({ message: "Dentist not found" });
  }
});

module.exports = router;
