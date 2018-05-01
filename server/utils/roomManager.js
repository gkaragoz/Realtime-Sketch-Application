const roomModel =require('./room').room;
const userManager =require('./userManager').userManager;
  
  class roomManager {
    constructor () {
      this.rooms = [];
    }

    createRoom() {
        var room = new roomModel();
        this.rooms.push(room);
        
        console.log("BAŞARILI:\t\t Bir oda oluşuturuldu: " + room.name);
        return room;
    }

    getRoomCount() {
        return this.rooms.length;
    }

    getUsers(room) {
        return room.getUsers();
    }

    getRoom(user) {
        for (let ii = 0; ii < this.rooms.length; ii++) {
            const room = this.rooms[ii];
            
            for (let jj = 0; jj < room.users.length; jj++) {
                const singleUser = room.users[jj];
                
                if (singleUser.socketId === user.socketId) {
                    return room;
                }
            }
        }
        return null;
    }

    getAvailableRoom() {
        for (let ii = 0; ii < this.rooms.length; ii++) {
            const room = this.rooms[ii];
            if (room.isAvailableForNewUser()) {
                console.log("SİSTEM:\t\t Uygun bir oda bulundu!");
                return room;
            }
        }

        console.log("SİSTEM:\t\t Uygun bir oda bulunamadı!");
        return this.createRoom();
    }

    InitializeRoom(user, callback) {
        var room = this.getAvailableRoom();
        room.addUser(user);
        console.log("SİSTEM:\t\t Bir kullanıcı odaya bağlandı: " + user.name);

        callback(room);
    }

    removeUser(user, room) {
        console.log("İŞLEM:\t\t Kullanıcı odadan çıkartılıyor: " + user.name);
        room.removeUser(user);
        console.log("SİSTEM:\t\t Kullanıcı odadan çıkartıldı: " + user.name);
    }
    
  }
  
  module.exports = {roomManager};