const Product = require("../../models/product.model");
const productCategory = require("../../models/product-category.model");
const Vote = require("../../models/vote.model");
const User = require("../../models/user.model");

const productsHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/products-category");

//[GET] / products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: 'desc' });

    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
}

//[GET] / products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        };

        const product = await Product.findOne(find);

        if (product.product_category_id) {
            const category = await productCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            });

            product.category = category;
        }

        product.priceNew = productsHelper.priceNewProduct(product);

        const vote = await Vote.find({
            product_id: product.id
        })

        const tbStar = (vote.reduce((sum, v) => sum + v.star, 0)) / vote.length;

        product.tbStar = tbStar;

        for (const v of vote) {
            const user = await User.find({
                tokenUser: v.tokenUser
            }).select("fullName");

            v.user = user;
        }


        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product,
            vote: vote
        });
    } catch (error) {
        res.redirect(`/products`);
    }

}

//[GET] / products/:slugCategory
module.exports.category = async (req, res) => {

    const category = await productCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false
    });

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);

    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
        deleted: false
    }).sort({ position: "desc" });
    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts
    });
}