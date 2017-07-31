Main.filter('ParamToSensorValue',function($filter){
	return function (sensor,msg,item) {
		if(!sensor || !msg) return '';
		if(!msg.p) return '';
		var param_name = sensor.p;
		if(msg.p[param_name] === undefined) {
			exp = param_name.replace(/\[/g,'s(\'');
			exp = exp.replace(/\]/g,'\')');
			exp = exp.replace(/const/g,'');
			var s = function(n) {
				return $filter('ParamToSensorValue')(item._index.sens.n[n], msg, item);	// ОХУЕТЬ! Работает!
			}
			var parr = [];
			for(var key in msg.p) {
				parr.push(key);
			}
			exp = exp.replace(RegExp(parr.join('|'), 'gi'), function myFunction(x){return msg.p[x];});
			try {
				val = eval(exp);
			} catch(e) {
				return '';
			}
		} else {
			var val = msg.p[param_name];
		}
		
		if(sensor.c.lower_bound) {
			if(val < sensor.c.lower_bound) {
				return '';
			}
		}
		if(sensor.c.upper_bound) {
			if(val > sensor.c.upper_bound) {
				return '';
			}
		}
		
		var last_row = false;
		for(var key in sensor.tbl) {
			var row = sensor.tbl[key];
			if(val!==undefined) {
				if(row.x >= val) {
					if(!last_row) last_row = row;
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
