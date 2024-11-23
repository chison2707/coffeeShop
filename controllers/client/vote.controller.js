const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const Vote = require("../../models/vote.model");

// [GET]/vote
module.exports.index = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const idProducts = [];
    const orders = await Order.find({
        user_id: tokenUser
    }).select("products");
    for (const order of orders) {
        for (const product of order.products) {
            idProducts.push(product.product_id);
        }
    }
    const idProduct = [...new Set(idProducts)];

    const product = await Product.find({
        _id: { $in: idProduct }
    }).select("title thumbnail");

    res.render("client/pages/vote/index", {
        pageTitle: "Đánh giá sản phẩm",
        product: product
    });
}

// [GET]/vote/:id
module.exports.vote = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const product = await Product.findOne({
        _id: req.params.id
    });

    const vote = await Vote.findOne({
        tokenUser: tokenUser,
        product_id: product._id
    });
    if (vote) {
        req.flash('error', "Bạn đã đánh giá sản phẩm này rồi!");
        res.redirect(`/vote`);
    } else {
        res.render("client/pages/vote/vote", {
            pageTitle: "Đánh giá sản phẩm",
            product: product
        });
    }

}

// [PATCH]/vote/:id/:star
module.exports.votePatch = async (req, res) => {
    const idProduct = req.params.id;
    const star = parseInt(req.params.star);
    const desc = req.body.desc;
    const vote = new Vote({
        tokenUser: req.cookies.tokenUser,
        star: star,
        desc: desc,
        product_id: idProduct
    });
    await vote.save();
    req.flash('success', "Đánh giá thành công!");
    res.redirect(`/vote`);
}