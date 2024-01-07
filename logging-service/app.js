var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cors = require('cors');

// Connect to MongoDB
const password = encodeURIComponent("iloveteeth");
var mongoURI = process.env.MONGODB_URI || `mongodb+srv://admin:${password}@cluster0.mm3fzdt.mongodb.net/?retryWrites=true&w=majority`
var port = process.env.PORT || 3004;

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

//catch invalid routes
app.use('/*', function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

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
    console.log(`Logging service started`);
    console.log(`Logging service listening on port ${port}, in ${env} mode`);
    console.log(`http://localhost:${port}`);
});

module.exports = app;
