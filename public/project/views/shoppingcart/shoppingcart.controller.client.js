/**
 * Created by smitha on 12/3/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('ShoppingCartController', ShoppingCartController)

    function ShoppingCartController($routeParams, $location, $http, $rootScope, SearchService, ShoppingCartService) {

        var vm = this;
        var userId = $routeParams['uid'];

        function init() {
            vm.userId = userId;
            vm.removeItemShoppingCart = removeItemShoppingCart;
            vm.checkout = checkout;


            if (userId) {
                ShoppingCartService.findShoppingCartByUserId(userId)
                    .success(function (cart) {
                        if (cart != null) {
                            var shoppingCartItems = [];
                            for (var i = 0; i < cart.items.length; i++) {
                                shoppingCartItems.push(cart.items[i].itemId);
                            }
                            SearchService.lookupItems(shoppingCartItems)
                                .success(function (items) {
                                    vm.cart = items;
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
            ShoppingCartService.removeItemShoppingCart(vm.userId, itemId)
                .success(function (cart) {
                    var shoppingCartItems = [];
                    for (var i = 0; i < cart.items.length; i++) {
                        shoppingCartItems.push(cart.items[i].itemId);
                    }
                    SearchService.lookupItems(shoppingCartItems)
                        .success(function (items) {
                            vm.cart = items;
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

        function checkout() {

        }

    }
})();