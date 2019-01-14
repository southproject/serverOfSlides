const Sequelize = require('sequelize');
var config = require('../config')

const mysqlConnection = new Sequelize(
    config.mysql_conf.database,
    config.mysql_conf.username,
    config.mysql_conf.password,{
    host:config.mysql_conf.host,
    dialect:config.mysql_conf.dialect,
    pool:{max:5,min:0,idle:1000},
});

module.exports = mysqlConnection;