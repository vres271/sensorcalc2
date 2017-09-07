Main.service('Users',  ['Wialon'
    ,function(Wialon){

	var _s = this;
	_s.items = [];
    _s.from = 0;
    _s.to = 99999;
	_s.get = function() {
        var params = {"spec":{"itemsType":"user","propName":"sys_name","propValueMask":"*","sortType":"id"},"force":1,"flags":261,"from":_s.from,"to":_s.to}
    	Wialon.request('core/search_items', params, function(data) {
        	_s.items = data.items;
        	_s.index = {
                id: createIndex(data.items, 'id')
                ,crt: createIndex(data.items, 'crt')
        	};
    	});
	}

    _s.getById = function(id, callback) {
        var params = {"id":1*id,"flags":"4294967295"}
        Wialon.request('core/search_item', params, function(data) {
    		callback(data.item);
    	});
	}

}]);