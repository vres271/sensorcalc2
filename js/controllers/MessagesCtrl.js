Main.controller('MessagesCtrl',function($scope, $stateParams, WaitFor, State, Wialon, Messages) {
	var id = $stateParams.id;
	$scope.id = $stateParams.id;

	$scope.s = State.messages;

	$scope.messages = Messages;
	WaitFor(function() {return Wialon.auth;} ,function() {
		Messages.get(id);
	});

	$scope.getMessages = function() {
		Messages.get(id, $scope.s.timeFrom, $scope.s.timeTo, );
	}

});