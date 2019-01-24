var mysql_conf = {
    "username":"root",
    "password":"",
    "database":"sync",
    "host":"127.0.0.1",
    "dialect":"mysql"
}

var tokenLifeTime = 3600;

var redis_conf = {
    host:'127.0.0.1',
    port:'6379'
}

var mongoose_conf = {
    uri:"mongodb://localhost/test"
}

module.exports = {
    mysql_conf,
    tokenLifeTime,
    redis_conf,
    mongoose_conf
};