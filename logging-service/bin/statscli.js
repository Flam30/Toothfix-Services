#! /usr/bin/env node
// remember to do npm install -g
// run with stats <command>
const yargs = require("yargs");
const {
  getBookingOperations,
  getSlotOperations,
  getCancelledOperations,
} = require("../utils/statsgetter");
const { get } = require("mongoose");

if (yargs.argv._[0] == null) {
  console.log(
    "Welcome to the logging service. Here you can find stats about toothfix's services.",
  );
  console.log("Usage: stats <command>");
  console.log("Commands:");
  console.log("bookings - Get the number of booking operations that were made");
  console.log("slots - Get the number of slots that are currently available");
  console.log("cancelled - Get the number of bookings that were cancelled");
}

if (yargs.argv._[0] === "bookings") {
  console.log("Number of booking operations made: ");
  getBookingOperations();
}

if (yargs.argv._[0] === "slots") {
  console.log("Number of slots created: ");
  getSlotOperations();
}

if (yargs.argv._[0] === "cancelled") {
  console.log("Number of bookings cancelled: ");
  getCancelledOperations();
}

const options = yargs
  .usage("stats <command>")
  .command("bookings", "Get the number of booking operations that were made")
  .command("slots", "Get the number of slots that are currently available")
  .command("cancelled", "Get the number of bookings that were cancelled")
  .help(true).argv;

// const options = yargs
//       .usage(usage)
//       .option("l", {alias:"languages", describe: "List all supported languages.", type: "boolean", demandOption
// : false })
//       .help(true)
//       .argv;
