var express = require('express');
//var redis = require('redis');
var router = express.Router();
const mysqlConnection = require('../database/mysql-connection');
const redisConnection = require('../database/redis-connection');
const mongoConnection = require('../database/mongo-connection');

var log =  require('../log')(module);

var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
//system config params
var config = require('../config');

//Controller function
const User_tableC = require('../controller/user_table');
const Access_tokenC = require('../controller/access_token');


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
            //console.log("--------come in Math.round()---------");
            //console.log("token: ",token);
            var now = new Date();
            if(Math.round((now-token.created_time)/10000)>config.tokenLifeTime){
             
            //console.log("-----now-----");
            //console.log(now);

             //console.log("----token.created_time---");
             //console.log(Math.round((Date.now()-token.created_time)/1000));
             //console.log(token.created_time);
                
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


/**
 * @swagger
 * /api/queryUsers:
 *   get:
 *     tags:
 *       - user
 *     description: 用户查询id-by bing
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/queryUsers', passport.authenticate('bearer',{session:false}), User_tableC.queryUsers);

/**
* @swagger
* definitions:
*   userinfo:
*     properties:
*       user_name:
*         type: bing
*       passwd:
*         type: 123456
*       email:
*         type: 1542721301@qq.com
*       phone_num:
*         type: 13297920692
*/
/**
 * @swagger
 * /api/addUsers:
 *   post:
 *     tags:
 *       - user
 *     description: 用户注册-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: userinfo
 *        description: 用户信息
 *        in: body
 *        required: true
 *        schema: 
 *          $ref: '#/definitions/userinfo'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.post('/addUsers',passport.authenticate('bearer',{session:false}),User_tableC.addUsers);

/**
 * @swagger
 * /api/queryResultTest:
 *   get:
 *     tags:
 *       - user
 *     description: test resultinfo -by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: user_name
 *        description: user_name
 *        in: query
 *        required: true
 *        type: string
 *      - name: passwd
 *        description: passwd
 *        in: query
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/queryResultTest',User_tableC.queryResultTest);

/**
 * @swagger
 * /api/destoryFormatTest:
 *   delete:
 *     tags:
 *       - user
 *     description: 删除返回值测试
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user_id
 *         description: user_id
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.delete('/destoryFormatTest',User_tableC.destoryFormatTest);


/**
 * @swagger
 * /api/saveUserModel:
 *   get:
 *     tags:
 *       - user
 *     description: test save() function -by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: user_name
 *        description: user_name
 *        in: query
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/saveUserModel',User_tableC.saveUserModel);


module.exports = router;