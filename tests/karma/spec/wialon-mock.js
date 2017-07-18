angular.module('wialon-mock', []).provider('Wialon', function () {
	this.$get = function () {
		return {
			duplicate: jasmine.createSpy()
		};
	};
});