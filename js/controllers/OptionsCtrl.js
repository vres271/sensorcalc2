Main.controller('OptionsCtrl',['$scope', 'Options', 'GlomosCRM', '$translate' , '$translatePartialLoader','tmhDynamicLocale'
	,function($scope, Options, GlomosCRM, $translate, $translatePartialLoader,tmhDynamicLocale) {
	$translatePartialLoader.addPart('options');
	$translate.refresh();
	$scope.glomoscrm = GlomosCRM;
	
	$scope.options = Options;
	$scope.languages = {
		en:  'English'
		,ru:  'Русский'
	};

	var copy_language = Options.item.language;
	$scope.saveItem = function() {
		Options.save();
		if(copy_language !== Options.item.language) {
			$translate.use(Options.item.language);
			tmhDynamicLocale.set(Options.item.language);
			copy_language = Options.item.language;
		}
	}

	$scope.resetItem = function() {
		Options.reset();
	}

	$scope.loginToCRM = function() {
		GlomosCRM.login();
	}


}]);
