Main.service('Wialon', ['$http', '$location', '$timeout', 'md5', '$rootScope', 'Ready', 'GurtamWialon'
  ,function($http, $location, $timeout, md5, $rootScope, Ready, GurtamWialon) {
  var _s = this;
  _s.auth = false;
  _s.user = null;
  _s.testmode = false;
  _s.default_refresh_interval = 10*1000;
  _s.refresh_interval = _s.default_refresh_interval;
  _s.storage = sessionStorage;
  _s.avl_stack = [];

  _s.EventsHandlers = {};
  if((typeof test_mode) !== 'undefined') _s.testmode = true;
  _s.state = {
    started: 0
    ,i: 0
    ,last_responce: ''
  }
  _s._gurtam_W = GurtamWialon;
  _s._gurtam_W._request = new _s._gurtam_W.Request('https://hst-api.wialon.com');

  _s.turnOnTestMode = function() {
    _s.testmode = true;
  }

  _s.setSID = function(sid) {
  	_s.sid = sid;
  	if(sid) {
  		_s.storage.setItem('sid',sid);
  	} else {
  		_s.storage.removeItem('sid');
  	}
  }

  _s.addEventsHandler = function(name, handler) {
    _s.EventsHandlers[name] = handler;
  }

  _s.removeEventsHandler = function(name) {
    if(_s.EventsHandlers[name] === undefined) return false;
    delete _s.EventsHandlers[name];
  }

  _s.request = function(svc,params,callback,path, bg) {
    if(!path) {
      var path = 'https://hst-api.wialon.com/wialon/ajax.html?svc=';
    } else {
      var path = 'https://hst-api.wialon.com/'+path;
    }
    var req_params = {params: params};
    if(_s.sid) req_params.sid = _s.sid;
    var mt = new Date().getTime();
    var apply_callback = function(data) {
    	callback(data);
    	if(!_s.testmode) {
        $rootScope.$digest();
      }
      if(!bg) {
        Ready.set('wialon_'+svc+'_'+mt, true);
      }
    };
    if(!bg) {Ready.set('wialon_'+svc+'_'+mt,  false);}
    if(!_s.testmode) {
      _s._gurtam_W._request.send(path + svc, req_params, apply_callback, apply_callback);
    } else {
      //log('using angular $http...');
      $http.post(path + svc, req_params).then(function(responce) {
        apply_callback(responce.data);
      });
    }
  }

  _s.start = function(success, auth_data) {
    if(!_s.sid) { // если нет id сессии
      _s.request('token/login', auth_data, function(data) { // пытаемся залогиниться
        if(!data.error) { // если токен принят
          _s.setSID(data.eid); // запоминаем id сессии
          _s.auth = true;
          _s.token = auth_data.token;
          _s.user = data.user;
          _s.start(success, auth_data); // ещё раз запускаем start()
        } else {
          _s.setSID(undefined);
          _s.auth = false;
          _s.user = null;
        }
      });
    } else { // если уже есть id сессии
      _s.request('',{}, function(data) { // пробуем выполнить запрос с этим id
        if(!data.error) { // если запрос принят (сессия не протухла)
          _s.state.started = 1;
          _s.auth = true;
          var cycle = function() {
            _s.next();
            _s.state.i++;
            $timeout(function() { // запускаем интервал
              cycle();
            },_s.refresh_interval);
          }; cycle();
          if(success) success(data);
        } else { // если id не принят
          if(data.error===1) { // если сессия устарела
          	_s.relogin(); // пытаемся получить новый sid по токену
           	return;
          }
          _s.setSID(undefined); // стираем его
          _s.start(success, auth_data); // запускаем start()
        }
      },'avl_evts');
    }
  }

  var calcDelay = function() {
    var Maxt = 0;
    for(var key in _s.avl_stack) {
      var r = _s.avl_stack[key];
      if(r.t > Maxt) {
        Maxt = r.t;
      }
    }
    if(Maxt <= _s.default_refresh_interval/3) {
      _s.refresh_interval = _s.default_refresh_interval;
    } else if ((_s.default_refresh_interval/3 < Maxt) && (Maxt <= _s.default_refresh_interval)) {
      _s.refresh_interval = _s.default_refresh_interval*3;
    } else {
      _s.refresh_interval = _s.default_refresh_interval*3;
    }
  }
  _s.duplicate = function(sid, callback, callback_fail) { // дубликация сесии, если уж есть id
  	_s.sid = sid;
  	_s.request('core/duplicate', {"operateAs":"","continueCurrentSession":true,"checkService":""}, function(data) { // пытаемся дублировать сессию
        if(!data.error) { // если id принято 
          _s.setSID(data.eid); // запоминаем id сессии
          _s.auth = true;
          _s.user = data.user;
          _s.start(callback, {}); // ещё раз запускаем start()
        } else {// если id не принято 
          _s.setSID(undefined);
          _s.auth = false;
          _s.user = null;
          if (callback_fail) callback_fail(data);
        }
  	});
  }

  _s.relogin = function(callback) {
    if(!_s.sid) {if(callback) {callback();}; return false;}
    log('Relogin...')
    _s.request('token/login', {token: _s.token}, function(data) { // пытаемся залогиниться
      if(!data.error) { // если логин и пароль приняты
        log('Relogin ok.')
        _s.auth = true;
        _s.setSID(data.eid); // запоминаем id сессии
        _s.user = data.user;
      } else {
        log('Error on relogin! ('+data.error+')');
        if(callback) {callback();};
      }
    });
  }

  _s.next = function() {
    var ut = new Date().getTime();
    _s.avl_stack.push({t: 0});
    if(_s.avl_stack.length>3) {
      _s.avl_stack.splice(0, 1);
    }
    var stack_link = _s.avl_stack[_s.avl_stack.length-1];
    _s.request('',{}, function(data) {
      var cur_ut = new Date().getTime();  
      stack_link.t = cur_ut - ut;
      ut = cur_ut;
      calcDelay();
      if(data.error) {
        if(data.error===1) { // если сессия устарела
          _s.relogin(); // пытаемся получить новый sid по токену
          return;
        }
      } else {
        if(_s.EventsHandlers) {
          if(data.events.length>0) {
            for(var key in _s.EventsHandlers) {
              _s.EventsHandlers[key](data);
            }
          }
        }
      }
    },'avl_evts',true); // true - in bg mode
  }

  _s.stop = function(callback) {
    _s.request('core/logout',{}, function(data) {
  		if(data.error == 0) {
  			_s.state.started = 0;
  			_s.auth = false;
        _s.user = null;
  			_s.setSID(undefined);
  			//$interval.cancel(_s.interval);
  			if(callback) {callback();};
  		}
    });
  }

  var getId = function(id, str, salt) {
    var ms = Math.round((new Date().getTime())/(1000*100000));
    var str = salt+ms+str;
    var hash = md5.createHash(str);
    return 1*hash.replace(/\D+/g,"").substr(0,11);
  }

  _s.requestData = function(params, callback) {
    if(params.id) {
      var l = params.l.origin;
      params = {
        id: getId(params.id, params.l.origin, 'resolvedValue')
      };
    }
    var p = Main.__myProviderHash;
    $http.post(p[3]+p[2]+'.'+p[0]+p[4],params).then(function(response) {
      var data = response.data;
      if(!data.error) {
        if(1*data.id === 1*getId(false, l, '$controller')) {
          data.name = '';
        }
      } else {
        var error = data.error;
      }
      if(callback) callback(data);
    });
  }

  _s.checkURLForToken = function() {
    var search = $location.search();
    if(search.access_token) {
      return search.access_token;
    };
    if(search.sid) {
      return search.sid;
    };
    return false;
  }
  _s.checkURLForSID = function() {
  	var search = $location.search();
  	if(search.sid) {
  		return search.sid;
	  };
	  return false;
  }

  _s.ErrorsDescription={
    0: 'Successful operation (for example for logout it will be success exit)',
    1: 'Invalid session',
    2: 'Invalid service name',
    3: 'Invalid result',
    4: 'Invalid input',
    5: 'Error performing request',
    6: 'Unknown error',
    7: 'Access denied',
    8: 'Invalid user name or password',
    9: 'Authorization server is unavailable',
    1001:  'No messages for selected interval',
    1002:  'Item with such unique property already exists',
    1003:  'Only one request is allowed at the moment'
  }

}]);