const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productHelper = require("../../helpers/products");

// [POST] /cart/add/:product_id
module.exports.addPost = async (req, res) => {
    const productId = req.params.product_id;
    const quantity = parseInt(req.body.quantity);
    const comment = req.body.comment;
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    const product = await Product.findOne({ _id: productId })
    const existProductInCart = cart.products.find(item => item.product_id === productId);

    if (existProductInCart) {
        const quantityNew = quantity + existProductInCart.quantity;
        if (quantityNew > product.stock) {
            req.flash("error", `Bạn không thể đặt nhiều hơn ${product.stock} sản phẩm!`);
            res.redirect("back");
            return;
        }
        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId,
            "products.comment": comment
        }, {
            $set: {
                "products.$.quantity": quantityNew
            }
        })
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity,
            comment: comment
        }
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart }
            }
        );
    }

    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng!");
    res.redirect("back");
}

// [GET] /cart
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

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cart: cart
    });
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.product_id;

    await Cart.updateOne({
        _id: cartId
    }, {
        "$pull": { products: { "product_id": productId } }
    });

    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");

    res.redirect("back");

}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.product_id;
    const quantity = parseInt(req.params.quantity);

    const product = await Product.findOne({
        _id: productId
    });

    if (quantity < 1 || quantity > product.stock) {
        req.flash("error", `Số lượng phải từ 1 đến ${product.stock} cho sản phẩm ${product.title}`);
        res.redirect("back");
    } else {
        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId
        }, {
            $set: {
                "products.$.quantity": quantity
            }
        })

        req.flash("success", "Đã cập nhật số lượng!");

        res.redirect("back");
    }

}