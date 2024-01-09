const { mqttClient, subscribe } = require("./utils/mqttController.js");
const { sendBookingConfirmation } = require("./utils/sendNotification.js");
const { updateSlot } = require("./utils/updateSlot.js");

const pendingTopic = "toothfix/booking/pending";

async function getMessages() {
  subscribe(pendingTopic, () => {
    mqttClient.on("message", async (topic, message) => {
      //sending a notification when a booking is made
      console.log("Received message from topic: ", topic);
      try {
        let strMessage = message.toString();
        let objMessage = JSON.parse(strMessage);
        console.log("JSON object from the booking:");
        console.log(objMessage.slotId);

        sendBookingConfirmation(objMessage.slotId);
        updateSlot(objMessage.slotId);
      } catch (error) {
        console.log(error, "500");
      }
    });
  });
}

module.exports = { getMessages };
