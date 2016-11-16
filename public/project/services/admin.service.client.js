/**
 * Created by smitha on 11/15/16.
 */
(function () {
    angular.module("ShoppingAwesome")
        .factory("AdminService", AdminService);

    function AdminService($http) {
        var api = {
            "findAdminById": findAdminById,
            "findAdminByUsername": findAdminByUsername,
            "findAdminByCredentials": findAdminByCredentials
        }
        return api;

        function findAdminById(userId) {

        }

        function findAdminByUsername(username) {

        }

        function findAdminByCredentials(username, password) {

        }

    }
})();