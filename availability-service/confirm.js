var Slot = require('./models/slots');
var mqttClient = require('./utils/MqttController');

async function confirmBooking() {

    const slot = await Slot.findById(mqttClient.getMessages()).lean().exec();

    console.log(slot._id)

    let confirmation = {
        "slotId": slot._id,
        "available": slot.available
    }
    mqttClient.publish("toothfix/booking/confirmation", JSON.stringify(confirmation));
}



module.exports = {
    confirmBooking
}