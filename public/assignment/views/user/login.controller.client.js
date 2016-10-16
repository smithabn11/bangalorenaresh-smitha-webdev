/**
 * Created by smitha on 10/7/16.
 */
(function () {
    angular.module('WebAppMaker')
        .controller('LoginController', LoginController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.hello = "Hello from LoginController";
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


})();