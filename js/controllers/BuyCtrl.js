Main.controller('BuyCtrl',['$scope','$translate' ,'$translatePartialLoader', 'GlomosCRM', 'WaitFor', 'Wialon'
	,function($scope,$translate,  $translatePartialLoader, GlomosCRM, WaitFor, Wialon) {
	$translatePartialLoader.addPart('about');
	$translate.refresh();

	$scope.glomoscrm = GlomosCRM;
	$scope.crm_account = {}

	WaitFor(function() {return Wialon.auth;} ,function() {
		getCRMAccount();
	});

	var getCRMAccount = function() {
		var params = {w_accounts_id:Wialon.user.bact};
		GlomosCRM.getAccount(params, function(data) {
			$scope.crm_account = data.item;
			$scope.crm_account.name = Wialon.user.nm;
			$scope.crm_account.w_accounts_id = Wialon.user.bact;
		});
	}

	$scope.send = function() {
		if(!Wialon.user) return;
		if(!$scope.crm_account.email) return;
		GlomosCRM.createAccount($scope.crm_account, function(data) {
			log(data);
			getCRMAccount();
		});
	}
	$scope.reg = function() {
		if(!Wialon.user) return;
		if(!$scope.crm_account.email) return;
		GlomosCRM.registerAccount($scope.crm_account, function(data) {
			log(data);
			getCRMAccount();
		});
	}

	$scope.buyModule = function() {
		var log_disabled = false;
		if(!GlomosCRM.auth) {
			log('CRM user not autorized', log_disabled);
			
		} else {
			log('CRM user auth ok', log_disabled); // 934f7600d5b927346a70184ba52d33cb
		}
	}

}]);




