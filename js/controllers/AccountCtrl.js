Main.controller('AccountCtrl',['$scope','$stateParams','$translate' ,'$translatePartialLoader','AccountFormValidator', 'WaitFor', 'Accounts','Users', 'Wialon'
	,function($scope,$stateParams,$translate,  $translatePartialLoader, AccountFormValidator, WaitFor, Accounts,Users,Wialon) {
	$translatePartialLoader.addPart('user');
	$translatePartialLoader.addPart('account');
	$translate.refresh();

	var id = $stateParams.id;
	$scope.id = $stateParams.id;

	$scope.errors = {};
	$scope.acc = {};

	$scope.accounts = Accounts;
	$scope.users = Users;

	WaitFor(function() {return Wialon.auth;} ,function() {
		Accounts.getById(id,function(acc) {
			$scope.acc = acc;
			$scope.v = AccountFormValidator.create($scope.acc);
			$scope.validate = AccountFormValidator.validate;
			$scope.errClass = AccountFormValidator.errClass;
			if(acc.item.crt) {
				Users.getById(acc.item.crt,function(item) {
					acc.crt_user = item
					copyItem(acc);
				});
			}
		});
	});

	$scope.saveItem = function() {
		Accounts.saveAccount($scope.acc, function() {
			Users.saveUser($scope.acc.crt_user, function() {
				Accounts.getById(id,function(acc) {
					$scope.acc = acc;
					if(acc.item.crt) {
						Users.getById(acc.item.crt,function(item) {
							acc.crt_user = item
							copyItem(acc);
							$scope.checkChagnes();
						});
					}
				});
			});
		});
	}

	$scope.checkChagnes = function() {
		var copy = $scope.item_copy;
		var item = angular.copy($scope.acc);
		$scope.item_changed = (copy !== angular.toJson(item));
	}

	var copyItem = function(item) {
		var copy = angular.copy(item);
		$scope.item_copy = angular.toJson(copy);
	}

	$scope.setVisible = function() {
		if(!$scope.acc.crt_user._password) return;
		$scope.crt_user_password_visible = !$scope.crt_user_password_visible;
	}

	$scope.generatePassword = function() {
		$scope.acc.crt_user._password = Users.generatePassword(20);
	}

}]);