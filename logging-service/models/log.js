//for bookings made
var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var logSchema = new Schema({
  eventType: { type: String, required: true },
  eventDate: { type: String, required: true },
  responsibleService: { type: String, required: true },
});

module.exports = mongoose.model("log", logSchema);
