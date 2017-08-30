Main.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
	$urlRouterProvider.otherwise(''); 
	//$locationProvider.html5Mode(false);
	$locationProvider.hashPrefix('');

    var lng = '';
    var opts_from_storage = localStorage.getItem('sc_options');
    if(opts_from_storage) {
        var opts = angular.fromJson(opts_from_storage);
        if(opts.language) {
            var lng = opts.language;
            if(lng === 'en') lng = '';
        }
    }
    var lng_dir = lng;
    if(lng) {
        lng_dir = lng_dir+'/';
    }

	$stateProvider
        .state('home', {
            url: ''
            ,views: {
                '': {templateUrl: 'html/views/'+lng_dir+'home.html'}
            }
        })
    	.state('about', {
            url: '/about/:item_name'
            ,views: {
                '': {templateUrl: 'html/views/'+lng_dir+'home.html', controller: 'AboutCtrl'}
            }
        })
    	.state('login', {
            url: '/login'
            ,views: {
                '': {templateUrl: 'html/views/'+lng_dir+'login.html', controller: 'LoginCtrl'}
            }
        })
        .state('units-list', {
            url: '/units'
            ,views: {
                '': {templateUrl: 'html/views/'+lng_dir+'units-list.html', controller: 'UnitsListCtrl'}
            }
        })
        .state('unit', {
            url: '/unit/:id'
            ,views: {
                '': {templateUrl: 'html/views/'+lng_dir+'unit.html', controller: 'UnitCtrl'}
            }
        })
    	.state('unit.sensor', {
            url: '/sensor/:sensor_id'
        })
    	.state('options', {
            url: '/options'
            ,views: {
                '': {templateUrl: 'html/views/'+lng_dir+'options.html', controller: 'OptionsCtrl'}
            }
        })
        .state('messages', {
            url: '/unit/:id/messages'
            ,views: {
                '': {templateUrl: 'html/views/'+lng_dir+'messages.html', controller: 'MessagesCtrl'}
            }
        })
     //    .state('account', {
     //        url: '/account'
     //        ,views: {
     //            '': {templateUrl: 'views/'+lng_dir+'account.html'}
     //            ,'main@account': {templateUrl: 'views/'+lng_dir+'account-main.html', controller: function($scope) {log(2); $scope.test = 999;}}
     //            ,'navbar@account': {templateUrl: 'views/'+lng_dir+'account-navbar.html', controller: function($scope) {log(1);}}
     //            ,'controlls@account': { template: '<h3>Main Controlls</h3>', controller: function($scope) {log(3);}}
     //        }
     //    })
    	// .state('options', {
    	// 	url: '/options'
    	// 	,views: {
     //            '': {templateUrl: 'views/'+lng_dir+'options.html', controller: function($scope) {log('this is options');}} // to ui-view
    	// 	}
    	// })
  }])
