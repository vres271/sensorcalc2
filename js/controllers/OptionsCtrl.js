Main.controller('OptionsCtrl',['$scope', 'Options', 'GlomosCRM', '$translate' , '$translatePartialLoader','tmhDynamicLocale', 'Wialon', 'WCRMProducts'
	,function($scope, Options, GlomosCRM, $translate, $translatePartialLoader,tmhDynamicLocale, Wialon, WCRMProducts) {
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
			$translate.refresh();
		}
	}

	$scope.resetItem = function() {
		Options.reset();
	}

	$scope.loginToCRM = function() {
		GlomosCRM.login();
	}

	$scope.products = WCRMProducts;
	WCRMProducts.get();

	$scope.test = function() {
		GlomosCRM.test();
	}
	$scope.test2 = function() {
		GlomosCRM.test2();
	}
	$scope.buy = function() {
		if(GlomosCRM.auth) {
			GlomosCRM.getAmCredentials(function(data) {
				if(data.item) {
					var params = {
						login: data.item.w_accounts_id
						,pass: data.item.am_pass
						,attempt_id: $scope.now.ut				
					}
					GlomosCRM.gotoAm(params);		
				}
			})
		} else {
			if(!Wialon.user) return;
			$scope.new_crm_account = {
				name: Wialon.user.nm
				,w_accounts_id: Wialon.user.bact
			}
			if(Wialon.user.prp.email && !$scope.new_crm_account.email) {
				$scope.new_crm_account.email = Wialon.user.prp.email;
			}
			$('#emailconfirm-dialog').modal('show');

			$scope.emailconfirm_dialog = {};
			$scope.emailconfirm_dialog.onSubmit = function() {
				if(!$scope.new_crm_account.email) return;
				err();
				GlomosCRM.createAccount($scope.new_crm_account, function(data) {
					if(data.created) {
						var params = {
							login: data.amember_response.login
							,pass: data.pass
							,attempt_id: $scope.now.ut				
						}
						GlomosCRM.gotoAm(params);		
					} else {
						log('createAccount error');
					}
				},err);
			}

		}
	}

	var err = function(e) {
		if(!e) {
			GlomosCRM.error = '';
			$scope.emailconfirm_dialog.error = '';
			return;
		}
		if(e.message) {
			GlomosCRM.error = e.message;
			$scope.emailconfirm_dialog.error = e.message;
			return;
		} else {
			GlomosCRM.error = '';
			$scope.emailconfirm_dialog.error = '';
		}
	}

}]);
