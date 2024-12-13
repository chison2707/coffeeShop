module.exports.registerPost = (req, res, next) => {
    // Kiểm tra họ tên
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập họ tên!');
        return res.redirect("back");
    }
    const fullNameRegex = /^[a-zA-Z0-9\sÀ-ỹ]+$/;
    if (!fullNameRegex.test(req.body.fullName)) {
        req.flash('error', 'Vui lòng không nhập ký tự đặc biệt!');
        return res.redirect("back");
    }

    // Kiểm tra email
    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        return res.redirect("back");
    }

    // Kiểm tra số điện thoại
    if (!req.body.phone) {
        req.flash('error', 'Vui lòng nhập số điện thoại!');
        return res.redirect("back");
    }
    const phoneRegex = /^(?:\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(req.body.phone)) {
        req.flash('error', 'Số điện thoại không hợp lệ!');
        return res.redirect("back");
    }

    // Kiểm tra mật khẩu
    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        return res.redirect("back");
    }
    if (req.body.password.length < 6) {
        req.flash('error', 'Mật khẩu phải có ít nhất 6 ký tự!');
        return res.redirect("back");
    }
    const passwordRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!passwordRegex.test(req.body.password)) {
        req.flash('error', 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt!');
        return res.redirect("back");
    }

    if (!req.body.confirmPassword) {
        req.flash('error', 'Vui lòng xác nhận lại mật khẩu!');
        return res.redirect("back");
    }
    if (req.body.password !== req.body.confirmPassword) {
        req.flash('error', 'Xác nhận mật khẩu không trùng khớp!');
        return res.redirect("back");
    }

    next();
};


module.exports.loginPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect("back");
        return;
    }
    next();
}


module.exports.forgotPassword = (req, res, next) => {
    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect("back");
        return;
    }
    next();
}

module.exports.resetPasswordPost = (req, res, next) => {
    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect("back");
        return;
    }

    if (!req.body.confirmPassword) {
        req.flash('error', 'Vui lòng xác nhận lại mật khẩu!');
        res.redirect("back");
        return;
    }

    if (req.body.password != req.body.confirmPassword) {
        req.flash('error', 'Xác nhận mật khẩu không trùng khớp');
        res.redirect("back");
        return;
    }
    next();
}


module.exports.changePassword = (req, res, next) => {
    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect("back");
        return;
    }

    if (!req.body.newpassword) {
        req.flash('error', 'Vui lòng mật khẩu mới!');
        res.redirect("back");
        return;
    }

    if (!req.body.confirmNewpassword) {
        req.flash('error', 'Vui lòng xác nhận lại mật khẩu mới!');
        res.redirect("back");
        return;
    }

    if (req.body.newpassword != req.body.confirmNewpassword) {
        req.flash('error', 'Xác nhận mật khẩu mới không trùng khớp');
        res.redirect("back");
        return;
    }
    next();
}