Main.service('GlomosCRM', ['$http', 'Options'
	,function($http, Options) {

	var _s = this;
	//_s.url = 'http://62.76.187.239/crm/api/';
	_s.url = 'https://crm.glomos.ru/api/';
	_s.user = null;
	_s.auth = false;
	_s.error = null;
	_s.enabled = true;

	_s.login = function() {
		if(!_s.enabled) return;
		_s.user = null;
		_s.error = null;
		if(!Options.item.wialon_crm_token) return;
		$http.post(_s.url+'bytoken.php',{token: Options.item.wialon_crm_token}).then(function(response) {
			var data = response.data;
			if(!data.error) {
				if(data.sid) {
					_s.user = data;
					_s.auth = true;
				}
			} else {
				_s.error = data.error;
			}
		});
	}

	_s.request = function(c, m, params, callback) {
		if(!_s.auth) return;
		$http.post(_s.url+'?c='+c+'&m='+m+'&sid='+_s.user.sid,params).then(function(response) {
			var data = response.data;
			if(!data.error) {
				if(callback) callback(data);
			} else {
				log(data.error);
			}
		});
	}

	_s.getObject = function(wid, callback) {
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

  
}]);