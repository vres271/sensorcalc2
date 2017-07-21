var Main = angular.module('Main', ['ui.router']);

Main.filter('UnitsFilter',function(){
	return function (items, criterion, now, hwtypes) {
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
    	var items = tmp;
    	var tmp = [];
    	if(hwtypes) {
    		if(hwtypes.index) {
	    		if(hwtypes.index.id) {
			    	for(var key in items){
			    	    var item = items[key];
			    	    if(item.hw) {
			    	    	if(hwtypes.index.id[item.hw]) {
					    	    if(RegExp(criterion.hw,'g').test(hwtypes.index.id[item.hw].name)){
					    	        tmp.push(item);
					    	    } 
			    	    	}
			    	    }
			    	}
	    		}
    		}
    	}
    	var items = tmp;
    	return items;
 	}
})

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

Main.filter('ParamToSensorValue',function(){
	return function (sensor,msg) {
		if(!sensor || !msg) return '';
		if(!msg.p) return '';
		var param_name = sensor.p;
		if(msg.p[param_name] === undefined) return '';
		var last_row = 0;
		var val = msg.p[param_name];
		for(var key in sensor.tbl) {
			var row = sensor.tbl[key];
			if(val) {
				if(row.x >= val) {
					return Math.round((last_row.a * val + 1*last_row.b)*100)/100 //a*x+b
				}
			}
			last_row = row;
		}
		if(sensor.tbl.length) {
			if(row.a !== undefined && row.b !== undefined) {
				return Math.round((row.a * val + 1*row.b)*100)/100 //a*x+b
			}
		}
		return val;
 	}
})
