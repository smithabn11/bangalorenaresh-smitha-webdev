/**
 * Created by smitha on 11/4/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('SearchMainController', SearchMainController)

    function SearchMainController($routeParams, $location, $http, $rootScope, SearchService, ShoppingCartService) {
        var vm = this;
        var userId = $routeParams['uid'];
        var numOfItemsPerRequest = 10;

        function init() {
            $('html').removeClass('project-bk');
            vm.userId = userId;
            vm.curPageIndex = 1;
            vm.error = "";
            vm.prevPageItems = prevPageItems;
            vm.nextPageItems = nextPageItems;
            vm.searchItem = searchItem;
            vm.addItemShoppingCart = addItemShoppingCart;

            if (vm.searchText == null && $rootScope.searchText && $rootScope.curPageIndex) {
                vm.curPageIndex = $rootScope.curPageIndex;
                searchItem($rootScope.searchText, $rootScope.curPageIndex);
            }
        }

        init();

        function searchItem(searchText, pageIndex) {

            if (searchText == undefined || searchText == "") {
                vm.error = "Search Text cannot be empty. Please enter the search text.";
                $('#main-search').addClass('has-error');
                $('#searchtext-btn').removeClass('btn-default');
                $('#searchtext-btn').addClass('btn-danger');
            } else {
                vm.error = "";
                vm.searchText = searchText;
                $('#main-search').removeClass('has-error');
                $('#searchtext-btn').addClass('btn-default');
                $('#searchtext-btn').removeClass('btn-danger');


                var promise = SearchService.searchItem(searchText, pageIndex);
                promise
                    .success(function (result) {
                        if (result != null && result.numItems > 0) {
                            $rootScope.searchText = searchText;
                            vm.curPageIndex = pageIndex;
                            $rootScope.curPageIndex = vm.curPageIndex;


                            vm.searchItemList = result.items;
                            if (result.totalResults > numOfItemsPerRequest) {
                                vm.reqPagination = true;
                                vm.totalResults = result.totalResults;
                            }
                        } else if (result.numItems == 0) {
                            vm.error = result.message;
                        }
                    })
                    .error(function (response) {
                        vm.error = response;
                    });
            }
        }

        function prevPageItems() {
            if (vm.totalResults >= (vm.curPageIndex * numOfItemsPerRequest) &&
                (vm.curPageIndex - 1) != 0) {
                var promise = SearchService.searchItem(vm.searchText, vm.curPageIndex - 1);
                promise
                    .success(function (result) {
                        if (result != null) {
                            vm.searchItemList = result.items;
                            vm.curPageIndex = vm.curPageIndex - 1;
                            $rootScope.curPageIndex = vm.curPageIndex;
                            $('#pagination-left').removeClass('disabled');
                        }
                    })
                    .error(function (response) {
                        vm.error = response;
                    });
            } else {
                $('#pagination-left').addClass('disabled');
            }
        }

        function nextPageItems() {
            var totalPages = (vm.totalResults / numOfItemsPerRequest);

            if (vm.totalResults >= (vm.curPageIndex * numOfItemsPerRequest) &&
                (vm.curPageIndex + 1) <= Math.ceil(totalPages)) {
                var promise = SearchService.searchItem(vm.searchText, vm.curPageIndex + 1);
                promise
                    .success(function (result) {
                        if (result != null) {
                            vm.searchItemList = result.items;
                            vm.curPageIndex = vm.curPageIndex + 1;
                            $rootScope.curPageIndex = vm.curPageIndex;
                            $('#pagination-right').removeClass('disabled');
                            $('#pagination-left').removeClass('disabled');
                        }
                    })
                    .error(function (response) {
                        vm.error = response;
                    });
            } else {
                $('#pagination-right').addClass('disabled');
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
    }
})();