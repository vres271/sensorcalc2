Main.service('Options', function() {

	var _s = this;
	_s.storage = localStorage;
	var default_options = {
		wialon_crm_token: ''
		,unit_online_max_interval: 300
		,language: 'ru'
		,wialon_version: 'hosting'
		,wialon_local_paths: [{addr:''}]
		,wialon_local_paths_selected: 0
	}
	var paths = {
		hosting: {
			request_url:'https://hst-api.wialon.com'
			,site_url:'https://hosting.wialon.com'
		} 
		,local: {
			request_url:'' // http://cms-05.garage-gps.com
			,site_url:''
		}
	}
	_s.item = {};

	_s.getPaths = function() {
		if(_s.item.wialon_version==='hosting') return paths[_s.item.wialon_version];
		if(_s.item.wialon_version==='local') {
			return {
				request_url: _s.item.wialon_local_paths[_s.item.wialon_local_paths_selected].addr
				,site_url: _s.item.wialon_local_paths[_s.item.wialon_local_paths_selected].addr
			};
		}
	}


	_s.load = function() {
		var item_from_storage = _s.storage.getItem('sc_options');
		if(!item_from_storage) {
			_s.item = default_options;
			return;
		}
		try {
			_s.item = angular.fromJson(item_from_storage);
		} catch(e) {
			_s.item = default_options;
		}
		for(var key in default_options) {
			var def = default_options[key];
			if(_s.item[key] === undefined) {
				_s.item[key] = def;
			}
		}
	}

	_s.save = function() {
		_s.storage.setItem('sc_options', angular.toJson(_s.item));
	}

	_s.reset = function() {
		_s.item = default_options;
		_s.save();
	}
  
});