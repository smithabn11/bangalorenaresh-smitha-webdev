/**
 * Created by smitha on 11/17/16.
 */
module.exports = function (app, models) {

    app.get('/api/shopper/:uid/wishlist', findWishlistShopper);
    app.put('/api/shopper/:uid/wishlist', updateWishlist);
    app.put('/api/shopper/:uid/wishlist/:itemId', addItemWishlist);
    app.delete('/api/shopper/:uid/wishlist', deleteWishlist);
    app.delete('/api/shopper/:uid/wishlist/:itemId', deleteItemWishlist);


    var shopperModel = models.shopperModel;

    function findWishlistShopper(req, res) {
        var userId = req.params.uid;


    }

    function updateWishlist(req, res) {

    }

    function addItemWishlist(req, res) {
        var userId = req.params.uid;
        var itemId = req.params.itemId;
        shopperModel.addItemWishlist(userId, itemId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.statusCode(400).send("Unable to update user wishlist");
                }
            );

    }

    function deleteWishlist(req, res) {

    }

    function deleteItemWishlist(req, res) {
        var userId = req.params.uid;
        var itemId = req.params.itemId;
        shopperModel.deleteItemWishlist(userId, itemId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.statusCode(400).send("Unable to update user wishlist");
                }
            );


    }
}