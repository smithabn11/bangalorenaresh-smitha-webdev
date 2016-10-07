/**
 * Created by smitha on 10/6/16.
 */

angular.module('WebAppMaker' , ['ngRoute'])
       .config(Config);

function Config($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl : 'login.html'
        })
        .when('/register', {
            templateUrl : 'register.html'
        });
}