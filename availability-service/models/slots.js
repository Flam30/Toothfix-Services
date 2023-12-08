var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')

var slotSchema = new Schema({
    date: { type: Date, required: true },
    available: { type: Boolean, rquired: true },
    dentist: { type: Schema.Types.String, ref: 'dentists', required: true },
    weekNumber: { type: String, default: function () { return moment(this.date).format('W') } },

});

module.exports = mongoose.model('slots', slotSchema);