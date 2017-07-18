Main.controller('MainCtrl',['$scope', 'Ready','$http', 'Wialon', function($scope, Ready, $http, Wialon) {
	
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
	
}]);