var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var dentistSchema = new Schema({
    personnummer: { type: String, unique: true, required: true },
    name: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    clinic: {type: Schema.Types.ObjectId, ref: 'clinic'}
});

module.exports = mongoose.model('dentists', dentistSchema);