const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const Account = require("../../models/account.model");

const productHelper = require("../../helpers/products");
const moment = require("moment");
const Spend = require("../../models/spend.model");

// [GET] /admin/revenue/collect
module.exports.index = async (req, res) => {
    const { startDate, endDate } = req.query;

    // Chuyển đổi ngày từ chuỗi sang định dạng Date
    const start = startDate ? moment(startDate).startOf("day").toDate() : null;
    const end = endDate ? moment(endDate).endOf("day").toDate() : null;

    // Tạo điều kiện lọc
    let filter = { status: "shipped" };
    if (start && end) {
        filter.createdAt = { $gte: start, $lte: end };
    } else if (start) {
        filter.createdAt = { $gte: start };
    } else if (end) {
        filter.createdAt = { $lte: end };
    }

    const orders = await Order.find(filter);

    let totalRevenue = 0;

    for (const o of orders) {
        for (const product of o.products) {
            product.priceNew = productHelper.priceNewProduct(product);
            product.totalPrice = product.priceNew * product.quantity;
        }
        o.totalPrice = o.products.reduce((sum, item) => sum + item.totalPrice, 0);
        totalRevenue += o.totalPrice;

        // Lấy thông tin người tạo
        const user = await User.findOne({
            tokenUser: o.user_id
        }).select("-password");
        if (user) {
            o.createFullName = user.fullName;
            o.emailUser = user.email;
        }
    }

    res.render("admin/pages/Revenue/index", {
        pageTitle: "Quản lý thu",
        order: orders,
        totalRevenue: totalRevenue,
        startDate: start ? moment(start).format("YYYY-MM-DD") : "",
        endDate: end ? moment(end).format("YYYY-MM-DD") : ""
    });
};

// [GET] /admin/revenue
module.exports.select = async (req, res) => {


    res.render("admin/pages/Revenue/select", {
        pageTitle: "Quản lý doanh thu"
    });
};

// [GET] /admin/revenue
module.exports.spend = async (req, res) => {
    const { startDate, endDate } = req.query;
    let totalSpend = 0;
    // Chuyển đổi ngày từ chuỗi sang định dạng Date
    const start = startDate ? moment(startDate).startOf("day").toDate() : null;
    const end = endDate ? moment(endDate).endOf("day").toDate() : null;

    // Tạo điều kiện lọc
    let filter = {};
    if (start && end) {
        filter.createdAt = { $gte: start, $lte: end };
    } else if (start) {
        filter.createdAt = { $gte: start };
    } else if (end) {
        filter.createdAt = { $lte: end };
    }
    const spend = await Spend.find(filter);
    for (const s of spend) {
        const infor = await Account.find({
            token: s.token
        }).select("fullName");
        s.infor = infor;
        totalSpend += s.price;
    }
    res.render("admin/pages/Revenue/spend", {
        pageTitle: "Quản lý chi",
        spend: spend,
        totalSpend: totalSpend,
        startDate: start ? moment(start).format("YYYY-MM-DD") : "",
        endDate: end ? moment(end).format("YYYY-MM-DD") : ""
    });
};

// [GET] /admin/revenue/spend/create
module.exports.spendCreate = async (req, res) => {
    res.render("admin/pages/Revenue/spendCreate", {
        pageTitle: "Tạo mới chi"
    });
};

// [POST] /admin/revenue/spend/create
module.exports.spendCreatePost = async (req, res) => {
    const desc = req.body.desc;
    const price = req.body.price;
    const spend = new Spend({
        token: req.cookies.token,
        desc: desc,
        price: price
    });
    await spend.save();
    req.flash("success", "Bạn đã thêm mới thành công!");
    res.redirect("/admin/revenue/spend");
};