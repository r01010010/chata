
var app = require('express')();
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

    socket.on('chat message', function(_msg){
        var msg = {
          user: users[socket.id],
          text: _msg
        };
        io.emit('chat message', msg);
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});