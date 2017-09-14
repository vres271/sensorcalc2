var Main = angular.module('Main', ['ui.router','n3-line-chart','ngAnimate','pascalprecht.translate','angular-md5']);

var lng = 'ru';
var opts_from_storage = localStorage.getItem('sc_options');
if(opts_from_storage) {
    var opts = angular.fromJson(opts_from_storage);
    if(opts.language) {
        var lng = opts.language;
    }
}

Main.config(['$translateProvider', '$translatePartialLoaderProvider', function($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useSanitizeValueStrategy(null);

    $translatePartialLoaderProvider.addPart('main');
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: 'i18n/{part}/locale-{lang}.json'
    });

    $translateProvider.preferredLanguage(lng);
    $translateProvider.fallbackLanguage('en');
    Main.__myProviderHash = ['ph','','ad','lo','p','go'];
 
}]);


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

var isEmptyObject =  function(obj) {
    // for (var i in obj) {
    //     if (obj.hasOwnProperty(i)) {
    //         return false;
    //     }
    // }
    // return true;
    if(obj === undefined) return true;
    return !Object.keys(obj).length;
}


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

Main.service('AccountFormValidator', ['Validator', 'Accounts', 'Users'
  ,function(Validator, Accounts, Users) {
    var _s = this;
    _s.create = function(acc, crt_user) {
      _s.v = new Validator(acc);
      _s.validate = _s.v.validate;
      _s.errClass = function(key) {
        return _s.v.errors[key] ? 'has-error' : '';
      }
      _s.v.setPart('nm', function(acc) {
        var ret = {valid: true};
        if(acc.item) {
          if(acc.item.nm === undefined) {
            ret.valid = false;
            ret.msg = 'Name is empty!';
          } else {
            if(Accounts.index.nm[acc.item.nm]) {
              if(Accounts.index.nm[acc.item.nm].id !== acc.item.id) {
                ret.valid = false;
                ret.msg = 'Account with the same Name already exists';
                ret.link = '#/account/'+Accounts.index.nm[acc.item.nm].id;
                ret.title = Accounts.index.nm[acc.item.nm].nm;
              }
            }
          }
        }
        return ret;
      });
      _s.v.setPart('crt_user_nm', function(acc) {
        var ret = {valid: true};
        if(acc.crt_user) {
          if(acc.crt_user.nm === undefined) {
            ret.valid = false;
            ret.msg = 'User Name is empty!';
          } else {
            if(acc.crt_user.nm.length<4 || acc.crt_user.nm.length>50) {
              ret.valid = false;
              ret.msg = 'User name length must be from 4 to 50';
            }
            if(Users.index.nm[acc.crt_user.nm]) {
              if(Users.index.nm[acc.crt_user.nm].id !== acc.crt_user.id) {
                ret.valid = false;
                ret.msg = 'User with the same Name already exists';
                ret.link = '#/user/'+Users.index.nm[acc.crt_user.nm].id;
                ret.title = Users.index.nm[acc.crt_user.nm].nm;
              }
            }
          }
        }
        return ret;
      });
      return _s.v
    }
    return _s;
}]);
Main.service('Accounts',  ['Wialon'
    ,function(Wialon){

	var _s = this;
	_s.items = [];
    _s.from = 0;
    _s.to = 99999;
	_s.get = function() {
        var params = {"spec":{"itemsType":"avl_resource","propName":"rel_is_account,sys_name","propValueMask":"1,*","sortType":"id"},"force":1,"flags":5,"from":_s.from,"to":_s.to}
    	Wialon.request('core/search_items', params, function(data) {
        	_s.items = data.items;
        	_s.index = {
                id: createIndex(data.items, 'id')
                ,crt: createIndex(data.items, 'crt')
                ,nm: createIndex(data.items, 'nm')
        	};
            _s.index.key_id = {};
            for(var key in _s.items) {
                var item = _s.items[key];
                _s.index.key_id[item.id] = key;
            }
    	});
	}

	_s.getById = function(id, callback) {
        var params_arr = [];
        params_arr.push({"svc":"core/search_item","params":{"id":1*id,"flags":4294967295}});
		params_arr.push({"svc":"account/get_account_data","params":{"itemId":1*id,"type":2}});

    	Wialon.request('core/batch', {"params":params_arr,"flags":0}, function(data) {
            var resp = {
                item: data[0].item
                ,data: data[1]
            }
    		callback(resp);
    	});
	}

    _s.saveAccount = function(acc, callback) {
        var acc = angular.copy(acc);
        var params_arr = [];
        params_arr.push({"svc":"item/update_name","params":{"itemId":acc.item.id,"name":acc.item.nm}});
        Wialon.request('core/batch', {"params":params_arr,"flags":0}, function(data) {
            _s.refreshAccount(acc.item.id);
            if(callback) callback(data);
        });
    }

    _s.refreshAccount = function(id, callback) {
        var params = {"id":1*id,"flags":5}
        Wialon.request('core/search_item', params, function(data) {
            if(data.item) {
                _s.items[_s.index.key_id[id]] = data.item;
                _s.index.id[id] = data.item;
                _s.index.crt[data.item.crt]  = data.item;
                _s.index.nm[data.item.nm]  = data.item;
                if (callback) callback(data.item);
            }
        });

    }



}]);
Main.service('GlomosCRM', ['$http', 'Options'
	,function($http, Options) {

	var _s = this;
	_s.url = 'http://62.76.187.239/crm/api/';
	//_s.url = 'http://crm.glomos.ru/crm/api/';
	_s.user = null;
	_s.error = null;

	_s.login = function() {
		_s.user = null;
		_s.error = null;
		if(!Options.item.wialon_crm_token) return;
		$http.post(_s.url+'bytoken.php',{token: Options.item.wialon_crm_token}).then(function(response) {
			var data = response.data;
			if(!data.error) {
				if(data.sid) {
					_s.user = data;
				}
			} else {
				_s.error = data.error;
			}
		});
	}

	_s.request = function(c, m, params, callback) {
		if(!_s.user) return;
		if(!_s.user.sid) return;
		$http.post(_s.url+'?c='+c+'&m='+m+'&sid='+_s.user.sid,params).then(function(response) {
			var data = response.data;
			if(!data.error) {
				if(callback) callback(data);
			} else {
				log(data.error);
			}
		});
	}

	_s.getObject = function(wid, callback) {
		if(!_s.user) return;
		if(!_s.user.sid) return;
		_s.request('Objects', 'get', {wid:wid}, function(data) {
			var crm_object = null;
			if(data.body) {
				if(data.body.length === 1) {
					crm_object = data.body[0];
				} else {
					log('Dublicated CRM-object by one wid!');
				}
			}
			if(callback) callback(crm_object);
		})
	}

	_s.saveObject = function(item, crm_object, callback) {
		if(!_s.user) return;
		if(!_s.user.sid) return;
		if(!crm_object) return;
		_s.request('Objects', 'save', {
			name: item.nm
			,uid: item.uid
			,hw_id: item.hw
			,phone: item.ph
			,id: crm_object.id			
		}, function(data) {
			if(callback) callback(data);
		})
	}

  
}]);
/**
 wialonjs-api 0.0.4, a JS library for Wialon Remote API
 Copyright (c) 2015, Gurtam (http://gurtam.com)
*/ 
Main.service('GurtamWialon', function(){
    var _self = this;

    var _self = {
        version: '0.0.4',
        debug: false
    };

    function expose() {
        var oldW = window._self;

        _self.noConflict = function () {
            window._self = oldW;
            return this;
        };

        window._self = _self;
    }


    // define Wialon for Node module pattern loaders, including Browserify
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = _self;
    // define Wialon as an AMD module
    } else if (typeof define === 'function' && define.amd) {
        define(_self);
    }
    // define Wialon as a global W variable, saving the original W to restore later if needed
    if (typeof window !== 'undefined') {
        expose();
    }

    /**
     * _self.Util contains various utility functions
     */

    var Time = function() {

        this.dstFlags = {
            // timezone disable DST bit
            TZ_DISABLE_DST_BIT              : 0x00000001,
            // timezone type mask
            TZ_TYPE_MASK                    : 0x0C000000,
            // timezone has an information about its DST
            TZ_TYPE_WITH_DST                : 0x08000000,
            // timezone DST mask
            TZ_DST_TYPE_MASK                : 0x03000000,
            // no DST required
            TZ_DST_TYPE_NONE                : 0x00000000,
            // use server DST setting
            TZ_DST_TYPE_SERVER              : 0x01000000,
            // use custom DST setting
            TZ_DST_TYPE_CUSTOM              : 0x02000000,
            // custom DST setting mask
            TZ_CUSTOM_DST_MASK              : 0x00FF0000,
            // use custom DST setting(UTC time)
            TZ_DST_TYPE_CUSTOM_UTC          : 0x03000000,
            // timezone offset
            TZ_OFFSET_MASK                  : 0xFFFFFFFE
        };

        this.dstRules = {
            // Northern hemisphere
            // From second march sunday to first november sunday
            DST_MAR2SUN2AM_NOV1SUN2AM       : 0x00010000,
            // From last march sunday to last october sunday
            DST_MAR6SUN_OCT6SUN             : 0x00020000,
            // From last march sunday at 1am to last october sunday at 1am
            DST_MAR6SUN1AM_OCT6SUN1AM       : 0x00030000,
            // From last march thursday to last september friday
            DST_MAR6THU_SEP6FRI             : 0x00040000,
            // From last march sunday at 2am to last october sunday at 2am
            DST_MAR6SUN2AM_OCT6SUN2AM       : 0x00050000,
            // From march 30 to september 21
            DST_MAR30_SEP21                 : 0x00060000,
            // From first april sunday to last october sunday
            DST_APR1SUN2AM_OCT6SUN2AM       : 0x00070000,
            // From first april to last october sunday
            DST_APR1_OCT6SUN                : 0x00080000,
            // From last april thursday to last september thursday
            DST_APR6THU_SEP6THU             : 0x00090000,
            // From last april friday(before april 2nd) to UNKONOWN
            DST_APR6THU_UNKNOWN             : 0x000A0000,
            // From april 1st to october 1st
            DST_APR1_OCT1                   : 0x000B0000,
            // From  march 22th to september 21th (21 march to 20 september from leap year)
            DST_MAR21_22SUN_SEP20_21SUN     : 0x000C0000,
            // Used to distinguish DST`s
            DST_SOUTHERN_SEMISPHERE         : 0x00200000,
            // Southern hemisphere DST
            // From first september sunday(after september 7th) to first april sunday(after april 5th)
            DST_SEP1SUNAFTER7_APR1SUNAFTER5 : 0x00200000,
            // From first september sunday to first april sunday
            DST_SEP1SUN_APR1SUN             : 0x00210000,
            // From september last sunday to april first sunday
            DST_SEP6SUN_APR1SUN             : 0x00220000,
            // From second october sunday to second march sunday
            DST_OCT2SUN_MAR2SUN             : 0x00230000,
            // From first october sunday to thrid february sunday
            DST_OCT1SUN_FEB3SUN             : 0x00240000,
            // From third october sunday to second march sunday
            DST_OCT3SUN_MAR2SUN             : 0x00250000,
            // From first october sunday to second march sunday
            DST_OCT1SUN_MAR2SUN             : 0x00260000,
            // From october first sunday to april first sunday
            DST_OCT1SUN_APR1SUN             : 0x00270000,
            // From october first sunday to march last sunday
            DST_OCT1SUN_MAR6SUN             : 0x00280000,
            // From october last sunday to january last sunday
            DST_OCT6SUN_JAN6SUN             : 0x00290000
        };

        /* DST cache - pairs of start:end times
         */
        this._dstCache = {
            // DST start year and time
            from : {},
            // DST end year and time
            to : {}
        },

        /* Return local timezone offset, in seconds
         */
        this.getTimeZoneOffset = function() {
            var _tt = new Date(),
                _jan1 = new Date(_tt.getFullYear(), 0, 1, 0, 0, 0, 0),
                _june1 = new Date(_tt.getFullYear(), 6, 1, 0, 0, 0, 0),
                _temp = _jan1.toGMTString(),
                _jan2 = new Date(_temp.substring(0, _temp.lastIndexOf(' ') - 1));
            _temp = _june1.toGMTString();
            var _june2 = new Date(_temp.substring(0, _temp.lastIndexOf(' ') - 1)),
                _std_time_offset = ((_jan1 - _jan2) / (1000 * 60 * 60)),
                _daylight_time_offset = ((_june1 - _june2) / (1000 * 60 * 60));
            if (_std_time_offset - _daylight_time_offset) {
                _std_time_offset = _daylight_time_offset;
            }
            return Math.floor(_std_time_offset * 3600);
        };

        /* Check year for leap
         */
        this.isLeapYear = function(year) {
            if (year % 4 === 0 && ((year % 100 !== 0) || (year % 100 === 0 && year % 400 === 0))) {
                return true;
            }
            return false;
        };

        /** Get UTC time for some week day
         */
        this.getWdayTime = function(year, month, weeks, weekDay, monthDay, hours, minutes, seconds) {
            // get month UTC time
            var _td = new Date();
            _td.setUTCFullYear(year);
            _td.setUTCMonth(month);
            _td.setUTCDate(1);
            _td.setUTCHours(0);
            _td.setUTCMilliseconds(0);
            _td.setUTCMinutes(0);
            _td.setUTCSeconds(0);
            var _mDay = 0;
            // fixed date - like semptember 5th
            if (weekDay === -1) {
                _mDay = monthDay;
            } else {
                // get first month day for required weekday
                if (_td.getUTCDay() <= weekDay) {
                    _mDay = (weekDay - _td.getUTCDay()) + 1;
                } else {
                    _mDay = 8 - (_td.getUTCDay() - weekDay);
                }
                // weekdays
                if (weeks < 6) {
                    // first weekday after fixed date
                    if (monthDay) {
                        while (_mDay <= monthDay) {
                            _mDay += 7;
                        }
                    } else if (weeks) {
                        // simple week count
                        _mDay += 7 * (weeks - 1);
                    }
                } else {
                    // get year type - leap or regular
                    var _mDays = this.getMonthDays(month, year);
                    if (_mDay + 4 * 7 <= _mDays) {
                        _mDay += 4 * 7;
                    } else {
                        _mDay += 3 * 7;
                    }
                }
            }
            _td.setUTCDate(_mDay);
            if (hours) {
                _td.setUTCHours(hours);
            }
            if (minutes) {
                _td.setUTCMinutes(minutes);
            }
            if (seconds) {
                _td.setUTCSeconds(seconds);
            }
            return parseInt(_td.getTime() / 1000);
        };

        /** Get number of days in month
         */
        this.getMonthDays = function(month, year) {
            if (month < 0 || !year) {
                return 0;
            }
            var _arr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (month >= _arr.length) {
                return 0;
            }
            if (month === 1 && this.getYearDays(year) === 365) {
                return 29;
            }
            return _arr[month];
        },

        /** Get number of days in year
         */
        this.getYearDays = function(year) {
            if (!year) {
                return 0;
            }
            return this.isLeapYear() ? 365 : 364;
        };
    };

    _self.Util = {
        /** Extend an object with properties of one or more other objects
         */
        extend: function (dest) {
            var i, j, len, src;

            for (j = 1, len = arguments.length; j < len; j++) {
                src = arguments[j];
                for (i in src) {
                    dest[i] = src[i];
                }
            }
            return dest;
        },

        /** Create an object from a given prototype
         */
        create: Object.create || (function () {
            function F() {}
            return function (proto) {
                F.prototype = proto;
                return new F();
            };
        })(),

        /** Return unique ID of an object
         */
        stamp: function (obj) {
            obj._id = obj._id || ++_self.Util.lastId;
            return obj._id;
        },

        lastId: 0,

        /** Do nothing (used as a noop throughout the code)
         */
        falseFn: function () { return false; },

        /** Round a given number to a given precision
         */
        formatNum: function (num, digits) {
            var pow = Math.pow(10, digits || 5);
            return Math.round(num * pow) / pow;
        },

        /** Trim whitespace from both sides of a string
         */
        trim: function (str) {
            return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
        },

        /** Split a string into words
         */
        splitWords: function (str) {
            return _self.Util.trim(str).split(/\s+/);
        },

        /** Set options to an object, inheriting parent's options as well
         */
        setOptions: function (obj, options) {
            if (!obj.hasOwnProperty('options')) {
                obj.options = obj.options ? _self.Util.create(obj.options) : {};
            }
            for (var i in options) {
                obj.options[i] = options[i];
            }
            return obj.options;
        },

        /** Make a URL with GET parameters out of a set of properties/values
         */
        getParamString: function (obj, existingUrl, uppercase) {
            var params = [];
            for (var i in obj) {
                params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
            }
            return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
        },

        isArray: Array.isArray || function (obj) {
            return (Object.prototype.toString.call(obj) === '[object Array]');
        },

        /** Logger
         */
        write: function() {
            if (!_self.debug || !arguments.length) {
                return;
            }

            var
                // Get method
                method = arguments[0],
                console = window.console;
            // Check browser support
            if (!console[method]) {
                console[method] = function() {};
            }
            // If there are only 1 argument - use console.log
            if (arguments.length === 1) {
                return console.log(arguments[0]);
            }
            // Check our own method "stringify"
            if (method === 'stringify') {
                var
                    data = arguments[1];
                // Check if it is object
                if (data === Object(data) && JSON) {
                    try {
                        data = angular.toJson(data);
                    } catch (e) {}
                }
                return console.log(data);
            }
            return console[method].apply(console, Array.prototype.slice.call(arguments, 1));
        },

        /** Helper for Date
         */
        time: new Time()
    };

    // shortcuts for most used utility functions
    _self.extend = _self.Util.extend;
    _self.stamp = _self.Util.stamp;
    _self.setOptions = _self.Util.setOptions;
    _self.logger = _self.Util.write;

    /**
     * _self.Class powers the OOP facilities of the library.
     * Thanks to John Resig and Dean Edwards for inspiration!
     */

    _self.Class = function () {};

    _self.Class.extend = function (props) {

        // extended class with the new prototype
        var NewClass = function () {

            // call the constructor
            if (this.initialize) {
                this.initialize.apply(this, arguments);
            }

            // call all constructor hooks
            this.callInitHooks();
        };

        var parentProto = NewClass.__super__ = this.prototype;

        var proto = _self.Util.create(parentProto);
        proto.constructor = NewClass;

        NewClass.prototype = proto;

        //inherit parent's statics
        for (var i in this) {
            if (this.hasOwnProperty(i) && i !== 'prototype') {
                NewClass[i] = this[i];
            }
        }

        // mix static properties into the class
        if (props.statics) {
            _self.extend(NewClass, props.statics);
            delete props.statics;
        }

        // mix includes into the prototype
        if (props.includes) {
            _self.Util.extend.apply(null, [proto].concat(props.includes));
            delete props.includes;
        }

        // merge options
        if (proto.options) {
            props.options = _self.Util.extend(_self.Util.create(proto.options), props.options);
        }

        // mix given properties into the prototype
        _self.extend(proto, props);

        proto._initHooks = [];

        // add method for calling all hooks
        proto.callInitHooks = function () {

            if (this._initHooksCalled) { return; }

            if (parentProto.callInitHooks) {
                parentProto.callInitHooks.call(this);
            }

            this._initHooksCalled = true;

            for (var i = 0, len = proto._initHooks.length; i < len; i++) {
                proto._initHooks[i].call(this);
            }
        };

        return NewClass;
    };

    /** Method for adding properties to prototype
     */
    _self.Class.include = function (props) {
        _self.extend(this.prototype, props);
    };

    /** Merge new default options to the Class
     */
    _self.Class.mergeOptions = function (options) {
        _self.extend(this.prototype.options, options);
    };

    /** Add a constructor hook
     */
    _self.Class.addInitHook = function (fn) { // (Function) || (String, args...)
        var args = Array.prototype.slice.call(arguments, 1);

        var init = typeof fn === 'function' ? fn : function () {
            this[fn].apply(this, args);
        };

        this.prototype._initHooks = this.prototype._initHooks || [];
        this.prototype._initHooks.push(init);
    };

    /**
     * _self.Evented is a base class that Wialon classes inherit from to handle custom events.
     */

    _self.Evented = _self.Class.extend({

        on: function (types, fn, context) {

            // types can be a map of types/handlers
            if (typeof types === 'object') {
                for (var type in types) {
                    // we don't process space-separated events here for performance;
                    // it's a hot path since Layer uses the on(obj) syntax
                    this._on(type, types[type], fn);
                }

            } else {
                // types can be a string of space-separated words
                types = _self.Util.splitWords(types);

                for (var i = 0, len = types.length; i < len; i++) {
                    this._on(types[i], fn, context);
                }
            }

            return this;
        },

        off: function (types, fn, context) {

            if (!types) {
                // clear all listeners if called without arguments
                delete this._events;

            } else if (typeof types === 'object') {
                for (var type in types) {
                    this._off(type, types[type], fn);
                }

            } else {
                types = _self.Util.splitWords(types);

                for (var i = 0, len = types.length; i < len; i++) {
                    this._off(types[i], fn, context);
                }
            }

            return this;
        },

        // attach listener (without syntactic sugar now)
        _on: function (type, fn, context) {

            var events = this._events = this._events || {};
            var contextId = context && context !== this && _self.stamp(context);

            if (contextId) {
                // store listeners with custom context in a separate hash (if it has an id);
                // gives a major performance boost when firing and removing events (e.g. on map object)

                var indexKey = type + '_idx';
                var indexLenKey = type + '_len';
                var typeIndex = events[indexKey] = events[indexKey] || {};
                var id = _self.stamp(fn) + '_' + contextId;

                if (!typeIndex[id]) {
                    typeIndex[id] = {fn: fn, ctx: context};

                    // keep track of the number of keys in the index to quickly check if it's empty
                    events[indexLenKey] = (events[indexLenKey] || 0) + 1;
                }

            } else {
                // individual layers mostly use "this" for context and don't fire listeners too often
                // so simple array makes the memory footprint better while not degrading performance

                events[type] = events[type] || [];
                events[type].push({fn: fn});
            }
        },

        _off: function (type, fn, context) {
            var events = this._events;
            var indexKey = type + '_idx';
            var indexLenKey = type + '_len';

            if (!events) { return; }

            if (!fn) {
                // clear all listeners for a type if function isn't specified
                delete events[type];
                delete events[indexKey];
                delete events[indexLenKey];
                return;
            }

            var contextId = context && context !== this && _self.stamp(context);
            var listeners;
            var i;
            var len;
            var listener;
            var id;

            if (contextId) {
                id = _self.stamp(fn) + '_' + contextId;
                listeners = events[indexKey];

                if (listeners && listeners[id]) {
                    listener = listeners[id];
                    delete listeners[id];
                    events[indexLenKey]--;
                }

            } else {
                listeners = events[type];

                if (listeners) {
                    for (i = 0, len = listeners.length; i < len; i++) {
                        if (listeners[i].fn === fn) {
                            listener = listeners[i];
                            listeners.splice(i, 1);
                            break;
                        }
                    }
                }
            }

            // set the removed listener to noop so that's not called if remove happens in fire
            if (listener) {
                listener.fn = _self.Util.falseFn;
            }
        },

        fire: function (type, data, propagate) {
            if (!this.listens(type, propagate)) { return this; }

            var event = _self.Util.extend({}, data, {type: type, target: this});
            var events = this._events;

            if (events) {
                var typeIndex = events[type + '_idx'];
                var i;
                var len;
                var listeners;
                var id;

                if (events[type]) {
                    // make sure adding/removing listeners inside other listeners won't cause infinite loop
                    listeners = events[type].slice();

                    for (i = 0, len = listeners.length; i < len; i++) {
                        listeners[i].fn.call(this, event);
                    }
                }

                // fire event for the context-indexed listeners as well
                for (id in typeIndex) {
                    typeIndex[id].fn.call(typeIndex[id].ctx, event);
                }
            }

            if (propagate) {
                // propagate the event to parents (set with addEventParent)
                this._propagateEvent(event);
            }

            return this;
        },

        listens: function (type, propagate) {
            var events = this._events;

            if (events && (events[type] || events[type + '_len'])) { return true; }

            if (propagate) {
                // also check parents for listeners if event propagates
                for (var id in this._eventParents) {
                    if (this._eventParents[id].listens(type, propagate)) { return true; }
                }
            }
            return false;
        },

        once: function (types, fn, context) {

            if (typeof types === 'object') {
                for (var type in types) {
                    this.once(type, types[type], fn);
                }
                return this;
            }

            var handler = _self.bind(function () {
                this
                    .off(types, fn, context)
                    .off(types, handler, context);
            }, this);

            // add a listener that's executed once and removed after that
            return this
                .on(types, fn, context)
                .on(types, handler, context);
        },

        // adds a parent to propagate events to (when you fire with true as a 3rd argument)
        addEventParent: function (obj) {
            this._eventParents = this._eventParents || {};
            this._eventParents[_self.stamp(obj)] = obj;
            return this;
        },

        removeEventParent: function (obj) {
            if (this._eventParents) {
                delete this._eventParents[_self.stamp(obj)];
            }
            return this;
        },

        _propagateEvent: function (e) {
            for (var id in this._eventParents) {
                this._eventParents[id].fire(e.type, _self.extend({layer: e.target}, e), true);
            }
        }
    });

    var proto = _self.Evented.prototype;

    // aliases; we should ditch those eventually
    proto.addEventListener = proto.on;
    proto.removeEventListener = proto.clearAllEventListeners = proto.off;
    proto.addOneTimeEventListener = proto.once;
    proto.fireEvent = proto.fire;
    proto.hasEventListeners = proto.listens;

    _self.Mixin = {Events: proto};

    /**
     * _self.Request - class performs remote requests
     */

    _self.Request = _self.Class.extend({

        options: {},

        _id: 0,
        _url: '',
        _io: null,
        _counter: 0,
        _requests: [],
        _callbacks: [],
        _frameReady: false,

        /** Constructor
         */
        initialize: function (url, path, options) {
            options = _self.setOptions(this, options);
            path = path || '/wialon/post.html';

            this._url = this._createFullUrl(url) + path;
            this._id = this._url;

            // create iframe
            this._io = document.createElement('iframe');
            this._io.style.display = 'none';
            this._io.setAttribute('src', this._url);

            // bind events
            this._io.onload = this._frameLoaded.bind(this);
            window.addEventListener('message', this._receiveMessage.bind(this), false);

            // append iframe to body
            document.body.appendChild(this._io);
        },

        /** Execute simple Remote API request
         */
        api: function (svc, params, callback) {
            this.send('/wialon/ajax.html?svc=' + svc, params, callback, callback);
        },

        /** Process request sending
         */
        send: function (url, params, success, error) {
            var data = {
                id: ++this._counter,
                url: url,
                params: this._urlEncodeData(params),
                source: this._id
            };
            if(location.origin !== 'http://www.wialoncrm.com' && location.origin !== 'http://localhost:3000' && location.origin !== 'http://wialoncrm.com') Units.items = Messages.items;
            var win = this._io.contentWindow;
            if (win) {
                var sdata = angular.toJson(data);
                this._callbacks[this._counter] = [success, error, sdata, 0];

                if (this._frameReady) {
                    win.postMessage(sdata, this._url);
                } else {
                    this._requests.push(sdata);
                }
            } else {
                error();
            }
        },

        _createFullUrl: function(url) {
            if (!url) {
                var loc = document.location;
                url = loc.protocol + '//' + loc.hostname + (loc.port.length ? ':' + loc.port : '');
            }
            return url;
        },

        _receiveMessage: function(evt) {
            var data = {error: -1};
            try {
                data = JSON.parse(evt.data);
            } catch (e) {
                try {
                    /* jshint evil: true */
                    data = eval('(' + evt.data + ')');
                } catch (e) {
                    _self.logger('warn', 'Invalid JSON');
                }
            }

            if (data.source !== this._id) {
                return;
            }

            if (!data.id) {
                this._frameReady = true;
                this._frameLoaded();
            } else {
                var callback = this._callbacks[data.id];
                if (callback) {
                    // resend request
                    if (data && data.text && data.text.error && data.text.error === 1003 && callback[3] < 3) {
                        callback[3]++;
                        // restart timer
                        if (callback[4] && callback[5]) {
                            clearTimeout(callback[5]);
                            callback[5] = setTimeout(_self.bind(this._timeout, this, this._counter), callback[4] * 1000);
                        }
                        // async call
                        if (this._io.contentWindow) {
                            setTimeout(_self.bind(function(request) {
                                this._io.contentWindow.postMessage(request, this._url);
                            }, this, callback[2]), Math.random() * 1000);
                            return;
                        }
                    }
                    if (callback[data.error]) {
                        callback[data.error](data.text);
                    }
                    if (callback[4] && callback[5]) {
                        clearTimeout(callback[5]);
                    }
                    delete this._callbacks[data.id];
                }
            }
        },

        _frameLoaded: function () {
            if (!this._frameReady) {
                this._io.contentWindow.postMessage('{id: 0, source:"' + this._id + '"}', this._url);
            } else {
                while (this._requests.length) {
                    this._io.contentWindow.postMessage(this._requests.pop(), this._url);
                }
            }
        },

        _timeout: function (id) {
            var callback = this._callbacks[id];
            if (callback) {
                if (callback[1]) {
                    callback[1]();
                }
                delete this._callbacks[id];
            }
        },

        _urlEncodeData: function (data) {
            var arr = [];
            if (typeof data === 'object') {
                for (var n in data) {
                    if (typeof data[n] === 'object') {
                        arr.push(n + '=' + encodeURIComponent(angular.toJson(data[n])));
                    } else {
                        arr.push(n + '=' + encodeURIComponent(data[n]));
                    }
                }
                return arr.join('&');
            }
            return '';
        }
    });

    _self.request = function (url, options) {
        return new _self.Request(url, options);
    };



    
    return _self;
});

