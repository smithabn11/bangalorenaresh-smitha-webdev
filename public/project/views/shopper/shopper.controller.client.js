/**
 * Created by smitha on 10/7/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('LoginController', LoginController)
        .controller('ProfileController', ProfileController)
        .controller('RegisterController', RegisterController)
        .controller('WishlistController', WishlistController);

    function LoginController($location, $http, $rootScope, ShopperService) {
        var vm = this;

        function init() {
            vm.login = login;
            removeErrorClasses();
        }

        init();

        function login(username, password) {
            removeErrorClasses();

            if (username == null || password == null) {
                if (username == null || username == "") {
                    $('#username').addClass('has-error');
                    $('#username').removeClass('has-success')
                    vm.error = "username cannot be empty";
                }
                else if (password == null || password == "") {
                    $('#password').addClass('has-error');
                    $('#password').removeClass('has-success')
                    vm.error = "password cannot be empty";
                }
            } else {
                vm.error = "";

                //var promise = ShopperService.findUserByCredentials(username, password);
                var promise = ShopperService.login(username, password);
                promise
                    .success(function (user) {
                        if (user && user._id) {
                            vm.user = user;
                            $rootScope.currentUser = user;
                            $location.url("/shopper/" + user._id + "/search");
                        } else {
                            vm.error = "No such username or password mismatch";
                        }
                    })
                    .error(function (response) {
                        vm.error = response + " " + "No such username or password mismatch";
                    })
            }
        }

        function removeErrorClasses() {
            $('#username').removeClass('has-error');
            $('#username').removeClass('has-success')
            $('#password').removeClass('has-error');
            $('#password').removeClass('has-success');
        }
    }

    function ProfileController($routeParams, $location, $http, $rootScope, ShopperService) {
        var vm = this;

        var userId = $routeParams.uid;

        function init() {
            //vm.userId = userId;
            vm.updateProfile = updateProfile;
            vm.unRegisterUser = unRegisterUser;
            vm.logout = logout;

            vm.error = "";

            if ($routeParams.uid) {
                vm.userId = $routeParams.uid;
            }
            else if ($rootScope.currentUser) {
                vm.userId = $rootScope.currentUser._id;
            }


            //var promise = ShopperService.findUserById(userId);
            var promise = ShopperService.findCurrentUser();
            promise
                .success(function (user) {
                    vm.user = user;
                })
                .error(function (response) {
                    vm.error = response;
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
                .error(function (response) {
                    vm.error = response;
                });
        }

        function logout() {
            ShopperService.logout()
                .success(function () {
                    vm.user = null;
                    $rootScope.currentUser = null;
                    $location.url("/login");
                })
                .error(function (response) {
                    vm.error = response;
                });
        }
    }

    function RegisterController($routeParams, $location, $http, $rootScope, ShopperService) {
        var vm = this;

        function init() {
            vm.register = register;
            removeErrorClasses();
        }

        init();

        function register(username, password, retype_password) {
            removeErrorClasses();
            vm.error = "";

            if (username == null || password == null || retype_password == null) {
                if (username == null) {
                    vm.error = "username cannot be empty";
                    $('#username').addClass('has-error');
                    $('#username').removeClass('has-success');
                }
                else if (password == null) {
                    vm.error = "password cannot be empty";
                    $('#password').addClass('has-error');
                    $('#password').removeClass('has-success');
                }
                else if (retype_password == null) {
                    vm.error = "verify password cannot be empty";
                    $('#retype_password').addClass('has-error');
                    $('#retype_password').removeClass('has-success');
                }
            }
            else {
                ShopperService.findUserByUsername(username)
                    .success(function (user) {
                        if (user == null) {
                            if (password.localeCompare(retype_password) != 0) {
                                vm.error = "Password did not match";
                            } else {
                                var newuser = {username: username, password: password, isShopper: true};
                                ShopperService.register(newuser)
                                    .success(function (user) {
                                        vm.user = user;
                                        $rootScope.currentUser = user;
                                        $location.url("/shopper/" + user._id);
                                    })
                                    .error(function (err) {
                                        vm.error = err;
                                    });
                            }
                        } else {
                            vm.error = "User already present";
                        }
                    })
                    .error(function (err) {
                        vm.error = err;
                    });
            }
        }

        function removeErrorClasses() {
            $('#username').removeClass('has-error');
            $('#username').removeClass('has-success');
            $('#password').removeClass('has-error');
            $('#password').removeClass('has-success');
            $('#retype_password').removeClass('has-error');
            $('#retype_password').removeClass('has-success');
        }

    }

    function WishlistController($routeParams, $location, $http, $rootScope, ShopperService, SearchService, WishlistService) {
        var vm = this;
        var userId = $routeParams.uid;
        if ($routeParams.uid) {
            vm.userId = $routeParams.uid;
        }
        else {
            vm.userId = $rootScope.currentUser._id;
        }

        function init() {
            vm.removeItemWishlist = removeItemWishlist;
            if ($routeParams.uid) {
                vm.userId = $routeParams.uid;
            }
            else {
                vm.userId = $rootScope.currentUser._id;
            }

            ShopperService.findUserById(vm.userId)
                .success(function (user) {
                    SearchService.lookupItems(user.wishlist)
                        .success(function (wishlistItems) {
                            if (wishlistItems.items) {
                                vm.wishlistItems = wishlistItems.items;
                            }
                        })
                        .error(function (error) {

                        })
                })
                .error(function (error) {

                });
        }

        init();

        function removeItemWishlist(itemId) {
            WishlistService.removeItemWishList(vm.userId, itemId)
                .success(function (status) {
                    if (status == "OK") {

                        ShopperService.findUserById(vm.userId)
                            .success(function (user) {
                                vm.user = user;
                                $rootScope.currentUser = user;

                                if (user.wishlist.length > 0) {
                                    SearchService.lookupWishlistItems(user.wishlist)
                                        .success(function (wishlistItems) {
                                            if (wishlistItems.items) {
                                                vm.wishlistItems = wishlistItems.items;
                                            }
                                        })
                                        .error(function (error) {
                                            vm.error = error;
                                        })
                                } else {
                                    vm.wishlistItems = [];
                                }
                            })
                            .error(function (error) {
                                vm.error = error;
                            });
                    }
                })
                .error(function (error) {
                    vm.error = error;
                })
        }
    }

})
();