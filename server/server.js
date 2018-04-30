const path = require('path');
const http = require('http');
const express = require('express');
const  socketIO=require('socket.io');

const {generateMessage}=require('./utils/message');
const {isRealString} = require('./utils/validation');
const UM = require('./utils/userManager').userManager;
const publicPath  = path.join(__dirname,"../public");
const port  =   process.env.PORT ||3000 ;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var userManager = new UM();

app.use(express.static(publicPath));

io.on('connection', function (socket) {
    console.log("Yeni bir kullanıcı bağlandı");

    socket.on('join', function(params, callback){
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Kullanıcı adı ve oda adı alanı doldurulmalıdır.');
        }

        socket.join(params.room);
        userManager.removeUser(socket.id);
        userManager.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', userManager.getUserList(params.room));

        //socket.emit from Admin text Welcome to the chat app
        socket.emit('newMessage', generateMessage('Admin','Hoşgeldiniz'));
        //socket.broadcast.emit from Admin text New user joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',  params.name + ' bağlandı.'));
        
        callback();
    });

    socket.on('createMessage',function (message,callback) {
       var user = userManager.getUser(socket.id);

       if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
       }
       
       callback();
    });

    socket.on('disconnect', function () {
        var user = userManager.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList', userManager.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', user.name + " ayrıldı." ));
        }
    });

    //Draw
    socket.on('draw', function(data, callback){
        console.log(JSON.stringify(data));

        var user = userManager.getUser(socket.id);

        socket.broadcast.to(user.room).emit('draw', data);
        callback(data);
    });
});

server.listen(port, function () {
    console.log('Server ' + port + ' numaralı portta çalışıyor');
});