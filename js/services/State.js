Main.service('State', function($interval) {
  var _s = this;

  _s.now = {
    utm: parseInt(new Date().getTime())
    ,ut: parseInt(new Date().getTime()/1000)
  };

  _s.units_list = {
    filter: {
    }
    ,custom_filter: {
      // mint:0
      // ,maxt:9261440000
    }
    ,orderby: ['crt','nm']
    ,limit: 25
  }

  _s.messages = {
    limit: 25
    ,timeFrom: new Date(_s.now.ut - 86400)
    ,timeTo: new Date(_s.now.ut)
  }

  $interval(function() {
    _s.now.utm = parseInt(new Date().getTime());
    _s.now.ut = _s.now.utm/1000;
  },1000);

  _s.default = angular.copy(_s);



  _s.resetFilter = function(key) {
    if(!_s[key]) return;
    _s[key].filter = angular.copy(_s.default[key].filter);
    _s[key].custom_filter = angular.copy(_s.default[key].custom_filter);
  }

});