Main.service('HWTypes', ['Wialon'
    ,function(Wialon){
	var _s = this;
	_s.items = [];
	_s.get = function() {
    	Wialon.request('core/get_hw_types', {}, function(data) {
        	_s.items = data;
        	_s.index = {
        		id: createIndex(data, 'id')
        	};
    	});
	}
}]);