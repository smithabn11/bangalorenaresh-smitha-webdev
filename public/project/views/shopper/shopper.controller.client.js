/**
 * Created by smitha on 10/7/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('LoginController', LoginController)
        .controller('ProfileController', ProfileController)
        .controller('RegisterController', RegisterController)
        .controller('WishlistController', WishlistController);

    function LoginController($location, $rootScope, ShopperService) {
        var vm = this;

        function init() {
            // $('html').addClass('project-bk');
            vm.login = login;
            removeErrorClasses();
        }

        init();

        function login(username, password) {
            removeErrorClasses();

            if (username == null || password == null) {
                if ((username == null || username == "") && (password == null || password == "")) {
                    $('#username').addClass('has-error');
                    $('#password').addClass('has-error');
                    vm.error = "username and password cannot be empty";
                    updateError();
                } else if (username == null || username == "") {
                    $('#username').addClass('has-error');
                    vm.error = "username cannot be empty";
                    updateError();
                }
                else if (password == null || password == "") {
                    $('#password').addClass('has-error');
                    vm.error = "password cannot be empty";
                    updateError();
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
                            updateError();
                        }
                    })
                    .error(function (response) {
                        vm.error = response + " " + "Please verify your credentials <br> New Shoppers please Register";
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

    function ProfileController($routeParams, $location, $http, $rootScope, ShopperService) {
        var vm = this;

        var userId = $routeParams.uid;

        function init() {
            $('html').removeClass('project-bk');

            vm.usstates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA",
                "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI",
                "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
                "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];


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
                    $rootScope.searchText = null;
                    $rootScope.curPageIndex = null;
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
            $('html').removeClass('project-bk');
            removeErrorClasses();
        }

        init();

        function register(username, password, retype_password) {
            removeErrorClasses();
            vm.error = "";

            if (username == null || username == "" ||
                password == null || password == "" ||
                retype_password == null || retype_password == "") {
                validateForm(username, password, retype_password);
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

    function WishlistController($routeParams, $location, $http, $rootScope, ShopperService, SearchService, ShoppingCartService, WishlistService) {
        var vm = this;
        var userId = $routeParams.uid;
        if ($routeParams.uid) {
            vm.userId = $routeParams.uid;
        }
        else {
            vm.userId = $rootScope.currentUser._id;
        }

        function init() {
            vm.addItemShoppingCart = addItemShoppingCart;

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
                                    SearchService.lookupItems(user.wishlist)
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

        function addItemShoppingCart(item) {
            if (vm.userId) {
                ShoppingCartService.findShoppingCartByUserId(userId)
                    .success(function (result) {
                        if (result == null) {
                            ShoppingCartService.createShoppingCart(userId, {
                                itemId: item.itemId,
                                quantity: 1,
                                price: item.salePrice
                            })
                                .success(function (cart) {
                                    $location.url("/shopper/" + vm.userId + "/shoppingcart");
                                })
                                .error(function (error) {
                                    if (error) {
                                        vm.error = error;
                                    }
                                })

                        } else {
                            ShoppingCartService.addItemShoppingCart(userId, {
                                itemId: item.itemId,
                                quantity: 1,
                                price: item.salePrice
                            })
                                .success(function (cart) {
                                    $location.url("/shopper/" + vm.userId + "/shoppingcart");
                                })
                                .error(function (error) {
                                    if (error) {
                                        vm.error = error;
                                    }
                                })
                        }
                    })
                    .error(function (error) {
                        if (error) {
                            vm.error = error;
                        }
                    })
            }
        }
    }

})
();