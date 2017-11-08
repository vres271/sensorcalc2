Main.service('WCRMConnector',  ['GlomosCRM', 'Users', 'Units'
    ,function(GlomosCRM, Users, Units){

	var _s = this;
	_s.i = '';

	_s.connect = function(items, callback) {
		_s.i = 0;
		var nextStep = function(i) {
			if(!items[i]) {if(callback) {callback();}; _s.i = ''; return;}
			var item = items[i];
			item._result = [];
			i++;
			_s.i = i;
			var creator = Users.index.id[item.crt];
			var units = _s.getAccountsUnits(item);
			var users = _s.getAccountsUsers(item);
			var params = {
				account: {
					wid: item.id
					,name: item.nm
				}
				,creator: {
					wid: creator.id
					,name: creator.nm
				}
				,units: units
				,users: users
			}
			GlomosCRM.request('connector','connect',params, function(data) {	
				item._result.push({message:data})
				item._checked = false;
				nextStep(i);
			},function(data) {	
				if(!item._result) item._result = [];
				item._result.push({error:true,message:data.message});
				nextStep(i);
			});
		}; nextStep(0);

	}

	_s.clear = function(accounts_id, callback) {
		GlomosCRM.request('connector','clear',{accounts_id: accounts_id}, function(data) {
			if(callback) callback(data);
		});
	}

	_s.clearAcc = function(accounts_id, callback) {
		GlomosCRM.request('connector','clearacc',{accounts_id: accounts_id}, function(data) {
			if(callback) callback(data);
		});
	}

	_s.getAccountsUnits = function(account) {
		var units = [];
		for(var key in Units.items) {
			var unit = Units.items[key];
			if(unit.bact === account.id) {
				units.push({
					wid:unit.id
					,name:unit.nm
					,uid:unit.uid
					,ph:unit.ph
					,hw:unit.hw
				});
			}
		}
		return units;
	}

	_s.getAccountsUsers = function(account) {
		var users = [];
		for(var key in Users.items) {
			var user = Users.items[key];
			if(user.bact === account.id) {
				users.push({
					wid:user.id
					,name:user.nm
				});
			}
		}
		return users;
	}



}]);