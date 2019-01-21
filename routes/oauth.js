var express = require('express');
var oauth2 = require('../auth/oauth2');
var passport = require('passport');
var user_table = require('../models/user_table');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');


//const User_table = user_table(Connection,Sequelize);
var User_table = require('../controller/user_table');

var BasicStrategy = require('passport-http').BasicStrategy;

var router = express.Router();

passport.use(new BasicStrategy(
    function (username, password, done) {
        //logs
        console.log("BasicStrategy");
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
));

router.post('/token',
    //passport.authenticate(['basic','oauth2-client-password'],{session:false}),
    passport.authenticate('basic',{session:false}),
    
    //res.send(JSON.stringify("---router---oauth---token---"))}
    function(req,res){
        res.json("---router---oauth---token---");
        console.log("req: ",req.userinfo);
    }  
);
   

module.exports = router;