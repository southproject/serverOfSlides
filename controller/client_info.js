var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var client_info = require('../models/client_info');

const Client_info = client_info(Connection,Sequelize);

//client endpoint query
function findByClientId(client_id,cb){

    Client_info.findOne({
        attributes: ['id','client_name','client_id','client_secret'],
        where:{
         client_id:client_id,
        // client_secret:client_secret
        }
    }).then(result=>{
        //console.log("-----------------result--------------------");
        //console.log(result.dataValues);
        if(result!=null)return cb(null,result.dataValues);
    })
}


module.exports = {
    findByClientId:findByClientId,

}