var assert = require('assert');
var http = require('http');
var qs = require('querystring');
var config = require('../config');
/*
//basic example
describe('Array',function(){
    describe('#indexOf()',function(){
        it('shoud return -1 when the value is not present',function(){
            assert.equal([1,2,3].indexOf(4),-1);
        });
    });
});
*/
/*
//1.hook execute logic
describe('hooks',()=>{
    
    before(()=>{
        console.log('before');
    })

    after(()=>{
        console.log('after');
    })

    beforeEach(()=>{
        console.log('beforeEach');
    })

    afterEach(()=>{
        console.log('afterEach');
    })

    //test scripts
    it('shoud return -1 when the value is not present',()=>{
        assert.equal([1,2,3].indexOf(4),-1);
    })
});
*/
/*
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
                console.log(body.toString());
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
*/

describe('API-2:getPersonalInfo',()=>{

    it('should return PseronalInfo',()=>{

        var options = {
            'method':'GET',
            'hostname':config.host,
            'port':config.port,
            'path':'/api/getPersonalInfo?user_id=14',
            'headers':{
                'Authorization':'Bearer 58a83636cc5a5d66df4da499d01079bd6b0e172377902ba24ec5359cc0ebe2d8',
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