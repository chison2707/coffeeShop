const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

//[GET] / admin/product-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const record = await ProductCategory.find(find);

    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh mục sản phẩm",
        record: record
    });
}

//[GET] / admin/product-category/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/product-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
    });
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const countProducts = await ProductCategory.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const record = new ProductCategory(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);

}