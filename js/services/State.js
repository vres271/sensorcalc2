Main.service('State', ['$interval', '$filter'
  ,function($interval, $filter) {
  var _s = this;

  _s.now = {
    utm: parseInt(new Date().getTime())
    ,ut: parseInt(new Date().getTime()/1000)
  };

  _s.units_list = {
    filter: {
    }
    ,custom_filter: {
      dt:'86400'
    }
    ,orderby: ['crt','nm']
    ,orderby_reverse: false
    ,limit: 25
    ,show: {
      accounts_nm: true
      ,nm: true
      ,uid: true
      ,hw: true
      ,ph: true
      ,lmsg_t: true
      ,lmsg_v: false
      ,online: true
      ,p_accounts_nm: false
      ,crt_nm: false
      ,ct: false
    }
  }

  _s.messages = {
    limitfrom: 0
    ,limitto: 25
    ,timeFrom: new Date(_s.now.utm - 86400000)
    ,timeTo: new Date(_s.now.utm) 
    ,filter: {
    }
  }

  _s.accounts_list = {
    filter: {
    }
    ,orderby: ['crt','nm']
    ,limit: 25
  }

  _s.users_list = {
    filter: {
    }
    ,orderby: ['crt','-id']
    ,limit: 25
    ,show: {
      nm: true
      ,crt_nm: true
      ,accounts_nm: true
      ,p_accounts_nm: true
    }
  }


  $interval(function() {
    _s.now.utm = parseInt(new Date().getTime());
    _s.now.ut = parseInt(_s.now.utm/1000);
  },1000);

  _s.default = angular.copy(_s);

  _s.resetFilter = function(key) {
    if(!_s[key]) return;
    _s[key].filter = angular.copy(_s.default[key].filter);
    _s[key].custom_filter = angular.copy(_s.default[key].custom_filter);
  }

}]);