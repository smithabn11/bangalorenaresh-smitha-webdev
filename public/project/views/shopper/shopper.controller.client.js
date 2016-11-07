/**
 * Created by smitha on 10/7/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('LoginController', LoginController)
        .controller('ProfileController', ProfileController)
        .controller('RegisterController', RegisterController);

    function LoginController($location, $http, ShopperService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            var promise = ShopperService.findUserByCredentials(username, password);
            promise
                .success(function (user) {
                    if (user === '0') {
                        vm.error = "No such shopper";
                    } else {
                        $location.url("/shopper/" + user._id);
                    }
                })
                .error(function () {

                })
        }
    }

    function ProfileController($routeParams, $location, $http, ShopperService) {
        var vm = this;

        var userId = $routeParams.uid;

        function init() {
            vm.userId = userId;
            vm.updateProfile = updateProfile;
            vm.unRegisterUser = unRegisterUser;

            var promise = ShopperService.findUserById(userId);
            promise
                .success(function (user) {
                    if (user != '0') {
                        vm.user = user;

                    }
                })
                .error(function () {

                });
        }

        init();


        function updateProfile(user) {
            ShopperService.updateUser(vm.user);
        }

        function unRegisterUser(user) {
            ShopperService.deleteUser(user._id)
                .success(function () {
                    $location.url('/login'); //need to wait as server may still be deleting hence need to wait
                })
                .error(function () {

                });
        }
    }

    function RegisterController($routeParams, $location, $http, ShopperService) {
        var vm = this;
        var userId = $routeParams.uid;

        function init() {
            vm.userId = userId;
            vm.register = register;
        }

        init();

        function register(username, password, retype_password) {
            var user = ShopperService.findUserByCredentials(username, password);
            if (user == null) {
                if (password.localeCompare(retype_password) != 0) {
                    vm.error = "Password did not match";
                } else {
                    var newuser = {_id: (new Date()).getTime() + "", username: username, password: password};
                    UserService.createUser(newuser);
                    $location.url("/shopper/" + newuser._id);
                }
            } else {
                vm.error = "User already present";
            }
        }
    }

})();