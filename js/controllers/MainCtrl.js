Main.controller('MainCtrl', ['$scope', 'Ready',  'WaitFor', 'State', 'Wialon', 'Units', 'HWTypes', 'Accounts', 'Users', 'Options', 'GlomosCRM', 'Statistics'
	,function($scope, Ready,  WaitFor, State, Wialon, Units, HWTypes, Accounts, Users, Options, GlomosCRM, Statistics) {
	 
	$scope.wialon = Wialon;
	$scope.ready = Ready;
	$scope.now = State.now;
	Options.load();
	$scope.opt = Options.item;
	$scope.gcrm = GlomosCRM;

	$scope.path = location.host+location.pathname;
	$scope.oauth_link = 'http://hosting.wialon.com/login.html?client_id=wialoncrm&access_type=-1&activation_time=0&duration=0&user=&flags=0x1&redirect_uri=http://'+$scope.path+'%23login';
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
	
	WaitFor(function() {return Wialon.auth;} ,function() {
		if(Units.items.length===0) Units.get();
		if(HWTypes.items.length===0) HWTypes.get();
		if(Accounts.items.length===0) Accounts.get();
		if(Users.items.length===0) Users.get();
		GlomosCRM.login();
	});

	$scope.logout = function() {
		Ready.wialon = false;
		Wialon.stop(function() {
			location.hash = '';
		});
	}

	
}]);