const mqtt = require("mqtt");

const port = "8080";
const url = `ws://13.51.167.96:${port}`;

const options = {
  connectTimeout: 4000,
};

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

function subscribe(topic) {
  mqttClient.subscribe(topic, (err) => {
    if (err) {
      console.error("subscription failed", err);
    }
    console.log(`Subscribed to topic: ${topic}`);
  });
}
  
// async function getConfirmation(slotId) {
//     mqttClient.on("message", async function (t, m) {
//         if (t === "toothfix/booking/confirmation") {
//           console.log("Received message from topic: ", t);
//           console.log("Message: ", m.toString());
//           var objConfirmation = JSON.parse(m.toString());
//           if(objConfirmation.slotID === slotId){
//             if(objConfirmation.approved === "true"){
//                 console.log("Booking approved");
//                 return true;
//             } else return false;
//         }
//       }
//     });
// }
  
module.exports = {
    publish,
    subscribe,
};
