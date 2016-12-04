/**
 * Created by smitha on 12/3/16.
 */
(function () {
    angular.module("ShoppingAwesome")
        .factory("ShoppingCartService", ShoppingCartService);

    function ShoppingCartService($http) {

        var api = {
            "createShoppingCart": createShoppingCart,
            "findShoppingCartByUserId": findShoppingCartByUserId,
            "addItemShoppingCart": addItemShoppingCart,
            "removeItemShoppingCart": removeItemShoppingCart,
            "deleteShoppingCart": deleteShoppingCart
        }
        return api;

        function createShoppingCart(userId, itemObj) {
            return $http.post("/api/shopper/" + userId + "/shoppingcart", itemObj);
        }

        function findShoppingCartByUserId(userId) {
            return $http.get("/api/shopper/" + userId + "/shoppingcart");
        }

        function addItemShoppingCart(userId, itemObj) {
            return $http.put("/api/shopper/" + userId + "/shoppingcart", itemObj);
        }

        function removeItemShoppingCart(userId, itemId) {
            return $http.delete("/api/shopper/" + userId + "/shoppingcart/" + itemId);
        }

        function deleteShoppingCart(userId) {
            return $http.delete("/api/shopper/" + userId + "/shoppingcart");
        }
    }
})();