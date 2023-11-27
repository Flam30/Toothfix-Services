var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var dentistSchema = new Schema({
    personnummer: { type: String, unique: true, required: true },
    name: { type: String },
    email: { type: String },
    phoneNumber: { type: String }
});

module.exports = mongoose.model('dentists', dentistSchema);