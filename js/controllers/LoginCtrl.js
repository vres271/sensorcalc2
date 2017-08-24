Main.controller('LoginCtrl',['$scope', 'Wialon','Statistics' 
	,function($scope, Wialon, Statistics) {
	var token = Wialon.checkURLForToken();
	if(token) {
		Wialon.start(function(data) {
			if(Wialon.sid) {
				Statistics.send('oauth');
				location.hash = 'units';
			}
		},{token: token});
	} else {
		//location.hash = '';
	}

}]);
