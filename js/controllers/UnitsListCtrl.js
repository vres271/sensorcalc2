Main.controller('UnitsListCtrl',['$scope', 'State', 'Units', 'HWTypes', 'Accounts', 'Users', '$translate' ,'$translatePartialLoader'
	,function($scope, State, Units, HWTypes, Accounts, Users, $translate,  $translatePartialLoader) {
	$translatePartialLoader.addPart('units-list');
	$translatePartialLoader.addPart('messages');
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

	// $scope.onTChange = function(type) {
	// 	if($scope.s.custom_filter.maxt<$scope.s.custom_filter.mint) {
	// 		if(type==='max') {
	// 			$scope.s.custom_filter.mint=$scope.s.custom_filter.maxt;
	// 		} else if(type==='min') {
	// 			$scope.s.custom_filter.maxt=$scope.s.custom_filter.mint;
	// 		}
	// 	}
	// }

	var setSliderDefaults = function() {
		if(!$scope.s.custom_filter.mint) {
			$scope.s.custom_filter.mint = 1000*($scope.now.ut-$scope.s.custom_filter.dt);	
		}
		if(!$scope.s.custom_filter.maxt) {
			$scope.s.custom_filter.maxt = 1000*$scope.now.ut;	
		}
	}; setSliderDefaults();

	$scope.slider_scales = {
		3600:{title:'Hour', format: 'HH:mm:ss'}
		,86400:{title:'Day', format: 'dd MMM HH:mm'}
		,604800:{title:'Week', format: 'EEE, dd MMM HH:mm'}
		,2678400:{title:'Month', format: 'd MMM HH:mm'}
		,31622400:{title:'Year', format: 'd MMMM yyyy'}
	}

	$scope.onScaleChange = function() {
		if($scope.s.custom_filter.mint < 1000*($scope.now.ut - $scope.s.custom_filter.dt)) {
			$scope.s.custom_filter.mint = 1000*($scope.now.ut - $scope.s.custom_filter.dt);
		}
		if($scope.s.custom_filter.maxt < 1000*($scope.now.ut - $scope.s.custom_filter.dt)) {
			$scope.s.custom_filter.maxt = 1000*($scope.now.ut - $scope.s.custom_filter.dt)+5000;
		}
	}

	$scope.showSlider = function() {
		$scope.s.custom_filter.show_t=!$scope.s.custom_filter.show_t;
		setSliderDefaults();
	}

	$scope.showMessage = function(item) {
		$scope.modal_item = item;
	}


	// $scope.openScriptDialog = function() {
	// 	$scope.script_dialog = {
	// 		items: []
	// 		,symbol: '0'
	// 		,action: '+'
	// 		,start: function() {
	// 			var nextStep = function(key) {
	// 				if(!$scope.script_dialog.items[key]) return;
	// 				var item = $scope.script_dialog.items[key];
	// 				var symbol = $scope.script_dialog.symbol;
	// 				if($scope.script_dialog.action === '+') {
	// 					//item.nm = '+'+item.nm;
	// 					item.uid = symbol+item.uid;
	// 					item.ph = '+'+symbol+item.ph.substr(1);
	// 				} else if ($scope.script_dialog.action === '-') {
	// 					if(item.uid[0]===symbol) {
	// 						item.uid = item.uid.substr(1);
	// 					}
	// 					if(item.ph[1]===symbol) {
	// 						item.ph = '+'+item.ph.substr(2,item.ph.length);
	// 					}
	// 				}
	// 				Units.saveUnit(item, function(data) {
	// 					item._result = data;
	// 					key = key + 1;
	// 					nextStep(key);
	// 				});
	// 			}
	// 			nextStep(0);
	// 		}
	// 	}
	// 	for(var key in $scope.items_result) {
	// 		var item = $scope.items_result[key];
	// 		if(item._checked) {
	// 			$scope.script_dialog.items.push(item);
	// 		}
	// 	}
	// 	$('#script-dialog').modal('show');
	// }


}]);