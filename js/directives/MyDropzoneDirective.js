.directive('myDropzone', ['$document', function($document) {
  return {
    
    restrict: 'AE' //attribute or $element
    ,require:"^ngModel" // this is important, 
    ,scope: {
      _onfileload: '=myDropzone'
    }

    ,link: function($scope, $element, $attr, ngModelCtrl) {
      $element.on('dragover', function(event) {
        //event.preventDefault();
        $element.addClass("dragover");
        $element.removeClass("error");
      });

      $element.on('dragleave', function(event) {
        event.preventDefault();
        $element.removeClass("dragover");
      });

      $element.on('drop', function(event) {
        $element.removeClass("dragover");
        if(event.originalEvent.dataTransfer.files[0]) {
          event.preventDefault();
          var file = event.originalEvent.dataTransfer.files[0];
          if(file.size) {
            maxFileSize = 100*1024;
            if (file.size > maxFileSize) {
                log('Файл слишком большой!');
                $element.addClass('error');
                return false;
            }
            var reader = new FileReader();
            reader.onload = (function (file) {
              return function () {
                $element.val(this.result);
                ngModelCtrl.$setViewValue(this.result);
                if($scope._onfileload) $scope._onfileload.callback($scope._onfileload.context,{file: file, content: this.result});
                return this.result;
              };
            })(file);
            reader.readAsText(file);
          }
        }
        $element.removeClass("dragover");
        $element.removeClass("error");
      });
    }
  };
}])