const mqtt = require("mqtt");
const bodyParser= require("body-parser");

//not sure about this we will see
var notificationSchema = require("../controllers/notifications");
var express = require("express");
var Notification = require("../models/notification");
var app = express();

app.use(bodyParser.json);

const port = "8080";
const url = `ws://13.51.167.96:${port}`;

const options = {
  connectTimeout: 4000,
};

//Connect
const mqttClient = mqtt.connect(url, options);

function connect() {
  mqttClient.on("connect", () => {
    console.log("mqtt client connected");
  });
}

//publish message
function publish(topic, message) {
  mqttClient.publish(topic, message, (err) => {
    if (err) {
      console.error("publish failed", err);
    }
  });
}

//subscribe to topic
function subscribe(topic) {
  mqttClient.subscribe(topic, (err) => {
    if (err) {
      console.error("subscription failed", err);
    }
    console.log(`Subscribed to topic: ${topic}`);
  });

  mqttClient.on("message", function (t, m) {
    //sending a notification when a booking is made
    console.log('yyyyy')
    if (t === "toothfix/booking") {
      console.log("Received message from topic: ", t);
      //post to database
          console.log("posting")
          let strMessage = m.toString();
          let objMessage = JSON.parse(strMessage);
          console.log(objMessage);
          const notification = Notification.create(objMessage);
          res.status(201).json(notification);
    }
});
}

module.exports = {
  publish,
  subscribe,
  connect,
};
