Main.service('Wialon', function($http, $location, $interval, $rootScope, Ready, GurtamWialon){
	var _s = this;
    _s.auth = false;
    _s.user = null;
    _s.testmode = true;
    _s.state = {
      started: 0
      ,i: 0
      ,last_responce: ''
    }
    _s._gurtam_W = GurtamWialon;
    _s._gurtam_W._request = new _s._gurtam_W.Request('https://hst-api.wialon.com');

    _s.turnOnTestMode = function(argument) {
      _s.testmode = true;
    }

    _s.setSID = function(sid) {
    	_s.sid = sid;
    	if(sid) {
    		sessionStorage.setItem('sid',sid);
    	} else {
    		sessionStorage.removeItem('sid');
    	}
    }

    _s.request = function(svc,params,callback,path, bg) {
      if(!path) {
        var path = 'https://hst-api.wialon.com/wialon/ajax.html?svc=';
      } else {
        var path = 'https://hst-api.wialon.com/'+path;
      }
      var req_params = {params: params};
      if(_s.sid) req_params.sid = _s.sid;
      var apply_callback = function(data) {
      	callback(data);
      	if(!bg) {
          Ready.parts.wialon = true;
        }
      	if(!_s.testmode) {
          $rootScope.$digest();
        }
      };
      if(!bg) {Ready.parts.wialon = false;}
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
            _s.interval = $interval(function() { // запускаем интервал
              _s.next();
              _s.state.i++;
            },180000);
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

    _s.duplicate = function(callback, sid) { // дубликация сесии, если уж есть id
    	_s.sid = sid;
    	_s.request('core/duplicate', {"operateAs":"","continueCurrentSession":true,"checkService":"cms_manager"}, function(data) { // пытаемся дублировать сессию
          if(!data.error) { // если id принято 
            _s.setSID(data.eid); // запоминаем id сессии
            _s.auth = true;
            _s.user = data.user;
            _s.start(callback, {}); // ещё раз запускаем start()
          } else {// если id не принято 
            _s.setSID(undefined);
            _s.auth = false;
            _s.user = null;
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
      _s.request('',{}, function(data) {
        if(data.error) {
          if(data.error===1) { // если сессия устарела
            _s.relogin(); // пытаемся получить новый sid по токену
            return;
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
    			$interval.cancel(_s.interval);
    			if(callback) {callback();};
    		}
      });
	  }

    _s.checkURLForToken = function() {
    	var search = $location.search();
    	if(search.access_token) {
    		return search.access_token;
		  };
		  return false;
    }

});