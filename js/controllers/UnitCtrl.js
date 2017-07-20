Main.controller('UnitCtrl',function($scope, $stateParams, Units, Wialon, WaitFor) {
	var id = $stateParams.id;
	$scope.item = {};

	WaitFor(function() {return Wialon.auth;} ,function() {
		Units.getById(id,function(item) {
			$scope.item = item;
		});
	});

	WaitFor(function() {return (Units.items.length>0);} ,function() {
		$scope.short_item = Units.index.id[id];
	});

});