// mqttService.js
const mqtt = require('mqtt');
const port = '8080';
const url = `ws://13.51.167.96:${port}`;



const options = {
    connectTimeout: 4000,
};

const mqttClient = mqtt.connect(url, options);

async function publish(topic, message) {
    mqttClient.publish(topic, message, (err) => {
        if (err) {
            console.error('publish failed', err)
        }
        console.log(`TOPIC: ${topic} \nMESSAGE: ${message}`)
    });
}

async function subscribe(topic, callback) {
    mqttClient.subscribe(topic, (err) => {
        if (err) {
            console.error("subscription failed", err);
        }
        console.log(`Subscribed to topic: ${topic}`);
        if (typeof callback === 'function') {
            callback();
        }
    });
}

module.exports = {
    mqttClient,
    publish,
    subscribe
};
