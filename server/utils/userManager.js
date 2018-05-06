const userModel =require('./user').user;

class userManager {
    constructor () {
      this.users = [];
    }

    createUser(socketId, name, callback) {
      var user = new userModel(socketId, name);
      this.users.push(user);
      
      callback(user);
    }

    removeUser (user) {
      console.log("İŞLEM:\t\t Kullanıcı siliniyor: " + user.name);
      const index = this.users.indexOf(user);
      this.users.splice(index, 1);
      console.log("BAŞARILI:\t\t Kullanıcı silindi: " + user.name);
    }

    getUser (socketId) {
      for (let ii = 0; ii < this.users.length; ii++) {
        const searching = this.users[ii];

        if (searching.socketId === socketId) {
          return searching;
        }
      }
      console.log("BAŞARISIZ:\t\t Aranan kullanıcı bulunamadı: " + socketId);
      return null;
    }

    getUserCount () {
      return this.users.length;
    }
  }
  
  module.exports = {userManager};