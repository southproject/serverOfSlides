//OAuth2.0
var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');

//Data Models
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var user_table = require('../models/user_table');
var access_token = require('../models/access_token');
var refresh_token = require('../models/refresh_token');

//system config params
var config = require('../config')

//Connections
//const User_table = user_table(Connection,Sequelize);
const Access_tokenModel = access_token(Connection,Sequelize);
const Refresh_tokenModel = refresh_token(Connection,Sequelize);

//controller's package function
const User_tableC = require('../controller/user_table');
const Client_infoC = require('../controller/client_info');
const Refresh_tokenC = require('../controller/refresh_token');
const Access_tokenC = require('../controller/access_token');
//Create OAuth 2.0 Server
var aserver = oauth2orize.createServer();
console.log('---come in oauth2---');

//Generic error handler
var errFn = function(cb, err){
    if(err){
        return cb(err);
    }
}

//Destroy any old tokens and generates a new access and refresh token
/*
var data = {
    user_id:result.user_id,
    client_id:client.client_id
};
*/

//Strategy

//var User_table = require('../controller/user_table');

var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
passport.use(new BasicStrategy(
    function (username, password, done) {
        //logs
        console.log("BasicStrategy");
        User_tableC.findByUsername(username, function(err, user){
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
    function (client_id, client_secret, done){
        console.log("ClientPasswordStrategy");

        Client_infoC.findByClientId(client_id, function(err, client){
            if (err) {
                return done(err);
            }

            if (!client) {
                return done(null, false);
            }

            if (client.client_secret !== client_secret){
                return done(null, false);
            }
            console.log("-------------client------------------");
            console.log(client);
            return done(null, client);
        });
    }
));




var generateTokens = function(data, done){

    var errorHandler = errFn.bind(undefined,done),
        //存入数据库中的refresh_Token,具有完整格式的
        refresh_TokenModel ,
        //利用加密工具生成的refresh_TokenValue值
        refresh_TokenValue,
        //存入数据库中的access_Token
        access_TokenModel,
        //利用加密工具生成的access_TokenValue值
        access_TokenValue;

    //1.移除当前用户id所存在数据库中的AccessToken和RefreshToken
    //利用controller层中的remove封装方法
    Access_tokenC.remove(data,errorHandler);
    Refresh_tokenC.remove(data,errorHandler);
    
    //2.用加密crypo生成新的tokenValue和RefreshToken
    access_TokenValue = crypto.randomBytes(32).toString('hex');
    refresh_TokenValue = crypto.randomBytes(32).toString('hex');

    //3.将新生成的tokenValue和refreshTokenValue放入到data
    //3.1扩展原有data中的字面量选项.

    //data.token = access_TokenValue;
    //access_TokenModel = new Access_tokenModel(data);
    access_TokenModel = {
        user_id:data.user_id,
        client_id:data.client_id,
        token:access_TokenValue,
    };

    

    //refresh_TokenModel = data;
    refresh_TokenModel = {
        user_id:data.user_id,
        client_id:data.client_id,
        token:refresh_TokenValue
    };
    //refresh_TokenModel = new refresh_token(data);
    //refresh_TokenModel = data;
    
    //check access_TokenModel && refresh_TokenModel
    //console.log("access_TokenModel",access_TokenModel);
    //console.log("refresh_TokenModel",refresh_TokenModel);

    //4.做持久化存储
    Refresh_tokenC.save(refresh_TokenModel,errorHandler);
    //Refresh_tokenModel.save(refresh_TokenModel,errorHandler);
    //4.2.access_TokenModel的持久化存储
    
    Access_tokenC.save(access_TokenModel,function (err) {
        if (err) {
            log.error(err);
            return done(err);
        }
        console.log("-------come in done function------");
        done(null, access_TokenModel, refresh_TokenModel, {
            'expires_in': config.tokenLifeTime
        });
    });
    
   /*
   Access_tokenC.save(access_TokenModel,refresh_TokenModel,done);
    */
  /* 
   Access_tokenModel.create({
       user_id:access_TokenModel.user_id,
       client_id:access_TokenModel.client_id,
       token:access_TokenModel.token,
       create_time:Date.now
   }).then(result=>{
        //console.log("time: ",Date.now);
      if(result!=0){
        console.log("----done-----");
        done(null, access_TokenModel, refresh_TokenModel, {
          'expires_in': config.tokenLifeTime
      });
      }
   });
   */
};

//Exchange username & password for access token
aserver.exchange(
    oauth2orize.exchange.password( 
        function(client, username, password, scope, done){
            console.log("come in exchange password");
            console.log(client);
             //1.查找验证用户名
            User_tableC.findByUsername(username, function(err, user){

                if (err) {
                    return done(err);
                }
                if (!user||user.passwd !== password){
                    return done(null, false);
                }
    
                var model = {
                    user_id:user.user_id,
                    client_id:client.client_id
                };
                generateTokens(model,done);

            }); 
}));

//Exchange refreshToken for access token
aserver.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done){

    Refresh_tokenC.findByClientIdToken({token:refreshToken,client_id:client.client_id}, function(err,token){
        if (err) {
            return done(err);
        }

        if (!token) {
            return done(null,false);
        }

        User_tableC.findByUserId(token.user_id,function(err,user){
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null,false);
            }
            var model = {
                user_id:user.user_id,
                client_id:client.client_id
            };
            generateTokens(model,done);
        });

    });
}));

exports.token = [
    passport.authenticate(['basic','oauth2-client-password'],{session:false}),
    aserver.token(),
    aserver.errorHandler()
]