const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/revenue.controller");
const validate = require("../../validates/admin/spend.validate");

router.get('/', controller.select);
router.get('/collect', controller.index);
router.get('/spend', controller.spend);
router.get('/spend/create', controller.spendCreate);
router.post('/spend/create', validate.createPost, controller.spendCreatePost);

module.exports = router;