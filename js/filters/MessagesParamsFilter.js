Main.filter('MessagesParamsFilter',function(){
	return function (items, criterion) {
		if(!items) return items;
		if(items.length===0) { return items};
		if(!criterion) {return items};
		if(criterion.params === '') {return items};
    	var props_to_hide = {};
    	if(items[0]) {
    		var row = items[0].p;
	    	for(var key in row){
	    	    var elem = row[key];
					if(!RegExp(criterion,'g').test(key)){
						props_to_hide[key] = true;
					} 
	    	}
    	}
    	return props_to_hide;
 	}
})
