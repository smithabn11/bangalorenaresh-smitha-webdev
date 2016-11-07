/**
 * Created by smitha on 11/4/16.
 */
(function () {
    angular.module("ShoppingAwesome")
        .factory("SearchService", SearchService);

    function SearchService($http) {
        var api = {
            "searchItem": searchItem,
        };

        return api;

        function searchItem(searchText) {
            // var url = "/api/search?item="+ searchText;
            var apiKey = "hw322tqs9xfk4twrv3anuqdx";
            var url = "http://api.walmartlabs.com/v1/search?query=" + searchText + "&format=json&apiKey=" + apiKey;
            return $http.get(url);
        }
    }
})();