const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

//[GET] / admin/product-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const record = await ProductCategory.find(find);

    const newRecord = createTreeHelper.tree(record)


    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh mục sản phẩm",
        record: newRecord
    });
}

//[GET] / admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    const record = await ProductCategory.find(find);

    const newRecord = createTreeHelper.tree(record)

    res.render("admin/pages/product-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        record: newRecord
    });
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("products-category_create")) {
        res.status(403).send("Bạn không có quyền thêm mới danh mục sản phẩm");
        return;
    } else {
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
}

// [GET] /admin/product-category/edit
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });

        const record = await ProductCategory.find({
            deleted: false
        });


        const newRecord = createTreeHelper.tree(record)

        res.render("admin/pages/product-category/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            record: newRecord
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
};

// [PATCH] /admin/product-category/edit
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    try {
        await ProductCategory.updateOne({ _id: id }, req.body);
        req.flash('success', `Cập nhật thành công!`);

    } catch (error) {
        req.flash('error', `Cập nhật thất bại!`);
    }
    res.redirect("back");
};