Main.service('Units', function(Wialon){
	var _s = this;
	_s.items = [];
	_s.get = function() {
		var params = {"spec":{"itemsType":"avl_unit","propName":"sys_name","propValueMask":"*","sortType":"sys_name"},"force":1,"flags":1439,"from":3300,"to":3400};
    	Wialon.request('core/search_items', params, function(data) {
        	_s.items = data.items;
        	_s.index = {
        		id: createIndex(data.items, 'id')
        	};
			_s.addToSession();
    	});
	}

	_s.getById = function(id, callback) {
		var params = {"id":1*id,"flags":"4294967295"}
    	Wialon.request('core/search_item', params, function(data) {
            for(var key in data.item.sens) {
                var sensor = data.item.sens[key];
                if(sensor.d) {
                    var tmp = sensor.d.substr(1);
                    tmp = tmp.split(':');
                    sensor._d = [];
                    sensor._dsrc = '';
                    for (var i = 0; i <= tmp.length; i = i + 2.0) {
                        if(tmp[i+1]) {
                            sensor._d.push({x:tmp[i],y:tmp[i+1]});
                            sensor._dsrc += tmp[i]+"\t"+tmp[i+1]+"\n";
                        }
                    }
                }
            }
    		callback(data.item);
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