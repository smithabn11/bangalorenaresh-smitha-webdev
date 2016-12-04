/**
 * Created by smitha on 11/4/16.
 */
module.exports = function (app, models) {

    app.post('/api/shopper/:uid/shoppingcart', createShoppingCart);
    app.get('/api/shopper/:uid/shoppingcart', findShoppingCartByUserId);
    app.put('/api/shopper/:uid/shoppingcart', addItemShoppingCart)
    app.delete('/api/shopper/:uid/shoppingcart/:itemId', removeItemShoppingCart);
    app.delete('/api/shopper/:uid/shoppingcart', deleteShoppingCart);

    var shoppingCartModel = models.shoppingCartModel;

    function createShoppingCart(req, res) {
        var userId = req.params.uid;
        var itemObj = req.body;
        shoppingCartModel.createShoppingCart(userId, itemObj)
            .then(
                function (cart) {
                    res.json(cart);
                },
                function (error) {
                    res.sendStatus(400);
                });

    }

    function findShoppingCartByUserId(req, res) {
        var userId = req.params.uid;
        shoppingCartModel.findShoppingCartByUserId(userId)
            .then(
                function (cart) {
                    res.json(cart);
                },
                function (error) {
                    res.sendStatus(400);
                });
    }

    function addItemShoppingCart(req, res) {
        var userId = req.params.uid;
        var itemObj = req.body;
        shoppingCartModel.addItemShoppingCart(userId, itemObj)
            .then(
                function (status) {
                    if (status) {
                        shoppingCartModel.findShoppingCartByUserId(userId)
                            .then(
                                function (cart) {
                                    res.json(cart);
                                },
                                function (error) {
                                    res.sendStatus(400);
                                });
                    }
                },
                function (error) {
                    res.sendStatus(400);
                });
    }

    function removeItemShoppingCart(req, res) {
        var userId = req.params.uid;
        var itemId = req.params.itemId;
        shoppingCartModel.removeItemShoppingCart(userId, itemId)
            .then(
                function (status) {
                    if (status) {
                        shoppingCartModel.findShoppingCartByUserId(userId)
                            .then(
                                function (cart) {
                                    res.json(cart);
                                },
                                function (error) {
                                    res.sendStatus(400);
                                });
                    }
                },
                function (error) {
                    res.sendStatus(400);
                });
    }


    function deleteShoppingCart(req, res) {
        var userId = req.params.uid;
        shoppingCartModel.deleteShoppingCart(userId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400);
                });

    }
}