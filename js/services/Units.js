Main.service('Units', function(Wialon){
	var _s = this;
	_s.items = [];
	_s.get = function() {
		var params = {"spec":{"itemsType":"avl_unit","propName":"sys_name","propValueMask":"*","sortType":"sys_name"},"force":1,"flags":1439,"from":501,"to":600};
    	Wialon.request('core/search_items', params, function(data) { 
          _s.items = data.items;
    	});
	}
});