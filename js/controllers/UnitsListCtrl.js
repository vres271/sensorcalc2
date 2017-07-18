Main.controller('UnitsListCtrl',function($scope, Units) {
	$scope.units = Units;
	$scope.filters = {};
	$scope.limit = 20;

	if(Units.items.length===0) {
		Units.get();
	}

});