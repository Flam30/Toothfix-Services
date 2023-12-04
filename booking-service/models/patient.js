var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var patientSchema = new Schema({
    personnummer: { type: String, unique: true, required: true },
    email: { type: String }
});

module.exports = mongoose.model('patients', patientSchema);