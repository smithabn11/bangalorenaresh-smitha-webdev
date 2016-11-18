/**
 * Created by smitha on 11/17/16.
 */
module.exports = function (app, models) {

    app.get('/api/shopper/:uid/wishlist', findWishlistShopper);
    app.put('/api/shopper/:uid/wishlist', updateWishlist);
    app.put('/api/shopper/:uid/wishlist/:item', addItemWishlist);
    app.delete('/api/shopper/:uid/wishlist', deleteWishlist);
    app.delete('/api/shopper/:uid/wishlist/:item', deleteItemWishlist);


    var shopperModel = models.shopperModel;

    function findWishlistShopper() {

    }

    function updateWishlist() {

    }

    function addItemWishlist() {

    }

    function deleteWishlist() {

    }

    function deleteItemWishlist() {

    }
}