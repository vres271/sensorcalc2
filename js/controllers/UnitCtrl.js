Main.controller('UnitCtrl',function($scope, $location, $stateParams, $timeout, WaitFor, Wialon, Units, HWTypes, UnitFormValidator) {
	var id = $stateParams.id;
	$scope.id = $stateParams.id;
	$scope.sensor_id = $stateParams.sensor_id;
	$scope.units = Units;
	$scope.hwtypes = HWTypes;
	$scope.errors = {};

	$scope.item = {};
	WaitFor(function() {return Wialon.auth;} ,function() {
		Units.getById(id,function(item) {
			$scope.item = item;
			$scope.uv = UnitFormValidator.create($scope.item);
			$scope.validate = UnitFormValidator.validate;
			$scope.errClass = UnitFormValidator.errClass;
			$scope.sens_errClass = UnitFormValidator.sens_errClass;
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

	$scope.setAutoBounds = function(sensor) {
		Units.setAutoBounds(sensor);
		Units.parceSensorTable(sensor);
	}

	$scope.checkPlus = function() {
		if($scope.item.ph[0] !== '+') {
			$scope.item.ph = '+'+$scope.item.ph;
		}
		if($scope.item.ph.length===1) {
			$scope.item.ph = '';
		}
	}

	$scope.onSensorCheck = function() {
		var i = 0;
		for(var key in $scope.item.sens) {
			if($scope.item.sens[key]._checked) {
				i = i+1;
			}
		}
		$scope.sensors_checked = (i>1);
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

	$scope.mergeSensors = function() {
		var sensor_names = [];
		for(var key in $scope.item.sens) {
			var sensor = $scope.item.sens[key];
			if(sensor._checked) {
				sensor_names.push('['+sensor.n+']');
			}
		}
		$scope.createSensor();
		var new_sensor = $scope.item._index.sens.id[$scope.sensor_id];
		new_sensor.p = sensor_names.join('+');
		for(var key in $scope.item.sens) {
			var sensor = $scope.item.sens[key];
			if(sensor._checked) {
				sensor.t = 'custom';
			}
			sensor._checked = false;
		}
		$scope.onSensorCheck();
	}

	$scope.deleteSensor = function(sensor, i) {
		if(sensor.id) {
			sensor._deleted = !sensor._deleted	
		} else {
			delete $scope.item.sens[i];
		}
	}

    $scope.sensor_chart_options = {
      series: [
        {
          dataset: "_d",
          key: "y",
          label: "Sensor output value (Y):",
          color: "#1f77b4",
          type: ['line', 'dot'],
          id: 'Sensor XY-Table'
        }
      ],
      axes: {x: {key: "x"}},
      grid: {x:true, y: true},
      margin: {top: 5}
    };


});