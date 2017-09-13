Main.controller('UserCtrl',['$scope','$stateParams','$translate' ,'$translatePartialLoader', 'WaitFor',  'Accounts','Users', 'Wialon','UserFormValidator'
	,function($scope,$stateParams,$translate,  $translatePartialLoader, WaitFor, Accounts,Users,Wialon,UserFormValidator) {
	$translatePartialLoader.addPart('user');
	$translatePartialLoader.addPart('account');
	$translate.refresh();

	var id = $stateParams.id;
	$scope.id = $stateParams.id;

	$scope.errors = {};
	$scope.item = {};

	$scope.accounts = Accounts;
	$scope.users = Users;

	WaitFor(function() {return Wialon.auth;} ,function() {
		Users.getById(id,function(item) {
			$scope.item = item;
			$scope.v = UserFormValidator.create($scope.item);
			$scope.validate = UserFormValidator.validate;
			$scope.errClass = UserFormValidator.errClass;
			copyItem(item);
		});
	});

	$scope.saveItem = function() {
		Users.saveUser($scope.item, function() {
			Users.getById(id,function(item) {
				$scope.item = item;
				copyItem(item);
				$scope.checkChagnes();
			});
		});
	}

	$scope.checkChagnes = function() {
		var copy = $scope.item_copy;
		var item = angular.copy($scope.item);
		$scope.item_changed = (copy !== angular.toJson(item));
	}

	var copyItem = function(item) {
		var copy = angular.copy(item);
		$scope.item_copy = angular.toJson(copy);
	}

	$scope.setVisible = function() {
		if(!$scope.item._password) return;
		$scope.user_password_visible = !$scope.user_password_visible;
	}

	$scope.generatePassword = function() {
		$scope.item._password = Users.generatePassword(20);
	}



}]);