Main.controller('MessagesCtrl',['$scope', '$filter', '$stateParams', '$rootScope', 'WaitFor', 'Ready', 'State', 'Wialon', 'Messages', 'Units'
	,function($scope, $filter, $stateParams, $rootScope, WaitFor, Ready, State, Wialon, Messages, Units) {
	var id = $stateParams.id;
	$scope.id = $stateParams.id;

	$scope.s = State.messages;

	$scope.messages = Messages;
	Messages.items = [];

	$scope.werrors = Wialon.ErrorsDescription;
	
	$scope.chart_keys = {};
    $scope.chart_messages_options = {
      series: [],
      axes: {x: {key: "t"}},
      grid: {x:true, y: true},
      margin: {top: 25, bottom: 35}
    };

	$scope.unit = {};
	Ready.set('messages',false);
	WaitFor(function() {return Wialon.auth;} ,function() {
		Units.getById(id,function(item) {
			$scope.unit = item;
			Messages.unit = item;
			Messages.get(id, null, null, function() {
				Ready.set('messages',true);
				$scope.filterCols();
			    Messages.startNewMessageListener(function() {
			    	if($scope.items_result[0]) {
						var i = $scope.items_result[0].__i;
						WaitFor(function() {return i !== $scope.items_result[0].__i;} ,function() {
							$scope.createChart();
						});
			    	}
			    });
			});
		});
	});


	$scope.getMessages = function() {
		Messages.get(id, $scope.s.timeFrom, $scope.s.timeTo, function(data) {
			$rootScope.$digest();
			$scope.createChart();
		});
	}

	$scope.filterCols = function() {
		$scope.hide_cols = $filter('MessagesParamsFilter')($scope.messages.items, $scope.s.filter.params);
	}

    $scope.createChart = function(key) {
    	if(key) {
    		if($scope.chart_keys[key]) {
    			delete $scope.chart_keys[key]
    		} else {
	    		$scope.chart_keys[key] = true;
    		}
    	}
    	$scope.mdata = {items: $scope.items_result};
		var series = []
		var colors = ['#1f77b4','#4F8C15','#52158C','#E3A41B','#26B54A','#19CFC2','#DB3BDB'];
		var i = 0;
		for(var key in $scope.chart_keys) {
			if($scope.chart_keys[key]) {
				series.push({
		          dataset: "items",
		          key: key,
		          label: key.substr(3, 50),
		          color: colors[i] ? colors[i] : '#60656E',
		          type: ['line'],
		          id: key
				})
				i++;
			}
		}
	    $scope.chart_messages_options = {
	      series: series,
	      axes: {x: {key: "__t"}},
	      grid: {x:true, y: true},
	      margin: {top: 25, bottom: 15}
	    };
    }

	$scope.onLimitChange = function() {
		var l = $scope.items_result.length;
		WaitFor(function() {return l !== $scope.items_result.length;} ,function() {
			$scope.createChart();
		});
	}

	$scope.shift = function(direction) {
		if(direction<0) {
			if(($scope.s.limitfrom - $scope.s.limitto) <= 0) {
				$scope.s.limitfrom = 0;
			} else {
				$scope.s.limitfrom = $scope.s.limitfrom - $scope.s.limitto;
			}
		} else if(direction===0) {
			$scope.s.limitfrom = 0;
		} else if(direction>0) {
			$scope.s.limitfrom = $scope.s.limitfrom + $scope.s.limitto;
		}
		var t = $scope.items_result[0].__t;
		WaitFor(function() {return t !== $scope.items_result[0].__t;} ,function() {
			$scope.createChart();
		});
	}

	$scope.isEmptyObject = isEmptyObject;

}]);