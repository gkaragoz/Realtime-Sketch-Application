const uuidv1 = require('uuid/v1');

class room {
    constructor() {
        //ROOM STRUCTURE        
        this.name = uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131'
        this.capacity = 3;
        this.users = [];

        //GAMEPLAY STUFF
        this.raundInterval = null;

        this.isGameStarted = false;
        this.raundTime = 3;
        this.maxRaund = 3;
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

        this.startGame();
    }

    getStatus() {
        var status = {
            name: this.name,
            capacity: this.capacity,
            users: this.users,
            isGameStarted: this.isGameStarted,
            raundTime: this.raundTime,
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
        this.isGameStarted = true;
        this.nextRaund();
        this.raundInterval = setInterval(this.whileRaund, 1000, this);
    }

    whileRaund(roomMain) {
        console.log("||||||Raundun bitmesine: " + roomMain.raundTime--);
        if (roomMain.isRaundFinished()) {
            console.log("||||||Raund bitti!");
            roomMain.stopRaund();
        }
    }

    stopRaund() {
        clearInterval(this.raundInterval);
    }

    isRaundFinished() {
        return (this.raundTime <= 0) ? true : false; 
    }

    nextRaund() {
        this.currentRaund++;
        if (this.isGameFinished()) {
            this.stopRaund();
            console.log("||| Game has been finished in this room: " + this.name);

            //Show room statistics.
            this.showRoomStatistics();

            console.log("||| Room is closing..." + this.name);
            this.closeRoom(function() {
                console.log("||| Room has been closed! " + this.name);
            });
        }
    }

    showRoomStatistics() {

    }

    calculateRoomStatistics() {

    }

    isGameFinished() {
        return (this.currentRaund > this.maxRaund) ? true : false;
    }

    closeRoom(callback) {
        //closeRoom;
        callback();
    }
}

module.exports = { room };