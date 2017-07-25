Main.controller('UnitCtrl',function($scope, $location, $stateParams, $timeout, WaitFor, Wialon, Units, HWTypes) {
	var id = $stateParams.id;
	$scope.id = $stateParams.id;
	$scope.sensor_id = $stateParams.sensor_id;

	$scope.hwtypes = HWTypes;

	$scope.item = {};
	WaitFor(function() {return Wialon.auth;} ,function() {
		Units.getById(id,function(item) {
			$scope.item = item;
		});
	});

	WaitFor(function() {return (Units.items.length>0);} ,function() {
		$scope.short_item = Units.index.id[id];
	});

	Wialon.removeEventsHandler('onUnitMessageRecieved');
	Wialon.addEventsHandler('onUnitMessageRecieved', function(data) {
		for(var key in data.events) {
			var event = data.events[key];
			if(event.i) {
				if(1*event.i === 1*id) {
					if(event.t === 'm') {
						$scope.blink = true;
						$timeout(function(argument) {
							$scope.blink = false;
						},500);
					}
				}
			}
		}
	});

	$scope.goto = function(sensor_id) {
		$scope.sensor_id = sensor_id;
	}

	$scope.parceSensorTable = function(sensor) {
		Units.parceSensorTable(sensor);
	}

	$scope.saveItem = function() {
		Units.saveUnit($scope.item, function() {
			Units.getById(id,function(item) {
				$scope.item = item;
			});
		});
	}

	$scope.createSensor = function() {
		var sensor_id = Units.createSensor($scope.item);
		$location.url('/unit/'+$scope.id+'/sensor/'+sensor_id);
		$scope.goto(sensor_id);
	}

});