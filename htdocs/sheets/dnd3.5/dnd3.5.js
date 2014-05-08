'use strict';

/*
net.narthollis.Charsheet.App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/sheets/dnd3.5/:hash', {
                templateUrl: 'sheets/dnd3.5/partials/sheet.html',
                controller: 'DND35Sheet',
            });
    }
]);
*/

net.narthollis.Charsheet.App.config(
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('sheets.dnd35', {
                url: '/dnd35/:hash',
                templateUrl: 'sheets/dnd3.5/partials/sheet.html',
                controller: 'DND35Sheet',
            });
    }
);


net.narthollis.Charsheet.Controllers.controller('DND35Sheet', ['$scope', '$http',
    function($scope, $http, $watch) {
        $scope.sheet = null;

        $http.get('api/c9aa3ab53314cc019edb4c9322d58228d40042d7.json').success(function(data) {
            $scope.sheet = data;
        });

        $scope.modifier = function(attrScore) {
            // Equation from http://ddowiki.com/page/Modifier
            return Math.floor((attrScore - 10)/2);
        };

        $scope.ability_totals = {
            'str': 0,
            'dex': 0,
            'con': 0,
            'int': 0,
            'wis': 0,
            'cha': 0
        }

        $scope.$watchGroup([
                'sheet.str',
                'sheet.str_adj',
                'sheet.dex',
                'sheet.dex_adj',
                'sheet.con',
                'sheet.con_adj',
                'sheet.int',
                'sheet.int_adj',
                'sheet.wis',
                'sheet.wis_adj',
                'sheet.cha',
                'sheet.cha_adj'
            ],
            function() {
                if ($scope.sheet == null) return;

                for (var i in $scope.ability_totals) {
                    if (!$scope.ability_totals.hasOwnProperty(i)) continue;

                    $scope.ability_totals[i] = $scope.sheet[i] + $scope.sheet[i + '_adj'];
                }
            }
        );

        $scope.armorTotal = 0;
        $scope.armorTouch = 0;
        $scope.armorFlat = 0;

        $scope.$watchGroup([
                'sheet.armor',
                'sheet.shield',
                'sheet.dex',
                'sheet.dex_adj',
                'sheet.armor_max_dex',
                'sheet.size_mod',
                'sheet.natural_armor',
                'sheet.deflection_mod',
                'sheet.armor_misc'
            ],
            function() {
                if ($scope.sheet == null) return;

                var ar = $scope.sheet.armor;
                var sh = $scope.sheet.shield;
                var de = Math.min(
                    $scope.modifier($scope.sheet.dex + $scope.sheet.dex_adj),
                    $scope.sheet.armor_max_dex
                );
                var sm = $scope.sheet.size_mod;
                var na = $scope.sheet.natural_armor;
                var dm = $scope.sheet.deflection_mod;
                var mi = $scope.sheet.armor_misc;

                $scope.armorTotal = ar + sh + de + sm + na + dm + mi;
                $scope.armorTouch = de + sm + dm + mi;
                $scope.armorFlat = ar + sh + sm + dm + mi;
            }
        );

        $scope.damagePlus = function() {
            $scope.sheet.damage++;
        };
        $scope.damageMinus = function() {
            $scope.sheet.damage--;
        };

        $scope.nonlethalPlus = function() {
            $scope.sheet.nonlethal++;
        };
        $scope.nonlethalMinus = function() {
            $scope.sheet.nonlethal--;
        };

        $scope.save_fortitude_total = 0;
        $scope.save_reflex_total = 0;
        $scope.save_will_total = 0;
        
        $scope.$watchGroup([
                'sheet.dex',
                'sheet.dex_adj',
                'sheet.save_fortitude_base',
                'sheet.save_fortitude_magic',
                'sheet.save_fortitude_misc',
                'sheet.save_fortitude_temp',
                'sheet.save_reflex_base',
                'sheet.save_reflex_magic',
                'sheet.save_reflex_misc',
                'sheet.save_reflex_temp',
                'sheet.save_will_base',
                'sheet.save_will_magic',
                'sheet.save_will_misc',
                'sheet.save_will_temp'
            ],
            function() {
                if ($scope.sheet == null) return;

                $scope.save_fortitude_total = $scope.modifier($scope.ability_totals.con) +
                                              $scope.sheet.save_fortitude_base +
                                              $scope.sheet.save_fortitude_magic + 
                                              $scope.sheet.save_fortitude_misc +
                                              $scope.sheet.save_fortitude_temp;

                $scope.save_reflex_total = $scope.modifier($scope.ability_totals.dex) +
                                              $scope.sheet.save_reflex_base +
                                              $scope.sheet.save_reflex_magic + 
                                              $scope.sheet.save_reflex_misc +
                                              $scope.sheet.save_reflex_temp;
                $scope.save_will_total = $scope.modifier($scope.ability_totals.wis) +
                                              $scope.sheet.save_will_base +
                                              $scope.sheet.save_will_magic + 
                                              $scope.sheet.save_will_misc +
                                              $scope.sheet.save_will_temp;
            }
        );

    }
]);


