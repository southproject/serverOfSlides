var mysql_conf = {
    "username":"root",
    "password":"root",
    "database":"sync",
    "host":"127.0.0.1",
    "dialect":"mysql"
}

var tokenLifeTime = 3600;


module.exports = {
    mysql_conf,
    tokenLifeTime
};