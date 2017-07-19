Main.controller('MainCtrl', function($scope, Ready, $http, $interval, Wialon) {
	
	$scope.wialon = Wialon;
	$scope.ready = Ready;
	
	//Wialon.turnOnTestMode();

	var sid_from_storage = sessionStorage.getItem('sid');
	if(sid_from_storage) { 
		Wialon.duplicate(false,sid_from_storage);
	}

	$scope.logout = function() {
		Ready.wialon = false;
		Wialon.stop(function() {
			location.hash = '';
		});
	}

	$interval(function() {
		$scope.now = parseInt(new Date().getTime()/1000);
	},1000);

	
});