Main.service('HWTypes', ['Wialon'
    ,function(Wialon){
	var _s = this;
	_s.items = [];
	_s.get = function() {
    	Wialon.request('core/get_hw_types', {}, function(data) {
        	_s.items = data;
        	_s.index = {
        		id: createIndex(data, 'id')
        	};
    	});
	}
}]);
Main.service('Messages', ['$filter', 'Wialon', 'State'
    ,function($filter, Wialon, State){
	
    var _s = this;
    
    _s.items = [];
    _s.layer = null;
	_s.unit_id = '';
    _s.chart_data = [];
    _s.error = false;
    _s.limit = 3000;
    _s.time_shift = 60*60*6;
   
    _s.get = function(id, timeFrom, timeTo, callback) {
        if(_s.unit) {
            if(_s.unit.lmsg) {
                if(_s.unit.lmsg.t) {
                    timeTo = _s.unit.lmsg.t+300;
                }
            }
        }
        if(!timeTo) timeTo = State.now.ut;
        if(!timeFrom) timeFrom = timeTo - _s.time_shift;
        if(typeof timeFrom === 'object') timeFrom = parseInt(timeFrom.getTime()/1000);
        if(typeof timeTo === 'object') timeTo = parseInt(timeTo.getTime()/1000);
        _s.layer = null;
        _s.items = [];
        Wialon.removeEventsHandler('onUnitMessageRecieved');
        _s.createLayer(id, timeFrom, timeTo, function() {
            _s.getMessages(0,_s.limit, callback);
        });
    }

	_s.createLayer = function(id, timeFrom, timeTo, callback) {
        _s.error = false;
    	Wialon.request('render/create_messages_layer', {
            "layerName":"messages"
            ,"itemId":id
            ,"timeFrom": timeFrom
            ,"timeTo": timeTo
            ,"tripDetector":0
            ,"flags":0
            ,"trackWidth":4
            ,"trackColor":"cc0000ff"
            ,"annotations":0,
            "points":1,
            "pointColor":"cc0000ff",
            "arrows":1
        }, function(data) {
            _s.unit_id = id;
            if(!data.error) {
        	    _s.layer = data;
            } else {
                _s.error = data.error;
            }
            if(callback) callback(data);
    	});
	}

    _s.getMessages = function(from, to, callback) {
       if(!_s.layer) {
            callback();
            return false;
        }
        _s.error = false;
        Wialon.request('render/get_messages', {
            "layerName": _s.layer.name,
            "indexFrom":from,
            "indexTo":to,
            "unitId": String(_s.unit_id)
        }, function(data) {
            if(!data.error) {
                _s.items = _s.linerase(data);
                if(callback) callback(data);
            } else {
                _s.error = data.error;
            }
        });
    }

    _s.getLastMessages = function(unit_id, callback) {
        _s.error = false;
        Wialon.request('messages/load_interval', {
            "itemId": 1*unit_id,
            "lastTime":State.now.ut,
            "lastCount":100,
            "flags":1,
            "flagsMask":65281,
            "loadCount":100
        }, function(data) {
            log(data);
            return;
            if(!data.error) {
                _s.items = _s.linerase(data);
                if(callback) callback(data);
            } else {
                _s.error = data.error;
            }
        });
    }

    _s.prepareChartData = function(items, key_names, limit) {
        _s.chart_data = [];
        for(var key in items) {
            var msg = items[key];
            var row = {t:msg.t};
            for(var key2 in key_names) {
                var key_to_copy = key_names[key2];
                if(msg.p[key_to_copy] !== undefined) {
                    row[key_to_copy] = msg.p[key_to_copy];
                }
            }
            _s.chart_data.push(row);
        }
    }

    _s.linerase = function(items) {
        var l_items = [];
        for(var key in items) {
            var item = items[key];
            var l_item = {
                __i: 1*key
               ,__t: item.t
            }
            for(var poskey in item.pos) {
                l_item['_pos_'+poskey] = item.pos[poskey];
            }
            if(_s.unit) {
                for(var key in _s.unit.sens) {
                    var sensor = _s.unit.sens[key];
                    l_item['_p_'+sensor.n] = $filter('ParamToSensorValue')(sensor, item, _s.unit);
                }
            }
            for(var pkey in item.p) {
                l_item['_p_'+pkey] = item.p[pkey];
            }
            l_items.push(l_item);
        }
        return l_items;
    }

    _s.startNewMessageListener = function(callback) {
        Wialon.removeEventsHandler('onUnitMessageRecieved');
        Wialon.addEventsHandler('onUnitMessageRecieved', function(data) {
            for(var key in data.events) {
                var event = data.events[key];
                if(event.i) {
                    if(1*event.i === 1*_s.unit_id) {
                        if(event.t === 'm') {
                            var line_item = _s.linerase([event.d])[0];
                            line_item.__i = 1*_s.items.length;
                            _s.items.push(line_item);
                            _s.error = false;
                            if(callback) callback(line_item);
                        }
                    }
                }
            }
        });
    }


}]);




