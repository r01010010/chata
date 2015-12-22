
var app = require('express')();
var _ = require('lodash');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket){

    var user = {
        id: socket.id,
        nickname: 'unknown'
    };

    users[socket.id] = user;

    io.to(socket.id).emit('user', user);

    socket.on('msg', function(_msg){

        var mode = 'default';

        if(_.startsWith(_msg, '/think ')){
            mode = 'think';
            _msg = _msg.replace('/think ', '');
        }

        var msg = {
          user: users[socket.id],
          text: _msg,
          mode: mode
        };


        io.emit('msg', msg);
    });

    socket.on('nick', function(_nick){
        var user = users[socket.id];
        user.nickname = _nick.substring(6, _nick.length);
        io.emit('nick_changed', user);
    });

    socket.on('oops', function(){
        var user = users[socket.id];
        io.emit('oops', user);
    })


});

http.listen(3000, function(){
    console.log('listening on *:3000');
});