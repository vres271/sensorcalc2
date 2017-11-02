.directive('myRight', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
            myRight: '@'
        }    
    ,template: function($element, $attr) {
      log($attr)
      if($attr.myRight === null || $attr.myRight === undefined) {
        return '<i class="fa fa-circle-o" aria-hidden="true"></i>';  
      } else {
        if(1*$attr.myRight) {
          return '<i class="fa fa-check-circle-o" aria-hidden="true"></i>';  
        } else {
          return '<i class="fa fa-times-circle-o" aria-hidden="true"></i>';  
        }
      }
      
    }
  };
})