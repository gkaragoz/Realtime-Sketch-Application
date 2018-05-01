const roomModel =require('./room').room;
const userManager =require('./userManager').userManager;
  
  class roomManager {
    constructor () {
      this.rooms = [];
    }

    createRoom() {
        var room = new roomModel();
        this.rooms.push(room);
        
        console.log(">>>>>>Bir oda oluşuturuldu: " + room.name);
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
                console.log(">>>>>Uygun bir oda bulundu!");
                console.log(">>>>>>Oda bilgileri: " + JSON.stringify(room.getStatus(), '', 2));
                return room;
            }
        }

        console.log(">>>>>>Uygun bir oda bulunamadı!");
        return this.createRoom();
    }

    InitializeRoom(user) {
        var room = this.getAvailableRoom();
        room.addUser(user);
        console.log(">>>>>Bir kullanıcı odaya bağlandı: " + user.name);
        console.log(">>>>>>Odanın son durumu: " + JSON.stringify(room.getStatus(), '', 2));

        return room;
    }

    removeUser(user, room) {
        console.log(">>>>>>...Kullanıcı odadan çıkartılıyor: " + user.name);
        room.removeUser(user);
        console.log(">>>>>>>Kullanıcı odadan çıkartıldı: " + user.name);
        console.log(">>>>>>>Güncellenen Odanın durumu: " + JSON.stringify(room.getStatus(), '', 2));
    }
    
  }
  
  module.exports = {roomManager};