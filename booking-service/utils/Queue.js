const { EventEmitter } = require("events");
const Queue = require("bull");

const { mqttClient, publish } = require("../utils/MqttController");

// Create an event emitter instance
const eventEmitter = new EventEmitter();

//Online redis db
const redisConfig = {
  redis: {
    password: "qtN6Ok1gmRDmPe0UP5sFQCmNhJEg5JPv",
    host: "redis-15929.c250.eu-central-1-1.ec2.cloud.redislabs.com",
    port: 15929,
  },
};

//Create a new queue
const requestQueue = new Queue("requestQueue", redisConfig);

//MQTT listener for messages (all topics)
mqttClient.on("message", function (topic, message) {
  console.log("Emitted event from mqttClient");
  eventEmitter.emit("message", topic, message);
});

// Process jobs from the queue
requestQueue.process(100, async function (job) {
  console.log("Processing job:", job.data);
  let slotIdMessage = { slotId: job.data.slotId };

  let confirmationResult = await new Promise((resolve) => {
    publish("toothfix/booking/pending", JSON.stringify(slotIdMessage));

    eventEmitter.on("message", function (t, m) {
      if (t === "toothfix/booking/confirmation") {
        console.log("Received message from topic: ", t);
        console.log("Message: ", m.toString());
        const objConfirmation = JSON.parse(m.toString());
        console.log(objConfirmation);
        if (objConfirmation.available === true) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
  return confirmationResult;
});

// Event listener for failed jobs
requestQueue.on("failed", (job, err) => {
  console.error(`Job ID ${job.id} failed with error:`, err);
});

module.exports = {
  requestQueue,
};
