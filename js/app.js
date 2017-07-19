var Main = angular.module('Main', ['ui.router']);

Main.filter('UnitsFilter',function(){
	return function (items, criterion, now) {
		if(!items) return items;
		if(items.length===0) { return items};
		if(!criterion) {return items};
		if(criterion.mint==='' && criterion.maxt==='') {return items};
    	var tmp = [];
    	for(var key in items){
    	    var item = items[key];
    	    if(item.lmsg) {
    	    	if(item.lmsg.t) {
		    	    // if(RegExp(criterion.t,'g').test(item.lmsg.t)){
		    	   //      tmp.push(item);
		    	    // } 
		    	    if(((now-1*item.lmsg.t) >= 1*criterion.mint) && ((now-1*item.lmsg.t) <= 1*criterion.maxt)) {
		    	    	tmp.push(item);
		    	    }
    	    	}
    	    }
    	}
    	return tmp;
 	}
})

Main.filter('UTtoTime',function(){
	return function (ut) {
		if(!ut) return '';
		if(ut < 60) return ut+' c';
		if((60 <= ut) && (ut < 300)) {
			var m = Math.floor(ut/60);
			var s = ut - m*60;
			return m+' мин '+s+' с';
		}
		if((300 <= ut) && (ut < 3600)) {
			var m = Math.floor(ut/60);
			return m+' мин';
		}
		if((3600 <= ut) && (ut < 21600)) {
			var h = Math.floor(ut/3600);
			var m = Math.floor(ut/60) - h*60;
			return h+' ч '+m+' мин';
		}
		if((21600 <= ut) && (ut < 86400)) {
			var h = Math.floor(ut/3600);
			return h+' ч';
		}
		if((86400 <= ut) && (ut < 1296000)) {
			var d = Math.floor(ut/86400);
			var h = Math.floor(ut/3600) - d*24;
			return d+' д '+h+' ч';
		}
		if((1296000 <= ut) && (ut < 1261440000)) {
			var d = Math.floor(ut/86400);
			return d+' д';
		}
		return '';
 	}
})
