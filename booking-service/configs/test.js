const password = require("./password");

module.exports = {
  mongoURI: `mongodb+srv://admin:${password.password}@toothfixtesting.nngojs1.mongodb.net/?retryWrites=true&w=majority`,
};
