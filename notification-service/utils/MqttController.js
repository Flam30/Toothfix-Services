const mqtt = require("mqtt");
const bodyParser = require("body-parser");

//not sure about this we will see
var express = require("express");
var router = express.Router();
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

  mqttClient.on("message", async function (t, m) {
    //sending a notification when a booking is made
    console.log("yyyyy");
    if (t === "toothfix/booking") {
      console.log("Received message from topic: ", t);
      //post to database

      try {
        console.log("posting");
        let strMessage = await m.toString();
        let objMessage = JSON.parse(strMessage);
        console.log("JSON object from the booking:");
        console.log(objMessage);

        const notification = await Notification.create(objMessage); 
        console.log("Created notification that should be posted:");
        console.log(notification);
        console.log('201')

        //TODO: change the notification request to have the required fields
      } catch (error) {
        console.log(error, '500')
      }
    
    }
  });
}

module.exports = {
  publish,
  subscribe,
  connect,
};
