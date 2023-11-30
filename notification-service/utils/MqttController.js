const mqtt = require("mqtt");
const bodyParser = require("body-parser");

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

  mqttClient.on("message", async function (t, m) {
    //sending a notification when a booking is made
    if (t === "toothfix/booking") {
      console.log("Received message from topic: ", t);
      //post to database
      try {
        console.log("posting");
        let strMessage = await m.toString(); //converts the message to a string
        let objMessage = JSON.parse(strMessage);  //converts the string to a JSON object
        console.log("JSON object from the booking:");
        console.log(objMessage);

        const notification = { //Make the norification object with the fields from the booking
          title : "Booking confirmation",
          body : "You have a new booking on " + objMessage.date.substring(8,10) + "/" + objMessage.date.substring(5,7) + "/" 
          + objMessage.date.substring(0,4) + " (DD/MM/YY)"  + " at " + objMessage.start + " with " + objMessage.dentist + ".",
          recipientEmail : objMessage.patientEmail,      
        }

        await Notification.create(notification); //post notification to the database
        console.log("Created notification that should be posted:");
        console.log(notification);
        console.log('201')
        
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
