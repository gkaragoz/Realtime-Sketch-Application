const uuidv1 = require('uuid/v1');

class room {
    constructor() {
        //ROOM STRUCTURE        
        this.name = uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131'
        this.capacity = 3;
        this.users = [];

        //GAMEPLAY STUFF
        this.raundInterval = null;

        this.gameStarted = false;
        this.raundTime = 3;
        this.currentTime = this.raundTime;
        this.maxRaund = 3;
        this.currentRaund = 1;
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
        this.gameStarted = true;
        console.log("*******************OYUN********************");
        console.log("ODA YÖNETİCİ:\t\t " + this.getUserCount() + " kullanıcı ile oyun başlatılıyor.");
        this.startRaund();
    }

    whileRaund(roomMain) {
        console.log("||||||Raundun bitmesine " + roomMain.currentTime-- + " saniye kaldı.");
        if (roomMain.isRaundFinished()) {
            console.log("||||||Raund bitti: " + roomMain.currentRaund + "/" + roomMain.maxRaund);
            roomMain.stopRaund();

            if (roomMain.isGameFinished()) {
                console.log("|||Bu odadaki oyun sona erdi: " + roomMain.name);
    
                //Show room statistics.
                // this.showRoomStatistics();
    
                // console.log("||| Room is closing..." + this.name);
                // this.closeRoom(function() {
                    // console.log("||| Room has been closed! " + this.name);
                // });
            } else {
                console.log("ODA YÖNETİCİ:\t\t Yeni raund 5 saniye sonra başlayacak...");
                console.log("ODA YÖNETİCİ:\t\t Yeni raund hazırlanıyor...");
                roomMain.nextRaund();
                roomMain.waitALittle(5000, function() {
                    roomMain.startRaund();
                    console.log("ODA YÖNETİCİ:\t\t Yeni raund başladı: " + roomMain.currentRaund + "/" + roomMain.maxRaund);
                });
            }
        }
    }

    startRaund() {
        this.stopRaund();
        this.raundInterval = setInterval(this.whileRaund, 1000, this);
    }

    stopRaund() {
        clearInterval(this.raundInterval);
    }

    isRaundFinished() {
        return (this.currentTime <= 0) ? true : false; 
    }

    resetRaundTimer() {
        console.log("ODA YÖNETİCİ:\t\t Raund time sıfırlandı. " + this.currentTime + " -> " + this.raundTime);
        this.currentTime = this.raundTime;
    }

    nextRaund(roomMain) {
        this.resetRaundTimer();
        this.currentRaund++;
    }

    showRoomStatistics() {

    }

    calculateRoomStatistics() {

    }

    isGameStarted() {
        return this.gameStarted;
    }

    isGameFinished() {
        return (this.currentRaund >= this.maxRaund) ? true : false;
    }

    closeRoom(callback) {
        //closeRoom;
        callback();
    }
    
    waitALittle(milliseconds, callback) {
        setTimeout(callback, milliseconds);
    }
}

module.exports = { room };