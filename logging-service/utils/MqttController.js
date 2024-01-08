const mqtt = require("mqtt");
const port = "8080";
const url = `ws://13.51.167.96:${port}`;

var Log = require("../models/log");

const options = {
  connectTimeout: 4000,
};

// Connect to MQTT broker
const mqttClient = mqtt.connect(url, options);

//publish message
function publish(topic, message) {
  mqttClient.publish(topic, message, (err) => {
    if (err) {
      console.error("publish failed", err);
    }
    console.log(`TOPIC: ${topic} \nMESSAGE: ${message}`);
  });
}

//subscribe to topic
function subscribe(topic) {
  mqttClient.subscribe(topic, (err) => {
    if (err) {
      console.error("subscription failed", err);
    }
    console.log(`Subscribed to topic: ${topic}`);

    mqttClient.on("message", async function (t, m) {
      if (t === "toothfix/logging/newbooking") {
        try {
          console.log("new booking received");
          console.log(m.toString());
          var date = new Date();
          var obj = {
            eventType: "Booking made",
            eventDate:
              date.getDate() +
              "/" +
              parseInt(date.getMonth() + 1) +
              "/" +
              date.getFullYear(),
            responsibleService: "Booking service",
          };

          await Log.create(obj);
          console.log("201 log created" + JSON.stringify(obj));
        } catch (error) {
          console.log(error, "500");
        }
      }
    });
  });
}

module.exports = {
  publish,
  subscribe,
  mqttClient,
  mqtt,
};
