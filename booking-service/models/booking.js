var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var bookingSchema = new Schema({
  date: { type: Date, required: true },
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  dentist: { type: Schema.Types.String, ref: "dentists", required: true },
  slotId: { type: String },
});

module.exports = mongoose.model("bookings", bookingSchema);
