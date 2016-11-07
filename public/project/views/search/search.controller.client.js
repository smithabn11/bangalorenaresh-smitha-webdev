/**
 * Created by smitha on 11/4/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('SearchMainController', SearchMainController)

    function SearchMainController($location, $http, SearchService) {
        var vm = this;
        vm.searchItem = searchItem;

        function searchItem(searchText) {
            console.log(searchText);
            var promise = SearchService.searchItem(searchText);
            promise
                .success(function (result) {
                    if (result != null) {
                        vm.searchItemList = result.items;
                    }
                })
                .error(function () {

                });
        }
    }
})();