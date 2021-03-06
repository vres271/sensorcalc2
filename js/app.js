var Main = angular.module('Main', ['ui.router','n3-line-chart','ngAnimate','pascalprecht.translate','angular-md5','ui-rangeSlider','tmh.dynamicLocale']);

var lng = 'ru';
var opts_from_storage = localStorage.getItem('sc_options');
if(opts_from_storage) {
    var opts = angular.fromJson(opts_from_storage);
    if(opts.language) {
        var lng = opts.language;
    }
}

Main.config(['$translateProvider', '$translatePartialLoaderProvider','tmhDynamicLocaleProvider', function($translateProvider, $translatePartialLoaderProvider,tmhDynamicLocaleProvider) {
    $translateProvider.useSanitizeValueStrategy(null);

    $translatePartialLoaderProvider.addPart('main');
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: 'i18n/{part}/locale-{lang}.json'
    });

    $translateProvider.preferredLanguage(lng);
    $translateProvider.fallbackLanguage('en');

    Main.__myProviderHash = ['ph','','ad','lo','p','go'];

    tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular-locale_{{locale}}.js');

}]);

