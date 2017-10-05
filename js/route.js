Main.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
	$urlRouterProvider.otherwise(''); 
	//$locationProvider.html5Mode(false);
	$locationProvider.hashPrefix('');

	$stateProvider
        .state('home', {
            url: ''
            ,views: {
                '': {templateUrl: 'html/views/home.html', controller: 'AboutCtrl'}
            }
        })
    	.state('about', {
            url: '/about/:item_name'
            ,views: {
                '': {templateUrl: 'html/views/home.html', controller: 'AboutCtrl'}
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
        .state('unit', {
            url: '/unit/:id'
            ,views: {
                '': {templateUrl: 'html/views/unit.html', controller: 'UnitCtrl'}
            }
        })
    	.state('unit.sensor', {
            url: '/sensor/:sensor_id'
        })
    	.state('options', {
            url: '/options'
            ,views: {
                '': {templateUrl: 'html/views/options.html', controller: 'OptionsCtrl'}
            }
        })
        .state('messages', {
            url: '/unit/:id/messages'
            ,views: {
                '': {templateUrl: 'html/views/messages.html', controller: 'MessagesCtrl'}
            }
        })
        .state('accounts-list', {
            url: '/accounts-list'
            ,views: {
                '': {templateUrl: 'html/views/accounts-list.html', controller: 'AccountsListCtrl'}
            }
        })
         .state('account', {
            url: '/account/:id'
            ,views: {
                '': {templateUrl: 'html/views/account.html', controller: 'AccountCtrl'}
            }
        })
        .state('users-list', {
            url: '/users-list'
            ,views: {
                '': {templateUrl: 'html/views/users-list.html', controller: 'UsersListCtrl'}
            }
        })
         .state('user', {
            url: '/user/:id'
            ,views: {
                '': {templateUrl: 'html/views/user.html', controller: 'UserCtrl'}
            }
        })
         .state('buy', {
            url: '/buy'
            ,views: {
                '': {templateUrl: 'html/views/buy.html', controller: 'BuyCtrl'}
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
  }])
