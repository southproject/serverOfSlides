'use strict';
(function(){

    var roomid = '5c6f6e65e00c7f1b4885c798';
    var project_id = '/'+roomid;
    var url = 'http://localhost:3001?roomid='+roomid;
    /*
    var socket = io(url,{
        path:project_id
    });
    */
   var socket =io(url);
   //var socket = io(url);
    //console.log(window.location);
    //some variable
    var username = 'bing';
    var connected = false;
    var editting = false;

    socket.emit('add user', username);

    socket.emit('join chat',{username:'bing'});

    socket.emit('send mesg',{username:'cristal',text:'Hello Gays!'})

    socket.on('login',(data)=>{
        connected = true;
        console.log("numOfUsers is "+data.numOfUers);
        console.log("socket.id is"+socket.id);
    });

    socket.on('user joined',(data)=>{
        console.log(data.username+" come in");
    });

    socket.on('user joined',(data)=>{
        console.log(data.username+" come in");
    });

})();