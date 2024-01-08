const mqtt = require("mqtt");
const bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
const Handlebars = require("handlebars");
const fs = require("fs");

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
  from: "noreply@toothfix.me",
});

const bookingTemplateImport = fs.readFileSync(
  "./templates/booking.html",
  "utf8",
);
const bookingTemplate = Handlebars.compile(bookingTemplateImport);

const cancellationTemplateImport = fs.readFileSync(
  "./templates/cancellation.html",
  "utf8",
);
const cancellationTemplate = Handlebars.compile(cancellationTemplateImport);

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

//subscribe to bookings
function subscribeBookings() {
  mqttClient.subscribe("toothfix/notifications/booking", (err) => {
    if (err) {
      console.error("subscription failed", err);
    }
    console.log(`Subscribed to topic: toothfix/notifications/booking`);
  });

  mqttClient.on("message", async function (t, m) {
    //sending a notification when a booking is made
    if (t === "toothfix/notifications/booking") {
      console.log("Received message from topic: ", t);
      //post to database
      try {
        let strMessage = await m.toString(); //converts the message to a string
        let objMessage = JSON.parse(strMessage); //converts the string to a JSON object
        console.log(objMessage);

        const notification = {
          //Make the notification object with the fields from the booking
          title: "Booking confirmation",
          body: `You've booked an appointment! You have a new booking on ${objMessage.date.substring(
            8,
            10,
          )}/${objMessage.date.substring(5, 7)}/${objMessage.date.substring(
            0,
            4,
          )} (DD/MM/YYYY) at ${objMessage.date.substring(11, 16)} with ${
            objMessage.dentist
          }.`,
          recipientEmail: objMessage.patientEmail,
        };

        const message = {
          from: "noreply@toothfix.me",
          to: objMessage.patientEmail,
          subject: notification.title,
          text: notification.body,
          html: bookingTemplate({
            date:
              objMessage.date.substring(8, 10) +
              "/" +
              objMessage.date.substring(5, 7) +
              "/" +
              objMessage.date.substring(0, 4),
            time: objMessage.date.substring(11, 16),
            dentist: objMessage.dentist,
          }),
          attachments: [
            {
              filename: "toothfix.png",
              path: "./templates/images/toothfix.png",
              cid: "toothfix",
            },
            {
              filename: "bell.png",
              path: "./templates/images/bell-icon.png",
              cid: "bell",
            },
            {
              filename: "facebook.png",
              path: "./templates/images/facebook.png",
              cid: "facebook",
            },
            {
              filename: "twitter.png",
              path: "./templates/images/twitter.png",
              cid: "twitter",
            },
            {
              filename: "instagram.png",
              path: "./templates/images/instagram.png",
              cid: "instagram",
            },
          ],
        };

        transporter.sendMail(message, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log(`Email sent to ${objMessage.patientEmail}!`);
          }
        });

        await Notification.create(notification); //post notification to the database
      } catch (error) {
        console.log(error, "500");
      }
    }
  });
}

//subscribe to cancellations
function subscribeCancellations() {
  mqttClient.subscribe("toothfix/notifications/cancellation", (err) => {
    if (err) {
      console.error("subscription failed", err);
    }
    console.log(`Subscribed to topic: toothfix/notifications/cancellation`);
  });

  mqttClient.on("message", async function (t, m) {
    //sending a notification when a booking is made
    if (t === "toothfix/notifications/cancellation") {
      console.log("Received message from topic: ", t);
      //post to database
      try {
        let strMessage = await m.toString(); //converts the message to a string
        let objMessage = JSON.parse(strMessage); //converts the string to a JSON object
        console.log(objMessage);

        const notification = {
          //Make the notification object with the fields from the booking
          title: "Booking cancelled",
          body: `Your ToothFix appointment on ${objMessage.date.substring(
            8,
            10,
          )}/${objMessage.date.substring(5, 7)}/${objMessage.date.substring(
            0,
            4,
          )} at ${objMessage.date.substring(11, 16)} with ${
            objMessage.dentist
          } has been cancelled.`,
          recipientEmail: objMessage.patientEmail,
        };

        const message = {
          from: "noreply@toothfix.me",
          to: objMessage.patientEmail,
          subject: notification.title,
          text: notification.body,
          html: cancellationTemplate({
            date:
              objMessage.date.substring(8, 10) +
              "/" +
              objMessage.date.substring(5, 7) +
              "/" +
              objMessage.date.substring(0, 4),
            time: objMessage.date.substring(11, 16),
            dentist: objMessage.dentist,
          }),
          attachments: [
            {
              filename: "toothfix.png",
              path: "./templates/images/toothfix.png",
              cid: "toothfix",
            },
            {
              filename: "bell.png",
              path: "./templates/images/bell-icon.png",
              cid: "bell",
            },
            {
              filename: "facebook.png",
              path: "./templates/images/facebook.png",
              cid: "facebook",
            },
            {
              filename: "twitter.png",
              path: "./templates/images/twitter.png",
              cid: "twitter",
            },
            {
              filename: "instagram.png",
              path: "./templates/images/instagram.png",
              cid: "instagram",
            },
          ],
        };

        transporter.sendMail(message, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log(`Email sent to ${objMessage.patientEmail}!`);
          }
        });

        await Notification.create(notification); //post notification to the database
      } catch (error) {
        console.log(error, "500");
      }
    }
  });
}

//subscribe to availability - will be changed later depending on how we implement this
function subscribeAvailability() {
  mqttClient.subscribe("toothfix/notifications/availability", (err) => {
    if (err) {
      console.error("subscription failed", err);
    }
    console.log(`Subscribed to topic: toothfix/notifications/availability`);
  });

  mqttClient.on("message", async function (t, m) {
    //sending a notification when a booking is made
    if (t === "toothfix/notifications/availability") {
      console.log("Received message from topic: ", t);
      //post to database
      try {
        let strMessage = await m.toString(); //converts the message to a string
        let objMessage = JSON.parse(strMessage); //converts the string to a JSON object
        console.log(objMessage);

        const notification = {
          //Make the notification object with the fields from the booking
          title: "New booking slots available",
          body: `${objMessage.dentist} has published their new available slots. Book your ToothFix appointment now!`,
          recipientEmail: objMessage.patientEmail,
        };

        const message = {
          from: "noreply@toothfix.me",
          to: objMessage.patientEmail,
          subject: notification.title,
          text: notification.body,
          html: `<html><h2>New slots available!</h2><p>${objMessage.dentist} has published their new available slots. Book your ToothFix appointment now!</p><h3><a href='https://toothfix.me'>ToothFix.me</a></h3></html>`,
        };

        transporter.sendMail(message, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log(`Email sent to ${objMessage.patientEmail}!`);
          }
        });

        await Notification.create(notification); //post notification to the database
      } catch (error) {
        console.log(error, "500");
      }
    }
  });
}

module.exports = {
  publish,
  subscribeBookings,
  subscribeCancellations,
  subscribeAvailability,
  connect,
};
