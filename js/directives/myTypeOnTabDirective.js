.directive('myTypeontab', ['$document', function($document) {
  return {
    restrict: 'AE' //attribute or $element
    ,require:"^ngModel" // this is important, 
    ,link: function($scope, $element, $attr, ngModelCtrl) {
		$element.on('keydown', function(e){
	        if (e.keyCode == 9) {
	        	e.preventDefault();
	        	var obj = e.target;
	        	obj.setSelectionRange;
				var strFirst = obj.value.substr(0, obj.selectionStart);
	            var strLast  = obj.value.substr(obj.selectionEnd, obj.value.length);
	            obj.value = strFirst + "\t" + strLast;
	            var cursor = strFirst.length + "\t".length;
	            obj.selectionStart = obj.selectionEnd = cursor;	 
	            ngModelCtrl.$setViewValue(obj.value);       
        	}
	    })
    }
  };
}])