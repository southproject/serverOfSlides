var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var user = require('../models/user');

const User = user(Connection, Sequelize);


function UserQuery(req, res){
    var id = req.query.uid;
    User.findOne({
        where:{
            id:id
        }
    }).then(result=>{
        if(result==null){
            res.json({errorCode:'1',msg:'user no exist'});
        }else{
            res.json({errorCode:'0',msg:result})
        }
    })
}

module.exports = {
    UserQuery : UserQuery
}
