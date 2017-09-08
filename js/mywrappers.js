var log = function(msg) {
	console.log(msg);
}

var createIndex = function(arr, keyname) {
	var index = {};
	for(var key in arr) {
		var elem = arr[key];
		index[elem[keyname]] = elem;
	}
	return index;
}

var isEmptyObject =  function(obj) {
    // for (var i in obj) {
    //     if (obj.hasOwnProperty(i)) {
    //         return false;
    //     }
    // }
    // return true;
    if(obj === undefined) return true;
    return !Object.keys(obj).length;
}

