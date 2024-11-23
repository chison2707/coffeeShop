const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
//[GET] / admin/prducts
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    const objSearch = searchHelper(req.query);
    if (objSearch.regex) {
        find.title = objSearch.regex;
    }

    // pagination
    const countProducts = await Product.countDocuments(find);
    let objPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts
    );
    // end pagination

    // sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    // end sort


    const products = await Product.find(find)
        .sort(sort)
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);

    for (const product of products) {
        // lấy thông tin người tạo
        const user = await Account.findOne({
            _id: product.createBy.account_id
        });
        if (user) {
            product.accountFullName = user.fullName;
        }
        // lấy thông tin người cập nhật cuối cùng
        const updatedBy = product.updateBy.slice(-1)[0];
        if (updatedBy) {
            const userUpdate = await Account.findOne({
                _id: updatedBy.account_id
            });
            updatedBy.accountFullName = userUpdate.fullName;
        }
    }
    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objSearch.keyword,
        pagination: objPagination
    });
}

//[PATCH] / admin/prducts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Product.updateOne({ _id: id }, {
        status: status,
        $push: { updateBy: updatedBy }
    });

    req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');

    res.redirect("back");
}

//[PATCH] / admin/prducts/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "active",
                $push: { updateBy: updatedBy }
            });
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm!`);

            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "inactive",
                $push: { updateBy: updatedBy }
            });
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deleteBy: {
                    account_id: res.locals.user.id,
                    deleteAt: new Date()
                }
            });
            req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, {
                    position: position,
                    $push: { updateBy: updatedBy }
                });
            }
            req.flash('success', `Đã đổi vị trí thành công ${ids.length} sản phẩm!`);
            break;
        default:
            break;
    }

    res.redirect("back");
}

//[DELETE] / admin/prducts/delete/:id
module.exports.deleteItem = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    // await Product.deleteOne({ _id: id });
    await Product.updateOne({ _id: id }, {
        deleted: true,
        // deleteAt: new Date()
        deleteBy: {
            account_id: res.locals.user.id,
            deleteAt: new Date()
        }
    });
    req.flash('success', 'Xóa sản phẩm thành công!');

    res.redirect("back");
}

// [GET] /admin/products/listDelete
module.exports.listDelete = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: true
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    const objSearch = searchHelper(req.query);
    if (objSearch.regex) {
        find.title = objSearch.regex;
    }

    // pagination
    const countProducts = await Product.countDocuments(find);
    let objPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts
    );
    // end pagination

    const products = await Product.find(find)
        .sort({ position: 'asc' })
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);

    for (const product of products) {
        const user = await Account.findOne({
            _id: product.deleteBy.account_id
        });
        if (user) {
            product.accountFullName = user.fullName;
        }
    }

    res.render("admin/pages/products/listDelete", {
        pageTitle: "Danh sách các sản phẩm đã xóa",
        products: products,
        filterStatus: filterStatus,
        keyword: objSearch.keyword,
        pagination: objPagination
    });
}

//[DELETE] / admin/products/listDelete/restore:id
module.exports.deleteItemReal = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.deleteOne({ _id: id });
    req.flash('success', 'Xóa sản phẩm thành công!');


    res.redirect("back");
}

//[PATCH] / admin/products/listDelete/delete:id
module.exports.restoreItem = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, {
        deleted: false
    });
    req.flash('success', 'Khôi phục sản phẩm thành công!');


    res.redirect("back");
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    const category = await ProductCategory.find(find);

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        category: newCategory
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createBy = {
        account_id: res.locals.user.id
    }

    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };


        const category = await ProductCategory.find({
            deleted: false

        });

        const newCategory = createTreeHelper.tree(category);

        const product = await Product.findOne(find);

        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {

        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Product.updateOne({ _id: id }, {
            ...req.body,
            $push: { updateBy: updatedBy }
        });
        req.flash('success', `Cập nhật thành công!`);

    } catch (error) {
        req.flash('error', `Cập nhật thất bại!`);
    }
    res.redirect("back");
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);
        // console.log(product);

        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};