var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var bookingSchema = new Schema({
    date: { type: Date },
    start: {type: String },
    end: { type: String },
    patient: {},
    dentist: {},
});

module.exports = mongoose.model('bookings', bookingSchema);