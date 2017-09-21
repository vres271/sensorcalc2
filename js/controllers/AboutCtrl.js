Main.controller('AboutCtrl',['$scope','$stateParams','$translate' ,'$translatePartialLoader'
	,function($scope,$stateParams,$translate,  $translatePartialLoader) {
	$translatePartialLoader.addPart('about');
	$translate.refresh();

	$scope.path = location.host+location.pathname;
	$scope.protocol = location.protocol;

	$scope.oauth_link = 'https://hosting.wialon.com/login.html?client_id=wialoncrm&access_type=-1&activation_time=0&duration=0&user=&flags=0x1&redirect_uri='+$scope.protocol+'//'+$scope.path+'%23login' ;

	$scope.item_name = $stateParams.item_name;

	var storage = localStorage;
	$scope.agree = Boolean(1*storage.getItem('agree'));
	$scope.saveAgree = function() {
		storage.setItem('agree', 1*$scope.agree);
	}

}]);




