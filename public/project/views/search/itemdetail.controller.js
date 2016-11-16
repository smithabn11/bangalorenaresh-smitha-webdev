/**
 * Created by smitha on 11/15/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('ItemDetailController', ItemDetailController)

    function ItemDetailController($routeParams, $location, $http, SearchService) {
        var vm = this;
        var userId = $routeParams['uid'];
        var itemId = $routeParams['itemid'];


        function init() {
            vm.userId = userId;
            vm.itemId = itemId;
            SearchService.itemDetail(itemId)
                .success(function (result) {
                    if (result != null) {
                        vm.item = result;
                    }
                })
                .error(function (error) {
                    vm.error = error;
                });
        }

        init();
    }
})();