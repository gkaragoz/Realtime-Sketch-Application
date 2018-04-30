  class user {
    constructor (socketId, name) {
        this.socketId = socketId;
        this.name = name;
        this.score = 0;
        this.isArtist = false;
    }

    getSocketId() {
      return this.socketId;
    }

    getName() {
      return this.name;
    }

    getScore() {
      return this.score;
    }

    setScore(score) {
      this.score = score;
    }

    resetScore() {
      this.score = 0;
    }

    addScore(score) {
      this.score += score;
    }

    getIsArtist() {
      return this.isArtist;
    }
  }
  
  module.exports = {user};