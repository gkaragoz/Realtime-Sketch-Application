const uuidv1 = require('uuid/v1');


class room {
    constructor() {
        this.name = uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131'
        this.capacity = 3;
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
    }

    removeUser(user) {
        console.log("SİLMEDEN ÖNCE: " + JSON.stringify(this.users));
        console.log("SİLİNECEK OLAN: " + JSON.stringify(user));

        const index = this.users.indexOf(user);
        this.users.splice(index, 1);

        console.log("SİLDİKTEN SONRA SONRA: " + JSON.stringify(this.users));
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
}

module.exports = { room };