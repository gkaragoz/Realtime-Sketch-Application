const path = require('path');
const http = require('http');
const express = require('express');
const socketIO=require('socket.io');

const {generateMessage}=require('./utils/message');
const {isRealString} = require('./utils/validation');
const UM = require('./utils/userManager').userManager;
const RM = require('./utils/roomManager').roomManager;
const publicPath  = path.join(__dirname,"../public");
const port  =   process.env.PORT ||3000 ;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var userManager = new UM();
var roomManager = new RM();

app.use(express.static(publicPath));

io.on('connection', function (socket) {
    console.log(">>>>>Yeni bir ziyaretçi bulundu: " + socket.id);

    socket.on('join', function(params, callback){
        if(!isRealString(params.name)){
            console.log(">>>>>Kullanıcı bağlanamadı: " + socket.id);
            callback('Kullanıcı adı alanı doldurulmalıdır.');
        } else {
            console.log(">>>>>Kullanıcı bağlantı kurdu: " + socket.id + " " + params.name);
            console.log(">>>>>...Yeni bir kullanıcı oluşturuluyor.");
            //Create a user.
            userManager.createUser(socket.id, params.name, function(user) {
                var room = roomManager.InitializeRoom(user);
                socket.join(room.name);

                io.to(room.name).emit('updateUserList', roomManager.getUsers(room));
                
                //socket.emit from Admin text Welcome to the chat app
                socket.emit('newMessage', generateMessage('Admin','Hoşgeldiniz'));
                //socket.broadcast.emit from Admin text New user joined
                socket.broadcast.to(room.name).emit('newMessage', generateMessage('Admin',  user.name + ' bağlandı.'));
                
                callback();
            });
        }
    });

    socket.on('createMessage',function (message,callback) {
        var user = userManager.getUser(socket.id);
        var room = roomManager.getRoom(user);

        console.log(">>>>>Mesaj isteği alındı.");
        if (user && isRealString(message.text)) {
            console.log(">>>>>Mesaj gönderildi. " + JSON.stringify(generateMessage(user.name, message.text), '', 2));
            io.to(room.name).emit('newMessage', generateMessage(user.name, message.text));
        } else {
            console.log(">>>>>Mesaj gönderilemedi.");
        }

        callback();
    });

    socket.on('disconnect', function () {
        console.log(">>>>>Kullanıcının bağlantısı kesildi!");
        var user = userManager.getUser(socket.id);
        var room = roomManager.getRoom(user);

        userManager.removeUser(user);
        roomManager.removeUser(user, room);
        
        io.to(room.name).emit('updateUserList', roomManager.getUsers(room));
        io.to(room.name).emit('newMessage', generateMessage('Admin', user.name + " ayrıldı." ));
    });

    //Draw
    socket.on('draw', function(data, callback){
        console.log(JSON.stringify(data));

        var user = userManager.getUser(socket.id);
        var room = roomManager.getRoom(user);

        socket.broadcast.to(room.name).emit('draw', data);
        callback(data);
    });
});

server.listen(port, function () {
    console.log('Server ' + port + ' numaralı portta çalışıyor');
});