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