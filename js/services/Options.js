Main.service('Options', function() {

	var _s = this;
	_s.storage = localStorage;
	var default_options = {
		wialon_crm_token: ''
		,unit_online_max_interval: 300
		,language: 'en'
	}
	_s.item = {};


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
	}

	_s.save = function() {
		_s.storage.setItem('sc_options', angular.toJson(_s.item));
	}

	_s.reset = function() {
		_s.item = default_options;
		_s.save();
	}
  
});