Main.service('WCRMRights',  ['GlomosCRM'
    ,function(GlomosCRM){

	var _s = this;
	_s.items = [];
	_s.get = function(params) {
		GlomosCRM.request('wcrmrights', 'get', params, function(data) {
			_s.items = data;
			_s.items.inv = {
				ref: {
					alias: ArrayFlip(_s.items.ref.alias)
					,types: ArrayFlip(_s.items.ref.types)
				}
			}
			_s.items.inv.tree = {}
			for(var key in _s.items.ref.tree) {
				var byobject = _s.items.ref.tree[key];
				var name = _s.items.inv.ref.types[key];
				_s.items.inv.tree[name] = {};
				for(var key2 in byobject) {
					var byright = byobject[key2]
					_s.items.inv.tree[name][byright.id] = {
						name: key2
						,alias: ArrayFlip(byright.alias)
					};
				}
			}
			log(_s.items)
		});
	}

	_s.getRef = function(params) {
		GlomosCRM.request('wcrmrights', 'getref', params, function(data) {
			_s.items.ref = data.ref;
			_s.items.inv = {
				ref: {
					alias: ArrayFlip(_s.items.ref.alias)
					,types: ArrayFlip(_s.items.ref.types)
				}
			}
			_s.items.inv.tree = {}
			for(var key in _s.items.ref.tree) {
				var byobject = _s.items.ref.tree[key];
				var name = _s.items.inv.ref.types[key];
				_s.items.inv.tree[name] = {};
				for(var key2 in byobject) {
					var byright = byobject[key2]
					_s.items.inv.tree[name][byright.id] = {
						name: key2
						,alias: ArrayFlip(byright.alias)
					};
				}
			}
			log(_s.items)
		});
	}

	function ArrayFlip( trans ) {
	    var key, tmp_ar = {};
	    for ( key in trans ) {
	        if ( trans.hasOwnProperty( key ) ) {
	            tmp_ar[trans[key]] = key;
	        }
	    }
	    return tmp_ar;
	}

	_s.saveRight = function(params, callback) {
		GlomosCRM.request('wcrmrights', 'save', params, function(data) {
			if(data.added && data.id) {
				_s.get();
			}
			if(callback) callback(data);
		});
	}

}]);