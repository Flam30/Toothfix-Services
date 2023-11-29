var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var notificationSchema = new Schema({
    title : { type: String }, //make required
    body : { type: String }, //make required
});

module.exports = mongoose.model('notifications', notificationSchema);