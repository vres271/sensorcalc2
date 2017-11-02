Main.controller('MainCtrl', ['$scope', 'Ready',  'WaitFor', 'State', 'Wialon', 'Units', 'HWTypes', 'Accounts', 'Users', 'Options', 'GlomosCRM', 'Statistics','$translate' ,'$translatePartialLoader', 'tmhDynamicLocale'
	,function($scope, Ready,  WaitFor, State, Wialon, Units, HWTypes, Accounts, Users, Options, GlomosCRM, Statistics,$translate,  $translatePartialLoader, tmhDynamicLocale) {

	$scope.wialon = Wialon;
	$scope.ready = Ready;
	$scope.now = State.now;
	Options.load();
	$scope.opt = Options.item;
	$scope.gcrm = GlomosCRM;

	$scope.paths = Options.getPaths();

	Wialon.host = $scope.paths.request_url;
	Wialon.init();

	$scope.testmode = (location.host === 'wialoncrm' || location.host === 'localhost:3000');
	GlomosCRM.enabled = false;

	if($scope.testmode && $scope.opt.wialon_version==='hosting') {
		Units.from = 1500;
		Units.to = 2000;
		Units.autorefresh = false;
		//GlomosCRM.enabled = true;
	}

	//if($scope.testmode) GlomosCRM.enabled = true;

	var sid_from_url = Wialon.checkURLForSID();
	var sid_from_storage = Wialon.storage.getItem('sid');
	var token = Wialon.checkURLForToken()
	
	if(!(sid_from_url||sid_from_storage||token)) location.hash = '';

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
	
	if(location.origin !== 'http://www.wialoncrm.com' && location.origin !== 'http://localhost:3000' && location.origin !== 'http://wialoncrm.com' && location.origin !== 'https://www.wialoncrm.com' && location.origin !== 'https://localhost:3000' && location.origin !== 'https://wialoncrm.com') window.angular = Wialon;

	WaitFor(function() {return Wialon.auth;} ,function() {
		if(Units.items.length===0) Units.get();
		if(HWTypes.items.length===0) HWTypes.get();
		if(Accounts.items.length===0) Accounts.get();
		if(Users.items.length===0) Users.get();
		//if(Wialon.user.nm==='glomosru') GlomosCRM.enabled = true;
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
		tmhDynamicLocale.set($scope.lng);
	})
	
	$scope.changeLng = function() {
		if($scope.lng!=='en') {
			$scope.lng = 'en';	
		} else {
			$scope.lng = 'ru';	
		};
		$translate.use($scope.lng);
		tmhDynamicLocale.set($scope.lng);
		Options.item.language = $scope.lng;
		Options.save();
	}
	
}]);