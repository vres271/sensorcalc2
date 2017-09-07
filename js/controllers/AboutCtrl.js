Main.controller('AboutCtrl',['$scope','$stateParams','$translate' ,'$translatePartialLoader'
	,function($scope,$stateParams,$translate,  $translatePartialLoader) {
	$translatePartialLoader.addPart('about');
	$translate.refresh();


	$scope.item_name = $stateParams.item_name;


}]);




