/**
 * Created by smitha on 11/15/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('AdminController', AdminController)
        .controller('ShopperListController', ShopperListController)
        .controller('AdminOrderController', AdminOrderController);

    function AdminController($routeParams) {
        var vm = this;
        var userId = $routeParams['uid'];

        function init() {
            vm.userId = userId;
        }

        init();
    }

    function ShopperListController($routeParams, ShopperService) {
        var vm = this;
        var userId = $routeParams['uid'];

        function init() {
            vm.userId = userId;
            ShopperService.findAllShoppers(userId)
                .success(function (shoppers) {
                    vm.shoppers = shoppers;
                })
                .error(function (error) {
                    vm.error = error;
                })
        }

        init();
    }

    function AdminOrderController($routeParams, OrderService) {
        var vm = this;
        var adminId = $routeParams['aid'];
        var shopperId = $routeParams['uid'];

        function init() {
            vm.adminId = adminId;
            vm.shopperId = shopperId;
            OrderService.findOrdersByUserId(shopperId)
                .success(function (orders) {
                    vm.orders = orders;
                })
                .error(function (error) {
                    vm.error = error;
                })
        }

        init();
    }

})();