const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

//[GET] /
module.exports.index = async (req, res) => {
    // lấy ra sản phẩm nổi bật
    const productFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(4);

    const newProducts = productsHelper.priceNewProducts(productFeatured);

    // Lấy ra sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" }).limit(4);

    const newProductsNew = productsHelper.priceNewProducts(productsNew);

    // Lấy ra sản phẩm mới nhất
    const productSold = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ sold: "desc" }).limit(4);

    const newproductSold = productsHelper.priceNewProducts(productSold);

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productFeatured: newProducts,
        productsNew: newProductsNew,
        newproductSold: newproductSold
    });
}