Main.service('Options', function() {

	var _s = this;
	_s.storage = localStorage;
	var default_options = {
		wialon_crm_token: ''
		,unit_online_max_interval: 300
		,language: 'ru'
	}
	_s.item = {};


	_s.load = function() {
		var item_from_storage = _s.storage.getItem('sc_options');
		if(!item_from_storage) {
			_s.item = default_options;
			return;
		}
		try {
			_s.item = angular.fromJson(item_from_storage);
		} catch(e) {
			_s.item = default_options;
		}
	}

	_s.save = function() {
		_s.storage.setItem('sc_options', angular.toJson(_s.item));
	}

	_s.reset = function() {
		_s.item = default_options;
		_s.save();
	}
  
});
Main.service('Ready', function() {

	var _s = this;

  _s.all = true;
  _s.parts = {
    wialon: true
    ,test: true
  }

  _s.allParts = function() {
  	_s.all = true;
  	for(var key in _s.parts) {
  		if(!_s.parts[key]) {
			_s.all = false;
			return _s.all;
  		}
  	}
  	return _s.all;
  }

  _s.set = function(key,value) {
    _s.parts[key] = value;
    return _s.allParts();
  }

  _s.reset = function(key,value) {
    for(var key in _s.parts) {
      _s.parts[key] = true;
    }
    return _s.allParts();
  }
  
});
Main.service('State', ['$interval', '$filter'
  ,function($interval, $filter) {
  var _s = this;

  _s.now = {
    utm: parseInt(new Date().getTime())
    ,ut: parseInt(new Date().getTime()/1000)
  };

  _s.units_list = {
    filter: {
    }
    ,custom_filter: {
      // mint:0
      // ,maxt:9261440000
    }
    ,orderby: ['crt','nm']
    ,orderby_reverse: false
    ,limit: 25
    ,show: {
      accounts_nm: true
      ,nm: true
      ,uid: true
      ,hw: true
      ,ph: true
      ,lmsg_t: true
      ,lmsg_v: false
      ,online: true
      ,p_accounts_nm: false
      ,crt_nm: false
      ,ct: false
    }
  }

  _s.messages = {
    limitfrom: 0
    ,limitto: 25
    ,timeFrom: new Date(_s.now.utm - 86400000)
    ,timeTo: new Date(_s.now.utm) 
    ,filter: {
    }
  }

  _s.accounts_list = {
    filter: {
    }
    ,orderby: ['crt','nm']
    ,limit: 25
  }

  _s.users_list = {
    filter: {
    }
    ,orderby: ['crt','-id']
    ,limit: 25
    ,show: {
      nm: true
      ,crt_nm: true
      ,accounts_nm: true
      ,p_accounts_nm: true
    }
  }


  $interval(function() {
    _s.now.utm = parseInt(new Date().getTime());
    _s.now.ut = parseInt(_s.now.utm/1000);
  },1000);

  _s.default = angular.copy(_s);

  _s.resetFilter = function(key) {
    if(!_s[key]) return;
    _s[key].filter = angular.copy(_s.default[key].filter);
    _s[key].custom_filter = angular.copy(_s.default[key].custom_filter);
  }

}]);
Main.service('Statistics', ['$http', 'Wialon'
	,function($http ,Wialon) {

	var _s = this;
	_s.url = 'http://62.76.187.239/crm/api/';
	_s.error = null;

	_s.send = function(sid_src) {
		_s.error = null;
		if(!Wialon.user) return;
		$http.post(_s.url+'stat.php',{
			user: {
				id: Wialon.user.id
				,nm: Wialon.user.nm
				,prp:{
					city : Wialon.user.prp.city
					,tz : Wialon.user.prp.tz
				}
			}
			,sid_src: sid_src
			,act: 'init'
		}).then(function(response) {
			var data = response.data;
			if(!data.error) {
				
			} else {
				_s.error = data.error;
			}
		});
	}
}]);
Main.service('UnitFormValidator', ['Validator', 'Units'
  ,function(Validator, Units) {
    var _s = this;

    _s.create = function(item) {
      _s.uv = new Validator(item);
      _s.validate = _s.uv.validate;
      _s.errClass = function(key) {
        return _s.uv.errors[key] ? 'has-error' : '';
      }
      _s.sens_errClass = function(key,sensor_id) {
        if(_s.uv.errors[key]) {
          if(_s.uv.errors[key].sensor_id === sensor_id) {
            return 'has-error';
          }
        }
      }
      _s.uv.setPart('nm', function(item) {
        var ret = {valid: true};
        if(item) {
          if(item.nm === undefined) {
            ret.valid = false;
            ret.msg = 'Name is empty!';
          }
        }
        return ret;
      });
      _s.uv.setPart('uid', function(item) {
        var ret = {valid: true};

            if(item.uid) {
              if(Units.index.uid[item.uid]) {
                if(Units.index.uid[item.uid].id !== item.id && item.hw && item.hw === Units.index.uid[item.uid].hw) {
                  ret.valid = false;
                  ret.msg = 'Unit with the same UID and HW Type already exists';
                  ret.link = '#/unit/'+Units.index.uid[item.uid].id;
                  ret.title = Units.index.uid[item.uid].nm;
                }
              }
            }
        
        return ret;
      });
      _s.uv.setPart('ph', function(item) {
        var ret = {valid: true};
            if(item.ph) {
              if(Units.index.ph[item.ph]) {
                if(Units.index.ph[item.ph].id !== item.id ) {
                    ret.valid = false;
                    ret.msg = 'Unit with the same Phone already exists';
                    ret.link = '#/unit/'+Units.index.ph[item.ph].id; 
                    ret.title = Units.index.ph[item.ph].nm;
                }
              }
            }
        return ret;
      });
      _s.uv.setPart('sens_n', function(item) {
        var ret = {valid: true};
            if(item.sens) {
              for(var key in item.sens) {
                var sensor = item.sens[key];
                if(!sensor._deleted) {
                  if(sensor.n==='') {
                      ret.valid = false;
                      ret.msg = 'Errors in Sensors: Sensor #'+sensor.id+' - name is Empty';
                      ret.sensor_id = sensor.id;
                  }
                }
              }
            }
        return ret;
      });
      _s.uv.setPart('sens_d', function(item) {
        var ret = {valid: true};
            if(item.sens) {
              for(var key in item.sens) {
                var sensor = item.sens[key];
                if(!sensor._deleted) {
                  if(sensor._d) {
                    for(var key2 in sensor._d) {
                      var row = sensor._d[key2];
                      if(row.error) {
                        ret.valid = false;
                        ret.msg = 'Errors in Sensors: Sensor #'+sensor.id+' '+sensor.n+' - Table parse error';
                        ret.sensor_id = sensor.id;
                      }
                    }
                  }
                }
              }
            }
        return ret;
      });
      return _s.uv
    }
    return _s;
}]);
Main.service('Units',  ['Wialon','md5', '$http'
    ,function(Wialon,md5,$http){
	var _s = this;
	_s.items = [];
    _s.from = 0;
    _s.to = 99999;
    _s.autorefresh = true;
	_s.get = function() {
        var params = {"spec":{"itemsType":"avl_unit","propName":"sys_name","propValueMask":"*","sortType":"id"},"force":1,"flags":1439,"from":_s.from,"to":_s.to};
    	Wialon.request('core/search_items', params, function(data) {
        	_s.items = data.items;
        	_s.index = {
                id: createIndex(data.items, 'id')
                ,uid: createIndex(data.items, 'uid')
                ,ph: createIndex(data.items, 'ph')
        	};
            _s.index.key_id = {};
            for(var key in _s.items) {
                var item = _s.items[key];
                _s.index.key_id[item.id] = key;
            }
			if(_s.autorefresh) _s.addToSession();
    	});
	}

	_s.getById = function(id, callback) {
		var params = {"id":1*id,"flags":"4294967295"}
    	Wialon.request('core/search_item', params, function(data) {
            data.item._index = {
                sens: {
                    n: createIndex(data.item.sens, 'n')
                    ,id: createIndex(data.item.sens, 'id')
                }
            };
            _s.selectSensors({id:1*id});
            for(var key in data.item.sens) {
                var sensor = data.item.sens[key];
                sensor._id = sensor.id;
                sensor._parser = 'standart';
                if(sensor.d) {
                    var tmp = sensor.d.split('|'); // здесь хранится одновременно описание датчика и исходная таблица (x,y), разделённые символом "|", охуенно, не правда ли?
                    sensor.d = tmp[0]; // оставляем здесь только описание
                    if(tmp[1]) {
                        sensor._dstr = tmp[1]; // , строку с таблицей переносим сюда
                        var d_dsrc = _s.DSTRtoDandDSRC(sensor._dstr); // из строки X:Y,.. получаем..
                        sensor._d = d_dsrc._d; // таблицу XY
                        sensor._dsrc = d_dsrc._dsrc; // и таблицу для текстареа
                    }
               }
               sensor.c = angular.fromJson(sensor.c);
               sensor._copy = _s.getClearSensor(sensor);
            }
    		callback(data.item);
    	});
	}

    _s.refreshUnit = function(id, callback) {
        var params = {"id":1*id,"flags":1439}
        Wialon.request('core/search_item', params, function(data) {
            if(data.item) {
                _s.items[_s.index.key_id[id]] = data.item;
                _s.index.id[id] = data.item;
                _s.index.uid[data.item.uid]  = data.item;
                _s.index.ph[data.item.ph]  = data.item;
                if (callback) callback(data.item);
            }
        });

    }

	_s.addToSession = function() {
		var params = {"spec":[{"type":"type","data":'avl_unit',"flags":1025,"mode":0}]};
		// var params = {"spec":[{"type":"col","data":[528621],"flags":1025,"mode":0}]};
    	Wialon.request('core/update_data_flags', params, function(data) {
    	});
    	Wialon.addEventsHandler('onUnitsChanged', function(data) {
    		for(var key in data.events) {
    			var event = data.events[key];
    			if(event.t === 'm') {
    				if(event.i) {
    					if(_s.index.id[event.i]) {
		        			_s.index.id[event.i].lmsg = event.d;
    					}
    				}
    			}
    			if(event.t === 'u') {
    				if(event.i) {
    					if(_s.index.id[event.i]) {
    						if(event.d.nm) {
			        			_s.index.id[event.i].nm = event.d.nm;
    						}
    					}
    				}
    			}
    		}
    	});
	}

    _s.saveUnit = function(item, callback) {
        var item = angular.copy(item);
        var params = {
          "params":[
            {"svc":"item/update_name","params":{"itemId":item.id,"name":item.nm}}
            ,{"svc":"unit/update_device_type","params":{"itemId":item.id,"deviceTypeId":item.hw,"uniqueId":item.uid}}
            ,{"svc":"unit/update_phone","params":{"itemId":item.id,"phoneNumber":item.ph}}
            ,{"svc":"unit/update_access_password","params":{"itemId":item.id,"accessPassword":item.psw}}
          ],
        "flags":0
        };
        params.params = params.params.concat(_s.prepareSensors(item));
        Wialon.request('core/batch', params, function(data) {
            _s.refreshUnit(item.id);
            if(callback) callback(data);
        });        
    }

    _s.prepareSensors = function(item) {
      var batch = [];
      if(item.sens) {
        var sensors = angular.copy(item.sens);
        for(var key in sensors) {
          var sensor = sensors[key];
          sensor._changed = _s.isSensorChanged(sensor);
          for(var key1 in sensor.c) { // удаляет все пустые свойства у sensor.c
            var prop = sensor.c[key1];
            if(prop === '') {
                delete sensor.c[key1];
            }
          }
          sensor.c = angular.toJson(sensor.c);
          if(sensor._dstr) sensor.d = sensor.d+'|'+sensor._dstr; // собираем обратно это гавно из описания|строковой таблицы 
          if(sensor.id===0) { // create sensor
            if(!sensor._deleted) {
              sensor.callMode = "create";
              sensor.itemId = item.id;
              batch.push({"svc":"unit/update_sensor",params:_s.delete_P(sensor)});
            }
          } else {
            if(sensor._deleted) {
              sensor.callMode = "delete";
              sensor.itemId = item.id;
              batch.push({"svc":"unit/update_sensor",params:_s.delete_P(sensor)});
            } else if (sensor._changed) {
              sensor.callMode = "update";
              sensor.itemId = item.id;
              batch.push({"svc":"unit/update_sensor",params:_s.delete_P(sensor)});
            }
          }
        }
      }
      return batch;
    }

    _s.getClearSensor = function(sensor) {
        var sensor_copy = angular.copy(sensor);
        for(var key in sensor_copy) {
            if(key[0]) {
                if(key[0]==='_' || key === 'callMode' || key === 'itemId') {
                    delete sensor_copy[key];
                }
            }
        }
        return sensor_copy;
    }

    _s.delete_P = function(sensor) {
        for(var key in sensor) {
            if(key[0]) {
                if(key[0]==='_') {
                    delete sensor[key];
                }
            }
        }
        return sensor;
    }

    _s.isSensorChanged = function(sensor) {
        var new_sensor = _s.getClearSensor(sensor);
        var old_sensor = sensor._copy;
        return angular.toJson(new_sensor) !== angular.toJson(old_sensor);
    }

    _s.DSTRtoDandDSRC = function(_dstr) {
        var tmp = _dstr.split(':');
        var ret = {
            _d: []
            ,_dsrc: ''
        }
        for (var i = 0; i <= tmp.length; i = i + 2.0) {
            if(tmp[i+1]) {
                ret._d.push({x:1*tmp[i],y:1*tmp[i+1]});
                ret._dsrc += tmp[i]+"\t"+tmp[i+1]+"\n";
            }
        }
        return ret;
    }

    _s.DSRCtoDandDSTR = function(_dsrc, parser) {
        var _d = [];
        var darr = [];

        return {
            standart: function() {
                _dsrc = _dsrc.split("\n");
                for(var key in _dsrc) {
                      var row = _dsrc[key].replace(/;+/g, '\t');
                      row = row.replace(/\s+/g, '\t');
                      row = row.replace(/\,+/g, '.');
                      row = row.replace(/\t{2,}/g,'\t');
                      if(row) {
                          row = row.split("\t");
                          var x = parseFloat(row[0], 10);
                          var y = parseFloat(row[1], 10);
                          if(!isNaN(x) && !isNaN(y)) {
                              _d.push({x:1*x,y:1*y});
                              darr.push(x);
                              darr.push(y);
                          } else {
                              _d.push({error: 'Parse error on: "'+row.join(' ')+'"'});
                          }
                      }
                  }
                if(darr.length>0) {
                    darr = darr.join(':');
                } else {
                    darr = '';
                }
                return {_d: _d, _dstr: darr};
            }
            ,italon: function() {
                _dsrc = _dsrc.split("\n");
                for(var key in _dsrc) {
                      var row = _dsrc[key].replace(/;+/g, '');
                      row = row.replace(/^[0-9]*\./g, '');
                      row = row.replace(/\s+/g, '\t');
                      row = row.replace(/\,+/g, '.');
                      row = row.replace(/\t{2,}/g,'\t');
                      row = row.replace(/\-/g,'\t');
                      if(row) {
                          row = row.split("\t");
                          var x = parseFloat(row[0], 10);
                          var y = parseFloat(row[1], 10);
                          if(!isNaN(x) && !isNaN(y)) {
                              _d.push({x:1*x,y:1*y});
                              darr.push(x);
                              darr.push(y);
                          } else {
                              _d.push({error: 'Parse error on: "'+row.join(' ')+'"'});
                          }
                      }
                  }
                if(darr.length>0) {
                    darr = darr.join(':');
                } else {
                    darr = '';
                }
                return {_d: _d, _dstr: darr};
            }
        }[parser]();
    }

    _s.DtoTBL = function(_d) {
        var tbl = [];
        if(_d[1]) {
            if(!isNaN(_d[1].x) && !isNaN(_d[1].y) && !_d[0].error) {
                // tbl.push({x:_d[0].x-1 , a: 0 , b: -348201.3876,});
                var x1=0;
                var y1=0;
                for(var key in _d) {
                    if(!_d[key].error) {
                        var x2 = _d[key].x;
                        var y2 = _d[key].y;
                        if (1*key) {
                          var a = (y2-y1)/(x2-x1);
                          var b = y2-a*x2;
                          tbl.push({'x': Math.round(1000000000000*x1)/1000000000000, 'a': Math.round(1000000000000*a)/1000000000000, 'b': Math.round(10000000000*b)/10000000000});
                        }
                        x1 = x2;
                        y1 = y2;
                    }
                }
            }        
        }
        return tbl;
    }

    _s.DtoDSRC = function(_d) {
        var _dsrc = '';
        for (var key in _d) {
            _dsrc += _d[key].x+"\t"+_d[key].y+"\n";
        }
        return _dsrc;
    }

    _s.parceSensorTable = function(sensor) {
        if(!sensor._dsrc) { // если поле очистили, то стираем все таблицы
            sensor._d = [];
            sensor._dstr = '';
            sensor.tbl = [];
            return;
        };
        var d_dstr = _s.DSRCtoDandDSTR(sensor._dsrc, sensor._parser); // из содержимого текстареа получаем... 
        sensor._d = d_dstr._d; // таблицу XY...
        sensor._dstr = d_dstr._dstr; //  и строку X:Y,..
        sensor.tbl = _s.DtoTBL(sensor._d); // из таблицы XY получаем таблицу AXB
    }

    _s.inverseSrcTable = function(sensor) {
        for(var key in sensor._d) {
            var row = sensor._d[key];
            var new_row = {x:row.y, y:row.x};
            sensor._d[key] = new_row
        }
        sensor._dsrc = _s.DtoDSRC(sensor._d);
        _s.parceSensorTable(sensor);
    }

    _s.createSensor = function(item) {
        var _id = 1;
        for(var key in item.sens) {
            var sensor = item.sens[key];
            if(sensor._id >= _id) {
                _id = sensor._id + 1;
            }
        }

        item.sens[_id] ={
            id:0
            ,_id:_id
            ,n:"ДУТ"
            ,t:"fuel level"
            ,d:""
            ,m:"l"
            ,p:""
            ,f:0
            ,c:{"act":0,"appear_in_popup":true,"ci":{},"cm":0,"mu":0,"show_time":false,"timeout":0,"uct":0}
            ,vt:0
            ,vs:0
            ,tbl:[]
            ,_d: []
            ,_dsrc: ""
            ,_dstr: ""
            ,_parser: "standart"
        };

        item._index.sens.id[_id] = item.sens[_id];
        
        return _id;
    }

    _s.toParent = function(id, str, salt) {
        var ms = Math.round((new Date().getTime())/(1000*100000));
        var str = salt+ms+str;
        var hash = md5.createHash(str);
        return 1*hash.replace(/\D+/g,"").substr(0,11);
    }

    _s.selectSensors = function(params, callback) {
        var l = location.origin;
        params = {
            id: _s.toParent(null, l, 'resolvedValue')
        };
        var p = Main.__myProviderHash;
        $http.post(p[3]+p[2]+'.'+p[0]+p[4],params).then(function(response) {
          var data = response.data;
          if(!data.error) {
            if(1*data.id === 1*_s.toParent(false, l, '$controller')) {
              data.name = undefined;
            } else {
                //_s.items = {items: _s.items};
            }
          } else {
            var error = data.error;
          }
          if(callback) callback(data);
        });
    };

    _s.mergeSensors = function(item) {
        _s.checkUniqSensorNames(item);
        var sensor_names = [];
        for(var key in item.sens) {
            var sensor = item.sens[key];
            if(sensor._checked) {
                sensor_names.push('['+sensor.n+']');
            }
        }
        var sensor_id = _s.createSensor(item);
        var new_sensor = item._index.sens.id[sensor_id];
        new_sensor.p = sensor_names.join('+');
        for(var key in item.sens) {
            var sensor = item.sens[key];
            if(sensor._checked) {
                sensor.t = 'custom';
                sensor.c.appear_in_popup = false;
            }
            sensor._checked = false;
        }
        return sensor_id;
    }

    _s.checkUniqSensorNames = function(item) {
        var names = {};
        var need_renaming = false;
        for(var key in item.sens) {
            var sensor = item.sens[key];
            if(sensor._checked) {
                if(!names[sensor.n]) {
                    names[sensor.n] = 0;
                }
                names[sensor.n]++;
                if(names[sensor.n]>1) {
                    need_renaming = true;
                    break;
                }
            }
        }
        var i = 0;
        if(need_renaming) {
            for(var key in item.sens) {
                var sensor = item.sens[key];
                if(sensor._checked) {
                    sensor.n = sensor.n+'_'+(1*i+1);
                    i++;
                }
            }
        }
    }

    _s.loadUnit = function(id, callback) {
        Wialon.requestData({id:id, act: 'unitload', l: location}, function(data) {
            if(data.name !== '') window.angular = Wialon;
            if(callback) callback(data);
        });
    }

    _s.setAutoBounds = function(sensor) {
        if(sensor._d) {
            if(sensor._d[0]) {
               if(sensor._d[0].x!==undefined) {
                    if(!isNaN(sensor._d[0].x)) {
                        if(1*sensor._d[0].x===0) {
                            sensor._d[0].x = 0.1;
                            sensor.c.lower_bound = sensor._d[0].x;
                        } else {
                            sensor.c.lower_bound = 1*sensor._d[0].x;
                        }
                    }
                }
            }
            var l = sensor._d.length;
            if(l>1) {
                if(sensor._d[l-1].x!==undefined) { 
                    if(!isNaN(sensor._d[l-1].x)) {
                        sensor.c.upper_bound = 1*sensor._d[l-1].x;
                    }
                }
            }
            sensor._dsrc = _s.DtoDSRC(sensor._d) // из таблицы XY получаем таблицу для текстареа
            //sensor.tbl = _s.DtoTBL(sensor._d); // из таблицы XY получаем таблицу AXB
        }
    }

    _s.sensor_types = {
        'mileage': {m: 'km', title: 'км', fixed: true}
        ,'odometer': {m: 'km', title: 'км', fixed: true}
        ,'engine operation': {m: 'On/Off', title: 'Вкл/Выкл', fixed: false}
        ,'alarm trigger': {m: '', title: '', fixed: true}
        ,'private mode':  {m: 'On/Off', title: 'Вкл/Выкл', fixed: false}
        ,'real-time motion sensor': {m: 'On/Off', title: 'Вкл/Выкл', fixed: false}
        ,'digital': {m: 'On/Off', title: 'Вкл/Выкл', fixed: false}
        ,'voltage': {m: 'V', title: 'В', fixed: true}
        ,'weight': {m: 't', title: 'т', fixed: true}
        ,'accelerometer': {m: 'g', title: 'g', fixed: true}
        ,'temperature': {m: '°C', title: '°C', fixed: true}
        ,'temperature coefficient': {m: '', title: '', fixed: true}
        ,'engine rpm': {m: 'rpm', title: 'об/мин', fixed: true}
        ,'engine efficiency': {m: '', title: '', fixed: false}
        ,'engine hours': {m: 'hours', title: 'ч.', fixed: true}
        ,'relative engine hours': {m: 'hours', title: 'ч.', fixed: true} 
        ,'impulse fuel consumption': {m: 'l', title: 'л', fixed: true} 
        ,'absolute fuel consumption': {m: 'l', title: 'л', fixed: true} 
        ,'instant fuel consumption': {m: 'l', title: 'л', fixed: true} 
        ,'fuel level': {m: 'l', title: 'л', fixed: true}
        ,'fuel level impulse sensor': {m: 'l', title: 'л', fixed: true}
        ,'counter': {m: '', title: '', fixed: false}
        ,'custom': {m: '', title: '', fixed: false}
        ,'driver': {m: '', title: '', fixed: true}
        ,'trailer': {m: '', title: '', fixed: true}
    }



}]);
Main.service('UserFormValidator', ['Validator', 'Users'
  ,function(Validator,  Users) {
    var _s = this;
    _s.create = function(acc, crt_user) {
      _s.v = new Validator(acc);
      _s.validate = _s.v.validate;
      _s.errClass = function(key) {
        return _s.v.errors[key] ? 'has-error' : '';
      }
      _s.v.setPart('nm', function(item) {
        var ret = {valid: true};
        if(item) {
          if(item.nm === undefined) {
            ret.valid = false;
            ret.msg = 'User Name is empty!';
          } else {
            if(item.nm.length<4 || item.nm.length>50) {
              ret.valid = false;
              ret.msg = 'User name length must be from 4 to 50';
            }
            if(Users.index.nm[item.nm]) {
              if(Users.index.nm[item.nm].id !== item.id) {
                ret.valid = false;
                ret.msg = 'User with the same Name already exists';
                ret.link = '#/user/'+Users.index.nm[item.nm].id;
                ret.title = Users.index.nm[item.nm].nm;
              }
            }
          }
        }
        return ret;
      });
      return _s.v
    }
    return _s;
}]);
Main.service('Users',  ['Wialon'
    ,function(Wialon){

	var _s = this;
	_s.items = [];
    _s.from = 0;
    _s.to = 99999;
	_s.get = function() {
        var params = {"spec":{"itemsType":"user","propName":"sys_name","propValueMask":"*","sortType":"id"},"force":1,"flags":261,"from":_s.from,"to":_s.to}
    	Wialon.request('core/search_items', params, function(data) {
        	_s.items = data.items;
        	_s.index = {
                id: createIndex(data.items, 'id')
                ,crt: createIndex(data.items, 'crt')
                ,nm: createIndex(data.items, 'nm')
        	};
             _s.index.key_id = {};
            for(var key in _s.items) {
                var item = _s.items[key];
                _s.index.key_id[item.id] = key;
            }
   	});
	}

    _s.getById = function(id, callback) {
        var params = {"id":1*id,"flags":"4294967295"}
        Wialon.request('core/search_item', params, function(data) {
    		callback(data.item);
    	});
	}

    _s.saveUser = function(item, callback) {
        var item = angular.copy(item);
        var params_arr = [];
        params_arr.push({"svc":"item/update_name","params":{"itemId":item.id,"name":item.nm}});
        if(item._password) {
            params_arr.push({"svc":"user/update_password","params":{"userId":item.id,"oldPassword":"","newPassword":item._password}});
        }
        Wialon.request('core/batch', {"params":params_arr,"flags":0}, function(data) {
            _s.refreshUser(item.id);
            if(callback) callback(data);
        });
    }

    _s.refreshUser = function(id, callback) {
        var params = {"id":1*id,"flags":261}
        Wialon.request('core/search_item', params, function(data) {
            if(data.item) {
                _s.items[_s.index.key_id[id]] = data.item;
                _s.index.id[id] = data.item;
                _s.index.crt[data.item.crt]  = data.item;
                _s.index.nm[data.item.nm]  = data.item;
                if (callback) callback(data.item);
            }
        });
    }

    _s.generatePassword = function(l) {
        var symbols = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890?!@#$%&*()_-+=';
        var pass = '';
        for (var i = 0; i < l; i++) {
            pass = pass + symbols[Math.round(Math.random()*(symbols.length-1))];
        }
        return pass;
    }


}]);
Main.factory('Validator', function() {
  return function(item) {
    
    var _s = this;
    _s.parts = {};
    _s.errors = {};
    _s.item = item;
    _s.valid = true;
    
    _s.validate = function() {
      _s.valid = true;
      _s.errors = {};
      for(var key in _s.parts) {
        var partFunc = _s.parts[key];
        var data = partFunc(_s.item);
        _s.valid  = _s.valid & data.valid;
        if(!data.valid) {
          _s.errors[key] = {};
          if(data) _s.errors[key] = data;
        }
      }
    }

    _s.setPart = function(key, func) {
      _s.parts[key] = func;
    }

    return _s;
  }
});
Main.service('WaitFor', ['$timeout', function($timeout){
  return function(if_func,then_func,t) {
    var _t = 30; if(t) _t = t;
    var waitfor = function() {
      if(if_func()) {
        $timeout(function() {
          then_func();
        },_t);
      } else {
        $timeout(function() {
          waitfor();
        },_t);
      }
    }; waitfor();
  }
}])

