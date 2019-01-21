var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var refresh_token = require('../models/refresh_token');
const Refresh_token = refresh_token(Connection,Sequelize);

//package function add callback function
function findByClientIdToken(token,clientId,cb){

    Refresh_token.findOne({
        attributes:['id','user_id','client_id','token','created_time'],
        where:{
            token:token
        }
    }).then(result=>{
        console.log("result: ",result.dataValues);
        if(result!=null)return cb(null,result.dataValues);
    })

}

//package remove function
function remove(data,cb){

    Refresh_token.destroy({
        where:{
            user_id:data.user_id,
            client_id:data.client_id
        }
    }).then(result=>{
        if(result==0)return cb(new Error('destroy failed'));  
    });
} 

//package save function
function save(data,cb){
    Refresh_token.create({
        user_id:data.user_id,
        client_id:data.client_id,
        token:data.token,
        create_time:Date.now
    }).then(result=>{
        //console.log(result);
      if(result==0){
          cb(new Error('save failed'));
      }
    });
}

module.exports={
    findByClientIdToken:findByClientIdToken,
    remove:remove,
    save:save
}