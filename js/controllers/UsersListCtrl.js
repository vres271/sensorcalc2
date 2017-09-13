Main.controller('UsersListCtrl',['$scope','$translate' ,'$translatePartialLoader', 'WaitFor', 'State', 'Accounts', 'Users', 'Wialon'
	,function($scope,$translate,  $translatePartialLoader, WaitFor, State, Accounts, Users, Wialon) {
	$translatePartialLoader.addPart('accounts-list');
	$translatePartialLoader.addPart('users-list');
	$translate.refresh();


	$scope.s = State.users_list;
	$scope.users = Users;
	$scope.accounts = Accounts;

	$scope.resetFilter = function() {
		State.resetFilter('users_list');
	}

	// $scope.checkAll = function() {
	// 	for(var key in $scope.items_result) {
	// 		var item = $scope.items_result[key];
	// 		item._checked = $scope.all_checked;
	// 	}
	// }

 //    $scope.$watch(function() {
	// 	$scope.items_checked = false;
	// 	for(var key in $scope.items_result) {
	// 		var item = $scope.items_result[key];
	// 		if(item._checked) {
	// 			$scope.items_checked = true;
	// 			return true;
	// 		}
	// 	}
	// 	return false;
	// });


}]);