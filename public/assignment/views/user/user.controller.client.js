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
            if(user == null) {
                vm.error = "No such user";
            } else {
                $location.url("/user/"+user._id);
            }
        }
    }

    function ProfileController($routeParams, UserService) {
        var vm = this;

        var userId = $routeParams.uid;

        var user = UserService.findUserById(userId);

        if(user != null) {
            vm.user = user;
        }
    }

    function RegisterController($routeParams, $location, UserService) {
        var vm = this;
        var userId = $routeParams.uid;
        vm.userId = userId;
        vm.register = register;

        function register(username, password) {
            var user = UserService.findUserByCredentials(username, password);
            console.log(user);
            if(user == null) {
                var newuser = {_id: "100", username: username, password: password};
                UserService.createUser(newuser);
                $location.url("/user/"+newuser._id);
            } else {
                vm.error = "User already present";
            }
        }
    }

})();