Main.controller('MainCtrl', function($scope, Ready, $http, $interval, WaitFor, State, Wialon, Units, HWTypes) {
	
	$scope.wialon = Wialon;
	$scope.ready = Ready;
	$scope.now = State.now;

	var sid_from_storage = sessionStorage.getItem('sid');
	if(sid_from_storage) { 
		Wialon.duplicate(false,sid_from_storage);
	}

	WaitFor(function() {return Wialon.auth;} ,function() {
		if(Units.items.length===0) Units.get();
		if(HWTypes.items.length===0) HWTypes.get();
	});

	$scope.logout = function() {
		Ready.wialon = false;
		Wialon.stop(function() {
			location.hash = '';
		});
	}
	
});