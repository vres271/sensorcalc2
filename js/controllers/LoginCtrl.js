Main.controller('LoginCtrl',function($scope, Wialon) {
	var token = Wialon.checkURLForToken();
	if(token) {
		Wialon.start(function(data) {
			if(Wialon.sid) {
				location.hash = 'units';
			}
		},{token: token});
	} else {
		//location.hash = '';
	}

});
