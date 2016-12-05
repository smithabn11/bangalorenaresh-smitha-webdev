/**
 * Created by smitha on 12/4/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('OrderController', OrderController)
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    function OrderController($routeParams, $location, $http, $rootScope, SearchService, ShopperService, OrderService, ModalService) {
        var vm = this;
        var userId = $routeParams['uid'];
        var orderId = $routeParams['oid'];

        function init() {
            vm.userId = userId;
            vm.orderId = orderId;
            vm.deleteOrderByOrderId = deleteOrderByOrderId;
            vm.gotoProfile = gotoProfile;
            vm.submitOrder = submitOrder;

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
                            })
                            .error(function (error) {
                                vm.error = error;
                            })

                        ShopperService.findUserById(vm.userId)
                            .success(function (user) {
                                if (user.street && user.city && user.state && user.zipcode) {
                                    vm.order.shippingStreet = user.street;
                                    vm.order.shippingCity = user.city;
                                    vm.order.shippingState = user.state;
                                    vm.order.shippingZipcode = user.zipcode;

                                }
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

        function deleteOrderByOrderId() {
            OrderService.deleteOrderByOrderId(userId, orderId)
                .success(function (status) {
                    $location.url("/shopper/" + userId + "/shoppingcart")
                })
                .error(function (error) {
                    vm.error = error;
                })
        }

        function gotoProfile() {
            if (vm.order.submitted) {
                $location.url("/shopper/" + vm.userId);
            } else {
                OrderService.deleteOrderByOrderId(userId, orderId)
                    .success(function (status) {
                        $location.url("/shopper/" + vm.userId);
                    })
                    .error(function (error) {
                        vm.error = error;
                    })
            }
        }

        function submitOrder() {
            OrderService.submitOrder(userId, orderId, vm.order)
                .success(function (order) {
                    vm.success = true;

                    // ModalService.showModal({
                    //     templateUrl: "/project/views/order/successOrderModal.html",
                    //     controller: "ModalInstanceCtrl"
                    // }).then(function (modal) {
                    //     modal.element.modal();
                    //     modal.close.then(function (result) {
                    //         $scope.yesNoResult = result ? "You said Yes" : "You said No";
                    //     });
                    // });


                })
                .error(function (error) {
                    vm.error = error;
                })
        }
    }

    function ModalInstanceCtrl($scope) {

        $scope.close = function (result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };
    }


})();
