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
      console.log(">>>>>>...Kullanıcı siliniyor: " + user.name);
      const index = this.users.indexOf(user);
      this.users.splice(index, 1);
      console.log(">>>>>>>Kullanıcı silindi: " + user.name);
      console.log(">>>>>>>Mevcut kullanıcı listesi: " + JSON.stringify(this.users, '', 2));
    }

    getUser (socketId) {
      console.log(">>>>>>Kullanıcı aranıyor: " + socketId);
      for (let ii = 0; ii < this.users.length; ii++) {
        const searching = this.users[ii];

        if (searching.socketId === socketId) {
          console.log(">>>>>>Aranan kullanıcı bulundu: " + JSON.stringify(searching, '', 2));
          return searching;
        }
      }
      console.log(">>>>>>Aranan kullanıcı bulunamadı: " + socketId);
      return null;
    }

    getUserCount () {
      return this.users.length;
    }
  }
  
  module.exports = {userManager};