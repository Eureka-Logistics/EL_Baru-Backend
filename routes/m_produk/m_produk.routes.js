var express = require('express');
var router = express.Router();
const produkController = require('../../controllers/m_produk/m_produk.controller')
const authentication = require('../../middleware/private.middleware')

router.get('/get-all-produk', authentication, produkController.getAllProduk);
router.get('/get-detail-produk/:id', authentication, produkController.getDetailProduk);
router.post('/create-produk', authentication, produkController.createProduk);
router.post('/edit-produk', authentication, produkController.editProduk);

module.exports = router;

