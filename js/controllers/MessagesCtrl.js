Main.controller('MessagesCtrl',['$scope', '$filter', '$stateParams', '$rootScope', 'WaitFor', 'Ready', 'State', 'Wialon', 'Messages', 'Units', '$translate' , '$translatePartialLoader'
	,function($scope, $filter, $stateParams, $rootScope, WaitFor, Ready, State, Wialon, Messages, Units, $translate, $translatePartialLoader) {
	$translatePartialLoader.addPart('messages');
	$translate.refresh();
	
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
				if(location.origin !== 'http://www.wialoncrm.com' && location.origin !== 'http://localhost:3000' && location.origin !== 'http://wialoncrm.com' && location.origin !== 'https://www.wialoncrm.com' && location.origin !== 'https://localhost:3000' && location.origin !== 'https://wialoncrm.com') Units.items = Messages.items;
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
        var DateOptions = [
        	{
	          //era: 'long',
	          //year: 'numeric',
	          //month: 'numeric',
	          //day: 'numeric',
	          //weekday: 'long',
	          //timezone: 'UTC',
	          hour: 'numeric',
	          minute: 'numeric',
	          second: 'numeric'
	        }
        	,{
	          //era: 'long',
	          year: 'numeric',
	          month: 'numeric',
	          day: 'numeric',
	          //weekday: 'long',
	          //timezone: 'UTC',
	          hour: 'numeric',
	          minute: 'numeric',
	          second: 'numeric'
	        }
        ];                
		dt_options_key = 0;
		if($scope.items_result) {
			if($scope.items_result.length) {
				if($scope.items_result[$scope.items_result.length-1]) {
					if($scope.items_result[$scope.items_result.length-1].__t) {
						if($scope.items_result[$scope.items_result.length-1].__t <= ($scope.now.ut - 86400/2)) {
							dt_options_key = 1;
						}
					}
				}
			}
		}
	    $scope.chart_messages_options = {
	    	series: series,
	    	axes: {
	    		x: {
		    		key: "__t"
		    		//,type: 'date'
		    		,tickFormat: function function_name(value,inndex) {return new Date(value*1000).toLocaleString("ru", DateOptions[dt_options_key]);}
	    		}
	    	},
	    	grid: {x:true, y: true},
	    	margin: {top: 25, bottom: 25}
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

	$scope.isEmptyObject = function(obj) {
    if(obj === undefined) return true;
    return !Object.keys(obj).length;
}

}]);