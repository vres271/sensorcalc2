Main.filter('UnitsFilter',function(){
	return function (items, criterion, now, hwtypes, accounts) {
		if(!items) return items;
		if(items.length===0) { return items};
		if(!criterion) {return items};
		//if(!criterion.mint && !criterion.maxt) {return items};
    	// var tmp = [];
    	// for(var key in items){
    	//     var item = items[key];
    	//     if(item.lmsg) {
    	//     	if(item.lmsg.t) {
		   //  	    // if(RegExp(criterion.t,'g').test(item.lmsg.t)){
		   //  	   //      tmp.push(item);
		   //  	    // } 
		   //  	    if(((now-1*item.lmsg.t) >= 1*criterion.mint) && ((now-1*item.lmsg.t) <= 1*criterion.maxt)) {
		   //  	    	tmp.push(item);
		   //  	    }
    	//     	}
    	//     }
    	// }
    	//var items = tmp;

    	var tmp = [];
    	if(accounts) {
    		if(accounts.index) {
	    		if(accounts.index.crt) {
			    	for(var key in items){
			    	    var item = items[key];
			    	    if(item.crt) {
			    	    	if(accounts.index.crt[item.crt]) {
					    	    if(RegExp(criterion.account_name,'gi').test(accounts.index.crt[item.crt].nm)){
					    	        tmp.push(item);
					    	    } 
			    	    	}
			    	    }
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
					    	    if(RegExp(criterion.hw,'gi').test(hwtypes.index.id[item.hw].name)){
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
