var socket = require('socket.io'), http = require('http'),

    server = http.createServer(), socket = socket.listen(server);

socket.on('connection', function(connection) {

    console.log('User Connected');

    connection.on('message', function(msg){

        socket.emit('message', msg);

    });

    socket.on('add-message', (message) => {

        io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});

    });

    socket.on('disconnect', function(){

        io.emit('users-changed', {user: socket.nickname, event: 'left'});

        console.log('User Disconnected');

    });

});

server.listen(3000, function(){

    console.log('Server started');

});
