var mongoose = require('mongoose');
var config = require('../config');

//mongoose connection
mongoose.connect(config.mongoose_conf.uri);

var mongoConnection = mongoose.connection;

module.exports = mongoConnection;