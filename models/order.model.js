const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: String,
    cart_id: String,
    userInfor: {
        fullName: String,
        phone: String,
        address: String
    },
    status: {
        type: String,
        default: "pending"
    },
    products: [
        {
            product_id: String,
            price: Number,
            discountPercentage: Number,
            quantity: Number,
            comment: String
        }
    ],
    updateBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ]
}, {
    timestamps: true
});
const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;