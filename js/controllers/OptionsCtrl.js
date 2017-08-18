Main.controller('OptionsCtrl',function($scope, Options, GlomosCRM) {

	$scope.options = Options;

	$scope.saveItem = function() {
		Options.save();
	}

	$scope.resetItem = function() {
		Options.reset();
	}

	$scope.loginToCRM = function() {
		GlomosCRM.login();
	}

});
