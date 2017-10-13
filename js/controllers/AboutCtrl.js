Main.controller('AboutCtrl',['$scope','$stateParams','$translate' ,'$translatePartialLoader', 'Wialon', 'Options'
	,function($scope,$stateParams,$translate,  $translatePartialLoader, Wialon, Options) {
	$translatePartialLoader.addPart('about');
	$translate.refresh();

	$scope.redirect_uri = location.host+location.pathname;
	$scope.protocol = location.protocol;

	$scope.item_name = $stateParams.item_name;

	var storage = localStorage;
	$scope.agree = Boolean(1*storage.getItem('agree'));
	$scope.saveAgree = function() {
		storage.setItem('agree', 1*$scope.agree);
	}

	$scope.onVersionChange = function function_name() {
		$scope.paths = Options.getPaths();
		$scope.validate();
		if($scope.valid) {
			Options.save();
			Wialon.host = $scope.paths.request_url;
			Wialon.init();
		}
	}

	$scope.valid = true;
	$scope.validate = function() {
		$scope.valid = true;
		if(Options.item.wialon_version === 'hosting') return true;
		for(var key in Options.item.wialon_local_paths) {
			delete Options.item.wialon_local_paths[key]._error; 
		}
		var selected_server = Options.item.wialon_local_paths[Options.item.wialon_local_paths_selected]; 
		if(!selected_server.addr) {
			selected_server._error = 'Empty value';
			$scope.valid = false;
			return false;
		}
		if(!(/^http(s{0,1}):\/\/.+/g.test(selected_server.addr))) {
			selected_server._error = 'Server address must start with http://';
			$scope.valid = false;
			return false;
		}
	}
	$scope.validate();

	$scope.setSelected  = function(i) {
		Options.item.wialon_local_paths_selected = i;
		$scope.validate();
		Options.save();
		$scope.paths = Options.getPaths();
	}

	$scope.addServer  = function(i) {
		Options.item.wialon_local_paths.push({addr: ''});
		Options.item.wialon_local_paths_selected = Options.item.wialon_local_paths.length-1;
		$scope.validate();
	}

	$scope.removeServer  = function(i) {
		if(i===Options.item.wialon_local_paths_selected) {
			$scope.setSelected(i-1);
		}
		Options.item.wialon_local_paths.splice(i,1);
		//delete Options.item.wialon_local_paths[i];
	}

	$scope.goToOAuth = function() {
		$scope.validate();
		if(!$scope.agree) return;
		if(!$scope.valid) return;
		$scope.paths = Options.getPaths();
		Options.save();
		$scope.paths.site_url = $scope.paths.site_url.replace(/\s+/g, '');
		$scope.paths.site_url = $scope.paths.site_url.replace(/\t+/g,'');
		var tmp = $scope.paths.site_url.split('://');
		if(Options.item.wialon_version === 'hosting') {
			if(!$scope.testmode) {
				if(location.protocol==='http:') {
					$scope.http_dialog = {
						tohosting: true
						,onSubmit: function() {
							location.href = 'https://'+location.host+location.pathname;
						}
					}
					$('#http-dialog').modal('show');
					return false;
				}
				$scope.protocol = 'https:';
			}
		} else {
			if(tmp[0]) {
				if(tmp[0]==='http' && location.protocol==='https:') {
					$scope.http_dialog = {
						tononssl: true
						,addr: $scope.paths.site_url
						,onSubmit: function() {
							location.href = 'http://'+location.host+location.pathname;
						}
					}
					$('#http-dialog').modal('show');
					return false;
				}
				if(tmp[0]==='https' && location.protocol==='http:') {
					$scope.http_dialog = {
						tossl: true
						,addr: $scope.paths.site_url
						,onSubmit: function() {
							location.href = 'https://'+location.host+location.pathname;
						}
					}
					$('#http-dialog').modal('show');
					return false;
				}
				if(tmp[0]==='http') $scope.protocol = 'http:';
				if(tmp[0]==='https') $scope.protocol = 'https:';
			}
		}
		$scope.oauth_link = '/login.html?client_id=wialoncrm&access_type=-1&activation_time=0&duration=0&user=&flags=0x1&redirect_uri='+$scope.protocol+'//'+$scope.redirect_uri+'login' ;
		location.href = $scope.paths.site_url+$scope.oauth_link;
	}


}]);




