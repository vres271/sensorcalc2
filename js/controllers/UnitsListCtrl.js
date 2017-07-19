Main.controller('UnitsListCtrl',function($scope, State, Units) {
	$scope.units = Units;

	$scope.filter = State.units_list.filters;
	$scope.custom_filter = State.units_list.custom_filters;
	$scope.orderby = State.units_list.orderby;
	$scope.limit = State.units_list.limit;

	if(Units.items.length===0) {
		Units.get();
	}

	$scope.addToSession = function() {
		Units.addToSession();
	}

});