var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var client_info = require('../models/client_info');

const Client_info = client_info(Connection,Sequelize);

//client endpoint query
function findByClientId(client_id,done){

    //const client_id = clientMessage.client_id;
    //const client_secret = clientMessage.client_secret;

    Client_info.findOne({
        attributes: ['id','client_name','client_id','client_secret'],
        where:{
         client_id:client_id,
        // client_secret:client_secret
        }
    }).then(result=>{
        if(result!=null){
            return done(null,result.dataValues);
        }else{
            return done(new Error('Client Not Found'));
        };
    })



}


module.exports = {
    findByClientId:findByClientId,

}