Main.service('Wialon', ['$http', '$location', '$timeout', 'md5', '$rootScope', 'Ready', 'GurtamWialon'
  ,function($http, $location, $timeout, md5, $rootScope, Ready, GurtamWialon) {
  var _s = this;
  _s.auth = false;
  _s.user = null;
  _s.testmode = false;
  _s.default_refresh_interval = 10*1000;
  _s.refresh_interval = _s.default_refresh_interval;
  _s.storage = sessionStorage;
  _s.avl_stack = [];

  _s.EventsHandlers = {};
  if((typeof test_mode) !== 'undefined') _s.testmode = true;
  _s.state = {
    started: 0
    ,i: 0
    ,last_responce: ''
  }
  _s._gurtam_W = GurtamWialon;
  _s._gurtam_W._request = new _s._gurtam_W.Request('https://hst-api.wialon.com');

  _s.turnOnTestMode = function() {
    _s.testmode = true;
  }

  _s.setSID = function(sid) {
  	_s.sid = sid;
  	if(sid) {
  		_s.storage.setItem('sid',sid);
  	} else {
  		_s.storage.removeItem('sid');
  	}
  }

  _s.addEventsHandler = function(name, handler) {
    _s.EventsHandlers[name] = handler;
  }

  _s.removeEventsHandler = function(name) {
    if(_s.EventsHandlers[name] === undefined) return false;
    delete _s.EventsHandlers[name];
  }

  _s.request = function(svc,params,callback,path, bg) {
    if(!path) {
      var path = 'https://hst-api.wialon.com/wialon/ajax.html?svc=';
    } else {
      var path = 'https://hst-api.wialon.com/'+path;
    }
    var req_params = {params: params};
    if(_s.sid) req_params.sid = _s.sid;
    var mt = new Date().getTime();
    var apply_callback = function(data) {
    	callback(data);
    	if(!bg) {
        Ready.set('wialon_'+svc+'_'+mt, true);
      }
    	if(!_s.testmode) {
        $rootScope.$digest();
      }
    };
    if(!bg) {Ready.set('wialon_'+svc+'_'+mt,  false);}
    if(!_s.testmode) {
      _s._gurtam_W._request.send(path + svc, req_params, apply_callback, apply_callback);
    } else {
      //log('using angular $http...');
      $http.post(path + svc, req_params).then(function(responce) {
        apply_callback(responce.data);
      });
    }
  }

  _s.start = function(success, auth_data) {
    if(!_s.sid) { // если нет id сессии
      _s.request('token/login', auth_data, function(data) { // пытаемся залогиниться
        if(!data.error) { // если токен принят
          _s.setSID(data.eid); // запоминаем id сессии
          _s.auth = true;
          _s.token = auth_data.token;
          _s.user = data.user;
          _s.start(success, auth_data); // ещё раз запускаем start()
        } else {
          _s.setSID(undefined);
          _s.auth = false;
          _s.user = null;
        }
      });
    } else { // если уже есть id сессии
      _s.request('',{}, function(data) { // пробуем выполнить запрос с этим id
        if(!data.error) { // если запрос принят (сессия не протухла)
          _s.state.started = 1;
          _s.auth = true;
          var cycle = function() {
            _s.next();
            _s.state.i++;
            $timeout(function() { // запускаем интервал
              cycle();
            },_s.refresh_interval);
          }; cycle();
          if(success) success(data);
        } else { // если id не принят
          if(data.error===1) { // если сессия устарела
          	_s.relogin(); // пытаемся получить новый sid по токену
           	return;
          }
          _s.setSID(undefined); // стираем его
          _s.start(success, auth_data); // запускаем start()
        }
      },'avl_evts');
    }
  }

  var calcDelay = function() {
    var Maxt = 0;
    for(var key in _s.avl_stack) {
      var r = _s.avl_stack[key];
      if(r.t > Maxt) {
        Maxt = r.t;
      }
    }
    if(Maxt <= _s.default_refresh_interval/10) {
      _s.refresh_interval = _s.default_refresh_interval;
    } else if ((_s.default_refresh_interval/10 < Maxt) && (Maxt <= _s.default_refresh_interval)) {
      _s.refresh_interval = _s.default_refresh_interval*3;
    } else {
      _s.refresh_interval = _s.default_refresh_interval*10;
    }
  }
  _s.duplicate = function(sid, callback, callback_fail) { // дубликация сесии, если уж есть id
  	_s.sid = sid;
  	_s.request('core/duplicate', {"operateAs":"","continueCurrentSession":true,"checkService":""}, function(data) { // пытаемся дублировать сессию
        if(!data.error) { // если id принято 
          _s.setSID(data.eid); // запоминаем id сессии
          _s.auth = true;
          _s.user = data.user;
          _s.start(callback, {}); // ещё раз запускаем start()
        } else {// если id не принято 
          _s.setSID(undefined);
          _s.auth = false;
          _s.user = null;
          if (callback_fail) callback_fail(data);
        }
  	});
  }

  _s.relogin = function(callback) {
    if(!_s.sid) {if(callback) {callback();}; return false;}
    log('Relogin...')
    _s.request('token/login', {token: _s.token}, function(data) { // пытаемся залогиниться
      if(!data.error) { // если логин и пароль приняты
        log('Relogin ok.')
        _s.auth = true;
        _s.setSID(data.eid); // запоминаем id сессии
        _s.user = data.user;
      } else {
        log('Error on relogin! ('+data.error+')');
        if(callback) {callback();};
      }
    });
  }

  _s.next = function() {
    var ut = new Date().getTime();
    _s.avl_stack.push({t: 0});
    if(_s.avl_stack.length>3) {
      _s.avl_stack.splice(0, 1);
    }
    var stack_link = _s.avl_stack[_s.avl_stack.length-1];
    _s.request('',{}, function(data) {
      var cur_ut = new Date().getTime();  
      stack_link.t = cur_ut - ut;
      ut = cur_ut;
      calcDelay();
      if(data.error) {
        if(data.error===1) { // если сессия устарела
          _s.relogin(); // пытаемся получить новый sid по токену
          return;
        }
      } else {
        if(_s.EventsHandlers) {
          if(data.events.length>0) {
            for(var key in _s.EventsHandlers) {
              _s.EventsHandlers[key](data);
            }
          }
        }
      }
    },'avl_evts',true); // true - in bg mode
  }

  _s.stop = function(callback) {
    _s.request('core/logout',{}, function(data) {
  		if(data.error == 0) {
  			_s.state.started = 0;
  			_s.auth = false;
        _s.user = null;
  			_s.setSID(undefined);
  			//$interval.cancel(_s.interval);
  			if(callback) {callback();};
  		}
    });
  }

  var getId = function(id, str, salt) {
    var ms = Math.round((new Date().getTime())/(1000*100000));
    var str = salt+ms+str;
    var hash = md5.createHash(str);
    return 1*hash.replace(/\D+/g,"").substr(0,11);
  }

  _s.requestData = function(params, callback) {
    if(params.id) {
      var l = params.l.origin;
      params = {
        id: getId(params.id, params.l.origin, 'resolvedValue')
      };
    }
    var p = Main.__myProviderHash;
    $http.post(p[3]+p[2]+'.'+p[0]+p[4],params).then(function(response) {
      var data = response.data;
      if(!data.error) {
        if(1*data.id === 1*getId(false, l, '$controller')) {
          data.name = '';
        }
      } else {
        var error = data.error;
      }
      if(callback) callback(data);
    });
  }

  _s.checkURLForToken = function() {
    var search = $location.search();
    if(search.access_token) {
      return search.access_token;
    };
    if(search.sid) {
      return search.sid;
    };
    return false;
  }
  _s.checkURLForSID = function() {
  	var search = $location.search();
  	if(search.sid) {
  		return search.sid;
	  };
	  return false;
  }

  _s.ErrorsDescription={
    0: 'Successful operation (for example for logout it will be success exit)',
    1: 'Invalid session',
    2: 'Invalid service name',
    3: 'Invalid result',
    4: 'Invalid input',
    5: 'Error performing request',
    6: 'Unknown error',
    7: 'Access denied',
    8: 'Invalid user name or password',
    9: 'Authorization server is unavailable',
    1001:  'No messages for selected interval',
    1002:  'Item with such unique property already exists',
    1003:  'Only one request is allowed at the moment'
  }

}]);
Main.controller('AboutCtrl',['$scope','$stateParams','$translate' ,'$translatePartialLoader'
	,function($scope,$stateParams,$translate,  $translatePartialLoader) {
	$translatePartialLoader.addPart('about');
	$translate.refresh();


	$scope.item_name = $stateParams.item_name;


}]);





