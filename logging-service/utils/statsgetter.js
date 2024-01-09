// get all the booking operations made
var Log = require("../models/log");
const mongoose = require("mongoose");

const password = encodeURIComponent("iloveteeth");
var mongoURI =
  process.env.MONGODB_URI ||
  `mongodb+srv://admin:${password}@cluster0.mm3fzdt.mongodb.net/?retryWrites=true&w=majority`;
var port = process.env.PORT || 3010;

async function getBookingOperations() {
  try {
    await mongoose.connect(mongoURI);

    const logs = await Log.countDocuments({
      eventType: "Booking made",
    }).maxTimeMS(50000);
    console.log(logs);
    mongoose.connection.close();
  } catch (error) {
    console.log(error, "500");
  }
}

async function getSlotOperations() {
  try {
    await mongoose.connect(mongoURI);

    const logs = await Log.countDocuments({
      eventType: "Slot created",
    }).maxTimeMS(50000);
    console.log(logs);
    mongoose.connection.close();
  } catch (error) {
    console.log(error, "500");
  }
}

async function getCancelledOperations() {
  try {
    await mongoose.connect(mongoURI);

    const logs = await Log.countDocuments({
      eventType: "Booking cancelled",
    }).maxTimeMS(50000);
    console.log(logs);
    mongoose.connection.close();
  } catch (error) {
    console.log(error, "500");
  }
}

module.exports = {
  getBookingOperations,
  getSlotOperations,
  getCancelledOperations,
};
