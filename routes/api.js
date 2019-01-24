var express = require('express');
var redis = require('redis');
var log =  require('../log')(module);
var router = express.Router();


const mysqlConnection = require('../database/mysql-connection');
// const redisConnection = require('../database/redis-connection');
const mongoConnection = require('../database/mongo-connection');



var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
//system config params
var config = require('../config');

//---MySQL：Controller function---models
const User_tableC = require('../controller/user_table');
const Access_tokenC = require('../controller/access_token');

//---MongoDB: Controllers function----model
const CourseC = require('../controllers/course');

//BearerStrategy adjust for Sequelize to MySQL
passport.use(new BearerStrategy(
    function(access_token,done){
       
       Access_tokenC.findOneByToken(access_token, function(err,token){
            if (err) {
                return done(null,false,{message:'no tokenRecord'});
            }

            if (!token) {
                return done(null, false);
            }
            var now = new Date();
            if(Math.round((now-token.created_time)/10000)>config.tokenLifeTime){
                
               Access_tokenC.remove(access_token,function(err){
                    if(err){
                        //product system 
                        return done(null,false,{message:'no tokenRecord'});
                    }
                });
                return done(null, false, {message:'Token expired'});
            }

             User_tableC.findByUserId(token.user_id, function(err, user){
                if(err){
                    return done(err);
                }

                if(!user){
                    return done(null, false, {message:'Unknown user'});
                }

                var info = {scope:'*'};
             done(null, user, info);
            })

        });
    }
));

//logs for MySQLConnection
mysqlConnection
.authenticate()
.then(()=>{
    console.log('mysqlConnection Connected Successfully.');
})
.catch(err=>{
    console.error('Unable to connect to the mysqlConnection',err);
});
/*
//logs for redisConnection
redisConnection.on("error",function(err){
    console.log("Error: "+err);
});
redisConnection.set("string key","string val", redis.print);
*/
//logs for mongooseConnection
mongoConnection.on('error',function(err){
    log.error('Connection error: ', err.message);
});
mongoConnection.once('open', function callback(){
    log.info('Connected to DB! ');
});


router.get('/', passport.authenticate('bearer',{session:false}), function(req,res){
    res.json({
        msg:'RESTful API is runing'
    });
});


router.get('/queryUsers', passport.authenticate('bearer',{session:false}), User_tableC.queryUsers);
router.post('/addUsers',passport.authenticate('bearer',{session:false}),User_tableC.addUsers);
router.get('/queryResultTest',User_tableC.queryResultTest);
router.delete('/destoryFormatTest',User_tableC.destoryFormatTest);
router.get('/saveUserModel',User_tableC.saveUserModel);

//MongoDB controller Function
router.post('/createCourse',CourseC.createCourse);
router.delete('/deleteCourse',CourseC.deleteCourse);
router.put('/updateCourse',CourseC.updateCourse);
router.get('/researchCourse',CourseC.researchCourse);
module.exports = router;