.directive('myPop', ['$document', function($document) {
  return {
    restrict: 'AE' //attribute or $element
    ,scope: {
    }

    ,link: function($scope, $element, $attr, ngModelCtrl) {
  		$element.attr('data-trigger',"focus");
  		$element.attr('title',"");
  		$element.attr('data-content',$attr.myPop );			
  		$element.attr('href','');			
  		$element.append('<i class="fa fa-question-circle-o" aria-hidden="true"></i>');
  		$element.popover();
    }
  };
}])