var Slot = require("../models/slots");

async function updateSlot(slotId) {
  const slot = await Slot.findById(slotId);
  if (slot.available) {
    slot.available = false;
  }
  slot.save();
}

module.exports = {
  updateSlot,
};
