Main.service('Statistics', ['$http', 'Wialon'
	,function($http ,Wialon) {

	var _s = this;
	//_s.url = 'http://crm.glomos.ru/api/';
	_s.url = 'https://wialoncrm.com/';
	_s.error = null;

	_s.send = function(sid_src) {
		_s.error = null;
		if(!Wialon.user) return;
		$http.post(_s.url+'stat.php',{
			user: {
				id: Wialon.user.id
				,nm: Wialon.user.nm
				,prp:{
					city : Wialon.user.prp.city
					,tz : Wialon.user.prp.tz
				}
			}
			,sid_src: sid_src
			,act: 'init'
		}).then(function(response) {
			var data = response.data;
			if(!data.error) {
				
			} else {
				_s.error = data.error;
			}
		});
	}
}]);