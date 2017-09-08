Main.controller('AccountCtrl',['$scope','$stateParams','$translate' ,'$translatePartialLoader', 'WaitFor',  'Accounts','Users', 'Wialon'
	,function($scope,$stateParams,$translate,  $translatePartialLoader, WaitFor, Accounts,Users,Wialon) {
	//$translatePartialLoader.addPart('accounts-list');
	//$translate.refresh();

	var id = $stateParams.id;
	$scope.id = $stateParams.id;

	$scope.errors = {};
	$scope.item = {};

	$scope.accounts = Accounts;
	$scope.users = Users;

	WaitFor(function() {return Wialon.auth;} ,function() {
		Accounts.getById(id,function(acc) {
			$scope.acc = acc;
			if(acc.item.crt) {
				Users.getById(acc.item.crt,function(item) {
					$scope.crt_user = item
				});
			}
		});
	});


}]);