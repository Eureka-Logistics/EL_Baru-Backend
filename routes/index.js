var express = require('express');
var router = express.Router();

const cors = require('cors');

// router.use(cors())

router.use(cors({
  origin: '*',
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}))
// router.use(cors());
router.options('*', cors());
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type', 'Origin');
  next();
}
router.use(allowCrossDomain);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'ELOGS API' });
});

router.use('/driver', require('./driver/driver.routes'))
router.use('/sp', require('./sp/sp.routes'))
router.use('/sm', require('./sm/sm.routes'))
router.use('/vehicle', require('./vehicle/vehicle.routes'))
router.use('/monitoring', require('./monitoring/monitoring.routes'))
router.use('/customer', require('./customer/customer.routes'))
router.use('/customer-policy', require('./customer/customer_policy.routes'))
router.use('/auth', require('./auth/auth.routes'))
router.use('/information', require('./information/information.routes'))
router.use('/mitra', require('./mitra/mitra.routes'))
router.use('/ap', require('./AP/ap.routes'))
router.use('/ar', require('./AR/ar.routes'))
router.use('/bu', require('./Busines_Unit/bu.routes'))
router.use('/report', require('./report/report.routes'))
router.use('/wilayah', require('./wilayah/wilayah.routes'))
router.use('/tarif', require('./tarif/tarif.routes'))
router.use('/marketing', require('./marketing/marketing.routes'))
router.use('/user', require('./user/user.routes'))
router.use('/return', require('./Return/return.routes'))
router.use('/uang_jalan', require('./uang_jalan/uang_jalan.routes'))
router.use('/uang_jalan_ptj', require('./uang_jalan/uang_jalan_ptj.routes'))
// router.use('/banner', require('./banner/banner.routes'))
router.use('/banner', require('./banner/banner.routes'))
router.use('/fcm-token', require('./fcm_token/fcm_token.routes'))
router.use('/fcm-cc', require('./fcm_cc/fcm_cc.routes'))
router.use('/darurat', require('./darurat/darurat.routes'))
router.use('/gps', require('./gps/gps.routes'));
router.use('/kendaraan', require('./kendaraan/kendaraan.routes'));
router.use('/track', require('./track/track.routes'));
router.use('/update-status', require('./update_status/update_status.routes'));
router.use('/retur', require('./retur/retur.routes'));
router.use('/maintenance', require('./maintenance/maintenance.routes'));
router.use('/kiriman', require('./kiriman/kiriman.routes'));
router.use('/pool', require('./pool/pool.routes'));
router.use('/pool-qrcode', require('./pool_qrcode/pool_qrcode.routes'));
router.use('/gl', require('./m_gl/m_gl.routes'));
router.use('/asm', require('./m_asm/m_asm.routes'));
router.use('/mgr', require('./m_mgr/m_mgr.routes'));
router.use('/cab', require('./m_cab/m_cab.routes'));
router.use('/sales', require('./m_sales/m_sales.routes'));
router.use('/produk', require('./m_produk/m_produk.routes'));
router.use('/odoo', require('./odoo/odoo.routes'));
router.use('/quotation', require('./quotation/quotation.routes'));
router.use('/quotation-detail', require('./quotation/quotation_detail.routes'));


module.exports = router;
