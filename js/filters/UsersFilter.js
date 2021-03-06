Main.filter('UsersFilter',function(){
	return function (items, criterion, accounts, users) {
		if(!items) return items;
		if(items.length===0) { return items};
		if(!criterion) {return items};

    	if(criterion.account_nm) {
	    	var tmp = [];
	    	if(items) {
	    		if(accounts.index) {
		    		if(accounts.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.bact) {
				    	    	if(accounts.index.id[item.bact]) {
						    	    if(RegExp(criterion.account_nm,'gi').test(accounts.index.id[item.bact].nm)){
						    	        tmp.push(item);
						    	    } 
				    	    	}
				    	    }
				    	}
		    		}
	    		}
	    	}
	    	var items = tmp;
    	}

    	if(criterion.crt_user_nm) {
	    	var tmp = [];
	    	if(items) {
	    		if(users.index) {
		    		if(users.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.crt) {
				    	    	if(users.index.id[item.crt]) {
						    	    if(RegExp(criterion.crt_user_nm,'gi').test(users.index.id[item.crt].nm)){
						    	        tmp.push(item);
						    	    } 
				    	    	}
				    	    }
				    	}
		    		}
	    		}
	    	}
	    	var items = tmp;
    	}

     	if(criterion.parent_account_nm) {
	    	var tmp = [];
	    	if(items) {
	    		if(accounts.index) {
		    		if(accounts.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.bact) {
				    	    	if(accounts.index.id[item.bact]) {
				    	    		var acc = accounts.index.id[item.bact];
				    	    		if(acc.bpact) {
				    	    			if(accounts.index.id[acc.bpact]) {
								    	    if(RegExp(criterion.parent_account_nm,'gi').test(accounts.index.id[acc.bpact].nm)){
								    	        tmp.push(item);
								    	    } 
				    	    			}
				    	    		}
				    	    	}
				    	    }
				    	}
		    		}
	    		}
	    	}
	    	var items = tmp;
    	}
   	

    	return items;
 	}
})
