var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var bookingSchema = new Schema({
    date: { type: Date },
    start: {type: String },
    end: { type: String },
    patient: { type: Schema.Types.String, ref: 'patients', required: false }, // TODO: required: true
    dentist: { type: Schema.Types.String, ref: 'dentists', required: false }, //TODO: required: true
});

module.exports = mongoose.model('bookings', bookingSchema);