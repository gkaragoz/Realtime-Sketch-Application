const uuidv1 = require('uuid/v1');

class room {
    constructor(io, words) {
        this.io = io;
        this.words = words;

        //ROOM STRUCTURE        
        this.name = uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131'
        this.capacity = 5;
        this.users = [];

        //GAMEPLAY STUFF
        this.gameInterval = null;

        this.gameStarted = false;
        this.currentTour = 0;
        this.tourTime = 30;
        this.currentTime = this.tourTime;
        this.maxRaund = 3;
        this.currentRaund = 0;
        this.currentQuestion = "saü";
        this.maxArtist = 0;
        this.currentArtist = 0;
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
        if (this.isReadyForGame() === "readyForNewGame") {
            console.log("|||||Yeni oyun başladı.");
            this.gameStarted = true;
            this.prepareGame();
            this.prepareRaund();
            this.prepareTour();
            this.startTour();
        }
    }

    prepareGame() {
        this.currentRaund = 0;
    }

    prepareRaund() {
        console.log("|||||Raund hazırlanıyor...");
        this.currentArtist = this.users.length - 1;
        this.onOffEveryArtist();
    }

    nextRaund() {
        console.log("|||||~~~Sonraki raunda geçiliyor...|||||");
        this.currentTour = 0;
        ++this.currentRaund;
    }

    prepareTour() {
        console.log("|||||Tur hazırlanıyor...");
        this.currentTime = this.tourTime;

        this.currentQuestion = this.getARandomWord();
        console.log("|||||Bu tur için kullanılacak kelime belirlendi: " + this.currentQuestion);

        //Set artist.
        this.onOffEveryArtist();

        //Emit the permission to artist.

        //Get random word from DB

        //Emit the open word to artist.

        //Emit the secret word to everyone.
        this.announceTheGame();
    }


    isAllToursCompleted() {
        return (this.currentArtist < 0) ? true : false;
    }

    endGame() {
        console.log("|||||Oyun bitti.");
        this.gameStarted = false;
    }

    whileGame(roomMain) {
        roomMain.decreaseTimer(roomMain);

        if (roomMain.isTourFinished()) {
            roomMain.setNextArtist();
            roomMain.stopTour();

            if (roomMain.isAllToursCompleted()) {
                roomMain.nextRaund();

                if (roomMain.isGameFinished()) {
                    roomMain.endGame();

                    console.log("|||||Yeni oyun 5 saniye sonra başlayacak...");
                    roomMain.waitALittle(5000, function () {
                        roomMain.startGame();
                    });
                    return;
                } else {
                    roomMain.prepareRaund();
                }
            }
            roomMain.prepareTour();
            roomMain.startTour();
        }
    }

    decreaseTimer(roomMain) {
        console.log("||||||Turun bitmesine " + roomMain.currentTime-- + " saniye kaldı.");
        // console.log("~~~Kullanıcılara currentTime bildiriliyor.");
        // roomMain.io.to(roomMain.name).emit('currentTime', roomMain.currentTime);
    }

    stopTour() {
        console.log("|||||Tur bitti");
        // Seçilen kelime şuydu bunlar bildi şunlar bilemedi emit le.
        clearInterval(this.gameInterval);
    }

    isTourFinished() {
        return (this.currentTime <= 0) ? true : false;
    }

    isAllToursFinished() {
        return (this.currentArtist < 0) ? true : false;
    }

    startTour() {
        console.log("|||||" + ++this.currentTour + ".Tur başlatılıyor...");
        console.log("|||||Yeni tur başladı: " + "Artist:" + this.users[this.currentArtist].name + " | Kelime: " + this.currentQuestion);

        this.gameInterval = setInterval(this.whileGame, 1000, this);
    }

    isReadyForGame() {
        if (this.getUserCount() <= 1) {
            //Yeni oyun için yeterli oyuncu yok.
            return "notEnoughUser";
        }
        else if (this.isGameStarted()) {
            //Yeni oyuna hazır değil: oyun zaten oynanıyor.
            return "alreadyPlaying";
        } else if (this.getUserCount() > 1 && this.isGameStarted() == false) {
            //Oda yeni bir oyuna hazır.
            return "readyForNewGame";
        } else {
            //Bir şeyler ters gidiyor.
            return "ERROR";
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

    setNextArtist() {
        this.currentArtist--;
    }

    onOffEveryArtist() {
        for (let ii = 0; ii < this.users.length; ii++) {
            const aUser = this.users[ii];
            if (aUser.socketId === this.users[this.currentArtist].socketId) {
                aUser.setArtist(true);
            } else {
                aUser.setArtist(false);
            }
        }
    }

    controlItself() {
        if (this.currentArtist > this.users.length - 1) {
            console.log("ODA KRİTİK DURUM: Oyun çıkısında artist düzeltildi.");
            this.currentArtist = this.users.length - 1;
        }
    }

    /**** EVENT STUFF ****/
    announceTheGame(){
        var data = {
            users: this.users,
            word : this.currentQuestion,
        };
        console.log("~~~Kullanıcılara startGame bildiriliyor.");
        this.io.to(this.name).emit('onGameStarted', data);
    }
    
    onTourStarted() {
        console.log("~~~Kullanıcılara tourStared bildiriliyor.");
        this.io.to(this.name).emit('onTourStarted', data);
    }

    onTourFinished() {
        console.log("~~~Kullanıcılara tourFinished bildiriliyor.");
        this.io.to(this.name).emit('onTourFinished');
    }

    getARandomWord() {
        var randomIndex = Math.floor((Math.random() * this.words.length));
        return this.words[randomIndex].value;
    }
}

module.exports = { room };