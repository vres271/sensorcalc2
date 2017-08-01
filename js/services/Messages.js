Main.service('Messages', function(Wialon, State){
	var _s = this;
    _s.items = [];
    _s.layer = null;
	_s.unit_id = '';
    _s.get = function(id, timeFrom, timeTo, callback) {
        if(!timeTo) timeTo = State.now.ut;
        if(!timeFrom) timeFrom = timeTo - 86400;
        if(typeof timeFrom === 'object') timeFrom = parseInt(timeFrom.getTime()/1000);
        if(typeof timeTo === 'object') timeTo = parseInt(timeTo.getTime()/1000);
        _s.createLayer(id, timeFrom, timeTo, function() {
            _s.getMessages(0,10000000, callback);
        });
    }
	_s.createLayer = function(id, timeFrom, timeTo, callback) {
    	Wialon.request('render/create_messages_layer', {
            "layerName":"messages"
            ,"itemId":id
            ,"timeFrom": timeFrom //1501444800
            ,"timeTo": timeTo //1501531199
            ,"tripDetector":0
            ,"flags":0
            ,"trackWidth":4
            ,"trackColor":"cc0000ff"
            ,"annotations":0,
            "points":1,
            "pointColor":"cc0000ff",
            "arrows":1
        }, function(data) {
            if(!data.error) {
        	    _s.layer = data;
                _s.unit_id = id;
                if(callback) callback(data);
            }
    	});
	}
    _s.getMessages = function(from, to, callback) {
        if(!_s.layer) return false;
        Wialon.request('render/get_messages', {
            "layerName": _s.layer.name,
            "indexFrom":from,
            "indexTo":to,
            "unitId": String(_s.unit_id)
        }, function(data) {
            if(!data.error) {
                _s.items = data;    
                if(callback) callback(data);
            }
        });

    }
});



