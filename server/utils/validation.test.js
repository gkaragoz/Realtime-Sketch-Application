const expect = require('expect');

//import isRealString
const {isRealString} = require('./validation');

    // isRealString
        // should reject non-string values
        // should reject string with only spaces
        // should allow string with non-space characters

    describe('isRealString', function(){
        it('String olmayan değerleri reddetmeli', function(){
            var res = isRealString(98);
            expect(res).toBe(false);
        });

        it('Tamamen boşluk olan stringi reddetmeli', function(){
            var res = isRealString('    ');
            expect(res).toBe(false);
        });

        it('Sadece boşluktan ibaret olmayan stringe izin vermeli', function(){
            var res = isRealString('  Oguzhan  ');
            expect(res).toBe(true);
        });

    });