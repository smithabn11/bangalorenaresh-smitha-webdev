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
            $('html').removeClass('project-bk');
            vm.userId = userId;
            vm.orderId = orderId;
            vm.deleteOrderByOrderId = deleteOrderByOrderId;
            vm.gotoProfile = gotoProfile;
            vm.submitOrder = submitOrder;
            initializeDropdownData(vm);


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
                                vm.error = "<li>" + error + "</li>";
                                updateError();
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
                                    vm.error = "<li>" + error + "</li>";
                                    updateError();
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
                    vm.error = "<li>" + error + "</li>";
                    updateError();
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
                                vm.error = "<li>" + error + "</li>";
                                updateError();
                            })
                    }
                })
                .error(function (order) {
                    vm.error = "<li>" + error + "</li>";
                    updateError();
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
                        vm.error = "<li>" + error + "</li>";
                        updateError();
                    })
            }
        }

        function submitOrder() {
            if (validateOrder()) {
                OrderService.submitOrder(userId, orderId, vm.order)
                    .success(function (order) {
                        if (order.submitted) {
                            vm.order = order;
                            ShoppingCartService.deleteShoppingCart(userId)
                                .success(function (status) {
                                    vm.success = true;
                                    vm.successMsg = "Order is successfully submitted!!! Order Id " + order._id;
                                    onOrderSubmissionSuccess();
                                    $('body').scrollTop(0);
                                })
                                .error(function (error) {
                                    vm.error = "<li>Order could not be sucessfully submitted</li>";
                                    console.log("Could not delete shopping cart");
                                    updateError();
                                })

                        } else {
                            vm.error = "<li>Order could not be sucessfully submitted</li>";
                            updateError();
                        }
                    })
                    .error(function (error) {
                        vm.error = "<li>" + error + "</li>";
                        updateError();
                    })
            }
        }

        function validateOrder() {
            removeErrors();

            var success = true;
            vm.error = "";
            if (vm.order.shippingStreet == undefined || vm.order.shippingStreet == "") {
                vm.error = "<li>Shipping Street cannot be empty</li>";
                $('#fmgrp-staddress').addClass("has-error");
                success = false;
            }
            if (vm.order.shippingCity == undefined || vm.order.shippingCity == "") {
                vm.error = vm.error + "<li>Shipping City cannot be empty</li>";
                $('#fmgrp-city').addClass("has-error");
                success = (success && false);
            }
            if (vm.order.shippingState == undefined || vm.order.shippingState == "") {
                vm.error = vm.error + "<li>Shipping State cannot be empty</li>";
                $('#fmgrp-state').addClass("has-error");
                success = (success && false);
            }
            if (vm.order.shippingZipcode == undefined || vm.order.shippingZipcode == "") {
                vm.error = vm.error + "<li>Shipping Zipcode cannot be empty</li>";
                $('#fmgrp-zipcode').addClass("has-error");
                success = (success && false);
            }

            if (vm.creditcard.cardnum == undefined || vm.creditcard.cardnum == "") {
                vm.error = vm.error + "<li>Card Number cannot be empty</li>";
                $('#cardNum').addClass("has-error");
                success = (success && false);
            } else if (vm.creditcard.cardnum && !(/\d{4}-?\d{4}-?\d{4}-?\d{4}/.test(vm.creditcard.cardnum))) {
                vm.error = vm.error + "<li>Card Number Invalid Format. Use digits XXXX-XXXX-XXXX-XXXX</li>";
                $('#cardNum').addClass("has-error");
                success = (success && false);
            }

            if (vm.creditcard.cardholdername == undefined || vm.creditcard.cardholdername == "") {
                vm.error = vm.error + "<li>Card Holder's Name cannot be empty</li>";
                $('#cardUsrName').addClass("has-error");
                success = (success && false);
            }

            if (vm.creditcard.expirymonth == undefined || vm.creditcard.expirymonth == "") {
                vm.error = vm.error + "<li>Expiry Month cannot be empty</li>";
                $('#expiryMM').addClass("has-error");
                success = (success && false);
            }

            if (vm.creditcard.expiryyear == undefined || vm.creditcard.expiryyear == "") {
                vm.error = vm.error + "<li>Expiry Year cannot be empty</li>";
                $('#expiryYY').addClass("has-error");
                success = (success && false);
            }

            if (vm.creditcard.cvv == undefined || vm.creditcard.cvv == "") {
                vm.error = vm.error + "<li>CVV cannot be empty</li>";
                $('#cvv').addClass("has-error");
                success = (success && false);
            }

            if (success == true) {
                removeErrors();
                vm.error = "";

            } else {
                updateError();
                $('body').scrollTop(0);
            }

            return success;
        }

        function initializeDropdownData(vm) {
            vm.usstates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA",
                "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI",
                "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
                "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
            vm.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            vm.years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
            vm.creditcard = {};
        }

        function updateError() {
            $('#loginerror').empty();
            $('#loginerror').append("<ul class='myPClass'>");
            $('#loginerror').append(vm.error);
            $('#loginerror').append("</ul>");
        }

        function removeErrors() {
            $('#fmgrp-staddress').removeClass("has-error");
            $('#fmgrp-city').removeClass("has-error");
            $('#fmgrp-state').removeClass("has-error");
            $('#fmgrp-zipcode').removeClass("has-error");
            $('#cardNum').removeClass("has-error");
            $('#cardUsrName').removeClass("has-error");
            $('#expiryMM').removeClass("has-error");
            $('#expiryYY').removeClass("has-error");
            $('#cvv').removeClass("has-error");
            $('#loginerror').empty();
        }

        function onOrderSubmissionSuccess() {
            $('#staddress').attr('readonly', true);
            $('#city').attr('readonly', true);
            $('#state').attr('readonly', true);
            $('#zipcode').attr('readonly', true);
            $('#cardNumber').attr('readonly', true);
            $('#cardUsername').attr('readonly', true);
            $('#expiryMonth').attr('disabled', true);
            $('#expiryYear').attr('disabled', true);
            $('#cvvCode').attr('readonly', true);
            var id = $('#cardNumber').val();
            $('#cardNumber').val('XXXX-XXXX-XXXX-' + id.substr(id.length - 4));

        }
    }


})
();
