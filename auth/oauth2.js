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
const User_table = user_table(Connection,Sequelize);
const Access_token = access_token(Connection,Sequelize);
const Refresh_token = refresh_token(Connection,Sequelize);

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

var generateTokens = function(data, done){

    var errorHandler = errFn.bind(undefined,done),
        //存入数据库中的refresh_Token,具有完整格式的
        refresh_TokenModel,
        //利用加密工具生成的refresh_TokenValue值
        refresh_TokenValue,
        //存入数据库中的access_Token
        access_TokenModel,
        //利用加密工具生成的access_TokenValue值
        access_TokenValue;

    //1.移除当前用户id所存在数据库中的AccessToken和RefreshToken
    //删除Access_token中的Token
    Access_token.destroy({
        where:{
            user_id:data.user_id,
            client_id:data.client_id
        }
    }).the(result=>{
        console.log('Access_token.destroy()--result',result);
    })
    //删除RefreshToken中的Token
    Refresh_token.destroy({
        where:{
            user_id:data.user_id,
            client_id:data.client_id
        }
    }).then(result=>{
        console.log('Refresh_token.destroy()--result',result);
    })
    
    //2.用加密crypo生成新的tokenValue和RefreshToken
    access_TokenValue = crypto.randomBytes(32).toString('hex');
    refresh_TokenValue = crypto.randomBytes(32).toString('hex');

    //3.将新生成的tokenValue和refreshTokenValue放入到data
    //3.1扩展原有data中的字面量选项.

    data.token = access_TokenValue;
    access_TokenModel = new Access_token(data);

    data.token = refresh_TokenValue;
    refresh_TokenModel = new Refresh_token(data);
    
    //check access_TokenModel && refresh_TokenModel
    console.log("access_TokenModel",access_TokenModel);
    console.log("refresh_TokenModel",refresh_TokenModel);

    //4.做持久化存储
    //4.1.refreshTokenModel的持久化存储
    /*
    Refresh_token.create({
        user_id:refresh_TokenModel.user_id,
        client_id:refresh_TokenModel.client_id,
        token:refresh_TokenModel.token,
        created_time:Date.now()
    }).then(result=>{
        console.log("access_TokenModel--result",result);
    })
    */
   refresh_TokenModel.save(errorHandler);

    //4.2.access_TokenModel的持久化存储
    access_TokenModel.save(function (err) {
        if (err) {
            log.error(err);
            return done(err);
        }
        done(null, access_TokenValue, refresh_TokenValue, {
            'expires_in': config.get('tokenLifeTime')
        });
    });
};

//Exchange username & password for access token
aserver.exchange(
    oauth2orize.exchange.password(
        
        function(client, username, password, scope, done){
            console.log("come in exchange password");
             //1.查找验证用户名
             User_table.findOne({
                attributes: ['user_id','user_name','passwd'],
                where:{
                    user_name:username,
                    passwd:password
                }
        }).then(result=>{
            if(result==null)return done(null,false);
            var model = {
                user_id:result.user_id,
                client_id:client.client_id
            };
            generateTokens(model,done);
    })
}));

exports.token = [
    //passport.authenticate(['basic','oauth2-client-password'],{session:false}),
    aserver.token(),
    aserver.errorHandler()
]