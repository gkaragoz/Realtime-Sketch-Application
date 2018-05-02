const uuidv1 = require('uuid/v1');

class room {
    constructor(io, word) {
        this.io = io;
        this.word = word;

        //ROOM STRUCTURE        
        this.name = uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131'
        this.capacity = 5;
        this.users = [];

        //GAMEPLAY STUFF
        this.gameInterval = null;

        this.gameStarted = false;
        this.currentTour = 0;
        this.tourTime = 10;
        this.currentTime = this.tourTime;
        this.maxRaund = 2;
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
            this.prepareTour(this, function(roomMain) {
                roomMain.startTour();
            });
        }
    }

    prepareGame() {
        this.currentRaund = 0;
    }

    prepareRaund() {
        console.log("|||||Raund hazırlanıyor...");
        this.currentArtist = this.users.length - 1;
    }

    nextRaund() {
        console.log("|||||Sonraki raunda geçiliyor...");
        this.currentTour = 0;
        ++this.currentRaund;
    }

    prepareTour(roomMain, callback) {
        console.log("|||||Tur hazırlanıyor...");
        this.currentTime = this.tourTime;

        this.getARandomWord(this.word, function(word) {
            //Set currentQuestion.
            roomMain.currentQuestion = word;
            console.log("|||||Bu tur için kullanılacak kelime belirlendi: " + roomMain.currentQuestion);
            callback(roomMain);
        });

        //Set artist.

        //Emit the permission to artist.

        //Get random word from DB

        //Emit the open word to artist.

        //Emit the secret word to everyone.
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
            roomMain.prepareTour(roomMain, function() {
                roomMain.startTour();
            });
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

    controlItself() {
        if (this.currentArtist > this.users.length-1) {
            console.log("ODA KRİTİK DURUM: Oyun çıkısında artist düzeltildi.");
            this.currentArtist = this.users.length - 1;
        }
    }

    /**** DB STUFF ****/
    getWordsCount(callback) {
        this.word.getWordsCount(function(count) {
            callback(count);
        });
    }

    getARandomWord(word, callback) {
        this.getWordsCount(function(count) {
            var randomIndex = Math.floor((Math.random() * count + 1));
            
            word.getAWord(randomIndex, function(data) {
                callback(data.value);
            });
        });
        
    }
}

module.exports = { room };