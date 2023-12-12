// slotService.js
var Slot = require('../models/slots');

async function getSlotById(slotId) {
    return await Slot.findById(slotId).lean().exec();
}

module.exports = {
    getSlotById
};
