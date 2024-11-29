const systemConfig = require("../../config/system");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my-account.route");
const orderRoutes = require("./order.route");
const userRoutes = require("./user.route");
const voteRoutes = require("./vote.route");
const revenueRoutes = require("./revenue.route");

const authController = require("../../controllers/admin/auth.controller");

module.exports = (app) => {
    const PARTH_ADMIN = systemConfig.prefixAdmin;
    app.get(PARTH_ADMIN, authController.login);
    app.use(PARTH_ADMIN + "/dashboard", authMiddleware.requireAuth, dashboardRoutes);

    app.use(PARTH_ADMIN + "/products", authMiddleware.requireAuth, productRoutes);
    app.use(PARTH_ADMIN + "/products-category", authMiddleware.requireAuth, productCategoryRoutes);
    app.use(PARTH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);
    app.use(PARTH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);
    app.use(PARTH_ADMIN + "/auth", authRoutes);
    app.use(PARTH_ADMIN + "/my-account", authMiddleware.requireAuth, myAccountRoutes);
    app.use(PARTH_ADMIN + "/order", authMiddleware.requireAuth, orderRoutes);
    app.use(PARTH_ADMIN + "/user", authMiddleware.requireAuth, userRoutes);
    app.use(PARTH_ADMIN + "/vote", authMiddleware.requireAuth, voteRoutes);
    app.use(PARTH_ADMIN + "/revenue", authMiddleware.requireAuth, revenueRoutes);
}