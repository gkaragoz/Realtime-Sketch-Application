const uuidv1 = require('uuid/v1');

class room {
    constructor(io) {
        this.io = io;

        //ROOM STRUCTURE        
        this.name = uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131'
        this.capacity = 3;
        this.users = [];

        //GAMEPLAY STUFF
        this.gameInterval = null;

        this.gameStarted = false;
        this.raundTime = 8;
        this.currentTime = this.raundTime;
        this.maxRaund = 2;
        this.currentRaund = 0;
        this.whoIsArtist = null;
        this.rightAnswerCount = 0;
        this.rewards = [
            250,    //1
            200,    //2
            150,    //3
            100,    //4
            50,     //5
            25,     //6
            10,     //7
            5       //8
        ]
    }

    getStatus() {
        var status = {
            name: this.name,
            capacity: this.capacity,
            users: this.users,
            gameStarted: this.gameStarted,
            raundTime: this.raundTime,
            currentTime: this.currentTime,
            maxRaund: this.maxRaund,
            currentRaund: this.currentRaund,
            whoIsArtist: this.whoIsArtist,
            rightAnswerCount: this.rightAnswerCount,
            rewards: this.rewards
        }

        return status;
    }

    addUser(user) {
        this.users.push(user);
    }

    removeUser(user) {
        const index = this.users.indexOf(user);
        this.users.splice(index, 1);
    }

    getUserCount() {
        return this.users.length;
    }

    getCapactiy() {
        return this.capacity;
    }

    getUsers() {
        return this.users;
    }

    isAvailableForNewUser() {
        return (this.getUserCount() >= this.getCapactiy() ? false : true);
    }

    /**** GAMEPLAY STUFF ****/
    startGame() {
        if(this.isReadyForGame()) {
            console.log("|||||Yeni oyun başladı.");
            this.gameStarted = true;
            this.prepareGame();
            this.prepareRaund();
            this.startRaund();
        }
    }

    prepareGame() {
        this.currentRaund = 0;
    }

    prepareRaund() {
        console.log("|||||Yeni raund hazırlanıyor...");
        this.currentTime = this.raundTime;

        //Find who is artist?

        //Emit the permission to artist.

        //Get random word from DB
        
        //Emit the open word to artist.
        
        //Emit the secret word to everyone.
    }

    endGame() {
        console.log("|||||Oyun bitti.");
        this.gameStarted = false;
    }

    whileGame(roomMain) {
        roomMain.decreaseTimer(roomMain);

        if (roomMain.isRaundFinished()) {
            roomMain.stopRaund();

            if (roomMain.isGameFinished()) {
                roomMain.endGame();
                
                console.log("|||||Yeni oyun 10 saniye sonra başlayacak...");
                roomMain.waitALittle(10000, function() {
                    roomMain.startGame();
                });
            } else {
                roomMain.prepareRaund();

                console.log("|||||Yeni raund 5 saniye sonra başlayacak...");
                roomMain.waitALittle(5000, function() {
                    roomMain.nextRaund();
                });
            }
        }
    }

    decreaseTimer(roomMain) {
        console.log("||||||Raundun bitmesine " + roomMain.currentTime-- + " saniye kaldı.");
        // console.log("~~~Kullanıcılara currentTime bildiriliyor.");
        // roomMain.io.to(roomMain.name).emit('currentTime', roomMain.currentTime);
    }

    stopRaund() {
        console.log("|||||Raund bitti: " + this.currentRaund + "/" + this.maxRaund);
        clearInterval(this.gameInterval);
    }

    isRaundFinished() {
        return (this.currentTime <= 0) ? true : false; 
    }
    
    startRaund() {
        console.log("|||||Raund başlatılıyor...");
        this.nextRaund();
    }
    
    nextRaund() {
        this.currentRaund++;
        console.log("|||||Yeni raund başladı: " + this.currentRaund + "/" + this.maxRaund);
        this.gameInterval = setInterval(this.whileGame, 1000, this);
    }

    isReadyForGame() {
        if (this.getUserCount() <= 1) {
            console.log("|||||ODA DURUM:\t\t Yeni oyun için yeterli oyuncu yok.");
            return false;
        }
        else if (this.isGameStarted()) {
            console.log("|||||ODA DURUM:\t\t Yeni oyuna hazır değil: oyun zaten oynanıyor.");
            return false;
        } else if (this.getUserCount() > 1 && this.isGameStarted() == false) {
            console.log("|||||ODA DURUM:\t\t Oda yeni bir oyuna hazır.");
            return true;
        } else {
            console.log("|||||ODA DURUM:\t\t Bir şeyler ters gidiyor.");
            return false;
        }
    }

    isGameStarted() {
        return this.gameStarted;
    }

    isGameFinished() {
        return (this.currentRaund >= this.maxRaund) ? true : false;
    }
    
    waitALittle(milliseconds, callback) {
        setTimeout(callback, milliseconds);
    }
}

module.exports = { room };