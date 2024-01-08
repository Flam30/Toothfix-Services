// notificationService.js
const { publish } = require("./mqttController");
const { getSlotById } = require("./findSlot");

async function sendBookingConfirmation(slotId) {
  try {
    let slot = await getSlotById(slotId);

    let confirmation = {
      slotId: slot._id,
      available: slot.available,
    };
    publish("toothfix/booking/confirmation", JSON.stringify(confirmation));
  } catch (error) {
    console.log(error, "500");
  }
}

module.exports = {
  sendBookingConfirmation,
};
