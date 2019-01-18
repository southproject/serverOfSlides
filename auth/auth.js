//Data Models
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var user_table = require('../models/user_table');
var access_token = require('../models/access_token');
var refresh_token = require('../models/refresh_token');
var client_info = require('../models/client_info');

//Connections
const User_table = user_table(Connection,Sequelize);
const Access_token = access_token(Connection,Sequelize);
const Refresh_token = refresh_token(Connection,Sequelize);
const Client_info = client_info(Connection,Sequelize);

//OAuth Strategy
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

//1.Client Password - credentials in the request body
/*
passport.use(new ClientPasswordStrategy(
    function (clientId, clientSecret, done){
        Client_info.findOne({
            where:{
               clientId:clientId,
               clientSecret:clientSecret
            }
        }).then(result => {
            if(result.length!=0)
            return done(null,false);
        });
    }
))
*/