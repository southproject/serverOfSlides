var mysql_conf = {
    "username":"root",
    "password":"root",
    "database":"sync",
    "host":"192.168.71.22",
    "dialect":"mysql"
}

var tokenLifeTime = 3600;

var redis_conf = {
    host:"192.168.71.22",
    port:'6379'
}

var mongoose_conf = {
    uri:"mongodb://192.168.71.22/apiDB"
}

var webSocketPort = 3001;

var host = '127.0.0.1';
var port = 3000;


module.exports = {
    mysql_conf,
    tokenLifeTime,
    redis_conf,
    mongoose_conf,
    webSocketPort,
    host,
    port
};