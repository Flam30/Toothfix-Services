var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var notificationSchema = new Schema({
    title : { type: String, required: true },
    body : { type: String, required: true },
});

module.exports = mongoose.model('notifications', notificationSchema);