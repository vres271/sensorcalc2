Main.filter('UnitsFilter',function(){
	return function (items, criterion, now, hwtypes, accounts, users) {
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

    	if(criterion.hw) {
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
    	}

    	if(criterion.p_accounts_nm) {
	    	var tmp = [];		//accounts.index.id[accounts.index.id[item.bact].bpact].nm
	    	if(accounts) {
	    		if(accounts.index) {
		    		if(accounts.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.bact) {
				    	    	if(accounts.index.id[item.bact]) {
				    	    		var account_crt = accounts.index.id[item.bact];
					    	    	if(accounts.index.id[account_crt.bpact]) {
							    	    if(RegExp(criterion.p_accounts_nm,'gi').test(accounts.index.id[account_crt.bpact].nm)){
							    	        tmp.push(item);
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

    	if(criterion.account_name) {
	    	var tmp = [];
	    	if(accounts) {
	    		if(accounts.index) {
		    		if(accounts.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.bact) {
				    	    	if(accounts.index.id[item.bact]) {
						    	    if(RegExp(criterion.account_name,'gi').test(accounts.index.id[item.bact].nm)){
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

    	return items;
 	}
})
