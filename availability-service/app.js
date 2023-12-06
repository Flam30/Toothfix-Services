var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');


const { getMessages } = require('./confirmBooking.js');

// Import routes
var slotsSchema = require('./controllers/slots');

const { MongoClient } = require("mongodb");
const password = encodeURIComponent("iloveteeth");

var mongoURI = process.env.MONGODB_URI || `mongodb+srv://admin:${password}@tothfixclusteravailabil.aok1zm8.mongodb.net/?retryWrites=true&w=majority`
var port = process.env.PORT || 3002;

mongoose.connect(mongoURI).catch(function (err) {
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
app.use(morgan('dev'));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options('*', cors());
app.use(cors());


// Define routes
app.get('/', function (req, res) {
    res.json({ message: 'Welcome to ToothFix API' });
});

//put the routes:
app.use('/slots', slotsSchema);

//catch invalid routes
app.use('/*', function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

//getMessages
getMessages()


// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        'message': err.message,
        'error': {}
    };
    if (env === 'development') {
        // Return sensitive stack trace only in dev mode
        err_res['error'] = err.stack;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

app.listen(port, function (err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}`);
});

module.exports = app;