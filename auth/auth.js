//Data Models
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var user_table = require('../models/user_table');
var access_token = require('../models/access_token');
var refresh_token = require('../models/refresh_token');
var client_info = require('../controller/client_info');


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
var LocalStrategy = require('passport-local').Strategy;

//1.Client Password - credentials in the request body





/*
passport.use(new BasicStrategy(
    function (username, password, done) {
        //logs
        console.log("BasicStrategy");
        User_table.findOne({ user_name: username }, function (err, userinfo) {
            if (err) {
                return done(err);
            }

            if (!userinfo) {
                return done(null, false);
            }

            if (userinfo.passwd !== password) {
                return done(null, false);
            }

            return done(null, userinfo);
        });
    }
));
*/
/*
passport.use(new LocalStrategy(
    function (username, password, done) {
        //logs
        console.log("LocalStrategy");
        User_table.findByUsername(username, function(err, userinfo){
            if (err) {
                return done(err);
            }

            if (!userinfo) {
                return done(null, false);
            }

            if (userinfo.passwd !== password){
                return done(null, false);
            }

            return done(null, userinfo);
        })  
    }
));*/
/*
passport.use(new ClientPasswordStrategy(
    function (clientId, clientSecret, done){
        Client_info.findOne({
            attributes:['id','client_name','client_id','client_secret'],
            where:{
               clientId:clientId,
               clientSecret:clientSecret
            }
        }).then(result => {
            console.log('come in ClientPasswordStrategy');
            if(result.length!=0)
            return done(null,result.dataValues);
        });
    }
));


 /*
function verifyClient(id_info,passwdSecret,done){
    console.log('come in ClientPasswordStrategy');
    
    console.log('id_info: ',id_info);
    console.log('passwdSecret: ',passwdSecret);
   
    client_info.findByClientId(client_id,(error, client) => {
        if (error) return done(error);
        if (!client) return done(null, false);
        if (client.clientSecret !== clientSecret) return done(null, false);
        return done(null, client);
      });      
}
*/

/*
passport.use(new BasicStrategy(
    function (username, password, done) {
        //logs
        console.log("BasicStrategy");
        Client.findOne({ clientId: username }, function (err, client) {
            if (err) {
                return done(err);
            }

            if (!client) {
                return done(null, false);
            }

            if (client.clientSecret !== password) {
                return done(null, false);
            }

            return done(null, client);
        });
    }
));


passport.use(new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
        console.log("ClientPasswordStrategy");
        Client.findOne({ clientId: clientId }, function (err, client) {
            if (err) {
                return done(err);
            }

            if (!client) {
                return done(null, false);
            }

            if (client.clientSecret !== clientSecret) {
                return done(null, false);
            }

            return done(null, client);
        });
    }
));

// Bearer Token strategy
// https://tools.ietf.org/html/rfc6750

passport.use(new BearerStrategy(
    function (accessToken, done) {
        console.log("BearerStrategy");
        AccessToken.findOne({ token: accessToken }, function (err, token) {

            if (err) {
                return done(err);
            }

            if (!token) {
                return done(null, false);
            }

            if (Math.round((Date.now() - token.created) / 1000) > config.get('security:tokenLife')) {

                AccessToken.remove({ token: accessToken }, function (err) {
                    if (err) {
                        return done(err);
                    }
                });

                return done(null, false, { message: 'Token expired' });
            }

            User.findById(token.userId, function (err, user) {

                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, { message: 'Unknown user' });
                }

                var info = { scope: '*' };
                done(null, user, info);
            });
        });
        //console.log("accessToken: ",accessToken);
        //console.log("AccessToken: ",AccessToken);
    }
));
*/