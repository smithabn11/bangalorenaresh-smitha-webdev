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

        function init() {
            vm.login = login;
            removeErrorClasses();
        }

        init();

        function login(username, password) {
            removeErrorClasses();

            if ((username == null || username == "") || (password == null || password == "")) {
                if ((username == null || username == "") && (password == null || password == "")) {
                    $('#username').addClass('has-error');
                    $('#password').addClass('has-error');
                    vm.error = "username and password cannot be empty";
                    updateError();
                } else if (username == null || username == "") {
                    $('#username').addClass('has-error');
                    $('#username').removeClass('has-success')
                    vm.error = "username cannot be empty";
                    updateError();
                }
                else if (password == null || password == "") {
                    $('#password').addClass('has-error');
                    $('#password').removeClass('has-success')
                    vm.error = "password cannot be empty";
                    updateError();
                }
            } else {
                vm.error = "";

                //var promise = UserService.findUserByCredentials(username, password);
                var promise = UserService.login(username, password);
                promise
                    .success(function (user) {
                        if (user && user._id) {
                            vm.user = user;
                            $location.url("/user/" + user._id);
                        } else {
                            vm.error = "No such username or password mismatch";
                            updateError();
                        }
                    })
                    .error(function (response) {
                        vm.error = response + " " + "Please verify your credentials <br> New Users please Register";
                        updateError();
                    })
            }
        }

        function removeErrorClasses() {
            $('#username').removeClass('has-error');
            $('#username').removeClass('has-success')
            $('#password').removeClass('has-error');
            $('#password').removeClass('has-success');
            $('#loginerror').empty();
        }

        function updateError() {
            $('#loginerror').empty();
            $('#loginerror').append("<p class='myPClass'></p>");
            $('.myPClass').html(vm.error);
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
            vm.error = "";

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
                });

        }
    }

    function RegisterController($routeParams, $location, $http, UserService) {
        var vm = this;
        var userId = $routeParams.uid;

        function init() {
            vm.register = register;
            removeErrorClasses();
        }

        init();

        function register(username, password, retype_password) {

            removeErrorClasses();

            if (username == null || username == "" ||
                password == null || password == "" ||
                retype_password == null || retype_password == "") {
                validateForm(username, password, retype_password);
            } else {
                removeErrorClasses();
                vm.error = "";
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
                                // UserService.createUser(newuser)
                                UserService.register(newuser)
                                    .success(function (user) {
                                        vm.user = user;
                                        $location.url("/user/" + user._id);
                                    })
                                    .error(function (response) {
                                        vm.error = response;
                                    });
                            }
                        } else {
                            vm.error = "User already present";
                        }
                    })
                    .error(function (response) {
                        vm.error = response;
                    });
            }
        }

        function removeErrorClasses() {
            $('#username').removeClass('has-error');
            $('#password').removeClass('has-error');
            $('#retype_password').removeClass('has-error');
        }

        function validateForm(username, password, retype_password) {
            if ((username == null || username == "") &&
                (password == null || password == "") &&
                (retype_password == null || retype_password == "")) {
                vm.error = "username and password fields cannot be empty";
                $('#username').addClass('has-error');
                $('#password').addClass('has-error');
                $('#retype_password').addClass('has-error');
            }
            else if (username == null || username == "") {
                vm.error = "username cannot be empty";
                $('#username').addClass('has-error');
            }
            else if (password == null || password == "") {
                vm.error = "password cannot be empty";
                $('#password').addClass('has-error');
            }
            else if (retype_password == null || retype_password == "") {
                vm.error = "verify password cannot be empty";
                $('#retype_password').addClass('has-error');
            }
        }
    }

})();