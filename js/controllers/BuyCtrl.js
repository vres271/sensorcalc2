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

	var err = function(e) {
		if(!e) {
			$scope.err_msg = '';
			return;
		}
		if(e.message) {
			$scope.err_msg = e.message;
			return;
		} else {
			$scope.err_msg = '';
		}
	}
	$scope.send = function() {
		if(!Wialon.user) return;
		if(!$scope.crm_account.email) return;
		err();
		GlomosCRM.createAccount($scope.crm_account, function(data) {
			if(data.created) {
				$scope.amember = {
					login: data.amember_response.login
					,pass: data.pass
					,login_attempt_id: $scope.now.ut
				}
				sendaMemberForm(data);
			} else {
				log('createAccount error');
			}
		},err);
	}

	$scope.buyModule = function() {
		var log_disabled = false;
		if(!GlomosCRM.auth) {
			log('CRM user not autorized', log_disabled);
		} else {
			log('CRM user auth ok', log_disabled); // 934f7600d5b927346a70184ba52d33cb
		}
	}

	var sendaMemberForm = function(data) {
		var elem = function(id) {
			return document.getElementById(id);
		}
		elem('amember-login').value=data.amember_response.login;
		elem('amember-pass').value=data.pass;
		elem('amember-login_attempt_id').value=$scope.now.ut;
		elem('am-login-form').submit();
	}

}]);




