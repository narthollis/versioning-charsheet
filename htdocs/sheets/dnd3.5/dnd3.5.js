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
            })
            .state('sheets.dnd35.description', {
                url: '/description',
                templateUrl: 'sheets/dnd3.5/partials/description.html',
            })
            .state('sheets.dnd35.stats', {
                url: '/stats',
                templateUrl: 'sheets/dnd3.5/partials/stats.html',
            })
            .state('sheets.dnd35.skills', {
                url: '/skills',
                templateUrl: 'sheets/dnd3.5/partials/skills.html',
            })
            .state('sheets.dnd35.health', {
                url: '/health',
                templateUrl: 'sheets/dnd3.5/partials/health.html',
            })
            .state('sheets.dnd35.attacks', {
                url: '/attacks',
                templateUrl: 'sheets/dnd3.5/partials/weapons.html',
            })
            .state('sheets.dnd35.items', {
                url: '/items',
                templateUrl: 'sheets/dnd3.5/partials/items.html',
            })
            .state('sheets.dnd35.feats', {
                url: '/feats',
                templateUrl: 'sheets/dnd3.5/partials/feats.html',
            })
            .state('sheets.dnd35.other', {
                url: '/other',
                templateUrl: 'sheets/dnd3.5/partials/other.html',
            })
            .state('sheets.dnd35.options', {
                url: '/options',
                templateUrl: 'sheets/dnd3.5/partials/options.html',
            });
    }
);


