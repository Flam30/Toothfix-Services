const password = require('./password.js');

module.exports = {
    mongoURI: `mongodb+srv://admin:${password.password}@toothfixcluster0.ouccgbu.mongodb.net/?retryWrites=true&w=majority`
};

