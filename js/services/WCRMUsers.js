Main.service('WCRMUsers',  ['GlomosCRM'
    ,function(GlomosCRM){

	var _s = this;
	_s.items = [];
	_s.get = function(params, callback) {
		GlomosCRM.request('users','get',{}, function(data) {			
			if(!data.error) {
				_s.items = data.items;
	        	_s.index = {
	                id: createIndex(data.items, 'id')
	        	};
			} else {
				log(data.error);
			}
		});
	}

	_s.getAll = function(params, callback) {
		GlomosCRM.request('users','getall',{}, function(data) {			
			if(!data.error) {
	        	data.index = {
	                id: createIndex(data.items, 'id')
	        	};
				callback(data);
			} else {
				log(data.error);
			}
		});
	}



}]);