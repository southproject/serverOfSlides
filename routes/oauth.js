var express = require('express');
var oauth2 = require('../auth/oauth2');
var passport = require('passport');
var user_table = require('../models/user_table');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var router = express.Router();

//const User_table = user_table(Connection,Sequelize);

//Strategy
/*
var User_table = require('../controller/user_table');
const Client_info = require('../controller/client_info');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
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
*/


router.post('/token',
    //passport.authenticate(['basic','oauth2-client-password'],{session:false}),
    //passport.authenticate('basic',{session:false}),
    
    //res.send(JSON.stringify("---router---oauth---token---"))}
    /*
    function(req,res){
        //res.json("---router---oauth---token---");
        console.log(req);
       //res.json({ user_id: req.user.user_id, username: req.user.user_name, email: req.user.email });
       //res.json({ username: req.userinfo.user_name, email: req.userinfo.email });
    }  
    */
    oauth2.token
);
   

module.exports = router;