/**
 * Created by smitha on 11/15/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('ItemDetailController', ItemDetailController)

    function ItemDetailController($routeParams, $location, $http, $rootScope, SearchService, WishlistService, ShoppingCartService) {
        var vm = this;
        var userId = $routeParams['uid'];
        var itemId = $routeParams['itemid'];

        function init() {
            vm.userId = userId;
            vm.itemId = itemId;
            vm.addWishList = addWishList;
            vm.addItemShoppingCart = addItemShoppingCart;

            $('#wishlist').removeClass('wishlist-error');
            $('#wishlist').removeClass('wishlist-success');

            SearchService.itemDetail(itemId)
                .success(function (result) {
                    if (result != null) {
                        vm.item = result;
                        if (result.longDescription) {
                            vm.longdesc = $('<p>').html(result.longDescription).text();
                        }

                    }
                })
                .error(function (error) {
                    vm.error = error;
                });
        }

        init();

        function addWishList() {
            WishlistService.addItemWishList(userId, itemId)
                .success(function (result) {
                    if (result) {
                        $('#wishlist').removeClass('wishlist-error');
                        $('#wishlist').addClass('wishlist-success');
                    }
                })
                .error(function (error) {
                    vm.error = error;
                    $('#wishlist').addClass('wishlist-error');
                    $('#wishlist').removeClass('wishlist-success');
                });

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
})();