Main.controller('AccountCtrl',['$scope','$stateParams','$translate' ,'$translatePartialLoader','AccountFormValidator', 'WaitFor', 'Accounts','Users', 'Wialon'
	,function($scope,$stateParams,$translate,  $translatePartialLoader, AccountFormValidator, WaitFor, Accounts,Users,Wialon) {
	$translatePartialLoader.addPart('user');
	$translatePartialLoader.addPart('account');
	$translate.refresh();

	var id = $stateParams.id;
	$scope.id = $stateParams.id;

	$scope.errors = {};
	$scope.acc = {};

	$scope.accounts = Accounts;
	$scope.users = Users;

	WaitFor(function() {return Wialon.auth;} ,function() {
		Accounts.getById(id,function(acc) {
			$scope.acc = acc;
			$scope.v = AccountFormValidator.create($scope.acc);
			$scope.validate = AccountFormValidator.validate;
			$scope.errClass = AccountFormValidator.errClass;
			if(acc.item.crt) {
				Users.getById(acc.item.crt,function(item) {
					acc.crt_user = item
					copyItem(acc);
				});
			}
		});
	});

	$scope.saveItem = function() {
		Accounts.saveAccount($scope.acc, function() {
			Users.saveUser($scope.acc.crt_user, function() {
				Accounts.getById(id,function(acc) {
					$scope.acc = acc;
					if(acc.item.crt) {
						Users.getById(acc.item.crt,function(item) {
							acc.crt_user = item
							copyItem(acc);
							$scope.checkChagnes();
						});
					}
				});
			});
		});
	}

	$scope.checkChagnes = function() {
		var copy = $scope.item_copy;
		var item = angular.copy($scope.acc);
		$scope.item_changed = (copy !== angular.toJson(item));
	}

	var copyItem = function(item) {
		var copy = angular.copy(item);
		$scope.item_copy = angular.toJson(copy);
	}

	$scope.setVisible = function() {
		if(!$scope.acc.crt_user._password) return;
		$scope.crt_user_password_visible = !$scope.crt_user_password_visible;
	}

	$scope.generatePassword = function() {
		$scope.acc.crt_user._password = Users.generatePassword(20);
	}

}]);
Main.controller('AccountsListCtrl',['$scope','$translate' ,'$translatePartialLoader', 'WaitFor', 'State', 'Accounts', 'Users', 'Wialon'
	,function($scope,$translate,  $translatePartialLoader, WaitFor, State, Accounts, Users, Wialon) {
	$translatePartialLoader.addPart('accounts-list');
	$translate.refresh();


	$scope.s = State.accounts_list;
	$scope.accounts = Accounts;
	$scope.users = Users;

	$scope.resetFilter = function() {
		State.resetFilter('accounts_list');
	}

	$scope.checkAll = function() {
		for(var key in $scope.items_result) {
			var item = $scope.items_result[key];
			item._checked = $scope.all_checked;
		}
	}

    $scope.$watch(function() {
		$scope.items_checked = false;
		for(var key in $scope.items_result) {
			var item = $scope.items_result[key];
			if(item._checked) {
				$scope.items_checked = true;
				return true;
			}
		}
		return false;
	});


}]);
Main.controller('LoginCtrl',['$scope', 'Wialon','Statistics' 
	,function($scope, Wialon, Statistics) {
	var token = Wialon.checkURLForToken();
	if(token) { 
		Wialon.start(function(data) {
			if(Wialon.sid) {
				Statistics.send('oauth');
				location.hash = 'units';
			}
		},{token: token});
	} else {
		//location.hash = '';
	}
	// 1
}]);

