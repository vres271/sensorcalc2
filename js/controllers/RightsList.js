Main.controller('RightsListCtrl',['$scope','$translate' ,'$translatePartialLoader', 'GlomosCRM', 'WaitFor', 'Wialon','WCRMRights', 'WCRMProducts','WCRMUsers','WCRMUGroups','WCRMAccounts'
	,function($scope,$translate,  $translatePartialLoader, GlomosCRM, WaitFor, Wialon, WCRMRights, WCRMProducts,WCRMUsers,WCRMUGroups,WCRMAccounts) {
	//$translatePartialLoader.addPart('admin');
	//$translate.refresh();

	$scope.glomoscrm = GlomosCRM;
	$scope.wcrmrights = WCRMRights;

	$scope.rights = WCRMRights.items;
	WCRMRights.getRef();

	WCRMProducts.get();
	WCRMUsers.getAll({},function(data) {
		$scope.allusers = data;
	});
	$scope.products = WCRMProducts;
	WCRMUGroups.getAll({},function(data) {
		$scope.allugroups = data;
	});
	WCRMAccounts.getAll({},function(data) {
		$scope.allaccounts = data;
	});

	$scope.rights_list = ['r','m','a','d','e0', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e11', 'e12', 'e13', 'e14', 'e15'];

	$scope.getRights = function(f) {
		WCRMRights.get(f);
	}


	$scope.rightIcon = function(val) {
      if(val === null || val === undefined) {
        return 'circle-o grey';  
      } else {
        if(1*val) {
          return 'check-circle-o green';  
        } else {
          return 'times-circle-o red';  
        }
      }
	}

	$scope.switchRight = function(item, right) {

		if(item[right] === null ) {
			item[right] = true;
		} else if(item[right] == true ) {
			item[right] = false;
		} else if(item[right] == false ) {
			item[right] = null;
		}
		WCRMRights.saveRight({item: item, right: right}, function(data) {log(data);});
	}

}]);




