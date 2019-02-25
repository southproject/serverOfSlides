var express = require('express');
var redis = require('redis');
var log =  require('../log')(module);
var router = express.Router();


const mysqlConnection = require('../database/mysql-connection');
const redisConnection = require('../database/redis-connection');
const mongoConnection = require('../database/mongo-connection');

var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
//system config params
var config = require('../config');

//---MySQL：Controller function---models
const User_tableC = require('../controller/user_table');
const User_project_relC = require('../controller/user_project_rel');
const Access_tokenC = require('../controller/access_token');

const WebSocketServer = require('../servers/websocketServer');

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

//logs for redisConnection
redisConnection.on("error",function(err){
    console.log("Error: "+err);
});
//redisConnection.set("string key","string val", redis.print);
redisConnection.flushall(function (err, reply) {
    if(reply!=null){
        console.log("flushall: ",reply);
    }else{
        console.log("flushall: ",err);
    }
});
redisConnection.set("key", 2422350, redis.print);




//logs for mongooseConnection
mongoConnection.on('error',function(err){
    log.error('Connection error: ', err.message);
});
mongoConnection.once('open', function callback(){
    log.info('Connected to MongoDB! ');
});


router.get('/', passport.authenticate('bearer',{session:false}), function(req,res){
    res.json({
        msg:'RESTful API is runing'
    });
});

/**
 * API for test
 *  */
router.get('/queryUsers', passport.authenticate('bearer',{session:false}), User_tableC.queryUsers);
router.post('/addUsers',passport.authenticate('bearer',{session:false}),User_tableC.addUsers);
router.get('/queryResultTest',User_tableC.queryResultTest);
router.delete('/destoryFormatTest',User_tableC.destoryFormatTest);
router.get('/saveUserModel',User_tableC.saveUserModel);

/**
 * API for Slides
 */
router.post('/register',User_tableC.register);
router.get('/queryUserinfo',passport.authenticate('bearer',{session:false}),User_tableC.queryUserinfo);
router.put('/updateInfo',passport.authenticate('bearer',{session:false}),User_tableC.updateInfo);
router.get('/getPersonalInfo',passport.authenticate('bearer',{session:false}),User_tableC.getPersonalInfo);
router.put('/updatePersonalInfo',passport.authenticate('bearer',{session:false}),User_tableC.updatePersonalInfo);
router.post('/joinProjectRelationShip',passport.authenticate('bearer',{session:false}),User_project_relC.joinProjectRelationShip);
router.get('/getProjectUsersList',passport.authenticate('bearer',{session:false}),User_project_relC.getProjectUsersList);

//Tools for generate TinyCode
router.get('/generateTinyCode',passport.authenticate('bearer',{session:false}),User_project_relC.generateTinyCode);
router.get('/getReflectProject_id',passport.authenticate('bearer',{session:false}),User_project_relC.getReflectProject_id);

//MongoDB controller Function
router.post('/createCourse',passport.authenticate('bearer',{session:false}),CourseC.createCourse);
router.delete('/deleteCourse',passport.authenticate('bearer',{session:false}),CourseC.deleteCourse);
router.put('/updateCourse',passport.authenticate('bearer',{session:false}),CourseC.updateCourse);
router.get('/researchByCourseId',passport.authenticate('bearer',{session:false}),CourseC.researchByCourseId);
router.get('/researchByCourseName',passport.authenticate('bearer',{session:false}),CourseC.researchByCourseName);
router.get('/researchByUserId',passport.authenticate('bearer',{session:false}),CourseC.researchByUserId);
router.get('/downloadCourse',passport.authenticate('bearer',{session:false}),CourseC.downloadCourse);

//createWebSocketServer
router.post('/createWebSocketServer',passport.authenticate('bearer',{session:false}),WebSocketServer.createWebSocketServer);
//router.get('/getUserinNSP',WebSocketServer.getUserinNSP);

module.exports = router;