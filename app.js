var startupSmb = angular.module('startupSmb', ['ng', 'ngRoute', 'ui.router', 'ui.bootstrap', 'ngMessages', 'angular-md5', 'ngCookies','ngAnimate']);

startupSmb.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/solutions/views/homePage.html',
                controller: 'homePageController'
            })

        $urlRouterProvider.otherwise('/home');
    }]);

