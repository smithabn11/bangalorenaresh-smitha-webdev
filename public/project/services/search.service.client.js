/**
 * Created by smitha on 11/4/16.
 */
(function () {
    angular.module("ShoppingAwesome")
        .factory("SearchService", SearchService);

    var apiKey = "hw322tqs9xfk4twrv3anuqdx";
    var thirdPartUrl = "http://api.walmartlabs.com/v1/";
    var maxItemsInOneFetch = 25;

    function SearchService($http) {
        var api = {
            "searchItem": searchItem,
            "itemDetail": itemDetail,
            "lookupItems": lookupItems,
            "setCurrentItem": setCurrentItem,
            "getCurrentItem": getCurrentItem
        };

        return api;

        var currentItem = {}

        function searchItem(searchText, startPageIndex) {
            // var url = "/api/search?item="+ searchText;

            var url = thirdPartUrl + "search?query=" + searchText +
                "&format=json&apiKey=" + apiKey +
                "&numItems=" + maxItemsInOneFetch +
                "&start=" + startPageIndex + "&format=json&callback=JSON_CALLBACK";
            return $http.jsonp(url);
        }

        function itemDetail(itemId) {
            var url = thirdPartUrl + "items/" + itemId + "?apiKey=" + apiKey + "&format=json&callback=JSON_CALLBACK";
            return $http.jsonp(url);
        }

        function lookupItems(itemIds) {
            var url = thirdPartUrl + "items?ids=" + itemIds + "&apiKey=" + apiKey + "&format=json&callback=JSON_CALLBACK";
            return $http.jsonp(url);
        }

        function setCurrentItem(item) {
            currentItem = item;
        }

        function getCurrentItem() {
            return currentItem;
        }

    }
})();