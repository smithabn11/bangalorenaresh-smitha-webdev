/**
 * Created by smitha on 12/9/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('ViewOrderController', ViewOrderController);

    function ViewOrderController($routeParams, SearchService, OrderService) {
        var vm = this;
        var userId = $routeParams['uid'];
        var orderId = $routeParams['oid'];

        function init() {
            vm.userId = userId;
            vm.orderId = orderId;
            OrderService.findOrderByOrderId(userId, orderId)
                .success(function (order) {
                    vm.order = order;
                    if (order != null) {
                        var orderItems = [];
                        vm.total = 0;
                        for (var i = 0; i < order.items.length; i++) {
                            orderItems.push(order.items[i].itemId);
                        }

                        SearchService.lookupItems(orderItems)
                            .success(function (items) {
                                vm.orderItems = items;
                                vm.success = true;
                                vm.successMsg = "Order was successfully submitted!!! Order Id " + order._id;
                            })
                            .error(function (error) {
                                vm.error = error;
                            })
                    }
                })
                .error(function (error) {
                    vm.error = error;
                })
        }

        init();

    }


})();