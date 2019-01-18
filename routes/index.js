//express基础路由服务
var express = require('express');
var router = express.Router();

//database连接变量
var Connection = require('../database/mysql-connection');
const Sequelize = require('sequelize');

//身份认证
var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

//var OAuthStrategy = require('passport-oauth').OAuthStrategy;


//数据模型和操作变量
var user_table = require('../models/user_table');
const User_table = user_table(Connection,Sequelize);

/*
//通行令牌认证
passport.use('provider',new OAuthStrategy({
  function (params) {
    
  }

}))
*/



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
