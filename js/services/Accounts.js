Main.service('Accounts',  ['Wialon'
    ,function(Wialon){

	var _s = this;
	_s.items = [];
    _s.from = 0;
    _s.to = 99999;
	_s.get = function() {
        var params = {"spec":{"itemsType":"avl_resource","propName":"rel_is_account,sys_name","propValueMask":"1,*","sortType":"id"},"force":1,"flags":5,"from":_s.from,"to":_s.to}
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
        var params_arr = [];
        params_arr.push({"svc":"core/search_item","params":{"id":1*id,"flags":4294967295}});
		params_arr.push({"svc":"account/get_account_data","params":{"itemId":1*id,"type":2}});

    	Wialon.request('core/batch', {"params":params_arr,"flags":0}, function(data) {
            var resp = {
                item: data[0].item
                ,data: data[1]
            }
    		callback(resp);
    	});
	}

    _s.saveAccount = function(acc, callback) {
        var acc = angular.copy(acc);
        var params_arr = [];
        params_arr.push({"svc":"item/update_name","params":{"itemId":acc.item.id,"name":acc.item.nm}});
        Wialon.request('core/batch', {"params":params_arr,"flags":0}, function(data) {
            _s.refreshAccount(acc.item.id);
            if(callback) callback(data);
        });
    }

    _s.refreshAccount = function(id, callback) {
        var params = {"id":1*id,"flags":5}
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



}]);