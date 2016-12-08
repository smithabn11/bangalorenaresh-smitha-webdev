/**
 * Created by smitha on 12/4/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var OrderSchema = require("./order.schema.server.js")();
    var OrderModel = mongoose.model("OrderModel", OrderSchema);

    var api = {
        createOrder: createOrder,
        findOrdersByUserId: findOrdersByUserId,
        findOrderByOrderId: findOrderByOrderId,
        updateOrderByOrderId: updateOrderByOrderId,
        deleteOrderByOrderId: deleteOrderByOrderId,
        submitOrder: submitOrder
    }

    return api;

    function createOrder(userId, cartObj) {
        var order = {
            _shopper: cartObj._shopper,
            items: [],
            total: cartObj.total
        };

        for (var i = 0; i < cartObj.items.length; i++) {
            order.items.push({
                itemId: cartObj.items[i].itemId,
                quantity: cartObj.items[i].quantity,
                price: cartObj.items[i].price
            })
        }

        return OrderModel.create(order);
    }

    function findOrdersByUserId(userId) {
        return OrderModel.find({_shopper: userId});
    }

    function findOrderByOrderId(userId, orderId) {
        return OrderModel.findOne({_shopper: userId, _id: orderId});
    }

    function updateOrderByOrderId(userId, orderId, orderObj) {
        return OrderModel.update({_shopper: userId, _id: orderId}, {$set: orderObj});
    }

    function deleteOrderByOrderId(userId, orderId) {
        return OrderModel.remove({_shopper: userId, _id: orderId});
    }

    function submitOrder(userId, orderId, orderObj) {
        return OrderModel.update({_shopper: userId, _id: orderId}, {
            $set: {
                items: orderObj.items,
                total: orderObj.total,
                submitted: true,
                shippingStreet: orderObj.shippingStreet,
                shippingCity: orderObj.shippingCity,
                shippingState: orderObj.shippingState,
                shippingZipcode: orderObj.shippingZipcode
            }
        });
    }


}