/**
 * Created by smitha on 12/2/16.
 */
(function () {
    angular.module("ShoppingAwesome")
        .factory("WishlistService", WishlistService);

    function WishlistService($http) {
        var api = {
            "addItemWishList": addItemWishList,
            "removeItemWishList": removeItemWishList,
            "findWishlistShopper": findWishlistShopper
        };
        return api;

        function addItemWishList(userId, itemId) {
            return $http.put("/api/shopper/" + userId + "/wishlist/" + itemId);
        }

        function removeItemWishList(userId, itemId) {
            return $http.delete("/api/shopper/" + userId + "/wishlist/" + itemId);
        }

        function findWishlistShopper(userId) {
            return $http.get("/api/shopper/" + userId + "/wishlist");
        }
    }
})();