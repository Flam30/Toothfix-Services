var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var bookingSchema = new Schema({
    date: { type: Date, required: true},
    start: {type: String, required: true },
    end: { type: String, required: true},
    patient: { type: Schema.Types.String, ref: 'patients', required: true },
    patientEmail: { type: String, required: true},
    dentist: { type: Schema.Types.String, ref: 'dentists', required: true }, 
});

module.exports = mongoose.model('bookings', bookingSchema);