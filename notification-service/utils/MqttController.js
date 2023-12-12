const mqtt = require("mqtt");
const bodyParser = require("body-parser");
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: "OVH",
    host: "ssl0.ovh.net",
    port: 465,
    name: "toothfix.me",
    secure: true, 
    auth: {
      user: "noreply@toothfix.me",
      pass: "ToothFix123",
    },
    from: "noreply@toothfix.me"
  });

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
    if (t === "toothfix/notification/booking") {
      console.log("Received message from topic: ", t);
      //post to database
      try {
        console.log("posting");
        let strMessage = await m.toString(); //converts the message to a string
        let objMessage = JSON.parse(strMessage);  //converts the string to a JSON object
        console.log("JSON object from the booking:");
        console.log(objMessage);

        const notification = { //Make the notification object with the fields from the booking
          title : "Booking confirmation",
          body : `You've booked an appointment! You have a new booking on ${objMessage.date.substring(8,10)}/${objMessage.date.substring(5,7)}/${objMessage.date.substring(0,4)} (DD/MM/YYYY) at ${objMessage.date.substring(11, 16)} with ${objMessage.dentist}.`,
          recipientEmail : objMessage.patientEmail,      
        }

        const message = {
          from: "noreply@toothfix.me",
          to: objMessage.patientEmail,
          subject: "Booking confirmation",
          text: `You've booked an appointment! You have a new booking on ${objMessage.date.substring(8,10)}/${objMessage.date.substring(5,7)}/${objMessage.date.substring(0,4)} (DD/MM/YYYY) at ${objMessage.date.substring(11, 16)} with ${objMessage.dentist}.`,
          html: `<html><h1>You've booked an appointment!</h1><p>You have a new booking on ${objMessage.date.substring(8,10)}/${objMessage.date.substring(5,7)}/${objMessage.date.substring(0,4)} (DD/MM/YYYY) at ${objMessage.date.substring(11, 16)} with ${objMessage.dentist}.</p><h2><a href='https://toothfix.me'>ToothFix.me</a></h2></html>`
        };

        transporter.sendMail(message, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log(`Email sent to ${objMessage.patientEmail}!`);
          }
        });

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
