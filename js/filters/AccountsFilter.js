Main.filter('AccountsFilter',function(){
	return function (items, criterion, accounts) {
		if(!items) return items;
		if(items.length===0) { return items};
		if(!criterion) {return items};
		if(!criterion.parent_account_nm) {return items};
    	var tmp = [];
    	if(items) {
    		if(accounts.index) {
	    		if(accounts.index.id) {
			    	for(var key in items){
			    	    var item = items[key];
			    	    if(item.bpact) {
			    	    	if(accounts.index.id[item.bpact]) {
					    	    if(RegExp(criterion.parent_account_nm,'gi').test(accounts.index.id[item.bpact].nm)){
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
