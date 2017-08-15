Main.service('UnitFormValidator', function(Validator, Units) {
    var _s = this;

    _s.create = function(item) {
      _s.uv = new Validator(item);
      _s.validate = _s.uv.validate;
      _s.errClass = function(key) {
        return _s.uv.errors[key] ? 'has-error' : '';
      }
      _s.sens_errClass = function(key,sensor_id) {
        if(_s.uv.errors[key]) {
          if(_s.uv.errors[key].sensor_id === sensor_id) {
            return 'has-error';
          }
        }
      }
      _s.uv.setPart('nm', function(item) {
        var ret = {valid: true};
        if(item) {
          if(item.nm === undefined) {
            ret.valid = false;
            ret.msg = 'Name is empty!';
          }
        }
        return ret;
      });
      _s.uv.setPart('uid', function(item) {
        var ret = {valid: true};

            if(item.uid) {
              if(Units.index.uid[item.uid]) {
                if(Units.index.uid[item.uid].id !== item.id && item.hw && item.hw === Units.index.uid[item.uid].hw) {
                  ret.valid = false;
                  ret.msg = 'Unit with the same UID and HW Type already exists';
                  ret.link = '#/unit/'+Units.index.uid[item.uid].id;
                  ret.title = Units.index.uid[item.uid].nm;
                }
              }
            }
        
        return ret;
      });
      _s.uv.setPart('ph', function(item) {
        var ret = {valid: true};
            if(item.ph) {
              if(Units.index.ph[item.ph]) {
                if(Units.index.ph[item.ph].id !== item.id ) {
            ret.valid = false;
                    ret.msg = 'Unit with the same Phone already exists';
                    ret.link = '#/unit/'+Units.index.ph[item.ph].id; 
                    ret.title = Units.index.ph[item.ph].nm;
                }
              }
            }
        return ret;
      });
      _s.uv.setPart('sens_n', function(item) {
        var ret = {valid: true};
            if(item.sens) {
              for(var key in item.sens) {
                var sensor = item.sens[key];
                if(!sensor._deleted) {
                  if(sensor.n==='') {
                      ret.valid = false;
                      ret.msg = 'Errors in Sensors: Sensor #'+sensor.id+' - name is Empty';
                      ret.sensor_id = sensor.id;
                  }
                }
              }
            }
        return ret;
      });
      _s.uv.setPart('sens_d', function(item) {
        var ret = {valid: true};
            if(item.sens) {
              for(var key in item.sens) {
                var sensor = item.sens[key];
                if(!sensor._deleted) {
                  if(sensor._d) {
                    for(var key2 in sensor._d) {
                      var row = sensor._d[key2];
                      if(row.error) {
                        ret.valid = false;
                        ret.msg = 'Errors in Sensors: Sensor #'+sensor.id+' '+sensor.n+' - Table parse error';
                        ret.sensor_id = sensor.id;
                      }
                    }
                  }
                }
              }
            }
        return ret;
      });
      return _s.uv
    }
    return _s;
});