const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productHelper = require("../../helpers/products");

//[GET] /checkout
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;

            const productInfo = await Product.findOne({
                _id: productId
            });

            productInfo.priceNew = productHelper.priceNewProduct(productInfo);

            item.productInfo = productInfo;

            item.totalPrice = item.quantity * productInfo.priceNew;
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)
    res.render("client/pages/checkout/index", {
        pageTitle: "Trang đặt hàng",
        cart: cart
    });
}

//[POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    const user_id = req.cookies.tokenUser;

    const cart = await Cart.findOne({
        _id: cartId
    });

    let products = [];

    for (const product of cart.products) {
        const objProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity,
            comment: product.comment
        };

        const productInfo = await Product.findOne({
            _id: product.product_id
        });

        objProduct.price = productInfo.price;
        objProduct.discountPercentage = productInfo.discountPercentage;

        products.push(objProduct);
    }

    const objOrder = {
        user_id: user_id,
        cart_id: cartId,
        userInfor: userInfo,
        products: products
    };

    const order = new Order(objOrder);
    await order.save();

    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    });

    res.redirect(`/checkout/success/${order.id}`);
}

//[GET] /checkout/success/:id
module.exports.success = async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.orderId
    });

    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail");

        product.productInfo = productInfo;

        product.priceNew = productHelper.priceNewProduct(product);

        product.totalPrice = product.priceNew * product.quantity;
    }
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công!!!",
        order: order
    });
}