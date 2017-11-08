Main.controller('AdminConnectCtrl',['$scope','$translate' ,'$translatePartialLoader', 'GlomosCRM', 'WaitFor', 'Wialon', 'Units', 'Users', 'Accounts','WCRMCompanies','WCRMCUsers','WCRMObjects','WCRMConnector'
	,function($scope,$translate,  $translatePartialLoader, GlomosCRM, WaitFor, Wialon, Units, Users, Accounts,WCRMCompanies,WCRMCUsers,WCRMObjects,WCRMConnector) {
	//$translatePartialLoader.addPart('admin');
	//$translate.refresh();

	$scope.glomoscrm = GlomosCRM;

	$scope.units = Units;
	$scope.accounts = Accounts;
	$scope.users = Users;

	$scope.companies = WCRMCompanies;
	$scope.c_users = WCRMCUsers;
	$scope.objects = WCRMCUsers;
	var getAll = function() {
		WCRMCompanies.get();
		WCRMCUsers.get();
		WCRMObjects.get();
	}; //getAll();

	$scope.checkAll = function() {
		for(var key in $scope.items_result) {
			var item = $scope.items_result[key];
			if(!$scope.companies.index.wid[item.id]) item._checked = $scope.all_checked;
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

	$scope.connect = function() {
		if(!$scope.items_checked) return false;
		var checked_items = getChecked($scope.items_result);
		if(checked_items.length) {
			$scope.progress_dialog = {
				title: 'Connecting to CRM'
				,N: checked_items.length
				,counterService: WCRMConnector
			}
			$('#progress-dialog').modal('show'); 
			WCRMConnector.connect(checked_items, function() {
				getAll();
				$('#progress-dialog').modal('hide');
				$scope.all_checked = false;
			});
		}
	}

	$scope.clear = function() {
		if(!GlomosCRM.account.id) return;
		WCRMConnector.clear(GlomosCRM.account.id, function() {
			getAll();
			Accounts.get();
		});
	}

	$scope.clearAcc = function() {
		if(!GlomosCRM.account.id) return;
		WCRMConnector.clearAcc(GlomosCRM.account.id, function() {
			//location.hash = '';
		});
	}


}]);




