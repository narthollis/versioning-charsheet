
if (typeof(net) == "undefined") var net = {};
if (typeof(net.narthollis) == "undefined") net.narthollis = {};
if (typeof(net.narthollis.Charsheet) == "undefined") net.narthollis.Charsheet = {};


net.narthollis.Charsheet.App = angular.module('net.narthollis.Charsheet.App', [
    'ngRoute',
    /* 'net.narthollis.Charsheet.Controllers', */
]);

net.narthollis.Charsheet.App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider. /*
            when('/sheets', {
                templateUrl: 'partials/phone-list.html',
                controller: 'net.narthollis.Charsheet.Controllers.SheetList'
            }). */
            otherwise({
                /*redirectTo: '/sheets'*/
                templateUrl: 'partials/phone-list.html',
            });
    }]);
