describe('Ready Service', function() {
    var Ready;
 
    beforeEach(module('Main'));
    beforeEach(inject(function(_Ready_) {
        Ready = _Ready_;
    }));

    it('can get an instance of my service', inject(function(Ready) {
        expect(Ready).toBeDefined();
    }));

	it(".all, .allParts(), .reset()", inject(function(Ready) {
		expect(Ready.all).toEqual(true); // по умолчанию true
		expect(Ready.parts ? true : false).toEqual(true); // parts объявлен
		expect(Ready.allParts()).toEqual(true); // allParts возвращает true
		expect(Ready.all).toEqual(true); // после allPparts .all тоже true

		expect(Ready.set('wialon', false)).toEqual(false);
		expect(Ready.all).toEqual(false);
		expect(Ready.set('objects', true)).toEqual(false);
		expect(Ready.all).toEqual(false);
		expect(Ready.set('wialon', true)).toEqual(true);
		expect(Ready.all).toEqual(true);

		expect(Ready.reset()).toEqual(true);
		expect(Ready.allParts()).toEqual(true);
		expect(Ready.all).toEqual(true); 
		Ready.set('wialon', false);
		Ready.set('objects', false);
		expect(Ready.all).toEqual(false); 
		expect(Ready.reset()).toEqual(true);
		expect(Ready.all).toEqual(true); 
	})); 

})
