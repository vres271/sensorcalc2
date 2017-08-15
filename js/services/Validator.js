Main.factory('Validator', function() {
  return function(item) {
    
    var _s = this;
    _s.parts = {};
    _s.errors = {};
    _s.item = item;
    _s.valid = true;
    
    _s.validate = function() {
      _s.valid = true;
      _s.errors = {};
      for(var key in _s.parts) {
        var partFunc = _s.parts[key];
        var data = partFunc(_s.item);
        _s.valid  = _s.valid & data.valid;
        if(!data.valid) {
          _s.errors[key] = {};
          if(data) _s.errors[key] = data;
        }
      }
    }

    _s.setPart = function(key, func) {
      _s.parts[key] = func;
    }

    return _s;
  }
});