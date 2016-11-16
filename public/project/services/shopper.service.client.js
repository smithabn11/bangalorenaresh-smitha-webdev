/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module("ShoppingAwesome")
        .factory("ShopperService", ShopperService);

    function ShopperService($http) {
        var api = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser
        };

        return api;

        function createUser(user) {
            return $http.post("/api/shopper", user);
        }

        function findUserByCredentials(username, password) {
            var url = '/api/shopper?username=' + username + '&password=' + password;
            return $http.get(url);

        }

        function findUserByUsername(username) {
            var url = '/api/shopper?username=' + username;
            return $http.get(url);
        }

        function findUserById(userId) {
            var url = '/api/shopper/' + userId;
            return $http.get(url);
        }

        function updateUser(userUpdated) {
            var url = "/api/shopper/" + userUpdated._id;
            return $http.put(url, userUpdated);
        }

        function deleteUser(userId) {
            var url = "/api/shopper/" + userId;
            return $http.delete(url);
        }
    }
})();