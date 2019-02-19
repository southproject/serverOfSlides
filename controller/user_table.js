var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var user_role = require('../models/user_role')
var user_table = require('../models/user_table');
var user_role_rel = require('../models/user_role_rel');

var log = require('../log')(module);
const User_table = user_table(Connection,Sequelize);
const User_role = user_role(Connection, Sequelize);
const User_role_rel = user_role_rel(Connection,Sequelize);

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

//Register for access
function register(req,res){

    const username = req.body.username;
    const passwd = req.body.passwd;
    const email = req.body.email;
    const phone_num = req.body.phone_num;
    const role = req.body.role;
    //check if repeat name
    User_table.findOne({
        where:{
            user_name:username
        }
    }).then(result=>{
        //log.info("result:",result);
        if(result==null){
            //1.first query user_role_id
            var resultinfo1,resultinfo2;
            //log.info("result=null");
            resultinfo2=User_table.create({
                user_name:username,
                passwd:passwd,
                email:email,
                phone_num:phone_num,
            })

        resultinfo1=User_role.findOne({
        attributes:['user_role_id'],
        where:{role_name:role}
        })
        var resultJson = {}
        resultinfo1.then(result =>{
            console.log("user_role_id:",result.dataValues.user_role_id);
            resultJson.user_role_id = result.dataValues.user_role_id;
            resultinfo2.then(result =>{
                console.log("user_id:",result.dataValues.user_id);
                resultJson.user_id = result.dataValues.user_id;
                User_role_rel.create({
                    user_id:resultJson.user_id,
                    user_role_id:resultJson.user_role_id
                }).then(result=>{
                    if(result!=null){
                        let rs1 = {
                            errorCode:0,
                            msg:"Register Success!"
                        }
                        res.send(rs1);
                    }else{
                        let rs2 = {
                            errorCode:2,
                            msg:"role relation create failed!"
                        }
                        res.send(rs2);
                    }
                    
                })
            })
        })
             
            

        }else{
         //Notification for repeat
         let rs0 = {
             errorCode:1,
             msg:"Duplicate name!"
         }
         res.send(rs0);
        }
        
    })
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

//Destory Format Test
function destoryFormatTest(req,res){

    const user_id = req.query.user_id;
    
    User_table.destroy({
        where:{user_id:user_id}
    }).then(result=>{
        console.log(result);
        res.send(JSON.stringify(result));
    })
}

//Generic error handler
var errFn = function(cb, err){
    if(err){
        return cb(err);
    }
}


//saveUserModel
function saveUserModel(req,res){

    const user_name = req.query.user_name;
    
    const user_demo = {
        user_name:user_name,
        passwd:'123456',
        email:'1542721301@qq.com',
        phone_num:'13297920692'
    }

    const userModel = new User_table(user_demo);

    var errorHandler = errFn.bind(undefined,res);

    userModel.save()
             .then(()=>{
                console.log("---save function then()---");
                //if(err)res.send(JSON.stringify('Success'));
                if(!err)return;
             })
             .catch(error=>{
                console.log("---save function catch_error()---");
             })
             
}

//BasicStrategy function
function findByUsername(username,cb){
        User_table.findOne({
            attributes: ['user_id','user_name','passwd','email'],
        where:{
            user_name:username
        }}).then(result=>{
            console.log("result: ",result.dataValues);
            if(result!=null)return cb(null,result.dataValues);
        })
}

//findByUserId
function findByUserId(user_id,cb){
    User_table.findOne({
        attributes:['user_id','user_name','passwd','email'],
        where:{
            user_id:user_id
        }
    }).then(result=>{
        console.log("result: ",result.dataValues);
        if(result!=null)return cb(null,result.dataValues);
    })
}


module.exports={
    addUsers:addUsers,
    queryUsers:queryUsers,
    queryResultTest:queryResultTest,
    destoryFormatTest:destoryFormatTest,
    saveUserModel:saveUserModel,
    findByUsername:findByUsername,
    findByUserId:findByUserId,
    register:register
}