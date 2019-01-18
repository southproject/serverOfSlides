
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

//Generic error handler
var errFn = function(cb, err){
    if(err){
        return cb(err);
    }
}

//Destroy any old tokens and generates a new access and refresh token
var generateTokens = function(data, done){

    var errorHandler = errFn.bind(undefined,done),
        //存入数据库中的refresh_Token,具有完整格式的
        refresh_Token,
        //利用加密工具生成的refresh_TokenValue值
        refresh_TokenValue,
        //存入数据库中的access_Token
        access_Token,
        //利用加密工具生成的access_TokenValue值
        access_TokenValue;

    //1.移除当前用户id所存在数据库中的AccessToken和RefreshToken

    RefreshToken.remove(data, errorHandler);
    AccessToken.remove(data, errorHandler);

    

    //2.用加密crypo生成新的tokenValue和RefreshToken
    tokenValue = crypto.randomBytes(32).toString('hex');
    refreshTokenValue = crypto.randomBytes(32).toString('hex');

    //3.将新生成的tokenValue和refreshTokenValue放入到data
    data.token = access_TokenValue;
    token = new Access_token(data);
    data.token = refreshTokenValue;
    refresh_Token = new Refresh_token(data);

    //4.做持久化存储
    refreshToken.save(errorHandler);
    token.save(function (err) {
        if (err) {
            log.error(err);
            return done(err);
        }
        done(null, tokenValue, refreshTokenValue, {
            'expires_in': config.get('tokenLifeTime')
        });
    });
};


//Exchange username & password for access token
aserver.exchange(
    oauth2orize.exchange.password(
        function(client, username, password, scope, done){
             //1.查找验证用户名
             User_table.findOne({
                attributes: ['user_id','user_name','passwd','email','phone_num'],
                where:{
                    user_name:username,
                    passwd:password
                }
        }).then(result=>{
            if(result.length==0)return done(null,false);
                var model = {
                    user_id:result.user_id,
                    client_id:client.client_id
                };
        generateTokens(model,done);
    })

}));

exports.token = [
    passport.authenticate(['basic','oauth2-client-password'],{session:false}),
    aserver.token(),
    aserver.errorHandler()
]