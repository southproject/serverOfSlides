var mysql_conf = {
    "username":"root",
    "password":"root",
    "database":"sync",
    "host":"192.168.99.100",
    "dialect":"mysql"
}

var tokenLifeTime = 3600;

var redis_conf = {
    host:'192.168.99.100',
    port:'6379'
}

var mongoose_conf = {
    uri:"mongodb://192.168.99.100/apiDB"
}

module.exports = {
    mysql_conf,
    tokenLifeTime,
    redis_conf,
    mongoose_conf
};