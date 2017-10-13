Main.service('Statistics', ['$http', 'Wialon', 'Options'
	,function($http ,Wialon, Options) {

	var _s = this;
	//_s.url = 'http://crm.glomos.ru/api/';
	_s.url = 'https://wialoncrm.com/';
	_s.url = '';
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
			,wialon_version: Options.item.wialon_version
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