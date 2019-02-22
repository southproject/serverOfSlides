var Sequelize = require('sequelize');
var redis = require('redis');
var Connection = require('../database/mysql-connection');
const redisConnection = require('../database/redis-connection');

var user_project_rel = require('../models/user_project_rel');

const User_project_rel = user_project_rel(Connection, Sequelize);

//reflect array
var reflectArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
]

//add project and user relationship:join project api
function joinProjectRelationShip(req, res) {

    const project_id = req.body.project_id;
    const user_id = req.body.user_id;

    User_project_rel.create({

        user_id: user_id,
        project_id: project_id,
        hoster: 0
    }).then(result => {
        if (result.length != 0) {
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


//generate tinyCode
function generateTinyCode(req, res) {
    const project_id = req.query.project_id;
    var str;
    //1.incr key
    redisConnection.incr("key", function (err, reply) {
        if (reply != null) {
            console.log(reply);
        } else {
            console.log(err);
        }
    });
    //2.get key
    redisConnection.get("key", function (err, reply) {
        if (reply != null) {
            console.log(reply);
            str = convertSixtyTwo(reply);
            //3.convert->set
            redisConnection.set(str, project_id, function (err, reply) {
                if (reply != null) {
                    console.log(reply);
                    res.json(str);
                } else {
                    console.log(err);
                    res.json(err);
                }
            });
        } else {
            console.log(err);
        }
    });
}


//through TinyCode get project_id
function getReflectProject_id(req,res){
    
    const tinyCode = req.query.tinyCode;

    redisConnection.get(tinyCode,function(err, reply){
        if(reply!=null){
            console.log(reply.toString());
            res.json(reply);
        }else{
            console.log(err);
            res.json(err);
        }
    })
}

/**
 *1.num>1
 *2.Math.floor(num%62);
*/
function convertSixtyTwo(num) {
    var array = [];
    while (num > 1) {
        let renum = Math.floor(num % 62);
        //console.log("renum:",renum);
        let element = reflectArray[renum];
        //console.log("element:",element);
        array.unshift(element);
        num = num / 62;
    }
    let result = "";
    array.forEach(function (element) {
        result += element;
    });
    return result;
}
/*
1.str.split("").reverse().join("");
2.str.indexOf(result[i]);
3.resultValue = resultValue+n*Math.pow(62,i);
*/
function convertTen(str) {
    let resultArray = str.split("").reverse().join("");
    let resultValue = 0;
    let length = resultArray.length;
    console.log("length:", length);
    for (let i = 0; i < length; i++) {
        console.log("element:", resultArray[i]);
        let n = reflectArray.indexOf(resultArray[i]);
        resultValue = resultValue + n * Math.pow(62, i);
        console.log("resultValue:", resultValue);
    }
    return resultValue;
}


module.exports = {
    joinProjectRelationShip: joinProjectRelationShip,
    generateTinyCode: generateTinyCode,
    getReflectProject_id:getReflectProject_id
}
