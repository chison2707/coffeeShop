const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require("../../controllers/client/vote.controller");

const authMiddleware = require("../../middlewares/client/auth.middleware");
const upload = multer();
const uploadCould = require("../../middlewares/admin/uploadCloud.middleware");

router.get('/', authMiddleware.requireAuth, controller.index);
router.get('/:id', authMiddleware.requireAuth, controller.vote);
router.patch('/:id/:star', authMiddleware.requireAuth, controller.votePatch);

module.exports = router;