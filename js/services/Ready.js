Main.service('Ready', function() {

	var _s = this;

  _s.all = true;
  _s.parts = {
    wialon: true
  }

  _s.allParts = function() {
  	_s.all = true;
  	for(var key in _s.parts) {
  		if(!_s.parts[key]) {
			_s.all = false;
			return _s.all;
  		}
  	}
  	return _s.all;
  }

  _s.set = function(key,value) {
    _s.parts[key] = value;
    return _s.allParts();
  }

  _s.reset = function(key,value) {
    for(var key in _s.parts) {
      _s.parts[key] = true;
    }
    return _s.allParts();
  }
  
});