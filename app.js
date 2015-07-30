var angular = require('angular'),
	_ = require('lodash');

angular.module('myApp', [])
.factory('hub', function () {

	if (!io) {
		console.error('WTF?!? no io loaded');
	}

	var socket = io.connect('http://localhost:8080/');
	socket.on('server_started', function (dat) {
		console.log('server_started', dat);
	});

	var hub = {};

	hub.emit = function  (msg, dat) {
		socket.emit(msg, dat);
	};

	hub.on = function (name, cb) {
		socket.on(name, cb);
	};

	return hub;
})
.controller('main', function ($scope, hub) {
	$scope.submit = function  () {
		hub.emit('request', {
			msg: $scope.requestText,
			ts: Date.now()
		});
		$scope.requestText = "";
	};

	hub.on('request_finished', function (dat) {
		console.log('finished request', dat);
	});

	hub.on('request_data', function  (dat) {
		console.log('request_data incoming', dat);
		$scope.$apply(function () {
			$scope.msg += dat.data;
		});
	});
})
.directive('myWidget', function () {
	return {
		restrict: 'E',
		replace: true,
		template: '<div>{{greeting}}</div>',
		link: function (scope, el, attrs) {
			console.log(attrs);
			if ( ! _.isUndefined(attrs.isCapture)) {
				console.log('enablecapture');
				scope.isCapture = true;
			} else {
				scope.isCapture = false;
			}
		}
	};
});