net.narthollis.Charsheet.Controllers.controller('DND35Sheet',
    [
        '$rootScope',
        '$scope',
        '$http',
        '$state',
   //     '$watch',

    function($rootScope, $scope, $http, $state, $watch) {
        /**
         * These functions provide the route functionalty for the tabs
         */
        $scope.tabs = [
            {
                "heading": "Description",
                "active": false,
                "route": "sheets.dnd35.description"
            },
            {
                "heading": "Stats",
                "active": false,
                "route": "sheets.dnd35.stats"
            },
            {
                "heading": "Skills",
                "active": false,
                "route": "sheets.dnd35.skills"
            },
            {
                "heading": "Health/Armor",
                "active": false,
                "route": "sheets.dnd35.health",
            },
            {
                "heading": "Attacks",
                "active": false,
                "route": "sheets.dnd35.attacks"
            },
            {
                "heading": "Items",
                "active": false,
                "route": "sheets.dnd35.items"
            },
            {
                "heading": "Feats",
                "active": false,
                "route": "sheets.dnd35.feats"
            },
            {
                "heading": "Other",
                "active": false,
                "route": "sheets.dnd35.other"
            },
            {
                "heading": "Options",
                "active": false,
                "route": "sheets.dnd35.options"
            }
        ];

        $scope.go = function(route) {
            $state.go(route);
        };

        $scope.$on("$stateChangeSuccess", function() {
            $scope.tabs.forEach(function(tab) {
                tab.active = $state.is(tab.route);
            });
        });

        /*
         * End Route Fucntionalty
         */

        /*
         * Defaults
         */
        $scope.SIZES = [
            {'value': -4, 'label': 'Fine'},
            {'value': -3, 'label': 'Diminutive'},
            {'value': -2, 'label': 'Tiny'},
            {'value': -1, 'label': 'Small'},
            {'value': 0, 'label': 'Medium'},
            {'value': 1, 'label': 'Large'},
            {'value': 2, 'label': 'Huge'},
            {'value': 3, 'label': 'Gargantuan'},
            {'value': 4, 'label': 'Colossal'},
        ];

        $scope.sheet = null;

        $scope.currentArmorIndex = null;
        $scope.currentShieldIndex = null;

        $http.get('api/c9aa3ab53314cc019edb4c9322d58228d40042d7.json').success(function(data) {
            $scope.sheet = data;

            $scope.sheet.armor.forEach(function(item, key) {
                if (item.equiped) {
                    $scope.currentArmorIndex = key;
                }
            });

            $scope.sheet.shield.forEach(function(item, key) {
                if (item.equiped) {
                    $scope.currentShieldIndex = key;
                }
            });
        });

        $scope.mathMax = Math.max;

        $scope.modifier = function(attrScore) {
            // Equation from http://ddowiki.com/page/Modifier
            return Math.floor((attrScore - 10)/2);
        };

        $scope.getAttributeBonus = function(attr) {
            if (attr == '---') return '---';

            return $scope.modifier($scope.ability_totals[attr.toLowerCase()]);
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

        $scope.sizeACMod = 0;
        $scope.sizeGrappleMod = 0;
        $scope.$watchGroup([
                'sheet.size'
            ],
            function() {
                if ($scope.sheet == null) return;

                var size = $scope.sheet.size;

                $scope.sizeGrappleMod = size * 4;

                if (size == 0) {
                    $scope.sizeACMod = 0;
                    return;
                }

                $scope.sizeACMod = -1 * (size/Math.abs(size) * Math.pow(2, Math.abs(size)-1));
            }
        );

        $scope.grappleTotal = 0;

        $scope.$watchGroup([
                'sheet.base_attack_bonus',
                'sheet.str',
                'sheet.str_adj',
                'sheet.size',
                'sheet.grapple_misc'
            ],
            function() {
                if ($scope.sheet == null) return;

                var bab = $scope.sheet.base_attack_bonus;
                var str = $scope.modifier($scope.ability_totals.str);
                var size = $scope.sizeGrappleMod;
                var misc = $scope.sheet.grapple_misc;
                
                $scope.grappleTotal = bab + str + size + misc;
            }
        );

        // Health
        // /////////////////////////////////////////////////////////////////
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

        // Armor
        // /////////////////////////////////////////////////////////////////
        $scope.currentArmor = 0;
        $scope.currentMaxDex = 10;
        $scope.currentShield = 0;

        $scope.currentNaturalArmor = 0;
        $scope.currentDeflectionMod = 0;

        $scope.armorTotal = 0;
        $scope.armorTouch = 0;
        $scope.armorFlat = 0;

        $scope.armorWeight = 0;
        $scope.shieldWeight = 0;
        $scope.protectiveItemWeight = 0;

        $scope.$watch(
            'sheet.armor',
            function() {
                if ($scope.sheet == null) return;

                $scope.currentArmor = 0;
                $scope.armorWeight = 0;

                $scope.sheet.armor.forEach(function(item) {
                    if (item.equiped) {
                        $scope.currentArmor = item.bonus;
                    } else {
                        $scope.armorWeight = $scope.armorWeight + item.weight;
                    }
                });
            },
            true
        );

        $scope.$watch(
            'sheet.shield',
            function() {
                if ($scope.sheet == null) return;

                $scope.currentShield = 0;
                $scope.shieldWeight = 0;

                $scope.sheet.shield.forEach(function(item) {
                    if (item.equiped) {
                        $scope.currentShield = item.bonus;
                    }
                    $scope.shieldWeight = $scope.shieldWeight + item.weight;
                });
            },
            true
        );

        $scope.$watch(
            'sheet.protective_item',
            function() {
                if ($scope.sheet == null) return;

                $scope.currentNaturalArmor = 0;
                $scope.currentDeflectionMod = 0;

                $scope.protectiveItemWeight = 0;

                $scope.sheet.protective_item.forEach(function(item) {
                    if (item.equiped) {
                        if (item.type == "natural") {
                            $scope.currentNaturalArmor = item.bonus;
                        } else if (item.type == "deflection") {
                            $scope.currentDeflectionMod = item.bonus;
                        }
                    }
                    $scope.protectiveItemWeight = $scope.protectiveItemWeight + item.weight;
                });
            },
            true
        );

        $scope.$watchGroup([
                'sheet.size',
                'currentArmor',
                'currentShield',
                'currentNaturalArmor',
                'currentDeflectionMod',
                'sheet.dex',
                'sheet.dex_adj',
                'sheet.armor_misc'
            ],
            function() {
                if ($scope.sheet == null) return;

                var ar = $scope.currentArmor;
                var sh = $scope.currentShield;
                var de = Math.min(
                    $scope.modifier($scope.ability_totals.dex),
                    $scope.currentMaxDex
                );
                var sm = $scope.sizeACMod;
                var na = $scope.currentNaturalArmor;
                var dm = $scope.currentDeflectionMod;

                $scope.armorTotal = 10 + ar + sh + de + sm + na + dm + $scope.sheet.armor_misc;
                $scope.armorTouch = 10 +           de + sm +      dm + $scope.sheet.armor_touch_misc;
                $scope.armorFlat  = 10 + ar + sh +      sm + na + dm + $scope.sheet.armor_flat_misc;
            }
        );

        // Armor
        // /////////////////////////////////////////////////////////////////
        $scope.addArmor = function() {
            $scope.sheet.armor[$scope.sheet.armor.length] = {'name': ''};
        };

        $scope.removeArmor = function(index) {
            $scope.sheet.armor.splice(index, 1);
        };

        $scope.activateArmor = function(index) {
            $scope.sheet.armor.forEach(function(item) {
                item.equiped = false;
            });
            $scope.sheet.armor[index].equiped = true;
        };

        $scope.deactivateArmor = function(index) {
            $scope.sheet.armor[index].equiped = false;
        };

        // Shields
        // /////////////////////////////////////////////////////////////////
        $scope.addShield = function() {
            $scope.sheet.shield[$scope.sheet.shield.length] = {'name': ''};
        };

        $scope.removeShield = function(index) {
            $scope.sheet.shield.splice(index, 1);
        };

        $scope.activateShield = function(index) {
            $scope.sheet.shield.forEach(function(item) {
                item.equiped = false;
            });
            $scope.sheet.shield[index].equiped = true;
        };

        $scope.deactivateShield = function(index) {
            $scope.sheet.shield[index].equiped = false;
        };

        // Protective Items
        // /////////////////////////////////////////////////////////////////
        $scope.addProtective = function() {
            $scope.sheet.protective_item[$scope.sheet.protective_item.length] = {'name': ''};
        };

        $scope.removeProtective = function(index) {
            $scope.sheet.protective_item.splice(index, 1);
        };

        $scope.activateProtective = function(index) {
            var _type = $scope.sheet.protective_item[index].type;
            if (_type != 'natural' && _type != 'deflection') return;

            $scope.sheet.protective_item.forEach(function(item) {
                if (item.type == _type) {
                    item.equiped = false;
                }
            });
            $scope.sheet.protective_item[index].equiped = true;
        };

        $scope.deactivateProtective = function(index) {
            $scope.sheet.protective_item[index].equiped = false;
        };

        // Attacks
        // /////////////////////////////////////////////////////////////////
        $scope.addAttack = function() {
            $scope.sheet.attack[$scope.sheet.attack.length] = {
                'name': '',
                'range': 0
            };
        };

        $scope.removeAttack = function(index) {
            $scope.sheet.attack.splice(index, 1);
        };

        $scope.attackSetDamageAttribute = function(index, attr) {
            $scope.sheet.attack[index].damage_attribute = attr;
        };

        $scope.attackSetAttackAttribute = function(index, attr) {
            $scope.sheet.attack[index].attack_attribute = attr;
        };

        // Attacks
        // /////////////////////////////////////////////////////////////////
        $scope.addItem = function() {
            $scope.sheet.items[$scope.sheet.items.length] = {
                'name': '',
                'quantity': 1,
                'weight':  0,
                'page': ''
            }
        };

        $scope.removeItem = function(index) {
            $scope.sheet.items.splice(index, 1);
        };

        $scope.itemWeight = 0;

        $scope.$watch(
            'sheet.items',
            function() {
                if ($scope.sheet == null) return;

                $scope.itemWeight = 0;

                $scope.sheet.items.forEach(function(item) {
                    $scope.itemWeight = $scope.itemWeight + (item.quantity * item.weight);
                });
            },
            true
        );

        // Skills
        // /////////////////////////////////////////////////////////////////

        var nameSkillIndex = {};

        // Maintain Skill Name Index
        $scope.$watch(
            'sheet.skills',
            function() {
                if ($scope.sheet == null) return;

                nameSkillIndex = {};

                $scope.sheet.skills.forEach(function(skill, index) {
                    nameSkillIndex[skill.name] = index;
                });
            },
            true
        );

        $scope.addSkill = function(index) {
            $scope.sheet.skills[$scope.sheet.skills.length] = {};

        }

        $scope.removeSkill = function(index) {
            $scope.sheet.skills.splice(index, 1);            
        }

        $scope.getSynergy = function(name) {
            var fromSkills = [];

            $scope.sheet.skill_synergy.forEach(function(synergy) {
                if (synergy.to == name) {
                    fromSkills[fromSkills.length] = synergy.from;
                }
            });

            var mod = 0;
            fromSkills.forEach(function(skill_name) {
                var skill = $scope.sheet.skills[nameSkillIndex[skill_name]];

                if ((skill.ranks + skill.misc + $scope.getAttributeBonus(skill.attribute)) > 5) {
                    mod = mod + 2;
                }
            });

            return mod;
        }

        // Saves
        // /////////////////////////////////////////////////////////////////
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