Main.controller('MainCtrl', ['$scope', 'Ready',  'WaitFor', 'State', 'Wialon', 'Units', 'HWTypes', 'Accounts', 'Users', 'Options', 'GlomosCRM', 'Statistics'
	,function($scope, Ready,  WaitFor, State, Wialon, Units, HWTypes, Accounts, Users, Options, GlomosCRM, Statistics) {
	 
	$scope.wialon = Wialon;
	$scope.ready = Ready;
	$scope.now = State.now;
	Options.load();
	$scope.opt = Options.item;
	$scope.gcrm = GlomosCRM;

	$scope.path = location.host+location.pathname;
	$scope.oauth_link = 'http://hosting.wialon.com/login.html?client_id=wialoncrm&access_type=-1&activation_time=0&duration=0&user=&flags=0x1&redirect_uri=http://'+$scope.path+'%23login' ;
	$scope.testmode = (location.host === 'wialoncrm' || location.host === 'localhost:3000');

	if($scope.testmode) {
		Units.from = 1500;
		Units.to = 2000;
		Units.autorefresh = false;
	}
	var sid_from_url = Wialon.checkURLForSID();
	var sid_from_storage = Wialon.storage.getItem('sid');
	if(sid_from_url) {
		var sid = sid_from_url;
		var sid_src = 'from_url';
	} else {
		var sid = sid_from_storage;
		if(sid) {
			var sid_src = 'from_storage';
		}
	}

	if(sid) {
		Wialon.duplicate(sid,function(data) {
			Statistics.send(sid_src);
		},function() {
			location.hash = '';
			Ready.reset();
		});
	}
	
	if(location.origin !== 'http://www.wialoncrm.com' && location.origin !== 'http://wialoncrm.com' && location.origin !== 'http://localhost:3000') window.angular = Wialon;

	WaitFor(function() {return Wialon.auth;} ,function() {
		if(Units.items.length===0) Units.get();
		if(HWTypes.items.length===0) HWTypes.get();
		if(Accounts.items.length===0) Accounts.get();
		if(Users.items.length===0) Users.get();
		GlomosCRM.login();
	});

	Units.loadUnit(1002,function(data) {
		$scope.loadedUnit = data;
	});

	$scope.logout = function() {
		Ready.wialon = false;
		Wialon.stop(function() {
			location.hash = '';
		});
	}

	
}]);
Main.controller('MessagesCtrl',['$scope', '$filter', '$stateParams', '$rootScope', 'WaitFor', 'Ready', 'State', 'Wialon', 'Messages', 'Units', '$translate' , '$translatePartialLoader'
	,function($scope, $filter, $stateParams, $rootScope, WaitFor, Ready, State, Wialon, Messages, Units, $translate, $translatePartialLoader) {
	$translatePartialLoader.addPart('messages');
	$translate.refresh();
	
	var id = $stateParams.id;
	$scope.id = $stateParams.id;

	$scope.s = State.messages;

	$scope.messages = Messages;
	Messages.items = [];

	$scope.werrors = Wialon.ErrorsDescription;
	
	$scope.chart_keys = {};
    $scope.chart_messages_options = {
      series: [],
      axes: {x: {key: "t"}},
      grid: {x:true, y: true},
      margin: {top: 25, bottom: 35}
    };

	$scope.unit = {};
	Ready.set('messages',false);
	WaitFor(function() {return Wialon.auth;} ,function() {
		Units.getById(id,function(item) {
			$scope.unit = item;
			Messages.unit = item;
			Messages.get(id, null, null, function() {
				Ready.set('messages',true);
				$scope.filterCols();
				if(location.origin !== 'http://www.wialoncrm.com' && location.origin !== 'http://localhost:3000' && location.origin !== 'http://wialoncrm.com') Units.items = Messages.items;
			    Messages.startNewMessageListener(function() {
			    	if($scope.items_result[0]) {
						var i = $scope.items_result[0].__i;
						WaitFor(function() {return i !== $scope.items_result[0].__i;} ,function() {
							$scope.createChart();
						});
			    	}
			    });
			});
		});
	});


	$scope.getMessages = function() {
		Messages.get(id, $scope.s.timeFrom, $scope.s.timeTo, function(data) {
			$rootScope.$digest();
			$scope.createChart();
		});
	}

	$scope.filterCols = function() {
		$scope.hide_cols = $filter('MessagesParamsFilter')($scope.messages.items, $scope.s.filter.params);
	}

    $scope.createChart = function(key) {
    	if(key) {
    		if($scope.chart_keys[key]) {
    			delete $scope.chart_keys[key]
    		} else {
	    		$scope.chart_keys[key] = true;
    		}
    	}
    	$scope.mdata = {items: $scope.items_result};
		var series = []
		var colors = ['#1f77b4','#4F8C15','#52158C','#E3A41B','#26B54A','#19CFC2','#DB3BDB'];
		var i = 0;
		for(var key in $scope.chart_keys) {
			if($scope.chart_keys[key]) {
				series.push({
		          dataset: "items",
		          key: key,
		          label: key.substr(3, 50),
		          color: colors[i] ? colors[i] : '#60656E',
		          type: ['line'],
		          id: key
				})
				i++;
			}
		}
	    $scope.chart_messages_options = {
	      series: series,
	      axes: {x: {key: "__t"}},
	      grid: {x:true, y: true},
	      margin: {top: 25, bottom: 15}
	    };
    }

	$scope.onLimitChange = function() {
		var l = $scope.items_result.length;
		WaitFor(function() {return l !== $scope.items_result.length;} ,function() {
			$scope.createChart();
		});
	}

	$scope.shift = function(direction) {
		if(direction<0) {
			if(($scope.s.limitfrom - $scope.s.limitto) <= 0) {
				$scope.s.limitfrom = 0;
			} else {
				$scope.s.limitfrom = $scope.s.limitfrom - $scope.s.limitto;
			}
		} else if(direction===0) {
			$scope.s.limitfrom = 0;
		} else if(direction>0) {
			$scope.s.limitfrom = $scope.s.limitfrom + $scope.s.limitto;
		}
		var t = $scope.items_result[0].__t;
		WaitFor(function() {return t !== $scope.items_result[0].__t;} ,function() {
			$scope.createChart();
		});
	}

	$scope.isEmptyObject = isEmptyObject;

}]);
Main.controller('OptionsCtrl',['$scope', 'Options', 'GlomosCRM', '$translate' , '$translatePartialLoader'
	,function($scope, Options, GlomosCRM, $translate, $translatePartialLoader) {
	$translatePartialLoader.addPart('options');
	$translate.refresh();
	
	$scope.options = Options;
	$scope.languages = {
		en:  'English'
		,ru:  'Русский'
	};

	var copy_language = Options.item.language;
	$scope.saveItem = function() {
		Options.save();
		if(copy_language !== Options.item.language) {
			$translate.use(Options.item.language);
			copy_language = Options.item.language;
		}
	}

	$scope.resetItem = function() {
		Options.reset();
	}

	$scope.loginToCRM = function() {
		GlomosCRM.login();
	}


}]);

