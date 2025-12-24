var express = require('express');
var router = express.Router();
const odooController = require('../../controllers/odoo/odoo.controller')
// Tidak menggunakan authentication untuk endpoint dari Odoo (bisa ditambahkan jika diperlukan)
// const authentication = require('../../middleware/private.middleware')

router.post('/create-from-odoo', odooController.createFromOdoo);

module.exports = router;

