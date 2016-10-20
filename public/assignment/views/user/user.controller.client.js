/**
 * Created by smitha on 10/7/16.
 */
(function () {
    angular.module('WebAppMaker')
        .controller('LoginController', LoginController)
        .controller('ProfileController', ProfileController)
        .controller('RegisterController', RegisterController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            var user = UserService.findUserByCredentials(username, password);
            console.log(user);
            if (user == null) {
                vm.error = "No such user";
            } else {
                $location.url("/user/" + user._id);
            }
        }
    }

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;

        var userId = $routeParams.uid;

        var user = UserService.findUserById(userId);

        if (user != null) {
            vm.user = user;
            vm.userId = userId;
        }

        vm.updateProfile = updateProfile;
        function updateProfile(user) {
            UserService.updateUser(vm.userId, user);
        }
    }

    function RegisterController($routeParams, $location, UserService) {
        var vm = this;
        var userId = $routeParams.uid;
        vm.userId = userId;
        vm.register = register;

        function register(username, password, retype_password) {
            var user = UserService.findUserByCredentials(username, password);
            if (user == null) {
                if (password.localeCompare(retype_password) != 0) {
                    vm.error = "Password did not match";
                } else {
                    var newuser = {_id: (new Date()).getTime() + "", username: username, password: password};
                    UserService.createUser(newuser);
                    $location.url("/user/" + newuser._id);
                }
            } else {
                vm.error = "User already present";
            }
        }
    }

})();