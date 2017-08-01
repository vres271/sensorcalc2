Main.controller('MessagesCtrl',function($scope, $filter, $stateParams, WaitFor, State, Wialon, Messages) {
	var id = $stateParams.id;
	$scope.id = $stateParams.id;

	$scope.s = State.messages;

	$scope.messages = Messages;
	WaitFor(function() {return Wialon.auth;} ,function() {
		Messages.get(id, null, null, function() {
			$scope.filterCols();
		});
	});

	$scope.getMessages = function() {
		Messages.get(id, $scope.s.timeFrom, $scope.s.timeTo);
	}

	$scope.filterCols = function() {
		$scope.hide_cols = $filter('MessagesParamsFilter')($scope.messages.items, $scope.s.filter.params);
	}

});