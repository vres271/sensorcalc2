Main.controller('OptionsCtrl',['$scope', 'Options', 'GlomosCRM'
	,function($scope, Options, GlomosCRM) {

	$scope.options = Options;
	$scope.languages = {
		en:  'English'
		,ru:  'Русский'
	};

	var copy_language = Options.item.language;
	$scope.saveItem = function() {
		Options.save();
		if(copy_language !== Options.item.language) location.reload();
	}

	$scope.resetItem = function() {
		Options.reset();
	}

	$scope.loginToCRM = function() {
		GlomosCRM.login();
	}


}]);
