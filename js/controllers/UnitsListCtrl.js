Main.controller('UnitsListCtrl',function($scope, State, Units, HWTypes) {
	$scope.units = Units;
	$scope.hwtypes = HWTypes;

	$scope.s = State.units_list;

	$scope.resetFilter = function() {
		State.resetFilter('units_list'); log(HWTypes)
	}

});