Main.service('WCRMCompanies',  ['GlomosCRM'
    ,function(GlomosCRM){

	var _s = this;
	_s.items = [];
	_s.get = function(params, callback) {
		GlomosCRM.request('companies','get',{}, function(data) {			
			if(!data.error) {
				_s.items = data.items;
	        	_s.index = {
	                id: createIndex(data.items, 'id')
	                ,wid: createIndex(data.items, 'wid')
	        	};
	        	log(_s.index)
			} else {
				log(data.error);
			}
		});
	}




}]);