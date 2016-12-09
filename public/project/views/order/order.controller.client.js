/**
 * Created by smitha on 12/4/16.
 */
(function () {
    angular.module('ShoppingAwesome')
        .controller('OrderController', OrderController);

    function OrderController($routeParams, $location, SearchService,
                             ShopperService, ShoppingCartService, OrderService) {
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

                        if (!order.submitted) {
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
                        } else {
                            $('#staddress').attr('readonly', true);
                            $('#city').attr('readonly', true);
                            $('#state').attr('readonly', true);
                            $('#zipcode').attr('readonly', true);
                            vm.success = true;
                            vm.successMsg = "Order was successfully submitted!!! Order Id " + order._id;
                        }

                    }
                })
                .error(function (error) {
                    vm.error = error;
                })
        }

        init();

        function deleteOrderByOrderId() {
            OrderService.findOrderByOrderId(userId, orderId)
                .success(function (order) {
                    if (order.submitted) {
                        $location.url("/shopper/" + userId + "/search")
                    } else {
                        OrderService.deleteOrderByOrderId(userId, orderId)
                            .success(function (status) {
                                $location.url("/shopper/" + userId + "/shoppingcart")
                            })
                            .error(function (error) {
                                vm.error = error;
                            })
                    }
                })
                .error(function (order) {
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
            if (validateShippingAddressOrder()) {
                OrderService.submitOrder(userId, orderId, vm.order)
                    .success(function (order) {
                        if (order.submitted) {
                            vm.order = order;
                            ShoppingCartService.deleteShoppingCart(userId)
                                .success(function (status) {
                                    vm.success = true;
                                    vm.successMsg = "Order is successfully submitted!!! Order Id " + order._id;
                                    $('#staddress').attr('readonly', true);
                                    $('#city').attr('readonly', true);
                                    $('#state').attr('readonly', true);
                                    $('#zipcode').attr('readonly', true);
                                })
                                .error(function (error) {
                                    vm.error = "Order could not be sucessfully submitted";
                                    console.log("Could not delete shopping cart");
                                })

                        } else {
                            vm.error = "Order could not be sucessfully submitted";
                        }
                    })
                    .error(function (error) {
                        vm.error = error;
                    })
            }
        }

        function validateShippingAddressOrder() {
            var success = true;
            if (vm.order.shippingStreet == undefined || vm.order.shippingStreet == "") {
                vm.error = "Shipping Street cannot be empty";
                $('#fmgrp-staddress').addClass("has-error");
                success = false;
            } else if (vm.order.shippingCity == undefined || vm.order.shippingCity == "") {
                vm.error = "Shipping City cannot be empty";
                $('#fmgrp-city').addClass("has-error");
                success = false;
            } else if (vm.order.shippingState == undefined || vm.order.shippingState == "") {
                vm.error = "Shipping State cannot be empty";
                $('#fmgrp-state').addClass("has-error");
                success = false;
            } else if (vm.order.shippingZipcode == undefined || vm.order.shippingZipcode == "") {
                vm.error = "Shipping Zipcode cannot be empty";
                $('#fmgrp-zipcode').addClass("has-error");
                success = false;
            }

            // var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(vm.order.shippingZipcode);
            // if(success == true && !isValidZip){
            //     success = false;
            //     vm.error = "Shipping Zipcode incorrect digits";
            //     $('#fmgrp-zipcode').addClass("has-error");
            // }

            if (success == true) {
                $('#fmgrp-staddress').removeClass("has-error");
                $('#fmgrp-city').removeClass("has-error");
                $('#fmgrp-state').removeClass("has-error");
                $('#fmgrp-zipcode').removeClass("has-error");
                vm.error = "";
            }

            return success;
        }
    }


})
();
