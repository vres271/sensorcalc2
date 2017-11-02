.directive('myMinmaxrange', ['$document', '$filter', function($document, $filter) {
  return {
    
    restrict: 'AE' //attribute or $element
    ,require:"^ngModel" // this is important, 
    ,scope: {
    }

    ,link: function($scope, $element, $attr, ngModelCtrl) {

		var label = document.getElementById($attr.myMinmaxrange);
  		var startMoving = function() {
  			$element.on('mousemove',Move);
  			label.style.display = 'block';
  		}

  		var stopMoving = function() {
  			$element.off('mousemove',Move);
  			label.style.display = 'none';
  		}

  		var Move = function(event) {
			var min = $attr.min;
			var max = $attr.max;
			var d = max-min;
			var width = parseInt($element.css('width'));
			var ut = parseInt(new Date().getTime()/1000);
  			label.innerHTML = $filter('UTtoTime')(ut-$element.val());
  			label.style.left = (width*($element.val()-min)/d)+'px';
  		}

  		$element.on('mousedown',startMoving);
  		$element.on('mouseup',stopMoving);
  		$element.on('click',Move);
  		$element.on('change',Move);
		  Move();

      // $element.on('dragleave', function(event) {
      //   event.preventDefault();
      //   $element.removeClass("dragover");
      // });

      // $element.on('drop', function(event) {
      //   $element.removeClass("dragover");
      //   if(event.originalEvent.dataTransfer.files[0]) {
      //     event.preventDefault();
      //     var file = event.originalEvent.dataTransfer.files[0];
      //     if(file.size) {
      //       maxFileSize = 1024;
      //       if (file.size > maxFileSize) {
      //           log('Файл слишком большой!');
      //           $element.addClass('error');
      //           return false;
      //       }
      //       var reader = new FileReader();
      //       reader.onload = (function (file) {
      //         return function () {
      //           $element.val(this.result);
      //           ngModelCtrl.$setViewValue(this.result);
      //           return this.result;
      //         };
      //       })(file);
      //       reader.readAsText(file);
      //     }
      //   }
      //   $element.removeClass("dragover");
      //   $element.removeClass("error");
      // });
    }
  };
}])