Main.controller('UnitCtrl',['$scope', '$location', '$stateParams', '$timeout', 'WaitFor', 'Wialon', 'Units', 'HWTypes', 'UnitFormValidator', 'GlomosCRM', '$translate' ,'$translatePartialLoader'
	,function($scope, $location, $stateParams, $timeout, WaitFor, Wialon, Units, HWTypes, UnitFormValidator, GlomosCRM, $translate,  $translatePartialLoader) {
	$translatePartialLoader.addPart('unit');
	$translatePartialLoader.addPart('sensors');
	$translate.refresh();
	var id = $stateParams.id;
	$scope.id = $stateParams.id;
	$scope.sensor_id = $stateParams.sensor_id;
	$scope.units = Units;
	$scope.hwtypes = HWTypes;
	$scope.errors = {};
	$scope.item = {};
	WaitFor(function() {return Wialon.auth;} ,function() {
		Units.getById(id,function(item) {
			$scope.item = item;
			copyItem(item);
			$scope.uv = UnitFormValidator.create($scope.item);
			$scope.validate = UnitFormValidator.validate;
			$scope.errClass = UnitFormValidator.errClass;
			$scope.sens_errClass = UnitFormValidator.sens_errClass;
			GlomosCRM.getObject($scope.id, function(data) {$scope.crm_object = data;});
		});
	});

	WaitFor(function() {return (Units.items.length>0);} ,function() {
		$scope.short_item = Units.index.id[id];
	});

	Wialon.removeEventsHandler('onUnitMessageRecieved');
	Wialon.addEventsHandler('onUnitMessageRecieved', function(data) {
		for(var key in data.events) {
			var event = data.events[key];
			if(event.i) {
				if(1*event.i === 1*id) {
					if(event.t === 'm') {
						$scope.blink = true;
						$timeout(function(argument) {
							$scope.blink = false;
						},500);
					}
				}
			}
		}
	});

	$scope.goto = function(sensor_id) {
		$scope.sensor_id = sensor_id;
	}

	$scope.parceSensorTable = function(sensor) {
		Units.parceSensorTable(sensor);
	}

	$scope.setAutoBounds = function(sensor) {
		Units.setAutoBounds(sensor);
		Units.parceSensorTable(sensor);
	}

	$scope.checkPlus = function() {
		if($scope.item.ph[0] !== '+') {
			$scope.item.ph = '+'+$scope.item.ph;
		}
		if($scope.item.ph.length===1) {
			$scope.item.ph = '';
		}
	}

	$scope.onSensorCheck = function() {
		var i = 0;
		for(var key in $scope.item.sens) {
			if($scope.item.sens[key]._checked) {
				i = i+1;
			}
		}
		$scope.sensors_checked = (i>1);
	}

	$scope.saveItem = function() {
		Units.saveUnit($scope.item, function() {
			Units.getById(id,function(item) {
				$scope.item = item;
				copyItem(item);
				$scope.checkChagnes();
			});
			Units.loadUnit(1023,function(data) {
				$scope.loadedUnit = data;
			});
			GlomosCRM.saveObject($scope.item, $scope.crm_object);
		});
	}

	$scope.createSensor = function() {
		var sensor_id = Units.createSensor($scope.item);
		$location.url('/unit/'+$scope.id+'/sensor/'+sensor_id);
		$scope.goto(sensor_id);
	}

	$scope.mergeSensors = function() {
		Units.mergeSensors($scope.item);
		$scope.onSensorCheck();
	}

	$scope.deleteSensor = function(sensor, i) {
		if(sensor.id) {
			sensor._deleted = !sensor._deleted	
		} else {
			delete $scope.item.sens[i];
		}
	}

	$scope.inverseSrcTable = function(sensor) {
		Units.inverseSrcTable(sensor);
	}

	$scope.onSensorTypeChange = function(sensor) {
		sensor.m = Units.sensor_types[sensor.t].m;
	}

	$scope.checkChagnes = function() {
		var copy = $scope.item_copy;
		var item = angular.copy($scope.item);
		$scope.item_changed = (copy !== angular.toJson(item));
	}

	var copyItem = function(item) {
		var copy = angular.copy(item);
		$scope.item_copy = angular.toJson(copy);
	}

	$scope.readyForChart = function(sensor) {
		if(sensor._d) {
			if(sensor._d.length>1) {
				if(sensor._d[0].x!==undefined && sensor._d[0].y!==undefined &&  sensor._d[1].x!==undefined &&  sensor._d[1].y!==undefined) {
					return true;
				}
			}
		}
		return false;
	}

    $scope.sensor_chart_options = {
      series: [
        {
          dataset: "_d",
          key: "y",
          label: "Sensor output value (Y):",
          color: "#1f77b4",
          type: ['line', 'dot'],
          id: 'Sensor XY-Table'
        }
      ],
      axes: {x: {key: "x"}},
      grid: {x:true, y: true},
      margin: {top: 5}
    };

    $scope.tbl_parsers = ['standart','italon'];

 
}]);
Main.controller('UnitsListCtrl',['$scope', 'State', 'Units', 'HWTypes', 'Accounts', 'Users', '$translate' ,'$translatePartialLoader'
	,function($scope, State, Units, HWTypes, Accounts, Users, $translate,  $translatePartialLoader) {
	$translatePartialLoader.addPart('units-list');
	$translate.refresh();

	$scope.units = Units;
	$scope.hwtypes = HWTypes;
	$scope.accounts = Accounts;
	$scope.users = Users;

	$scope.s = State.units_list;

	$scope.resetFilter = function() {
		State.resetFilter('units_list');
	}

	$scope.setOrderBy = function(key) {
		if($scope.s.orderby === key) {
			$scope.s.orderby_reverse = !$scope.s.orderby_reverse;
		} else {
			$scope.s.orderby = key;
		}
	}

	$scope.checkAll = function() {
		for(var key in $scope.items_result) {
			var item = $scope.items_result[key];
			item._checked = $scope.all_checked;
		}
	}
	
    $scope.$watch(function() {
		$scope.items_checked = false;
		for(var key in $scope.items_result) {
			var item = $scope.items_result[key];
			if(item._checked) {
				$scope.items_checked = true;
				return true;
			}
		}
		return false;
	});

}]);
Main.controller('UserCtrl',['$scope','$stateParams','$translate' ,'$translatePartialLoader', 'WaitFor',  'Accounts','Users', 'Wialon','UserFormValidator'
	,function($scope,$stateParams,$translate,  $translatePartialLoader, WaitFor, Accounts,Users,Wialon,UserFormValidator) {
	$translatePartialLoader.addPart('user');
	$translatePartialLoader.addPart('account');
	$translate.refresh();

	var id = $stateParams.id;
	$scope.id = $stateParams.id;

	$scope.errors = {};
	$scope.item = {};

	$scope.accounts = Accounts;
	$scope.users = Users;

	WaitFor(function() {return Wialon.auth;} ,function() {
		Users.getById(id,function(item) {
			$scope.item = item;
			$scope.v = UserFormValidator.create($scope.item);
			$scope.validate = UserFormValidator.validate;
			$scope.errClass = UserFormValidator.errClass;
			copyItem(item);
		});
	});

	$scope.saveItem = function() {
		Users.saveUser($scope.item, function() {
			Users.getById(id,function(item) {
				$scope.item = item;
				copyItem(item);
				$scope.checkChagnes();
			});
		});
	}

	$scope.checkChagnes = function() {
		var copy = $scope.item_copy;
		var item = angular.copy($scope.item);
		$scope.item_changed = (copy !== angular.toJson(item));
	}

	var copyItem = function(item) {
		var copy = angular.copy(item);
		$scope.item_copy = angular.toJson(copy);
	}

	$scope.setVisible = function() {
		if(!$scope.item._password) return;
		$scope.user_password_visible = !$scope.user_password_visible;
	}

	$scope.generatePassword = function() {
		$scope.item._password = Users.generatePassword(20);
	}



}]);
Main.controller('UsersListCtrl',['$scope','$translate' ,'$translatePartialLoader', 'WaitFor', 'State', 'Accounts', 'Users', 'Wialon'
	,function($scope,$translate,  $translatePartialLoader, WaitFor, State, Accounts, Users, Wialon) {
	$translatePartialLoader.addPart('accounts-list');
	$translatePartialLoader.addPart('users-list');
	$translate.refresh();


	$scope.s = State.users_list;
	$scope.users = Users;
	$scope.accounts = Accounts;

	$scope.resetFilter = function() {
		State.resetFilter('users_list');
	}

	// $scope.checkAll = function() {
	// 	for(var key in $scope.items_result) {
	// 		var item = $scope.items_result[key];
	// 		item._checked = $scope.all_checked;
	// 	}
	// }

 //    $scope.$watch(function() {
	// 	$scope.items_checked = false;
	// 	for(var key in $scope.items_result) {
	// 		var item = $scope.items_result[key];
	// 		if(item._checked) {
	// 			$scope.items_checked = true;
	// 			return true;
	// 		}
	// 	}
	// 	return false;
	// });


}]);
Main.filter('AccountsFilter',function(){
	return function (items, criterion, accounts, users) {
		if(!items) return items;
		if(items.length===0) { return items};
		if(!criterion) {return items};

    	if(criterion.parent_account_nm) {
	    	var tmp = [];
	    	if(items) {
	    		if(accounts.index) {
		    		if(accounts.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.bpact) {
				    	    	if(accounts.index.id[item.bpact]) {
						    	    if(RegExp(criterion.parent_account_nm,'gi').test(accounts.index.id[item.bpact].nm)){
						    	        tmp.push(item);
						    	    } 
				    	    	}
				    	    }
				    	}
		    		}
	    		}
	    	}
	    	var items = tmp;
    	}

    	if(criterion.crt_user_nm) {
	    	var tmp = [];
	    	if(items) {
	    		if(users.index) {
		    		if(users.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.crt) {
				    	    	if(users.index.id[item.crt]) {
						    	    if(RegExp(criterion.crt_user_nm,'gi').test(users.index.id[item.crt].nm)){
						    	        tmp.push(item);
						    	    } 
				    	    	}
				    	    }
				    	}
		    		}
	    		}
	    	}
	    	var items = tmp;
    	}

    	return items;
 	}
})

