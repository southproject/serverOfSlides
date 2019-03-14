var assert = require('assert');
var http = require('http');
var qs = require('querystring');
var config = require('../config');

var access_token = [];
//generateToken
describe('API-1:generateToken',()=>{

    it('should return Token Value',()=>{

        var options = {
            'method':'POST',
            'hostname':config.host,
            'port':config.port,
            'path':'/api/oauth/token',
            'headers':{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        var req = http.request(options,function(res){
            var chunks = [];

            res.on('data',(chunk)=>{
                chunks.push(chunk);
            });

            res.on('end',(chunk)=>{
                var body = Buffer.concat(chunks);
                AccessToken = body.toString();
                access_token_json = JSON.parse(AccessToken);
                access_token.push(access_token_json.access_token);
                //console.log(body.toString().access_token);
                //console.log('access_token:',access_token);
            });

            res.on('error',(error)=>{
                console.error(error);
            });
        });

        var postData = qs.stringify({
            'grant_type': 'password',
            'username': 'bing',
            'password': '123456789',
            'client_id': 'A10',
            'client_secret': 'xiaomi'
        })
        req.write(postData);
        req.end();
    });
});
//contact bearer token
var Token = 'Bearer '+access_token[0];

describe('API-2:getPersonalInfo',()=>{

    it('should return PseronalInfo',()=>{

        //console.log('Token:',access_token);

        var options = {
            'method':'GET',
            'hostname':config.host,
            'port':config.port,
            'path':'/api/getPersonalInfo?user_id=14',
            'headers':{
                'Authorization':Token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        var req = http.request(options,function(res){
            var chunks = [];

            res.on('data',(chunk)=>{
                chunks.push(chunk);
            });

            res.on('end',(chunk)=>{
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });

            res.on('error',(error)=>{
                console.error(error);
            });
        });
        req.end();
    });
});
