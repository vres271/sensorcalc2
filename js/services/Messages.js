Main.service('Messages', ['$filter', 'Wialon', 'State'
    ,function($filter, Wialon, State){
	
    var _s = this;
    
    _s.items = [];
    _s.all_cols = {};
    _s.layer = null;
	_s.unit_id = '';
    _s.chart_data = [];
    _s.error = false;
    _s.limit = 3000;
    _s.time_shift = 60*60*6;
   
    _s.get = function(id, timeFrom, timeTo, callback) {
        if(_s.unit) {
            if(_s.unit.lmsg) {
                if(_s.unit.lmsg.t) {
                    timeTo = _s.unit.lmsg.t+300;
                }
            }
        }
        if(!timeTo) timeTo = State.now.ut;
        if(!timeFrom) timeFrom = timeTo - _s.time_shift;
        if(typeof timeFrom === 'object') timeFrom = parseInt(timeFrom.getTime()/1000);
        if(typeof timeTo === 'object') timeTo = parseInt(timeTo.getTime()/1000);
        _s.layer = null;
        _s.items = [];
        _s.all_cols = {};
        Wialon.removeEventsHandler('onUnitMessageRecieved');
        _s.createLayer(id, timeFrom, timeTo, function() {
            _s.getMessages(0,_s.limit, callback);
        });
    }

	_s.createLayer = function(id, timeFrom, timeTo, callback) {
        _s.error = false;
    	Wialon.request('render/create_messages_layer', {
            "layerName":"messages"
            ,"itemId":id
            ,"timeFrom": timeFrom
            ,"timeTo": timeTo
            ,"tripDetector":0
            ,"flags":0
            ,"trackWidth":4
            ,"trackColor":"cc0000ff"
            ,"annotations":0,
            "points":1,
            "pointColor":"cc0000ff",
            "arrows":1
        }, function(data) {
            _s.unit_id = id;
            if(!data.error) {
        	    _s.layer = data;
            } else {
                _s.error = data.error;
            }
            if(callback) callback(data);
    	});
	}

    _s.getMessages = function(from, to, callback) {
       if(!_s.layer) {
            callback();
            return false;
        }
        _s.error = false;
        Wialon.request('render/get_messages', {
            "layerName": _s.layer.name,
            "indexFrom":from,
            "indexTo":to,
            "unitId": String(_s.unit_id)
        }, function(data) {
            if(!data.error) {
                _s.items = _s.linerase(data);
                if(callback) callback(data);
            } else {
                _s.error = data.error;
            }
        });
    }

    _s.getLastMessages = function(unit_id, callback) {
        _s.error = false;
        Wialon.request('messages/load_interval', {
            "itemId": 1*unit_id,
            "lastTime":State.now.ut,
            "lastCount":100,
            "flags":1,
            "flagsMask":65281,
            "loadCount":100
        }, function(data) {
            log(data);
            return;
            if(!data.error) {
                _s.items = _s.linerase(data);
                if(callback) callback(data);
            } else {
                _s.error = data.error;
            }
        });
    }

    _s.prepareChartData = function(items, key_names, limit) {
        _s.chart_data = [];
        for(var key in items) {
            var msg = items[key];
            var row = {t:msg.t};
            for(var key2 in key_names) {
                var key_to_copy = key_names[key2];
                if(msg.p[key_to_copy] !== undefined) {
                    row[key_to_copy] = msg.p[key_to_copy];
                }
            }
            _s.chart_data.push(row);
        }
    }

    _s.linerase = function(items) {
        var l_items = [];

        for(var key in items) {
            var item = items[key];
            var l_item = {
                __i: 1*key
               ,__t: item.t
               //,__tD: new Date(item.t*1000)
            }
            if(_s.unit) {
                for(var key in _s.unit.sens) {
                    var sensor = _s.unit.sens[key];
                    l_item['_s_'+sensor.n] = $filter('ParamToSensorValue')(sensor, item, _s.unit);
                    _s.all_cols['_s_'+sensor.n] = true;
                }
            }
            for(var poskey in item.pos) {
                l_item['_pos_'+poskey] = item.pos[poskey];
                //_s.all_cols['_pos_'+poskey] = true;
            }
            for(var pkey in item.p) {
                l_item['_p_'+pkey] = item.p[pkey];
                _s.all_cols['_p_'+pkey] = true;
            }
            l_items.push(l_item);
        }
        return l_items;
    }

    _s.startNewMessageListener = function(callback) {
        Wialon.removeEventsHandler('onUnitMessageRecieved');
        Wialon.addEventsHandler('onUnitMessageRecieved', function(data) {
            for(var key in data.events) {
                var event = data.events[key];
                if(event.i) {
                    if(1*event.i === 1*_s.unit_id) {
                        if(event.t === 'm') {
                            var line_item = _s.linerase([event.d])[0];
                            line_item.__i = 1*_s.items.length;
                            _s.items.push(line_item);
                            _s.error = false;
                            if(callback) callback(line_item);
                        }
                    }
                }
            }
        });
    }


}]);



