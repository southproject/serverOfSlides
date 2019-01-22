var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var access_token = require('../models/access_token');
const Access_token = access_token(Connection,Sequelize);
//system config params
var config = require('../config')


//package remove function
function remove(data,cb){

    Access_token.destroy({
        where:{
            user_id:data.user_id,
            client_id:data.client_id
        }
    }).then(result=>{
        if(result==0)return cb(new Error('destroy failed'));  
        return cb(null);
    });
} 

//package save function

function save(data,cb){
    Access_token.create({
        user_id:data.user_id,
        client_id:data.client_id,
        token:data.token
        //create_time:Date.now()
    }).then(result=>{
        //console.log("--------Date.now()------");
        //console.log(Date.now());
        //console.log("--------var now = new Date()------");
        //var now = new Date();
        //console.log(now);
      if(result==0){
         return cb(new Error('save failed'));
      }
      return cb(null);
      //return ;
    });
}

/*
function save(access_TokenModel,refresh_TokenModel,done){
    Access_token.create({
        user_id:data.user_id,
        client_id:data.client_id,
        token:data.token,
        create_time:Date.now
    }).then(result=>{
        //console.log(result);
      if(result!=0){
           console.log("----done-----");
          done(null, access_TokenModel, refresh_TokenModel, {
            'expires_in': config.tokenLifeTime
        });
      }
    });
}
*/

//package findOne callback function
function findOneByToken(access_token, cb){
    Access_token.findOne({
        attributes:['user_id','client_id','token','created_time'],
        where:{
            token:access_token
        }
    }).then(result=>{
        if(result!=null){return cb(null,result.dataValues);}
        return cb(new Error('no tokenRecord'));
    });
}



module.exports = {
    remove:remove,
    save:save,
    findOneByToken:findOneByToken
}