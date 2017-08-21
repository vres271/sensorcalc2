Main.controller('MainCtrl', function($scope, Ready,  WaitFor, State, Wialon, Units, HWTypes, Options, GlomosCRM) {
	
	$scope.wialon = Wialon;
	$scope.ready = Ready;
	$scope.now = State.now;
	Options.load();
	$scope.opt = Options.item;

	$scope.gcrm = GlomosCRM;

	
	$scope.path = location.host+location.pathname;
	
	var sid_from_url = Wialon.checkURLForSID();
	var sid_from_storage = Wialon.storage.getItem('sid');
	if(sid_from_url) {
		var sid = sid_from_url;
	} else {
		var sid = sid_from_storage;
	}

	Wialon.duplicate(sid,false,function() {
		location.hash = '';
		Ready.reset();
	});
	
	WaitFor(function() {return Wialon.auth;} ,function() {
		if(Units.items.length===0) Units.get();
		if(HWTypes.items.length===0) HWTypes.get();
		GlomosCRM.login();
	});

	$scope.logout = function() {
		Ready.wialon = false;
		Wialon.stop(function() {
			location.hash = '';
		});
	}
	
});