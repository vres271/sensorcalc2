Main.service('State', function($interval) {

	var _s = this;
  _s.units_list = {
    filter: {
    }
    ,custom_filter: {
      mint:0
      ,maxt:9261440000
    }
    ,orderby: ['crt','nm']
    ,limit: 25
  }

  _s.now = {
    ut:0
  };
  $interval(function() {
    _s.now.ut = parseInt(new Date().getTime()/1000);
  },1000);

  _s.default = angular.copy(_s);



  _s.resetFilter = function(key) {
    if(!_s[key]) return;
    _s[key].filter = angular.copy(_s.default[key].filter);
    _s[key].custom_filter = angular.copy(_s.default[key].custom_filter);
  }

});