var express = require('express');
var router = express.Router();
const customerPolicyController = require('../../controllers/customer/customer_policy.controller');
const authentication = require('../../middleware/private.middleware');

// Customer Policy endpoints
router.get('/get-customer-policy', authentication, customerPolicyController.getCustomerPolicy);
router.get('/get-customer-policy-detail', authentication, customerPolicyController.getCustomerPolicyDetail);
router.post('/get-billable-options', authentication, customerPolicyController.getBillableOptions);
router.post('/create-customer-policy', authentication, customerPolicyController.createCustomerPolicy);
router.post('/edit-customer-policy', authentication, customerPolicyController.editCustomerPolicy);
router.post('/del-customer-policy', authentication, customerPolicyController.delCustomerPolicy);

module.exports = router;
