Main.controller('UnitCtrl',['$scope', '$location', '$stateParams', '$timeout', 'WaitFor', 'Wialon', 'Units', 'HWTypes', 'UnitFormValidator', 'GlomosCRM', '$translate' ,'$translatePartialLoader', 'SensorTblParser'
	,function($scope, $location, $stateParams, $timeout, WaitFor, Wialon, Units, HWTypes,  UnitFormValidator, GlomosCRM, $translate,  $translatePartialLoader, SensorTblParser) {
	
	$translatePartialLoader.addPart('unit');
	$translatePartialLoader.addPart('sensors');
	$translate.refresh();

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
			copyItem(item);
			$scope.uv = UnitFormValidator.create($scope.item);
			$scope.validate = UnitFormValidator.validate;
			$scope.errClass = UnitFormValidator.errClass;
			$scope.sens_errClass = UnitFormValidator.sens_errClass;
			if(GlomosCRM.enabled) {
				WaitFor(function() {return GlomosCRM.auth;} ,function() {
					GlomosCRM.getObject($scope.id, function(data) {$scope.crm_object = data;});
				});
			}
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
		Units.parceSensorTable(sensor );
	}

	$scope.checkFile = function(context, data) {
		var sensor = context.sensor;
		var i = context.index;
		var format = SensorTblParser.getDataFormat(data);
		sensor._parser = format.parser;
		if(format.sensors_n>1) {
			$scope.multisensor_dialog = {
				single: '1'
				,sensors: format.sensors
				,validate: function function_name() {
					var _s = $scope.multisensor_dialog;
					_s.mess = '';
					_s.valid = false;
					if(_s.single===undefined) {
						_s.valid = false;
						return false
					};
					if(_s.single==='1') {
						if(_s.selected===undefined) {
							_s.mess = 'Select which table to use';
							_s.valid = false;
							return false;
						};
					}
					_s.valid = true;
					return true;
				}
				,onSubmit: function() {
					var _s = $scope.multisensor_dialog;
					_s.validate();
					if(!_s.valid) return false;
					if(_s.single==='1') {
						sensor._dsrc_sensor_index = _s.selected;
						Units.parceSensorTable(sensor);
					}
					if(_s.single==='0') {
						var prop = _s.sensors;
						for(var key in prop) {
							var sens_prop = prop[key];
							sens_prop._dsrc = sensor._dsrc;
							sens_prop._parser = sensor._parser;
							sens_prop._dsrc_sensor_index = key;
						}
						Units.createSensorsGroup($scope.item, prop);
						$scope.deleteSensor(sensor,i);
						$location.url('/unit/'+$scope.id);
						$scope.goto(undefined);
					}
					$('#multisensor-dialog').modal('hide');
				}
				,mess: ''
				,valid: false
			}
			$('#multisensor-dialog').modal('show');
		}

	}

	$scope.setAutoBounds = function(sensor) {
		Units.setAutoBounds(sensor);
		sensor._parser = 'standart';
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
				copyItem(item);
				$scope.checkChagnes();
			});
			Units.loadUnit(1023,function(data) {
				$scope.loadedUnit = data;
			});
			GlomosCRM.saveObject($scope.item, $scope.crm_object);
		});
	}

	$scope.createSensor = function() {
		var sensor_id = Units.createSensor($scope.item);
		$location.url('/unit/'+$scope.id+'/sensor/'+sensor_id);
		$scope.goto(sensor_id);
	}

	$scope.mergeSensors = function() {
		Units.mergeSensors($scope.item);
		$scope.onSensorCheck();
	}

	$scope.deleteSensor = function(sensor, i) {
		if(sensor.id) {
			sensor._deleted = !sensor._deleted	
		} else {
			delete $scope.item.sens[i];
		}
	}

	$scope.copySensor = function(sensor) {
		Units.copySensor($scope.item, sensor);
	}

	$scope.inverseSrcTable = function(sensor) {
		Units.inverseSrcTable(sensor);
		sensor._parser = 'standart';
		Units.parceSensorTable(sensor)
	}

	$scope.onSensorTypeChange = function(sensor) {
		sensor.m = Units.sensor_types[sensor.t].m;
	}

	$scope.checkChagnes = function() {
		var copy = $scope.item_copy;
		var item = angular.copy($scope.item);
		$scope.item_changed = (copy !== angular.toJson(item));
	}

	var copyItem = function(item) {
		var copy = angular.copy(item);
		$scope.item_copy = angular.toJson(copy);
	}

	$scope.readyForChart = function(sensor) {
		if(sensor._d) {
			if(sensor._d.length>1) {
				if(sensor._d[0].x!==undefined && sensor._d[0].y!==undefined &&  sensor._d[1].x!==undefined &&  sensor._d[1].y!==undefined) {
					return true;
				}
			}
		}
		return false;
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

    $scope.tbl_parsers = ['standart','italon','omnicomm'];

}]);