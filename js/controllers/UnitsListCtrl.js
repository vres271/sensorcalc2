Main.controller('UnitsListCtrl',function($scope, State, Units) {
	$scope.units = Units;
	$scope.s = State.units_list;

	$scope.resetFilter = function() {
		State.resetFilter('units_list');
	}

});