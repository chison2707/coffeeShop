const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/checkout.controller");
const authMiddleware = require("../../middlewares/client/auth.middleware");

router.get('/', authMiddleware.requireAuth, controller.index);
router.post('/order', authMiddleware.requireAuth, controller.order);
router.get('/success/:orderId', authMiddleware.requireAuth, controller.success);
router.get('/payonl/:orderId', authMiddleware.requireAuth, controller.payOnl);

module.exports = router;