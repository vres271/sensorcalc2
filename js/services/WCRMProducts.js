Main.service('WCRMProducts',  ['GlomosCRM'
    ,function(GlomosCRM){

	var _s = this;
	_s.items = [];
	_s.get = function(params, callback) {
		GlomosCRM.request('products','get',{}, function(data) {			
			if(!data.error) {
				_s.items = data.items;
	        	_s.index = {
	                id: createIndex(data.items, 'id')
	                ,am_products_id: createIndex(data.items, 'am_products_id')
	        	};
			} else {
				log(data.error);
			}
		});
	}



}]);