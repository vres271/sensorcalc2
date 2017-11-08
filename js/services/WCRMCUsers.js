Main.service('WCRMCUsers',  ['GlomosCRM'
    ,function(GlomosCRM){

	var _s = this;
	_s.items = [];
	_s.get = function(params, callback) {
		GlomosCRM.request('c_users','get',{}, function(data) {			
			if(!data.error) {
				_s.items = data.items;
	        	_s.index = {
	                id: createIndex(data.items, 'id')
	                ,wid: createIndex(data.items, 'wid')
	        	};
			} else {
				log(data.error);
			}
		});
	}

	_s.getAll = function(params, callback) {
		GlomosCRM.request('c_users','getall',{}, function(data) {			
			if(!data.error) {
	        	data.index = {
	                id: createIndex(data.items, 'id')
	                ,wid: createIndex(data.items, 'wid')
	        	};
				callback(data);
			} else {
				log(data.error);
			}
		});
	}



}]);