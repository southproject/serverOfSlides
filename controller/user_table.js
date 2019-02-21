var Sequelize = require('sequelize');
var Connection = require('../database/mysql-connection');
var user_role = require('../models/user_role')
var user_table = require('../models/user_table');
var user_role_rel = require('../models/user_role_rel');
var personal_info = require('../models/personal_info');

var log = require('../log')(module);
const User_table = user_table(Connection,Sequelize);
const User_role = user_role(Connection, Sequelize);
const User_role_rel = user_role_rel(Connection,Sequelize);
const Personal_info = personal_info(Connection,Sequelize);

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
        //user_role mustbe have in mysqldatabase
        resultinfo1=User_role.findOne({
        attributes:['user_role_id'],
        where:{role_name:role}
        })
        var resultJson = {}
        resultinfo1.then(result =>{
            log.info("user_role_id:",result.dataValues.user_role_id);
            resultJson.user_role_id = result.dataValues.user_role_id;
            //create userinfo 
            resultinfo2.then(result =>{
               // console.log("resultinfo2:",result);
                log.info("user_id:",result.dataValues.user_id);
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
       //console.log("user_id:",result.dataValues.user_id);
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


//Userinfo
function queryUserinfo(req, res) {

    const username = req.query.username;

    User_table.findOne({
        attributes: ['user_id', 'email', 'phone_num'],
        where: {
            user_name: username
        }
    }).then(result => {
        if (result != null) {
            //res.send(result.dataValues)
            let message = {
                user_id: result.dataValues.user_id,
                email: result.dataValues.email,
                phone_num: result.dataValues.phone_num,
                //works
                works: '139',
                visit: '5w+',
                mark: '120',
                download: '160'
            }
            let rs0 = {
                errorCode: 0,
                msg: message
            }
            res.send(rs0);
        } else {
            let rs1 = {
                errorCode: 1,
                msg: "can't find this user!"
            }
            res.send(rs1);
        }
    })
}

//update email/phone_num/passwd
function updateInfo(req,res){

    const user_id = req.body.user_id;
    const email = req.body.email;
    const phone_num = req.body.phone_num;
    const passwd = req.body.passwd;

    User_table.update({
        email:email,
        phone_num:phone_num,
        passwd:passwd
    },
        
      { where:{
            user_id:user_id
        }
    }).then(result=>{
        if (result != 0) {
            let rs0 = {
                errorCode: 0,
                msg: "success"
            }
            res.send(rs0);
        } else {
            let rs1 = {
                errorCode: 1,
                msg: "failure"
            }
            res.send(rs1);
        }
    })
}

/*----personal_info--Model-----*/
//get personal userinfo
function getPersonalInfo(req, res) {
    const user_id = req.query.user_id;

    Personal_info.findOne({
        where: {
            user_id: user_id
        }
    }).then(result => {
        if (result != null) {
            let rs0 = {
                errorCode: 0,
                msg: result
            }
            res.send(rs0);
        } else {
            let message = {
                nick_name:"fresh man",
                position:"green hand",
                city:"wuhan",
                sexy:"secret",
                description:"~"
            }
            let rs1 = {
                errorCode: 1,
                msg: message
            }
           res.send(rs1);
        }
    })
}

//Update PersonalInfo
function updatePersonalInfo(req, res) {
    const user_id = req.body.user_id;
    const nick_name = req.body.nick_name;
    const position = req.body.position;
    const city = req.body.city;
    const sexy = req.body.sexy;
    const description = req.body.description;

    Personal_info.update({

        nick_name: nick_name,
        position: position,
        city: city,
        sexy: sexy,
        description: description
    },
        {
            where: {
                user_id: user_id
            }
        }).then(result => {
            if (result != 0) {
                let rs0 = {
                    errorCode: 0,
                    msg: "success"
                }
                res.send(rs0);
            } else {
                let rs1 = {
                    errorCode: 1,
                    msg: "failure"
                }
                res.send(rs1);
            }
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
    register:register,
    queryUserinfo:queryUserinfo,
    updateInfo:updateInfo,
    getPersonalInfo:getPersonalInfo,
    updatePersonalInfo:updatePersonalInfo
}