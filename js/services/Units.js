Main.service('Units', function(Wialon){
	var _s = this;
	_s.items = [];
	_s.get = function() {
        var params = {"spec":{"itemsType":"avl_unit","propName":"sys_name","propValueMask":"*","sortType":"sys_name"},"force":1,"flags":1439,"from":0,"to":10000};
		//var params = {"spec":{"itemsType":"avl_unit","propName":"sys_name","propValueMask":"*","sortType":"sys_name"},"force":1,"flags":1439,"from":3300,"to":3400};
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
               sensor.c = angular.fromJson(sensor.c);
               sensor._copy = _s.getClearSensor(sensor);
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

    _s.saveUnit = function(item, callback) {
        var params = {
          "params":[
            {"svc":"item/update_name","params":{"itemId":item.id,"name":item.nm}}
            ,{"svc":"unit/update_device_type","params":{"itemId":item.id,"deviceTypeId":item.hw,"uniqueId":item.uid}}
            ,{"svc":"unit/update_phone","params":{"itemId":item.id,"phoneNumber":item.ph}}
            ,{"svc":"unit/update_access_password","params":{"itemId":item.id,"accessPassword":item.psw}}
          ],
        "flags":0
        };
        params.params = params.params.concat(_s.prepareSensors(item));
        Wialon.request('core/batch', params, function(data) {
            if(callback) callback(data);
        });        
    }

    _s.prepareSensors = function(item) {
      var batch = [];
      if(item.sens) {
        var sensors = angular.copy(item.sens);
        for(var key in sensors) {
          var sensor = sensors[key];
          sensor._changed = _s.isSensorChanged(sensor);
          sensor.c = angular.toJson(sensor.c);
          if(sensor.id===0) { // create sensor
            if(!sensor._deleted) {
              sensor.callMode = "create";
              sensor.itemId = item.id;
              batch.push({"svc":"unit/update_sensor",params:sensor});
            }
          } else {
            if(sensor._deleted) {
              sensor.callMode = "delete";
              sensor.itemId = item.id;
              batch.push({"svc":"unit/update_sensor",params:sensor});
            } else if (sensor._changed) {
              sensor.callMode = "update";
              sensor.itemId = item.id;
              batch.push({"svc":"unit/update_sensor",params:sensor});
            }
          }
        }
      }
      return batch;
    }

    _s.getClearSensor = function(sensor) {
        var sensor_copy = angular.copy(sensor);
        for(var key in sensor_copy) {
            if(key[0]) {
                if(key[0]==='_' || key === 'callMode' || key === 'itemId') {
                    delete sensor_copy[key];
                }
            }
        }
        return sensor_copy;
    }

    _s.isSensorChanged = function(sensor) {
        var new_sensor = _s.getClearSensor(sensor);
        var old_sensor = sensor._copy;
        return angular.toJson(new_sensor) !== angular.toJson(old_sensor);
    }

    _s.parceSensorTable = function(sensor) {
        if(!sensor._dsrc) {
            sensor._d = [];
            sensor.d = '';
            sensor.tbl = [];
            return;
        };
        var _dsrc = sensor._dsrc.split("\n");
        var darr = [];
        sensor._d = [];
        sensor.tbl = [];
        for(var key in _dsrc) {
            var row = _dsrc[key].replace(/;+/g, '\t');
            row = row.replace(/\s+/g, '\t');
            row = row.replace(/\,+/g, '.');
            row = row.replace(/\t{2,}/g,'\t');
            row = row.split("\t");
            var x = parseFloat(row[0], 10);
            var y = parseFloat(row[1], 10);
            if(!isNaN(x) && !isNaN(y)) {
                sensor._d.push({x:x,y:y});
                darr.push(x);
                darr.push(y);
            } else {
                sensor._d.push({error: 'Parse error on: "'+row.join(' ')+'"'});
            }
        }
        if(darr.length>0) {
            sensor.d = '|'+darr.join(':');
        }
        if(sensor._d[1]) {
            if(!isNaN(sensor._d[1].x) && !isNaN(sensor._d[1].y) && !sensor._d[0].error) {
                sensor.tbl.push({x:sensor._d[0].x-1 , a: 0 , b: -348201.3876,});
                var x1=0;
                var y1=0;
                for(var key in sensor._d) {
                    if(!sensor._d[key].error) {
                        var x2 = sensor._d[key].x;
                        var y2 = sensor._d[key].y;
                        if (1*key) {
                          var a = (y2-y1)/(x2-x1);
                          var b = y2-a*x2;
                          sensor.tbl.push({'x': Math.round(1*x1), 'a': Math.round(1000000000000*a)/1000000000000, 'b': Math.round(10000000000*b)/10000000000});
                        }
                        x1 = x2;
                        y1 = y2;
                    }
                }
            }        
        }
    }


});