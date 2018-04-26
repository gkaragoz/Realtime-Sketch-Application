const expect = require('expect');
const {Users} = require('./users');

describe('Users', function () {
    var users;

    beforeEach( function () {
        users = new Users();
        users.users = [{
            id      : '1',
            name    : 'Mike',
            room    : 'Node Course'
        }, {
            id      : '2',
            name    : 'Jen',
            room    : 'Node Course'
        }, {
            id      : '3',
            name    : 'Julie',
            room    : 'React Course'
        }];
    });

    it('Yeni kullanıcı eklemeli', function(){
        var users = new Users();
        var user = {
            id   : '123',
            name : 'Oğuzhan',
            room : 'The Office Fans'
        };

        var resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it( 'React Course\'a ait kullanıcıları getirmeli', function () {
        var userList = users.getUserList('React Course');
        
        expect(userList).toEqual(['Julie']);
    });

    it('Olan kullanıcıyı silmeli', () => {
        var userId = '1';
        var user = users.removeUser(userId);
    
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
      });
    
      it('Olmayan kullanıcıyı silmemeli', () => {
        var userId = '99';
        var user = users.removeUser(userId);
    
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
      });

    it ( 'Kullanıcıyı bulmalı', function () {
        var userId = '2' ;

        var user   = users.getUser(userId) ;

        expect(user.id).toBe(userId);
    });

    it ( 'Olmayan kullanıcıyı bulmamalı', function () {
        var userId = '99' ;
        
        var user   = users.getUser( userId ) ;
        
        expect(user).toNotExist();
    });
}) ;