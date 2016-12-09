/**
 * Created by smitha on 11/15/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('ItemDetailController', ItemDetailController)

    function ItemDetailController($routeParams, $location, ShopperService, SearchService, WishlistService, ShoppingCartService) {
        var vm = this;
        var userId = $routeParams['uid'];
        var itemId = $routeParams['itemid'];

        function init() {
            vm.userId = userId;
            vm.itemId = itemId;
            vm.addWishList = addWishList;
            vm.addItemShoppingCart = addItemShoppingCart;
            removeWishListClass();


            SearchService.itemDetail(itemId)
                .success(function (result) {
                    if (result != null) {
                        vm.item = result;
                        if (result.longDescription) {
                            vm.longdesc = $('<p>').html(result.longDescription).text();
                            $("#longDesc").append("<div class='myPClass'></div>");
                            $(".myPClass").html(vm.longdesc);
                        } else {
                            $("#longDesc").empty();
                        }
                    }
                    ShopperService.findUserById(vm.userId)
                        .success(function (shopper) {
                            for (var i = 0; i < shopper.wishlist.length; i++) {
                                if (shopper.wishlist[i] == vm.itemId) {
                                    $('#wishlist').removeClass('wishlist-error');
                                    $('#wishlist').addClass('wishlist-success');
                                    $('#wishlistsm').removeClass('wishlist-error');
                                    $('#wishlistsm').addClass('wishlist-success');
                                    vm.isInWishlist = true;
                                    break;
                                }
                            }
                        })
                        .error(function (error) {

                        })

                })
                .error(function (error) {
                    vm.error = error;
                });
        }

        init();

        function addWishList() {
            if (!vm.isInWishlist) {
                WishlistService.addItemWishList(userId, itemId)
                    .success(function (result) {
                        if (result) {
                            $('#wishlist').removeClass('wishlist-error');
                            $('#wishlist').addClass('wishlist-success');
                            $('#wishlistsm').removeClass('wishlist-error');
                            $('#wishlistsm').addClass('wishlist-success');
                        }
                    })
                    .error(function (error) {
                        vm.error = error;
                        $('#wishlist').addClass('wishlist-error');
                        $('#wishlist').removeClass('wishlist-success');
                        $('#wishlistsm').addClass('wishlist-error');
                        $('#wishlistsm').removeClass('wishlist-success');
                    });
            }

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

        function removeWishListClass() {
            $('#wishlist').removeClass('wishlist-error');
            $('#wishlist').removeClass('wishlist-success');
            $('#wishlistsm').removeClass('wishlist-error');
            $('#wishlistsm').removeClass('wishlist-success');
        }
    }
})();