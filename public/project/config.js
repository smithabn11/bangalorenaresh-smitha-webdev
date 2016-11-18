/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .config(Config);

    function Config($routeProvider, $httpProvider) {
        $routeProvider
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
            .when('/shopper/:uid', {
                templateUrl: 'views/shopper/profile.view.client.html',
                controller: 'ProfileController',
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
            .when('/admin', {
                templateUrl: 'views/admin/adminlogin.view.client.html',
                controller: 'AdminLoginController',
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: '/login'
            });

        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
        $httpProvider.defaults.headers.common["Accept"] = "application/json";
        $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    }
})();


