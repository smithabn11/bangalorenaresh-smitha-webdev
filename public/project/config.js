/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .config(Config);

    function Config($routeProvider) {
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
    }
})();


