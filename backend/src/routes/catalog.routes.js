const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');

router.get('/', catalogController.getUnifiedCatalog);

router.get('/:sku', catalogController.getProductBySku);

module.exports = router;