/**
 * Created by smitha on 10/7/16.
 */
(function () {
    angular.module('WebAppMaker')
        .controller('LoginController', LoginController)
        .controller('ProfileController', ProfileController)
        .controller('RegisterController', RegisterController);

    function LoginController($location, $http, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            //var promise = UserService.findUserByCredentials(username, password);
            var promise = UserService.login(username, password);
            promise
                .success(function (user) {
                    if (user && user._id) {
                        $location.url("/user/" + user._id);
                    } else {
                        vm.error = "No such username or password mismatch";
                    }
                })
                .error(function (response) {
                    vm.error = response;
                    console.log(response);
                })
        }
    }

    function ProfileController($routeParams, $location, $http, UserService) {
        var vm = this;

        //var userId = $routeParams.uid;

        function init() {
            //vm.userId = userId;
            vm.updateProfile = updateProfile;
            vm.unRegisterUser = unRegisterUser;
            vm.logout = logout;

            //var promise = UserService.findUserById(userId);
            var promise = UserService.findCurrentUser();
            promise
                .success(function (user) {
                    vm.user = user;
                })
                .error(function (response) {
                    vm.error = response;
                    console.log(response);
                });
        }

        init();


        function updateProfile(user) {
            UserService.updateUser(vm.user);
        }

        function unRegisterUser(user) {
            UserService.deleteUser(user._id)
                .success(function () {
                    $location.url('/login'); //need to wait as server may still be deleting hence need to wait
                })
                .error(function (response) {
                    vm.error = response;
                    console.log(response);
                });
        }

        function logout() {
            UserService.logout()
                .success(function () {
                    vm.user = null;
                    $location.url("/login");
                })
                .error(function (response) {
                    vm.error = response;
                    console.log(response);
                });

        }
    }

    function RegisterController($routeParams, $location, $http, UserService) {
        var vm = this;
        var userId = $routeParams.uid;

        function init() {
            vm.userId = userId;
            vm.register = register;
        }

        init();

        function register(username, password, retype_password) {
            var promise = UserService.findUserByUsername(username);
            promise
                .success(function (user) {
                    if (user == null) {
                        if (password.localeCompare(retype_password) != 0) {
                            vm.error = "Password did not match";
                        } else {
                            var newuser = {
                                // _id: (new Date()).getTime() + "",
                                username: username, password: password
                            };
                            UserService.createUser(newuser)
                                .success(function (user) {
                                    $location.url("/user/" + user._id);
                                })
                                .error(function (response) {
                                    vm.error = response;
                                    console.log(response);
                                });
                        }
                    } else {
                        vm.error = "User already present";
                    }
                })
                .error(function (response) {
                    vm.error = response;
                    console.log(response);
                });
        }
    }

})();