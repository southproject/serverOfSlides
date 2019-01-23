var config = require('../config');
var redis = require('redis'),
    redisConnection = redis.createClient(config.redis_conf.port,config.redis_conf.host);

module.exports = redisConnection;