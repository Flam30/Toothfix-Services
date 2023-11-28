const mqtt = require('mqtt');

const port = '8080';
const url = `ws://13.51.167.96:${port}`;

const options = {
    connectTimeout: 4000,
};

//publish message
function publish(topic, message) {
    const client = mqtt.connect(url, options);

    client.on('connect', () => {
        client.publish(topic, message, (err) => {
            if (err) {
                console.error('publish failed', err)
            }
        });
    })
}

//subscribe to topic
function subscribe(topic) {
    const client = mqtt.connect(url, options);

    client.on('connect', () => {
        client.subscribe('topic', (err) => {
            if (err) {
                console.error('subscription failed', err)
            }
            console.log(`Subscribed to topic: ${topic}`);
        });
        mqttClient.on('message', function (t, m) {
            if (t === topic) {
                callback(m.toString())
            }
        })
    })
}

module.exports = {
    publish,
    subscribe
}