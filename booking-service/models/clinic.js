var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var clinicSchema = new Schema({
    name: { type: String, unique: true, required: true },
    address: { type: String },
    openHours: { type: String }
});

module.exports = mongoose.model('clinics', clinicSchema);