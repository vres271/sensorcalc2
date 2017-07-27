Main.filter('UTtoTime',function(){
	return function (ut) {
		if(!ut) return '';
		if(ut < 60) return ut+' s';
		if((60 <= ut) && (ut < 300)) {
			var m = Math.floor(ut/60);
			var s = ut - m*60;
			return m+' min '+s+' s';
		}
		if((300 <= ut) && (ut < 3600)) {
			var m = Math.floor(ut/60);
			return m+' min';
		}
		if((3600 <= ut) && (ut < 21600)) {
			var h = Math.floor(ut/3600);
			var m = Math.floor(ut/60) - h*60;
			return h+' h '+m+' min';
		}
		if((21600 <= ut) && (ut < 86400)) {
			var h = Math.floor(ut/3600);
			return h+' h';
		}
		if((86400 <= ut) && (ut < 1296000)) {
			var d = Math.floor(ut/86400);
			var h = Math.floor(ut/3600) - d*24;
			return d+' d '+h+' h';
		}
		if((1296000 <= ut) && (ut < 1261440000)) {
			var d = Math.floor(ut/86400);
			return d+' d';
		}
		return '';
 	}
})

