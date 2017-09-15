Main.controller('MainCtrl', ['$scope', 'Ready',  'WaitFor', 'State', 'Wialon', 'Units', 'HWTypes', 'Accounts', 'Users', 'Options', 'GlomosCRM', 'Statistics','$translate' ,'$translatePartialLoader'
	,function($scope, Ready,  WaitFor, State, Wialon, Units, HWTypes, Accounts, Users, Options, GlomosCRM, Statistics,$translate,  $translatePartialLoader) {
	 
	$scope.wialon = Wialon;
	$scope.ready = Ready;
	$scope.now = State.now;
	Options.load();
	$scope.opt = Options.item;
	$scope.gcrm = GlomosCRM;

	$scope.testmode = (location.host === 'wialoncrm' || location.host === 'localhost:3000');

	if($scope.testmode) {
		Units.from = 1500;
		Units.to = 2000;
		Units.autorefresh = false;
	}

	var sid_from_url = Wialon.checkURLForSID();
	var sid_from_storage = Wialon.storage.getItem('sid');

	if(sid_from_url) {
		var sid = sid_from_url;
		var sid_src = 'from_url';
	} else {
		var sid = sid_from_storage;
		if(sid) {
			var sid_src = 'from_storage';
		}
	}

	if(sid) {
		Wialon.duplicate(sid,function(data) {
			Statistics.send(sid_src);
		},function() {
			location.hash = '';
			Ready.reset();
		});
	}
	
	if(location.origin !== 'http://www.wialoncrm.com' && location.origin !== 'http://wialoncrm.com' && location.origin !== 'http://localhost:3000') window.angular = Wialon;

	WaitFor(function() {return Wialon.auth;} ,function() {
		if(Units.items.length===0) Units.get();
		if(HWTypes.items.length===0) HWTypes.get();
		if(Accounts.items.length===0) Accounts.get();
		if(Users.items.length===0) Users.get();
		GlomosCRM.login();
	});

	Units.loadUnit(1002,function(data) {
		$scope.loadedUnit = data;
	});

	$scope.logout = function() {
		Ready.wialon = false;
		Wialon.stop(function() {
			location.hash = '';
		});
	}

	$translate.onReady(function() {
		$scope.lng = $translate.use();
	})
	$scope.changeLng = function() {
		if($scope.lng!=='en') {
			$scope.lng = 'en';	
		} else {
			$scope.lng = 'ru';	
		};
		$translate.use($scope.lng);
		Options.item.language = $scope.lng;
		Options.save();
	}
	
}]);