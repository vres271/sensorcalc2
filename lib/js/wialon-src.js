/**
 wialonjs-api 0.0.4, a JS library for Wialon Remote API
 Copyright (c) 2015, Gurtam (http://gurtam.com)
*/
(function (window) {/* jshint -W079 */
/* global define */

var _gurtam_W = {
    version: '0.0.4',
    debug: false
};

function expose() {
    var oldW = window._gurtam_W;

    _gurtam_W.noConflict = function () {
        window._gurtam_W = oldW;
        return this;
    };

    window._gurtam_W = _gurtam_W;
}


// define Wialon for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = _gurtam_W;
// define Wialon as an AMD module
} else if (typeof define === 'function' && define.amd) {
    define(_gurtam_W);
}
// define Wialon as a global W variable, saving the original W to restore later if needed
if (typeof window !== 'undefined') {
    expose();
}

/**
 * _gurtam_W.Util contains various utility functions
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

_gurtam_W.Util = {
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
        obj._id = obj._id || ++_gurtam_W.Util.lastId;
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
        return _gurtam_W.Util.trim(str).split(/\s+/);
    },

    /** Set options to an object, inheriting parent's options as well
     */
    setOptions: function (obj, options) {
        if (!obj.hasOwnProperty('options')) {
            obj.options = obj.options ? _gurtam_W.Util.create(obj.options) : {};
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
        if (!_gurtam_W.debug || !arguments.length) {
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
_gurtam_W.extend = _gurtam_W.Util.extend;
_gurtam_W.stamp = _gurtam_W.Util.stamp;
_gurtam_W.setOptions = _gurtam_W.Util.setOptions;
_gurtam_W.logger = _gurtam_W.Util.write;

/**
 * _gurtam_W.Class powers the OOP facilities of the library.
 * Thanks to John Resig and Dean Edwards for inspiration!
 */

_gurtam_W.Class = function () {};

_gurtam_W.Class.extend = function (props) {

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

    var proto = _gurtam_W.Util.create(parentProto);
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
        _gurtam_W.extend(NewClass, props.statics);
        delete props.statics;
    }

    // mix includes into the prototype
    if (props.includes) {
        _gurtam_W.Util.extend.apply(null, [proto].concat(props.includes));
        delete props.includes;
    }

    // merge options
    if (proto.options) {
        props.options = _gurtam_W.Util.extend(_gurtam_W.Util.create(proto.options), props.options);
    }

    // mix given properties into the prototype
    _gurtam_W.extend(proto, props);

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
_gurtam_W.Class.include = function (props) {
    _gurtam_W.extend(this.prototype, props);
};

/** Merge new default options to the Class
 */
_gurtam_W.Class.mergeOptions = function (options) {
    _gurtam_W.extend(this.prototype.options, options);
};

/** Add a constructor hook
 */
_gurtam_W.Class.addInitHook = function (fn) { // (Function) || (String, args...)
    var args = Array.prototype.slice.call(arguments, 1);

    var init = typeof fn === 'function' ? fn : function () {
        this[fn].apply(this, args);
    };

    this.prototype._initHooks = this.prototype._initHooks || [];
    this.prototype._initHooks.push(init);
};

/**
 * _gurtam_W.Evented is a base class that Wialon classes inherit from to handle custom events.
 */

_gurtam_W.Evented = _gurtam_W.Class.extend({

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
            types = _gurtam_W.Util.splitWords(types);

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
            types = _gurtam_W.Util.splitWords(types);

            for (var i = 0, len = types.length; i < len; i++) {
                this._off(types[i], fn, context);
            }
        }

        return this;
    },

    // attach listener (without syntactic sugar now)
    _on: function (type, fn, context) {

        var events = this._events = this._events || {};
        var contextId = context && context !== this && _gurtam_W.stamp(context);

        if (contextId) {
            // store listeners with custom context in a separate hash (if it has an id);
            // gives a major performance boost when firing and removing events (e.g. on map object)

            var indexKey = type + '_idx';
            var indexLenKey = type + '_len';
            var typeIndex = events[indexKey] = events[indexKey] || {};
            var id = _gurtam_W.stamp(fn) + '_' + contextId;

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

        var contextId = context && context !== this && _gurtam_W.stamp(context);
        var listeners;
        var i;
        var len;
        var listener;
        var id;

        if (contextId) {
            id = _gurtam_W.stamp(fn) + '_' + contextId;
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
            listener.fn = _gurtam_W.Util.falseFn;
        }
    },

    fire: function (type, data, propagate) {
        if (!this.listens(type, propagate)) { return this; }

        var event = _gurtam_W.Util.extend({}, data, {type: type, target: this});
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

        var handler = _gurtam_W.bind(function () {
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
        this._eventParents[_gurtam_W.stamp(obj)] = obj;
        return this;
    },

    removeEventParent: function (obj) {
        if (this._eventParents) {
            delete this._eventParents[_gurtam_W.stamp(obj)];
        }
        return this;
    },

    _propagateEvent: function (e) {
        for (var id in this._eventParents) {
            this._eventParents[id].fire(e.type, _gurtam_W.extend({layer: e.target}, e), true);
        }
    }
});

var proto = _gurtam_W.Evented.prototype;

// aliases; we should ditch those eventually
proto.addEventListener = proto.on;
proto.removeEventListener = proto.clearAllEventListeners = proto.off;
proto.addOneTimeEventListener = proto.once;
proto.fireEvent = proto.fire;
proto.hasEventListeners = proto.listens;

_gurtam_W.Mixin = {Events: proto};

/**
 * _gurtam_W.Request - class performs remote requests
 */

_gurtam_W.Request = _gurtam_W.Class.extend({

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
        options = _gurtam_W.setOptions(this, options);
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
                _gurtam_W.logger('warn', 'Invalid JSON');
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
                        callback[5] = setTimeout(_gurtam_W.bind(this._timeout, this, this._counter), callback[4] * 1000);
                    }
                    // async call
                    if (this._io.contentWindow) {
                        setTimeout(_gurtam_W.bind(function(request) {
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

_gurtam_W.request = function (url, options) {
    return new _gurtam_W.Request(url, options);
};



}(window));