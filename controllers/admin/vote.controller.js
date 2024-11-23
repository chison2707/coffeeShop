const Vote = require("../../models/vote.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
//[GET] / admin/vote
module.exports.index = async (req, res) => {
    const votes = await Vote.find({});

    for (const vote of votes) {
        const user = await User.findOne({
            tokenUser: vote.tokenUser
        }).select("-password");
        const product = await Product.findOne({
            _id: vote.product_id
        }).select("title thumbnail");
        vote.user = user;
        vote.product = product;
    }


    res.render("admin/pages/vote/index", {
        pageTitle: "Danh sách đánh giá",
        votes: votes
    });
}

//[GET] / admin/vote/detail/:id
module.exports.detail = async (req, res) => {
    const vote = await Vote.findById({
        _id: req.params.id
    });
    const product = await Product.findOne({
        _id: vote.product_id
    });
    const user = await User.findOne({
        tokenUser: vote.tokenUser
    }).select("-password");
    vote.product = product;
    vote.user = user;

    res.render("admin/pages/vote/detail", {
        pageTitle: "Danh sách đánh giá",
        vote: vote
    });
}

//[DELETE] / admin/vote/delete/:id
module.exports.delete = async (req, res) => {
    await Vote.deleteOne({ _id: req.params.id })
    req.flash("success", "Xóa đánh giá thành công!");
    res.redirect("back");
}