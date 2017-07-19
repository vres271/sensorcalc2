Main.service('Units', function(Wialon){
	var _s = this;
	_s.items = [];
	_s.get = function() {
		var params = {"spec":{"itemsType":"avl_unit","propName":"sys_name","propValueMask":"*","sortType":"sys_name"},"force":1,"flags":1439,"from":2300,"to":2400};
    	Wialon.request('core/search_items', params, function(data) {
        	_s.items = data.items;
        	_s.index = {
        		id: createIndex(data.items, 'id')
        	};
			_s.addToSession();
    	});
	}

	_s.addToSession = function() {
		var params = {"spec":[{"type":"type","data":'avl_unit',"flags":1025,"mode":0}]};
		// var params = {"spec":[{"type":"col","data":[528621],"flags":1025,"mode":0}]};
    	Wialon.request('core/update_data_flags', params, function(data) {
    	});
    	Wialon.addEventsHandler('onUnitsChanged', function(data) {
    		for(var key in data.events) {
    			var event = data.events[key];
    			if(event.t === 'm') {
    				if(event.i) {
    					if(_s.index.id[event.i]) {
		        			_s.index.id[event.i].lmsg = event.d;
    					}
    				}
    			}
    			if(event.t === 'u') {
    				if(event.i) {
    					if(_s.index.id[event.i]) {
    						if(event.d.nm) {
			        			_s.index.id[event.i].nm = event.d.nm;
    						}
    					}
    				}
    			}
    		}
    	});
	}
});