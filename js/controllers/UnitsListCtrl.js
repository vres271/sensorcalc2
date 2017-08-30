Main.controller('UnitsListCtrl',['$scope', 'State', 'Units', 'HWTypes', 'WaitFor', '$translate' ,'$translatePartialLoader'
	,function($scope, State, Units, HWTypes,WaitFor,$translate,  $translatePartialLoader) {
	$translatePartialLoader.addPart('units-list');
	$translate.refresh();

	$scope.units = Units;
	$scope.hwtypes = HWTypes;

	$scope.s = State.units_list;

	$scope.resetFilter = function() {
		State.resetFilter('units_list'); log(HWTypes)
	}

	$scope.ItemsSelected = function() {
		$scope.items_checked = false;
		for(var key in $scope.items_result) {
			var item = $scope.items_result[key];
			if(item._checked) {
				$scope.items_checked = true;
				return true;
			}
		}
		return false;
	}

	$scope.checkAll = function() {
		for(var key in $scope.items_result) {
			var item = $scope.items_result[key];
			item._checked = $scope.all_checked;
		}
	}
	

}]);