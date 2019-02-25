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

module.exports = {
    mysql_conf,
    tokenLifeTime,
    redis_conf,
    mongoose_conf,
    webSocketPort
};