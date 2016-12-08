/**
 * Created by smitha on 12/4/16.
 */
module.exports = function (app, models) {

    app.post('/api/shopper/:uid/shoppingcart/checkout', createOrder);
    app.get('/api/shopper/:uid/order/:oid', findOrderByOrderId);
    app.get('/api/shopper/:uid/myorders', findOrdersByUserId);
    app.put('/api/shopper/:uid/order/:oid', updateOrderByOrderId);
    app.delete('/api/shopper/:uid/order/:oid', deleteOrderByOrderId);
    app.post('/api/shopper/:uid/order/:oid/submit', submitOrder);

    var orderModel = models.orderModel;

    function createOrder(req, res) {
        var userId = req.params.uid;
        var cartObj = req.body;

        orderModel.createOrder(userId, cartObj)
            .then(
                function (order) {
                    res.json(order);
                },
                function (error) {
                    res.sendStatus(400);
                });
    }

    function findOrderByOrderId(req, res) {
        var userId = req.params.uid;
        var orderId = req.params.oid;

        orderModel.findOrderByOrderId(userId, orderId)
            .then(
                function (order) {
                    res.json(order);
                },
                function (error) {
                    res.sendStatus(400);
                });
    }

    function findOrdersByUserId(req, res) {
        var userId = req.params.uid;

        orderModel.findOrdersByUserId(userId)
            .then(
                function (orders) {
                    res.json(orders);
                },
                function (error) {
                    res.sendStatus(400);
                });
    }

    function updateOrderByOrderId(req, res) {
        var userId = req.params.uid;
        var orderId = req.params.oid;
        var orderObj = req.body;

        orderModel.updateOrderByOrderId(userId, orderId, orderObj)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400);
                });

    }

    function deleteOrderByOrderId(req, res) {
        var userId = req.params.uid;
        var orderId = req.params.oid;

        orderModel.deleteOrderByOrderId(userId, orderId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400);
                });
    }

    function submitOrder(req, res) {
        var userId = req.params.uid;
        var orderId = req.params.oid;
        var orderObj = req.body;


        orderModel.submitOrder(userId, orderId, orderObj)
            .then(
                function (status) {
                    orderModel.findOrderByOrderId(userId, orderId)
                        .then(
                            function (order) {
                                if (order.submitted) {
                                    res.json(order);
                                } else {
                                    res.sendStatus(400).send("Order could not be submitted");
                                }
                            },
                            function (error) {
                                res.sendStatus(400).send("Something went wrong submitting order");
                            });
                },
                function (error) {
                    res.sendStatus(400).send("Something went wrong submitting order");
                });
    }


}