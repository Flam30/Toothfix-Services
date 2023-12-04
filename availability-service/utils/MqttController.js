var Slot = require('../models/slots');
const mqtt = require('mqtt');
const port = '8080';
const url = `ws://13.51.167.96:${port}`;

const options = {
    connectTimeout: 4000,
};

const mqttClient = mqtt.connect(url, options);

const pendingTopic = "toothfix/booking/pending"; //publish message

function publish(topic, message) {
    mqttClient.publish(topic, message, (err) => {
        if (err) {
            console.error('publish failed', err)
        }
        console.log(`TOPIC: ${topic} \nMESSAGE: ${message}`)
    });
}

async function subscribe() {
    mqttClient.subscribe(pendingTopic, (err) => {
        if (err) {
            console.error("subscription failed", err);
        }
        console.log(`Subscribed to topic: ${pendingTopic}`);
    });
}

//subscribe to topic
async function getMessages() {

    mqttClient.on("message", async (t, m) => {
        //sending a notification when a booking is made
        console.log("Received message from topic: ", t);
        try {
            let strMessage = m.toString();
            let objMessage = JSON.parse(strMessage);
            console.log("JSON object from the booking:");
            console.log(objMessage.slotId);

            let slot = await Slot.findById(objMessage.slotId).lean().exec();

            console.log(slot._id)

            let confirmation = {
                "slotId" : slot._id,
                "available" : slot.available
            }
            publish("toothfix/booking/confirmation", JSON.stringify(confirmation));

        } catch (error) {
            console.log(error, '500');
        }
    });
}

module.exports = {
    publish,
    subscribe,
    getMessages
}