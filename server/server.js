const path = require('path');
const http = require('http');
const express = require('express');
const socketIO=require('socket.io');
const mongoose = require('mongoose');
const word = require('./model/word');

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
var words = [];

mongoose.connect('mongodb://localhost/words_db');
db = mongoose.connection;

fillWords(function(data) {
    this.words = data;
    console.log("VERİTABANI:\t\t " + this.words.length + " adet kelime başarıyla alındı");
});

app.use(express.static(publicPath));

io.on('connection', function (socket) {
    socket.on('join', function(params, callback){
        if(!isRealString(params.name)){
            console.log("UYARI:\t\t Başarısız giriş.");
            callback('Kullanıcı adı alanı doldurulmalıdır.');
        } else {
            console.log("İŞLEM:\t\t Bir kullanıcı oluşturuluyor.");
            //Create a user.
            userManager.createUser(socket.id, params.name, function(user) {
                console.log("BAŞARILI:\t\t Kullanıcı oluşumu tamamlandı.");
                roomManager.InitializeRoom(io, this.words, user, function(room) {
                    socket.join(room.name);
                    
                    room.startGame();

                    io.to(room.name).emit('updateUserList', roomManager.getUsers(room));
                
                    //socket.emit from Admin text Welcome to the chat app
                    socket.emit('newMessage', generateMessage('Admin','Hoşgeldiniz'));
                    //socket.broadcast.emit from Admin text New user joined
                    socket.broadcast.to(room.name).emit('newMessage', generateMessage('Admin',  user.name + ' bağlandı.'));
                    
                    callback();
                });
            });
        }
    });

    socket.on('createMessage',function (message,callback) {
        var user = userManager.getUser(socket.id);
        var room = roomManager.getRoom(user);

        if (user && isRealString(message.text)) {
            console.log("BAŞARILI:\t\t Mesaj gönderildi: " + JSON.stringify(generateMessage(user.name, message.text), '', 2) + "\n");
            io.to(room.name).emit('newMessage', generateMessage(user.name, message.text));
        } else {
            console.log("BAŞARISIZ:\t\t Mesaj gönderilemedi.");
        }

        callback();
    });

    socket.on('disconnect', function () {
        console.log("UYARI:\t\t Kullanıcının bağlantısı kesildi!");
        var user = userManager.getUser(socket.id);
        var room = roomManager.getRoom(user);

        userManager.removeUser(user);
        roomManager.removeUser(user, room);
        
        if (room.isReadyForGame() == "notEnoughUser") {
            console.log("UYARI:\t\t Oynanan oyun yeterli oyuncu olmadığından durdurulmak zorunda!");
            room.stopTour();
            room.endGame();
        }

        room.controlItself();

        io.to(room.name).emit('updateUserList', roomManager.getUsers(room));
        io.to(room.name).emit('newMessage', generateMessage('Admin', user.name + " ayrıldı." ));

        var totalUserCount = userManager.getUserCount();
        if (totalUserCount === 0) {
            console.log("SİSTEM:\t\t SUNUCUDA KİMSE KALMADI!******");
        } else {
            console.log("SİSTEM:\t\t SUNUCUDA " + totalUserCount + " KİŞİ OYUN OYNUYOR!******");
        }
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

/**** DB STUFF ****/
function fillWords(callback) {
    word.getAllWords(function (res) {
        callback(res);
    });
}

server.listen(port, function () {
    console.log('SİSTEM:\t\t Server ' + port + ' numaralı portta çalışıyor');
});