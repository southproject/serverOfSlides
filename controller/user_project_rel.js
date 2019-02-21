var Sequelize = require('sequelize');
var Connection = require('../database/mysql-connection');

var user_project_rel = require('../models/user_project_rel');

const User_project_rel = user_project_rel(Connection,Sequelize);

//add project and user relationship:join project api
function joinProjectRelationShip(req, res){
    
    const project_id = req.body.project_id;
    const user_id = req.body.user_id;

    User_project_rel.create({

        user_id:user_id,
        project_id:project_id,
        hoster:0
    }).then(result=>{
        if(result.length!=0){
            let rs0 = {
                errorCode:0,
                msg:"success"   
            }
            res.send(rs0);
        }else{
            let rs1 = {
                errorCode:1,
                msg:"failure"
            }
            res.send(rs1);
        }
    })
}

module.exports = {
    joinProjectRelationShip:joinProjectRelationShip
}
