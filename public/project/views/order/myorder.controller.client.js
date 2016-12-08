/**
 * Created by smitha on 12/7/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('MyOrderController', MyOrderController);

    function MyOrderController($routeParams, $location, $http, OrderService) {
        var vm = this;
        var userId = $routeParams['uid'];

        function init() {
            vm.userId = userId;
            OrderService.findOrdersByUserId(userId)
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