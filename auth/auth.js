//Data Models
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var user_table = require('../models/user_table');
var access_token = require('../models/access_token');
var refresh_token = require('../models/refresh_token');
var client_info = require('../controller/client_info');


//Connections
//const User_table = user_table(Connection,Sequelize);
const Access_token = access_token(Connection,Sequelize);
const Refresh_token = refresh_token(Connection,Sequelize);
//const Client_info = client_info(Connection,Sequelize);

//Controller function
const User_table = require('../controller/user_table');
const Client_info = require('../controller/client_info');

//OAuth Strategy
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var LocalStrategy = require('passport-local').Strategy;

//1.Client Password - credentials in the request body
passport.use(new BasicStrategy(
    function (username, password, done) {
        //logs
        console.log("BasicStrategy");
        User_table.findByUsername(username, function(err, user){
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (user.passwd !== password){
                return done(null, false);
            }
            console.log("-------------user:------------------");
            console.log(user);
            return done(null, user);
        })  
    }
));

passport.use(new ClientPasswordStrategy(
    function (client_id, clientSecret, done){
        console.log("ClientPasswordStrategy");

        Client_info.findByClientId(client_id, function(err, client){
            if (err) {
                return done(err);
            }

            if (!client) {
                return done(null, false);
            }

            if (client.clientSecret !== clientSecret){
                return done(null, false);
            }
            console.log("-------------client------------------");
            console.log(client);
            return done(null, client);
        });
    }
));