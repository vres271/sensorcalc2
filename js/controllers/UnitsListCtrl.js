Main.controller('UnitsListCtrl',['$scope', 'State', 'Units', 'HWTypes', 'Accounts', 'Users', '$translate' ,'$translatePartialLoader'
	,function($scope, State, Units, HWTypes, Accounts, Users, $translate,  $translatePartialLoader) {
	$translatePartialLoader.addPart('units-list');
	$translate.refresh();

	$scope.units = Units;
	$scope.hwtypes = HWTypes;
	$scope.accounts = Accounts;
	$scope.users = Users;

	$scope.s = State.units_list;

	$scope.resetFilter = function() {
		State.resetFilter('units_list');
	}

	$scope.setOrderBy = function(key) {
		if($scope.s.orderby === key) {
			$scope.s.orderby_reverse = !$scope.s.orderby_reverse;
		} else {
			$scope.s.orderby = key;
		}
	}

	$scope.checkAll = function() {
		for(var key in $scope.items_result) {
			var item = $scope.items_result[key];
			item._checked = $scope.all_checked;
		}
	}
	
    $scope.$watch(function() {
		$scope.items_checked = false;
		for(var key in $scope.items_result) {
			var item = $scope.items_result[key];
			if(item._checked) {
				$scope.items_checked = true;
				return true;
			}
		}
		return false;
	});

	$scope.onTChange = function(type) {
		if($scope.s.custom_filter.maxt<$scope.s.custom_filter.mint) {
			if(type==='max') {
				$scope.s.custom_filter.mint=$scope.s.custom_filter.maxt;
			} else if(type==='min') {
				$scope.s.custom_filter.maxt=$scope.s.custom_filter.mint;
			}
		}
	}

}]);