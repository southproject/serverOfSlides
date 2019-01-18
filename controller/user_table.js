var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var user_table = require('../models/user_table');

const User_table = user_table(Connection,Sequelize);

//Register
function addUsers(req,res){
    
    const user_name = req.body.user_name;
    const passwd = req.body.passwd;
    const email = req.body.email;
    const phone_num = req.body.phone_num;

    User_table.create({

        user_name:user_name,
        passwd:passwd,
        email:email,
        phone_num:phone_num

    }).then(result =>{
        console.log(result);
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
    });
}
//Login
function userLogin(req,res){
    
}


//QueryUsers
function queryUsers(req,res){

    User_table.findAll({

    }).then(result=>{
        var resultJsonArray = [];
        if(result.length!=0){
            for(let i=0;i<result.length;i++){
                let item = {
                    user_id:result[i].dataValues.user_id,
                    user_name:result[i].dataValues.user_name,
                    email:result[i].dataValues.email,
                    phone_num:result[i].dataValues.phone_num
                };
                resultJsonArray.push(item);
            }
            let rs0 = {
                errorCode:0,
                msg:resultJsonArray
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

//query Rsult Test
function queryResultTest(req,res){

    const user_name = req.query.user_name;
    const passwd = req.query.passwd;

    User_table.findOne({
        attributes: ['user_id','user_name','passwd'],
        where:{
            user_name:user_name,
            passwd:passwd
        }
    }).then(result=>{
       console.log("result:",result);
       console.log("user_id:",result.dataValues.user_id);
       res.send(result);
    })
}




module.exports={
    addUsers:addUsers,
    queryUsers:queryUsers,
    queryResultTest:queryResultTest
}