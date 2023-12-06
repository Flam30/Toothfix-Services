var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var slotSchema = new Schema({
    date: { type: Date, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    available: { type: Boolean, rquired: true },
    dentist: { type: Schema.Types.String, ref: 'dentists', required: true },
});

module.exports = mongoose.model('slots', slotSchema);