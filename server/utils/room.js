const uuidv1 = require('uuid/v1');

class room {
    constructor(io) {
        this.io = io;

        //ROOM STRUCTURE        
        this.name = uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131'
        this.capacity = 3;
        this.users = [];

        //GAMEPLAY STUFF
        this.raundInterval = null;

        this.gameStarted = false;
        this.raundTime = 2;
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
        if (this.isReadyForGame()) {
            this.gameStarted = true;
            console.log("ODA YÖNETİCİ:\t\t " + this.getUserCount() + " kullanıcı ile oyun başlatılıyor.");
            this.resetCurrentRaund();
            this.prepareRaund();
            this.nextRaund();

            console.log("~~~Kullanıcılara startGame bildiriliyor.");
            this.io.to(this.name).emit('startGame');
        } else {
            this.endGame();
            console.log("ODA YÖNETİCİ:\t\t " + "Oyunun başlatılması için yeterli oyuncu yok!");
        }
    }

    endGame() {
        this.gameStarted = false;
        console.log("|||Bu odadaki oyun sona erdi: " + this.name);

        console.log("~~~Kullanıcılara endGame bildiriliyor.");
        this.io.to(this.name).emit('endGame');
    }

    whileRaund(roomMain) {
        console.log("||||||Raundun bitmesine " + roomMain.currentTime-- + " saniye kaldı.");
        console.log("~~~Kullanıcılara currentTime bildiriliyor.");
        roomMain.io.to(roomMain.name).emit('currentTime', roomMain.currentTime);

        if (roomMain.isRaundFinished()) {
            console.log("||||||Raund bitti: " + roomMain.currentRaund + "/" + roomMain.maxRaund);
            roomMain.stopRaund();

            if (roomMain.isGameFinished()) {
                roomMain.endGame();

                //Show room statistics.
                //this.showRoomStatistics();

                console.log("ODA YÖNETİCİ:\t\t Yeni oyun 10 saniye sonra başlayacak...");
                roomMain.waitALittle(10000, function() {
                    roomMain.startGame();
                });

            } else if (roomMain.isReadyForGame()) {
                console.log("ODA YÖNETİCİ:\t\t Yeni raund 5 saniye sonra başlayacak...");
                console.log("ODA YÖNETİCİ:\t\t Yeni raund hazırlanıyor...");
                roomMain.prepareRaund();
                roomMain.waitALittle(5000, function() {
                    roomMain.nextRaund();
                    console.log("ODA YÖNETİCİ:\t\t Yeni raund başladı: " + roomMain.currentRaund + "/" + roomMain.maxRaund);
                });
            } else {
                roomMain.endGame();
                console.log("ODA YÖNETİCİ:\t\t " + "Oyunun başlatılması için yeterli oyuncu yok!");
            }
        }
    }

    stopRaund() {
        clearInterval(this.raundInterval);

        console.log("~~~Kullanıcılara stopRaund bildiriliyor.");
        this.io.to(this.name).emit('stopRaund');
    }

    isRaundFinished() {
        return (this.currentTime <= 0) ? true : false; 
    }

    resetCurrentRaund() {
        console.log("ODA YÖNETİCİ:\t\t Current Raund sıfırlandı. ");
        this.currentRaund = 0;
        
        console.log("~~~Kullanıcılara resetCurrentRound bildiriliyor.");
        this.io.to(this.name).emit('resetCurrentRound', this.currentRaund);
    }

    resetRaundTimer() {
        console.log("ODA YÖNETİCİ:\t\t Raund time sıfırlandı. " + this.currentTime + " -> " + this.raundTime);
        this.currentTime = this.raundTime;

        console.log("~~~Kullanıcılara resetRaundTimer bildiriliyor.");
        this.io.to(this.name).emit('resetRaundTimer', this.currentTime);
    }

    prepareRaund() {
        this.stopRaund();
        this.resetRaundTimer();
    }

    nextRaund(roomMain) {
        this.currentRaund++;

        console.log("~~~Kullanıcılara nextRaund bildiriliyor.");
        this.io.to(this.name).emit('nextRaund', this.currentRaund);

        this.raundInterval = setInterval(this.whileRaund, 1000, this);
    }

    showRoomStatistics() {

    }

    calculateRoomStatistics() {

    }

    isReadyForGame() {
        return (this.getUserCount() > 1) ? true : false;
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