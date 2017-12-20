var startupSmb = angular.module('startupSmb', ['ng', 'ngRoute', 'ui.router','ui.bootstrap','ngMessages']);

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

