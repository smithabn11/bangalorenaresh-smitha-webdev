/**
 * Created by smitha on 12/4/16.
 */
(function () {
    angular.module("ShoppingAwesome")
        .factory("OrderService", OrderService);

    function OrderService($http) {
        var api = {
            "checkOut": checkOut,
            "findOrderByOrderId": findOrderByOrderId,
            "deleteOrderByOrderId": deleteOrderByOrderId,
            "submitOrder": submitOrder,
            "findOrdersByUserId": findOrdersByUserId
        }
        return api;

        function checkOut(userId, cartObj) {
            return $http.post("/api/shopper/" + userId + "/shoppingcart/checkout", cartObj);
        }

        function findOrderByOrderId(userId, orderId) {
            return $http.get("/api/shopper/" + userId + "/order/" + orderId);
        }

        function deleteOrderByOrderId(userId, orderId) {
            return $http.delete("/api/shopper/" + userId + "/order/" + orderId);
        }

        function submitOrder(userId, orderId, orderObj) {
            return $http.post("/api/shopper/" + userId + "/order/" + orderId + "/submit", orderObj);
        }

        function findOrdersByUserId(userId){
            return $http.get("/api/shopper/" + userId + "/myorders");
        }
    }
})();