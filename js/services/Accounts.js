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
        	};
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

}]);