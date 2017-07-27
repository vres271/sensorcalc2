Main.service('Units', function(Wialon){
	var _s = this;
	_s.items = [];
	_s.get = function() {
        var params = {"spec":{"itemsType":"avl_unit","propName":"sys_name","propValueMask":"*","sortType":"id"},"force":1,"flags":1439,"from":1500,"to":2000};
        //var params = {"spec":{"itemsType":"avl_unit","propName":"sys_name","propValueMask":"*","sortType":"id"},"force":1,"flags":1439,"from":3000,"to":3500};
		//var params = {"spec":{"itemsType":"avl_unit","propName":"sys_name","propValueMask":"*","sortType":"id"},"force":1,"flags":1439,"from":3300,"to":3400};
    	Wialon.request('core/search_items', params, function(data) {
        	_s.items = data.items;
        	_s.index = {
                id: createIndex(data.items, 'id')
                ,uid: createIndex(data.items, 'uid')
                ,ph: createIndex(data.items, 'ph')
        	};
			_s.addToSession();
    	});
	}

	_s.getById = function(id, callback) {
		var params = {"id":1*id,"flags":"4294967295"}
    	Wialon.request('core/search_item', params, function(data) {
            data.item._index = {
                sens: {
                    n: createIndex(data.item.sens, 'n')
                }
            };
            for(var key in data.item.sens) {
                var sensor = data.item.sens[key];
                sensor._id = sensor.id;
                if(sensor.d) {
                    var tmp = sensor.d.split('|'); // здесь хранится одновременно описание датчика и исходная таблица (x,y), разделённые символом "|", охуенно, не правда ли?
                    sensor.d = tmp[0]; // оставляем здесь только описание
                    if(tmp[1]) {
                        sensor._dstr = tmp[1]; // , строку с таблицей переносим сюда
                        var d_dsrc = _s.DSTRtoDandDSRC(sensor._dstr); // из строки X:Y,.. получаем..
                        sensor._d = d_dsrc._d; // таблицу XY
                        sensor._dsrc = d_dsrc._dsrc; // и таблицу для текстареа
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
        var item = angular.copy(item);
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
          for(var key1 in sensor.c) { // удаляет все пустые свойства у sensor.c
            var prop = sensor.c[key1];
            if(prop === '') {
                delete sensor.c[key1];
            }
          }
          sensor.c = angular.toJson(sensor.c);
          if(sensor._dstr) sensor.d = sensor.d+'|'+sensor._dstr; // собираем обратно это гавно из описания|строковой таблицы 
          if(sensor.id===0) { // create sensor
            if(!sensor._deleted) {
              sensor.callMode = "create";
              sensor.itemId = item.id;
              batch.push({"svc":"unit/update_sensor",params:_s.delete_P(sensor)});
            }
          } else {
            if(sensor._deleted) {
              sensor.callMode = "delete";
              sensor.itemId = item.id;
              batch.push({"svc":"unit/update_sensor",params:_s.delete_P(sensor)});
            } else if (sensor._changed) {
              sensor.callMode = "update";
              sensor.itemId = item.id;
              batch.push({"svc":"unit/update_sensor",params:_s.delete_P(sensor)});
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

    _s.delete_P = function(sensor) {
        for(var key in sensor) {
            if(key[0]) {
                if(key[0]==='_') {
                    delete sensor[key];
                }
            }
        }
        return sensor;
    }

    _s.isSensorChanged = function(sensor) {
        var new_sensor = _s.getClearSensor(sensor);
        var old_sensor = sensor._copy;
        return angular.toJson(new_sensor) !== angular.toJson(old_sensor);
    }

    _s.DSTRtoDandDSRC = function(_dstr) {
        var tmp = _dstr.split(':');
        var ret = {
            _d: []
            ,_dsrc: ''
        }
        for (var i = 0; i <= tmp.length; i = i + 2.0) {
            if(tmp[i+1]) {
                ret._d.push({x:1*tmp[i],y:1*tmp[i+1]});
                ret._dsrc += tmp[i]+"\t"+tmp[i+1]+"\n";
            }
        }
        return ret;
    }

    _s.DSRCtoDandDSTR = function(_dsrc) {
        var _d = [];
        var darr = [];
        _dsrc = _dsrc.split("\n");
        for(var key in _dsrc) {
              var row = _dsrc[key].replace(/;+/g, '\t');
              row = row.replace(/\s+/g, '\t');
              row = row.replace(/\,+/g, '.');
              row = row.replace(/\t{2,}/g,'\t');
              if(row) {
                  row = row.split("\t");
                  var x = parseFloat(row[0], 10);
                  var y = parseFloat(row[1], 10);
                  if(!isNaN(x) && !isNaN(y)) {
                      _d.push({x:1*x,y:1*y});
                      darr.push(x);
                      darr.push(y);
                  } else {
                      _d.push({error: 'Parse error on: "'+row.join(' ')+'"'});
                  }
              }
          }
        if(darr.length>0) {
            darr = darr.join(':');
        } else {
            darr = '';
        }
        return {_d: _d, _dstr: darr};
    }

    _s.DtoTBL = function(_d) {
        var tbl = [];
        if(_d[1]) {
            if(!isNaN(_d[1].x) && !isNaN(_d[1].y) && !_d[0].error) {
                // tbl.push({x:_d[0].x-1 , a: 0 , b: -348201.3876,});
                var x1=0;
                var y1=0;
                for(var key in _d) {
                    if(!_d[key].error) {
                        var x2 = _d[key].x;
                        var y2 = _d[key].y;
                        if (1*key) {
                          var a = (y2-y1)/(x2-x1);
                          var b = y2-a*x2;
                          tbl.push({'x': Math.round(1000000000000*x1)/1000000000000, 'a': Math.round(1000000000000*a)/1000000000000, 'b': Math.round(10000000000*b)/10000000000});
                        }
                        x1 = x2;
                        y1 = y2;
                    }
                }
            }        
        }
        return tbl;
    }

    _s.DtoDSRC = function(_d) {
        var _dsrc = '';
        for (var key in _d) {
            _dsrc += _d[key].x+"\t"+_d[key].y+"\n";
        }
        return _dsrc;
    }

    _s.parceSensorTable = function(sensor) {
        if(!sensor._dsrc) { // если поле очистили, то стираем все таблицы
            sensor._d = [];
            sensor._dstr = '';
            sensor.tbl = [];
            return;
        };
        var d_dstr = _s.DSRCtoDandDSTR(sensor._dsrc); // из содержимого текстареа получаем... 
        sensor._d = d_dstr._d; // таблицу XY...
        sensor._dstr = d_dstr._dstr; //  и строку X:Y,..
        sensor.tbl = _s.DtoTBL(sensor._d); // из таблицы XY получаем таблицу AXB
    }

    _s.createSensor = function(item) {
        var _id = 1;
        for(var key in item.sens) {
            var sensor = item.sens[key];
            if(sensor._id >= _id) {
                _id = sensor._id + 1;
            }
        }

        item.sens[_id] ={
            id:0
            ,_id:_id
            ,n:"ДУТ"
            ,t:"fuel level"
            ,d:""
            ,m:"l"
            ,p:""
            ,f:0
            ,c:{"act":0,"appear_in_popup":true,"ci":{},"cm":0,"mu":0,"show_time":false,"timeout":0,"uct":0}
            ,vt:0
            ,vs:0
            ,tbl:[]
            ,_d: []
            ,_dsrc: ""
            ,_dstr: ""
        };

        return _id;
    }

    _s.setAutoBounds = function(sensor) {
        if(sensor._d) {
            if(sensor._d[0]) {
               if(sensor._d[0].x!==undefined) {
                    if(!isNaN(sensor._d[0].x)) {
                        if(1*sensor._d[0].x===0) {
                            sensor._d[0].x = 0.1;
                            sensor.c.lower_bound = sensor._d[0].x;
                        } else {
                            sensor.c.lower_bound = 1*sensor._d[0].x;
                        }
                    }
                }
            }
            var l = sensor._d.length;
            if(l>1) {
                if(sensor._d[l-1].x!==undefined) { 
                    if(!isNaN(sensor._d[l-1].x)) {
                        sensor.c.upper_bound = 1*sensor._d[l-1].x;
                    }
                }
            }
            sensor._dsrc = _s.DtoDSRC(sensor._d) // из таблицы XY получаем таблицу для текстареа
            //sensor.tbl = _s.DtoTBL(sensor._d); // из таблицы XY получаем таблицу AXB
        }
    }

});