// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 3001;

//Routing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname,'public')));
//cors domain setting
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", '3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });


function syncData(project_id) {
    //SyncData function
    console.log("come in io");
    var namespace = '/' + project_id;
    var io = require('socket.io')(server, {
        path: namespace
    });
    var numOfUers = 0;
    //var project_id = '/5c6f6e65e00c7f1b4885c798';
    //var nsp = io.of(project_id);

    io.on('connection', (socket) => {

        var addedUser = false;
        //console.log("socket: ",socket);
        //console.log("socket.conn.server.clients:",socket.conn.server.clients);

        /**add user**/
        //when the client emits 'add user',this listens and executes
        socket.on('add user', (username) => {
            //?
            if (addedUser) return;
            console.log('%s come in WebSocket!', username);
            //we store the username in the socket session for this client
            socket.username = username;
            ++numOfUers;
            addedUser = true;
            socket.emit('login', {
                numOfUers: numOfUers
            });

            //broadcast all clients that a person has connected
            socket.broadcast.emit('user joined', {
                username: socket.username,
                numOfUers: numOfUers
            });
        });


        /**editting**/
        //when the client emits 'editting',server broadcast it to others
        socket.on('editting', () => {
            socket.broadcast.emit('editting', {
                username: socket.username
            });
        });

        /**stop editting**/
        //when the client emits 'stop editting', server broadcast it to others
        socket.on('stop editting', () => {
            socket.broadcast.emit('stop editting', {
                username: socket.username
            });
        });

        /**update data**/
        //when the client emits 'update data',this listen and executes
        socket.on('update data', (data) => {
            //server will broadcast to all client to execute 'update data'
            socket.broadcast.emit('update data', data)
            /*
            socket.broadcast.emit('update data',{
                username: socket.username,
                message:data
            });
            */
        });

        /**disconnection**/
        //when the user disconnection,server broadcast to all the clients
        socket.on('disconnection', () => {
            if (addedUser) {
                --numOfUers;

                //broadcast to all the client
                socket.broadcast.emit('user left', {
                    username: socket.username,
                    numOfUers: numOfUers
                });
            }
        });

    });
}

function createWebSocketServer(req, res) {
    const project_id = req.body.project_id;
    console.log("create new namespace: ", project_id);
    syncData(project_id);
    let rs = {
        errorCode:0,
        msg:'create success!'
    }
    res.send(rs);
}

//Depreciation
function getUserinNSP(req,res){
    const project_id = req.query.project_id;
    var namespace = '/' + project_id;
    var io = require('socket.io')(server, {
        path: namespace
    });
}



server.listen(port, ()=>{
    console.log('SyncServer listening at port %d',port);
});

module.exports = {
    createWebSocketServer:createWebSocketServer,
    //getUserinNSP:getUserinNSP
}