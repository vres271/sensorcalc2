Main.service('SensorTblParser', function() {

  var _s = this;

	_s.getDataFormat = function(data) {
    var result = {
      parser: 'standart'
      ,type: ''
      ,sensors_n: 1
      ,sensors: []
    }
    if(data) {
      if(data.file) {
        if(data.file.type) {
          result.type = data.file.type;
          if(data.file.type === 'text/xml') {
            var x2js = new X2JS();
            var content = x2js.xml_str2json(data.content);
            if(content) {
              if(content.vehicle) {
                if(content.vehicle.sensor) {
                  result.parser = 'omnicomm';
                  if(content.vehicle.sensor.length) {
                    result.sensors_n = content.vehicle.sensor.length;
                    for(var key in content.vehicle.sensor) {
                      var block = content.vehicle.sensor[key];
                      if(block.value) {
                        if(block.value[block.value.length-1]) {
                          var last_row = block.value[block.value.length-1];
                          if(last_row._code && last_row.__text) {
                            var sensor = {
                              max: last_row.__text
                              ,number: block._number
                            } 
                            result.sensors.push(sensor);
                          }
                        }
                      }
                    }
                  } else {
                    result.sensors_n = 1;
                  }
                  return result;
                }
              }
            }
          } else if (data.file.type === 'text/plain') {
            var content = data.content.split("\n");
            if(content[0]) {
              var row = content[0];
              if(/\d+\.\d+-\d+,*\d*;/g.test(row)) {
                result.parser = 'italon';
                return result;
              }
            }
          }
        }
      }
    }
		return result;
	}

	_s.parseTbl = function(sensor) {

        var _dsrc = sensor._dsrc;
        var parser = sensor._parser;
        var _d = [];
        var darr = [];

        return {
            standart: function() {
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
            ,omnicomm: function() {
                var x2js = new X2JS();
                var content = x2js.xml_str2json(_dsrc);
                if(content) {
                    if(content.vehicle) {
                        if(content.vehicle.sensor) {
                            if(content.vehicle.sensor.length) { // несколько датчиков
                                if(sensor._dsrc_sensor_index) {
                                  if(content.vehicle.sensor[sensor._dsrc_sensor_index]) {
                                    var sens = content.vehicle.sensor[sensor._dsrc_sensor_index];
                                  } else {
                                    var sens = content.vehicle.sensor[0];
                                  }
                                } else {
                                  var sens = content.vehicle.sensor[0];
                                }
                            } else { // один датчик
                                var sens = content.vehicle.sensor;
                            }
                            if(sens.value) {
                                for(var key in sens.value) {
                                    var row = sens.value[key];
                                    var x = 1*row._code;
                                    var y = row.__text/10;
                                    if(!isNaN(x) && !isNaN(y)) {
                                        _d.push({x:x,y:y});
                                        darr.push(x);
                                        darr.push(y);
                                    } else {
                                        _d.push({error: 'Parse error on: "'+row.join(' ')+'"'});
                                    }
                                }
                            }
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
            ,italon: function() {
                _dsrc = _dsrc.split("\n");
                for(var key in _dsrc) {
                    var row = _dsrc[key].replace(/;+/g, '');
                    row = row.replace(/^[0-9]*\./g, '');
                    row = row.replace(/\s+/g, '\t');
                    row = row.replace(/\,+/g, '.');
                    row = row.replace(/\t{2,}/g,'\t');
                    row = row.replace(/\-/g,'\t');
                    if(row) {
                        row = row.split("\t");
                        var x = parseFloat(row[0], 10);
                        var y = parseFloat(row[1], 10);
                        if(!isNaN(x) && !isNaN(y)) {
                            _d.push({x:1*x,y:1*y});
                            darr.push(x);
                            darr.push(y);
                        } else {
                          if(key >= _dsrc.length-2) {
                            break;
                          } else {
                            _d.push({error: 'Parse error on: "'+row.join(' ')+'"'});
                          }
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
        }[parser]();
	}
  
});