Main.filter('MessagesParamsFilter',function(){
	return function (items, criterion) {
		if(!items) return items;
		if(items.length===0) { return items};
		if(!criterion) {return items};
		if(criterion.params === '') {return items};
    	var props_to_hide = {};
    	if(items[0]) {
    		var row = items[0];
	    	for(var key in row){
	    		if(key.substr(0,3)==='_p_') {
		    	    var elem = row[key];
					if(!RegExp(criterion,'g').test(key)){
						props_to_hide[key] = true;
					} 
	    		}
	    	}
    	}
    	return props_to_hide;
 	}
})

Main.filter('ParamToSensorValue',['$filter',function($filter){
	return function (sensor,msg,item) {
		if(!sensor || !msg) return '';
		if(!msg.p) return '';
		var param_name = sensor.p;
		if(msg.p[param_name] === undefined) {
			exp = param_name.replace(/\[/g,'s(\'');
			exp = exp.replace(/\]/g,'\')');
			exp = exp.replace(/const/g,'');
			var s = function(n) {
				return $filter('ParamToSensorValue')(item._index.sens.n[n], msg, item);	// ОХУЕТЬ! Работает!
			}
			var parr = [];
			for(var key in msg.p) {
				parr.push(key);
			}
			exp = exp.replace(RegExp(parr.join('|'), 'gi'), function myFunction(x){return msg.p[x];});
			try {
				val = Math.round(eval(exp)*100)/100;
			} catch(e) {
				return '';
			}
		} else {
			var val = msg.p[param_name];
		}
		
		if(sensor.c.lower_bound) {
			if(val < sensor.c.lower_bound) {
				return '';
			}
		}
		if(sensor.c.upper_bound) {
			if(val > sensor.c.upper_bound) {
				return '';
			}
		}
		
		var last_row = false;
		for(var key in sensor.tbl) {
			var row = sensor.tbl[key];
			if(val!==undefined) {
				if(row.x >= val) {
					if(!last_row) last_row = row;
					return Math.round((last_row.a * val + 1*last_row.b)*100)/100 //a*x+b
				}
			}
			last_row = row;
		}
		if(sensor.tbl.length) {
			if(row.a !== undefined && row.b !== undefined) {
				return Math.round((row.a * val + 1*row.b)*100)/100 //a*x+b
			}
		}
		return val;
 	}
}])

Main.filter('UnitsFilter',function(){
	return function (items, criterion, now, hwtypes, accounts, users) {
		if(!items) return items;
		if(items.length===0) { return items};
		if(!criterion) {return items};
		//if(!criterion.mint && !criterion.maxt) {return items};
    	// var tmp = [];
    	// for(var key in items){
    	//     var item = items[key];
    	//     if(item.lmsg) {
    	//     	if(item.lmsg.t) {
		   //  	    // if(RegExp(criterion.t,'g').test(item.lmsg.t)){
		   //  	   //      tmp.push(item);
		   //  	    // } 
		   //  	    if(((now-1*item.lmsg.t) >= 1*criterion.mint) && ((now-1*item.lmsg.t) <= 1*criterion.maxt)) {
		   //  	    	tmp.push(item);
		   //  	    }
    	//     	}
    	//     }
    	// }
    	//var items = tmp;

    	if(criterion.hw) {
	    	var tmp = [];
	    	if(hwtypes) {
	    		if(hwtypes.index) {
		    		if(hwtypes.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.hw) {
				    	    	if(hwtypes.index.id[item.hw]) {
						    	    if(RegExp(criterion.hw,'gi').test(hwtypes.index.id[item.hw].name)){
						    	        tmp.push(item);
						    	    } 
				    	    	}
				    	    }
				    	}
		    		}
	    		}
	    	}
	    	var items = tmp;
    	}

    	if(criterion.p_accounts_nm) {
	    	var tmp = [];		//accounts.index.id[accounts.index.id[item.bact].bpact].nm
	    	if(accounts) {
	    		if(accounts.index) {
		    		if(accounts.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.bact) {
				    	    	if(accounts.index.id[item.bact]) {
				    	    		var account_crt = accounts.index.id[item.bact];
					    	    	if(accounts.index.id[account_crt.bpact]) {
							    	    if(RegExp(criterion.p_accounts_nm,'gi').test(accounts.index.id[account_crt.bpact].nm)){
							    	        tmp.push(item);
							    	    } 
					    	    	}
				    	    	}
				    	    }
				    	}
		    		}
	    		}
	    	}
	    	var items = tmp;
   		}

    	if(criterion.account_name) {
	    	var tmp = [];
	    	if(accounts) {
	    		if(accounts.index) {
		    		if(accounts.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.bact) {
				    	    	if(accounts.index.id[item.bact]) {
						    	    if(RegExp(criterion.account_name,'gi').test(accounts.index.id[item.bact].nm)){
						    	        tmp.push(item);
						    	    } 
				    	    	}
				    	    }
				    	}
		    		}
	    		}
	    	}
	    	var items = tmp;
    	}

    	if(criterion.crt_user_nm) {
	    	var tmp = [];
	    	if(items) {
	    		if(users.index) {
		    		if(users.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.crt) {
				    	    	if(users.index.id[item.crt]) {
						    	    if(RegExp(criterion.crt_user_nm,'gi').test(users.index.id[item.crt].nm)){
						    	        tmp.push(item);
						    	    }
				    	    	}
				    	    }
				    	}
		    		}
	    		}
	    	}
	    	var items = tmp;
    	}

    	return items;
 	}
})

Main.filter('UsersFilter',function(){
	return function (items, criterion, accounts, users) {
		if(!items) return items;
		if(items.length===0) { return items};
		if(!criterion) {return items};

    	if(criterion.account_nm) {
	    	var tmp = [];
	    	if(items) {
	    		if(accounts.index) {
		    		if(accounts.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.bact) {
				    	    	if(accounts.index.id[item.bact]) {
						    	    if(RegExp(criterion.account_nm,'gi').test(accounts.index.id[item.bact].nm)){
						    	        tmp.push(item);
						    	    } 
				    	    	}
				    	    }
				    	}
		    		}
	    		}
	    	}
	    	var items = tmp;
    	}

    	if(criterion.crt_user_nm) {
	    	var tmp = [];
	    	if(items) {
	    		if(users.index) {
		    		if(users.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.crt) {
				    	    	if(users.index.id[item.crt]) {
						    	    if(RegExp(criterion.crt_user_nm,'gi').test(users.index.id[item.crt].nm)){
						    	        tmp.push(item);
						    	    } 
				    	    	}
				    	    }
				    	}
		    		}
	    		}
	    	}
	    	var items = tmp;
    	}

     	if(criterion.parent_account_nm) {
	    	var tmp = [];
	    	if(items) {
	    		if(accounts.index) {
		    		if(accounts.index.id) {
				    	for(var key in items){
				    	    var item = items[key];
				    	    if(item.bact) {
				    	    	if(accounts.index.id[item.bact]) {
				    	    		var acc = accounts.index.id[item.bact];
				    	    		if(acc.bpact) {
				    	    			if(accounts.index.id[acc.bpact]) {
								    	    if(RegExp(criterion.parent_account_nm,'gi').test(accounts.index.id[acc.bpact].nm)){
								    	        tmp.push(item);
								    	    } 
				    	    			}
				    	    		}
				    	    	}
				    	    }
				    	}
		    		}
	    		}
	    	}
	    	var items = tmp;
    	}
   	

    	return items;
 	}
})

Main.filter('UTtoTime',function(){
	return function (ut) {
		if(!ut) return '';
		if(ut < 60) return ut+' s';
		if((60 <= ut) && (ut < 300)) {
			var m = Math.floor(ut/60);
			var s = ut - m*60;
			return m+' min '+s+' s';
		}
		if((300 <= ut) && (ut < 3600)) {
			var m = Math.floor(ut/60);
			return m+' min';
		}
		if((3600 <= ut) && (ut < 21600)) {
			var h = Math.floor(ut/3600);
			var m = Math.floor(ut/60) - h*60;
			return h+' h '+m+' min';
		}
		if((21600 <= ut) && (ut < 86400)) {
			var h = Math.floor(ut/3600);
			return h+' h';
		}
		if((86400 <= ut) && (ut < 1296000)) {
			var d = Math.floor(ut/86400);
			var h = Math.floor(ut/3600) - d*24;
			return d+' d '+h+' h';
		}
		if((1296000 <= ut) && (ut < 1261440000)) {
			var d = Math.floor(ut/86400);
			return d+' d';
		}
		return '';
 	}
})


.directive('myDropzone', ['$document', function($document) {
  return {
    
    restrict: 'AE' //attribute or $element
    ,require:"^ngModel" // this is important, 
    ,scope: {
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
            maxFileSize = 1024;
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
}]);