var expect = require('expect');
var generateMessage = require("./message").generateMessage;
var generateLocationMessage = require("./message").generateLocationMessage;

describe('generateMessage', function () {
    it('Doğru mesaj nesnesi üretmelidir.', function () {
        var from = 'Jen';
        var text = 'Some message';
        var message = generateMessage(from,text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from,text});

        //store res in variable
        //assert from match
        //assert text match
        //assert createdAat is number
    });
});

describe('generateLocationMessage', function () {
    it('Doğru konum nesnesi üretmelidir.', function () {
        var from = "Deb";
        var latitude  = 15;
        var longitude = 19;
        var url  = "https://www.google.com/maps?q=15,19";
        var message = generateLocationMessage(from,latitude,longitude);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, url});
        
    });
});