var express = require("express");
var mongoose = require("mongoose");
var morgan = require("morgan");
var path = require("path");
var cors = require("cors");

// Import routes
var bookingSchema = require("./controllers/bookings");
var clinicSchema = require("./controllers/clinics");
var dentistSchema = require("./controllers/dentists");

const { MongoClient } = require("mongodb");

const { subscribe } = require("./utils/MqttController");

var port = process.env.PORT || 3001;
const env = process.env.NODE_ENV || 'development'; // development as default
const config = require(`./configs/${env}` + '.js'); // import the config.js file based on the environment

mongoose.connect(config.mongoURI).catch(function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with given URI`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});

// Create Express app
var app = express();
// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan("dev"));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options("*", cors());
app.use(cors());

// Define routes
app.get("/", function (req, res) {
  res.json({ message: "Welcome to ToothFix API" });
});

//put the routes:
app.use("/bookings", bookingSchema);
app.use("/clinics", clinicSchema);
app.use("/dentists", dentistSchema);

//catch invalid routes
app.use("/*", function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

//subscribe to MQTT
subscribe("toothfix/booking/confirmation"); //subscribe to booking confirmation topic

// Error handler (i.e., when exception is thrown) must be registered last

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err.stack);
  var err_res = {
    message: err.message,
    error: {},
  };
  if (env === "development") {
    // Return sensitive stack trace only in dev mode
    err_res["error"] = err.stack;
  }
  res.status(err.status || 500);
  res.json(err_res);
});

app.listen(port, function (err) {
  if (err) throw err;
  console.log(`Booking service started`);
  console.log(`Booking service listening on port ${port}, in ${env} mode`);
  console.log(`http://localhost:${port}`);
});

module.exports = app;
