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
                ,nm: createIndex(data.items, 'nm')
        	};
             _s.index.key_id = {};
            for(var key in _s.items) {
                var item = _s.items[key];
                _s.index.key_id[item.id] = key;
            }
   	});
	}

    _s.getById = function(id, callback) {
        var params = {"id":1*id,"flags":"4294967295"}
        Wialon.request('core/search_item', params, function(data) {
    		callback(data.item);
    	});
	}

    _s.saveUser = function(item, callback) {
        var item = angular.copy(item);
        var params_arr = [];
        params_arr.push({"svc":"item/update_name","params":{"itemId":item.id,"name":item.nm}});
        if(item._password) {
            params_arr.push({"svc":"user/update_password","params":{"userId":item.id,"oldPassword":"","newPassword":item._password}});
        }
        Wialon.request('core/batch', {"params":params_arr,"flags":0}, function(data) {
            _s.refreshUser(item.id);
            if(callback) callback(data);
        });
    }

    _s.refreshUser = function(id, callback) {
        var params = {"id":1*id,"flags":261}
        Wialon.request('core/search_item', params, function(data) {
            if(data.item) {
                _s.items[_s.index.key_id[id]] = data.item;
                _s.index.id[id] = data.item;
                _s.index.crt[data.item.crt]  = data.item;
                _s.index.nm[data.item.nm]  = data.item;
                if (callback) callback(data.item);
            }
        });
    }

    _s.generatePassword = function(l) {
        var symbols = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890?!@#$%&*()_-+=';
        var pass = '';
        for (var i = 0; i < l; i++) {
            pass = pass + symbols[Math.round(Math.random()*(symbols.length-1))];
        }
        return pass;
    }


}]);