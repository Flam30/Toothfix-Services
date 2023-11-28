const mqtt = require('mqtt');

const port = '8080';
const url = `ws://13.51.167.96:${port}`;

const options = {
    connectTimeout: 4000,
};

const mqttClient = mqtt.connect(url, options);

//publish message
function publish(topic, message) {
    mqttClient.publish(topic, message, (err) => {
        if (err) {
            console.error('publish failed', err)
        }
        console.log(`TOPIC: ${topic} \nMESSAGE: ${message}` )
    });
}

module.exports = {
    publish
}