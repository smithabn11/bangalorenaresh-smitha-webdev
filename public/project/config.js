/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .config(Config);

    function Config($routeProvider, $httpProvider) {
        $routeProvider
            .when('/admin', {
                templateUrl: 'views/admin/admin.view.client.html',
                controller: 'AdminController',
                controllerAs: "model",
                resolve: {
                    checkAdmin: checkShopperAdmin
                }
            })
            .when('/admin/:uid', {
                templateUrl: 'views/admin/admin.view.client.html',
                controller: 'AdminController',
                controllerAs: "model",
                resolve: {
                    checkAdmin: checkShopperAdmin
                }
            })
            .when('/admin/:uid/shopperlist', {
                templateUrl: 'views/admin/shopperlist.view.client.html',
                controller: 'ShopperListController',
                controllerAs: "model",
                resolve: {
                    checkAdmin: checkShopperAdmin
                }
            })
            .when('/admin/:aid/shopper/:uid/adminorder', {
                templateUrl: 'views/admin/adminorder.view.client.html',
                controller: 'AdminOrderController',
                controllerAs: "model",
                resolve: {
                    checkAdmin: checkShopperAdmin
                }
            })
            .when('/login', {
                templateUrl: 'views/shopper/login.view.client.html',
                controller: 'LoginController',
                controllerAs: "model"
            })
            .when('/register', {
                templateUrl: 'views/shopper/register.view.client.html',
                controller: 'RegisterController',
                controllerAs: "model"
            })
            .when('/shopper', {
                templateUrl: 'views/shopper/profile.view.client.html',
                controller: 'ProfileController',
                controllerAs: "model",
                resolve: {
                    checkShopperLogin: checkShopperLogin
                }
            })
            .when('/shopper/:uid', {
                templateUrl: 'views/shopper/profile.view.client.html',
                controller: 'ProfileController',
                controllerAs: "model"
            })
            .when('/shopper/:uid/wishlist', {
                templateUrl: 'views/shopper/wishlist.view.client.html',
                controller: 'WishlistController',
                controllerAs: "model"
            })
            .when('/shopper/:uid/myorders', {
                templateUrl: 'views/order/myorders.view.client.html',
                controller: 'MyOrderController',
                controllerAs: "model"
            })
            .when('/shopper/:uid/search', {
                templateUrl: 'views/search/search-main.view.client.html',
                controller: 'SearchMainController',
                controllerAs: "model"
            })
            .when('/shopper/:uid/search/:itemid', {
                templateUrl: 'views/search/itemdetail.view.client.html',
                controller: 'ItemDetailController',
                controllerAs: "model"
            })
            .when('/shopper/:uid/shoppingcart', {
                templateUrl: 'views/shoppingcart/shoppingcart.view.client.html',
                controller: 'ShoppingCartController',
                controllerAs: "model"
            })
            .when('/shopper/:uid/order/:oid', {
                templateUrl: 'views/order/order.view.client.html',
                controller: 'OrderController',
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: '/login'
            });

        // $httpProvider.defaults.useXDomain = true;
        // $httpProvider.defaults.withCredentials = true;
        // delete $httpProvider.defaults.headers.common["X-Requested-With"];
        // $httpProvider.defaults.headers.common["Accept"] = "application/json";
        // $httpProvider.defaults.headers.common["Content-Type"] = "application/json";


        function checkShopperLogin($q, $location, ShopperService) {
            var deferred = $q.defer();
            ShopperService.checkLogin()
                .success(function (user) {
                    if (user != '0') {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }

                })
                .error(function (err) {
                    $location.url("/login");
                });
            return deferred.promise;

        }


        function checkShopperAdmin($q, ShopperService) {
            var deferred = $q.defer();
            ShopperService.checkAdmin()
                .success(function (user) {
                    if (user != '0') {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                });
            return deferred.promise;

        }
    }
})();


