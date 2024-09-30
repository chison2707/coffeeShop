const Product = require("../../models/product.model");

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

    const products = await Product.find(find)
        .sort({ position: 'asc' })
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);
    // console.log(products);
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

    await Product.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');

    res.redirect("back");
}

//[PATCH] / admin/prducts/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm!`);

            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deleteAt: new Date()
            });
            req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, {
                    position: position
                });
            }
            req.flash('success', `Đã đổi vị trí thành công ${ids.length} sản phẩm!`);
            break;
        default:
            break;
    }

    res.redirect("back");
}

//[PATCH] / admin/prducts/delete/:id
module.exports.deleteItem = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    // await Product.deleteOne({ _id: id });
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deleteAt: new Date()
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
    // console.log(products);
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