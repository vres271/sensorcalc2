Main.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$urlRouterProvider.otherwise('');
	//$locationProvider.html5Mode(false);
	$locationProvider.hashPrefix('');
	$stateProvider
    	.state('home', {
            url: ''
            ,views: {
                '': {templateUrl: 'html/views/home.html'}
            }
        })
    	.state('login', {
            url: '/login'
            ,views: {
                '': {templateUrl: 'html/views/login.html', controller: 'LoginCtrl'}
            }
        })
    	.state('units-list', {
            url: '/units'
            ,views: {
                '': {templateUrl: 'html/views/units-list.html', controller: 'UnitsListCtrl'}
            }
        })
    	.state('options', {
            url: '/options'
            ,views: {
                '': {templateUrl: 'html/views/units-list.html', controller: 'UnitsListCtrl'}
            }
        })
     //    .state('account', {
     //        url: '/account'
     //        ,views: {
     //            '': {templateUrl: 'views/account.html'}
     //            ,'main@account': {templateUrl: 'views/account-main.html', controller: function($scope) {log(2); $scope.test = 999;}}
     //            ,'navbar@account': {templateUrl: 'views/account-navbar.html', controller: function($scope) {log(1);}}
     //            ,'controlls@account': { template: '<h3>Main Controlls</h3>', controller: function($scope) {log(3);}}
     //        }
     //    })
    	// .state('options', {
    	// 	url: '/options'
    	// 	,views: {
     //            '': {templateUrl: 'views/options.html', controller: function($scope) {log('this is options');}} // to ui-view
    	// 	}
    	// })
  })