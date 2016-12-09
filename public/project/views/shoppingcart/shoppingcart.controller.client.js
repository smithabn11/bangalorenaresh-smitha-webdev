/**
 * Created by smitha on 12/3/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('ShoppingCartController', ShoppingCartController)

    function ShoppingCartController($routeParams, $location,
                                    SearchService, ShoppingCartService, OrderService) {

        var vm = this;
        var userId = $routeParams['uid'];

        function init() {
            vm.userId = userId;
            vm.removeItemShoppingCart = removeItemShoppingCart;
            vm.checkOut = checkOut;


            if (userId) {
                ShoppingCartService.findShoppingCartByUserId(userId)
                    .success(function (cart) {
                        if (cart != null) {
                            var shoppingCartItems = [];
                            vm.total = 0;
                            for (var i = 0; i < cart.items.length; i++) {
                                shoppingCartItems.push(cart.items[i].itemId);
                                vm.total += cart.items[i].price;
                            }
                            vm.cart = cart;
                            vm.cart.total = vm.total;

                            SearchService.lookupItems(shoppingCartItems)
                                .success(function (items) {
                                    vm.cartItems = items;
                                })
                                .error(function (error) {
                                    vm.error = error;
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

        init();

        function removeItemShoppingCart(itemId) {
            var itemDbId;
            for (var i = 0; i < vm.cart.items.length; i++) {
                if (itemId == vm.cart.items[i].itemId) {
                    itemDbId = vm.cart.items[i]._id;
                    break;
                }
            }

            ShoppingCartService.removeItemShoppingCart(vm.userId, itemId, itemDbId)
                .success(function (cart) {
                    var shoppingCartItems = [];
                    vm.total = 0;
                    for (var i = 0; i < cart.items.length; i++) {
                        shoppingCartItems.push(cart.items[i].itemId);
                        vm.total += cart.items[i].price;
                    }
                    vm.cart = cart;
                    vm.cart.total = vm.total;

                    SearchService.lookupItems(shoppingCartItems)
                        .success(function (items) {
                            vm.cartItems = items;
                        })
                        .error(function (error) {
                            vm.error = error;
                        })
                })
                .error(function (error) {
                    if (error) {
                        vm.error = error;
                    }
                })
        }

        function checkOut() {
            OrderService.checkOut(vm.userId, vm.cart)
                .success(function (order) {
                    //goto checkout page, shopping cart will be deleted and converted to order
                    if (order._id) {
                        $location.url("/shopper/" + vm.userId + "/order/" + order._id);
                    }
                })
                .error(function (error) {
                    if (error) {
                        vm.error = error;
                    }
                })
        }

    }
})();