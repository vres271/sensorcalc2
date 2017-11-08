Main.service('GlomosCRM', ['$http', 'Options'
	,function($http, Options) {

	var _s = this;
	//_s.url = 'http://62.76.187.239/crm/api/';
	//_s.url = 'https://crm.glomos.ru/api/';
	//_s.url = 'https://wialoncrm.com/';
	_s.url = 'wcrm.php';
	_s.url = 'api/';
	_s.account = null;
	_s.auth = false;
	_s.error = null;
	_s.enabled = true;

	_s.login = function(onsuccess) {
		if(!_s.enabled) return;
		_s.account = null;
		_s.auth = false;
		_s.error = null;
		if(!Options.item.wialon_crm_token) return;
		_s.request('account','login',{token: Options.item.wialon_crm_token}, function(data) {
			if(data.user.sid) {
				_s.account = data;
				_s.sid = _s.account.user.sid;
				_s.auth = true;
				if(onsuccess) onsuccess(data);
			}
		},function(data) {_s.error = data.message});
	}

	_s.request = function(o, m, params, callback, onerror) {
		if(!_s.enabled) return;
		//var url = _s.url+''+o+'/'+m+(_s.auth?'?sid='+_s.sid:'');
		if(!params) params = {};
		var url = _s.url+''+o+'/'+m;
		if(_s.auth) params.sid = _s.sid;
		$http.post(url,params).then(function(response) {
			var data = response.data;
			if(!data.error) {
				if(callback) callback(data);
			} else {
				if(onerror) {
					onerror(data);
				} else {
					log(data);
				}
			}
		});
	}

	_s.getObject = function(wid, callback) {
		return false;
		if(!_s.auth) return;
		_s.request('Objects', 'get', {wid:wid}, function(data) {
			var crm_object = null;
			if(data.body) {
				if(data.body.length === 1) {
					crm_object = data.body[0];
				} else {
					log('Dublicated CRM-object by one wid!');
				}
			}
			if(callback) callback(crm_object);
		})
	}

	_s.saveObject = function(item, crm_object, callback) {
		return false;
		if(!_s.auth) return;
		if(!crm_object) return;
		_s.request('Objects', 'save', {
			name: item.nm
			,uid: item.uid
			,hw_id: item.hw
			,phone: item.ph
			,id: crm_object.id			
		}, function(data) {
			if(callback) callback(data);
		})
	}

	// _s.getAccount = function(params, callback) {
	// 	$http.post(_s.url+'wcrm.php?obj=account&m=get&sid='+_s.account.sid,params).then(function(response) { //934f7600d5b927346a70184ba52d33cb
	// 		var data = response.data;
	// 		if(!data.error) {
	// 			if(callback) callback(data);
	// 		} else {
	// 			log(data.error);
	// 		}
	// 	});
	// }

	_s.createAccount = function(params, callback, onerror) {
		_s.request('account','create',params, function(data) {
			if(data.created) {
				if(data.wcrm_token) {
					Options.item.wialon_crm_token = data.wcrm_token;
					Options.save();
					_s.login();
				}
			}
			if(callback) callback(data);
		},onerror);
	}

	_s.getAmCredentials = function(callback, onerror) {
		_s.request('account','getamcredentials',{}, function(data) {
			if(callback) callback(data);
		}, onerror);
	}
 
	_s.gotoAm = function(params) {
		var elem = function(id) {
			return document.getElementById(id);
		}
		elem('amember-login').value = params.login;
		elem('amember-pass').value = params.pass;
		elem('amember-login_attempt_id').value = params.attempt_id;
		elem('am-login-form').submit();
	}

	_s.test = function(callback, onerror) {
		_s.request('account','test',{}, function(data) {
			log(data);
			if(callback) callback(data);
		}, onerror);
	}
 
	_s.test2 = function(callback, onerror) {
		_s.request('test_object','test_method',{}, function(data) {
			log(data);
			if(callback) callback(data);
		}, onerror);
	}
 

}]);