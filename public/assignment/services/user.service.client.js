/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http) {

        var api = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByCredentials": findUserByCredentials,
            "findUserByUsername" : findUserByUsername,
            "updateUser": updateUser,
            "deleteUser": deleteUser
        };

        return api;

        function createUser(user) {
            return $http.post("/api/user", user);
        }

        function findUserByCredentials(username, password) {
            var url = '/api/user?username=' + username + '&password=' + password;
            return $http.get(url);
        }

        function findUserByUsername(username) {
            var url = '/api/user?username=' + username;
            return $http.get(url);
        }

        function findUserById(userId) {
            var url = '/api/user/' + userId;
            return $http.get(url);
        }

        function updateUser(userUpdated) {
            var url = "/api/user/" + userUpdated._id;
            return $http.put(url, userUpdated);
        }

        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url);
        }
    }
})();