'use strict';

if (typeof(net) == "undefined") var net = {};
if (typeof(net.narthollis) == "undefined") net.narthollis = {};
if (typeof(net.narthollis.Charsheet) == "undefined") net.narthollis.Charsheet = {};


net.narthollis.Charsheet.App = angular.module('net.narthollis.Charsheet.App', [
    'ui.router',
    'ui.bootstrap',
    'net.narthollis.Charsheet.Controllers',
]);

/*net.narthollis.Charsheet.App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/sheets', {
                templateUrl: 'partials/sheet-list.html',
                controller: 'SheetList'
            }). 
            otherwise({
                redirectTo: '/sheets'
            });
    }
]);*/

net.narthollis.Charsheet.App.config(
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/sheets/list");

        $stateProvider
            .state('sheets', {
                abstract: true,
                url: '/sheets',
                templateUrl: 'partials/sheets.html',
                controller: 'SheetList'
            })
            .state('sheets.list', {
                url: '/list',
                templateUrl: 'partials/sheet-list.html',
            });
    }
);

