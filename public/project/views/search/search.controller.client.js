/**
 * Created by smitha on 11/4/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('SearchMainController', SearchMainController)

    function SearchMainController($routeParams, $location, $http, SearchService) {
        var vm = this;
        var userId = $routeParams['uid'];
        var numOfItemsPerRequest = 25;

        function init() {
            vm.userId = userId;
            vm.curPageIndex = 1;
            vm.prevPageItems = prevPageItems;
            vm.nextPageItems = nextPageItems;
            vm.searchItem = searchItem;
        }

        init();

        function searchItem(searchText) {
            console.log(searchText);
            vm.searchText = searchText;
            var promise = SearchService.searchItem(searchText, 1);
            promise
                .success(function (result) {
                    if (result != null) {
                        vm.searchItemList = result.items;
                        if (result.totalResults > numOfItemsPerRequest) {
                            vm.reqPagination = true;
                            vm.totalResults = result.totalResults;
                        }
                    }
                    console.log(vm.reqPagination);
                })
                .error(function (response) {
                    vm.error = response;
                });
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



    }
})();