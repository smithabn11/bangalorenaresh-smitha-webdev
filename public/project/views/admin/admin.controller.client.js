/**
 * Created by smitha on 11/15/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('AdminLoginController', AdminLoginController)

    function AdminLoginController($location, $http, AdminService) {
        var vm = this;
        vm.adminLogin = adminLogin;

        function adminLogin(username, password) {
            var promise = AdminService.findUserByCredentials(username, password);
            promise
                .success(function (user) {
                    if (user === '0') {
                        vm.error = "No admin access";
                    } else {
                        $location.url("/admin/" + user._id);
                    }
                })
                .error(function (err) {
                    vm.error = err;
                })
        }
    }


})();