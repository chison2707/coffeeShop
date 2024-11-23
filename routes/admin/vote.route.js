const express = require('express');
const router = express.Router();

const controller = require("../../controllers/admin/vote.controller");


router.get('/', controller.index);
router.get('/detail/:id', controller.detail);
router.delete('/delete/:id', controller.delete);
module.exports = router;