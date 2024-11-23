module.exports.createPost = (req, res, next) => {
    if (!req.body.desc) {
        req.flash('error', 'Vui lòng nhập mô tả chi tiết!');
        res.redirect("back");
        return;
    }
    if (!req.body.price) {
        req.flash('error', 'Vui lòng nhập số tiền chi!');
        res.redirect("back");
        return;
    }
    next();
}