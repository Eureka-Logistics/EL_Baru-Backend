const core = require('../../config/core.config');
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');

exports.getCustomerPolicy = async (req, res) => {
  try {
    const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

    const getUser = await models.users.findOne({ where: { id: req.user.id } });
    if (getUser) {
      const data = await models.customer_policy.findAndCountAll({
        distinct: true,
        where: {
          ...req.query.id_customer ? { id_customer: req.query.id_customer } : {}
        },
        limit,
        offset,
        order: [["id_customer_policy", "desc"]]
      });

      output = {
        status: { code: 200, message: 'Success get Data' },
        data
      };
    }
  } catch (error) {
    output = { status: { code: 500, message: error.message } };
  }

  const errorsFromMiddleware = await customErrorMiddleware(req);
  if (!errorsFromMiddleware) {
    res.status(output.status.code).send(output);
  } else {
    res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
  }
};

exports.getCustomerPolicyDetail = async (req, res) => {
  try {
    const getUser = await models.users.findOne({ where: { id: req.user.id } });
    if (getUser) {
      const data = await models.customer_policy.findOne({
        where: {
          ...req.query.id_customer_policy ? { id_customer_policy: req.query.id_customer_policy } : {},
          ...req.query.id_customer ? { id_customer: req.query.id_customer } : {}
        }
      });

      if (data) {
        output = { status: { code: 200, message: 'Success get Data' }, data };
      } else {
        output = { status: { code: 404, message: 'Data not found' } };
      }
    }
  } catch (error) {
    output = { status: { code: 500, message: error.message } };
  }

  const errorsFromMiddleware = await customErrorMiddleware(req);
  if (!errorsFromMiddleware) {
    res.status(output.status.code).send(output);
  } else {
    res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
  }
};

exports.getBillableOptions = async (req, res) => {
  try {
    const getUser = await models.users.findOne({ where: { id: req.user.id } });
    if (getUser) {
      const { id_customer } = req.body;
      if (!id_customer) {
        return res.status(400).json({
          status: { code: 400, message: 'id_customer wajib diisi' }
        });
      }

      const policy = await models.customer_policy.findOne({
        where: { id_customer }
      });

      if (!policy) {
        return res.status(404).json({
          status: { code: 404, message: 'Customer Policy not found' }
        });
      }

      const chargeable = (flag) => String(flag || 'N').toUpperCase() === 'Y';

      const options = [];
      if (chargeable(policy.muat_chargeable)) options.push({ key: 'muat', label: 'Muat', default_price: policy.muat_price });
      if (chargeable(policy.tkbm_chargeable)) options.push({ key: 'tkbm', label: 'TKBM', default_price: policy.tkbm_price });
      if (chargeable(policy.overtonase_chargeable)) options.push({ key: 'overtonase', label: 'Overtonase', default_price: policy.overtonase_price });
      if (chargeable(policy.penyeberangan_chargeable)) options.push({ key: 'penyeberangan', label: 'Penyeberangan', default_price: policy.penyeberangan_price });
      if (chargeable(policy.uang_inap_chargeable)) options.push({ key: 'uang_inap', label: 'Uang Inap', default_price: policy.uang_inap_price });
      if (chargeable(policy.tol_chargeable)) options.push({ key: 'tol', label: 'Tol', default_price: policy.tol_price });
      if (chargeable(policy.timbangan_chargeable)) options.push({ key: 'timbangan', label: 'Timbangan', default_price: policy.timbangan_price });
      if (chargeable(policy.karantina_chargeable)) options.push({ key: 'karantina', label: 'Karantina', default_price: policy.karantina_price });
      if (chargeable(policy.inap_chargeable)) options.push({ key: 'inap', label: 'Inap', default_price: policy.inap_price });
      if (chargeable(policy.bongkar_chargeable)) options.push({ key: 'bongkar', label: 'Bongkar', default_price: policy.bongkar_price });

      return res.status(200).json({
        status: { code: 200, message: 'Success get billable options' },
        data: {
          id_customer_policy: policy.id_customer_policy,
          id_customer: policy.id_customer,
          options
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ status: { code: 500, message: error.message } });
  }
};

exports.createCustomerPolicy = async (req, res) => {
  try {
    const getUser = await models.users.findOne({ where: { id: req.user.id } });
    if (getUser) {
      const created = await models.customer_policy.create({
        id_customer: req.body.id_customer,
        muat_chargeable: req.body.muat_chargeable ?? 'N',
        muat_price: req.body.muat_price ?? 0,
        tkbm_chargeable: req.body.tkbm_chargeable ?? 'N',
        tkbm_price: req.body.tkbm_price ?? 0,
        overtonase_chargeable: req.body.overtonase_chargeable ?? 'N',
        overtonase_price: req.body.overtonase_price ?? 0,
        penyeberangan_chargeable: req.body.penyeberangan_chargeable ?? 'N',
        penyeberangan_price: req.body.penyeberangan_price ?? 0,
        uang_inap_chargeable: req.body.uang_inap_chargeable ?? 'N',
        uang_inap_price: req.body.uang_inap_price ?? 0,
        tol_chargeable: req.body.tol_chargeable ?? 'N',
        tol_price: req.body.tol_price ?? 0,
        timbangan_chargeable: req.body.timbangan_chargeable ?? 'N',
        timbangan_price: req.body.timbangan_price ?? 0,
        karantina_chargeable: req.body.karantina_chargeable ?? 'N',
        karantina_price: req.body.karantina_price ?? 0,
        inap_chargeable: req.body.inap_chargeable ?? 'N',
        inap_price: req.body.inap_price ?? 0,
        bongkar_chargeable: req.body.bongkar_chargeable ?? 'N',
        bongkar_price: req.body.bongkar_price ?? 0,
      });

      if (created) {
        output = { status: { code: 200, message: 'Success create Customer Policy' }, data: created };
      }
    }
  } catch (error) {
    output = { status: { code: 500, message: error.message } };
  }

  const errorsFromMiddleware = await customErrorMiddleware(req);
  if (!errorsFromMiddleware) {
    res.status(output.status.code).send(output);
  } else {
    res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
  }
};

exports.editCustomerPolicy = async (req, res) => {
  try {
    const getUser = await models.users.findOne({ where: { id: req.user.id } });
    if (getUser) {
      const updated = await models.customer_policy.update({
        muat_chargeable: req.body.muat_chargeable ?? 'N',
        muat_price: req.body.muat_price ?? 0,
        tkbm_chargeable: req.body.tkbm_chargeable ?? 'N',
        tkbm_price: req.body.tkbm_price ?? 0,
        overtonase_chargeable: req.body.overtonase_chargeable ?? 'N',
        overtonase_price: req.body.overtonase_price ?? 0,
        penyeberangan_chargeable: req.body.penyeberangan_chargeable ?? 'N',
        penyeberangan_price: req.body.penyeberangan_price ?? 0,
        uang_inap_chargeable: req.body.uang_inap_chargeable ?? 'N',
        uang_inap_price: req.body.uang_inap_price ?? 0,
        tol_chargeable: req.body.tol_chargeable ?? 'N',
        tol_price: req.body.tol_price ?? 0,
        timbangan_chargeable: req.body.timbangan_chargeable ?? 'N',
        timbangan_price: req.body.timbangan_price ?? 0,
        karantina_chargeable: req.body.karantina_chargeable ?? 'N',
        karantina_price: req.body.karantina_price ?? 0,
        inap_chargeable: req.body.inap_chargeable ?? 'N',
        inap_price: req.body.inap_price ?? 0,
        bongkar_chargeable: req.body.bongkar_chargeable ?? 'N',
        bongkar_price: req.body.bongkar_price ?? 0,
      }, {
        where: {
          id_customer_policy: req.body.id_customer_policy
        }
      });

      if (updated) {
        output = { status: { code: 200, message: 'Success update Customer Policy' } };
      }
    }
  } catch (error) {
    output = { status: { code: 500, message: error.message } };
  }

  const errorsFromMiddleware = await customErrorMiddleware(req);
  if (!errorsFromMiddleware) {
    res.status(output.status.code).send(output);
  } else {
    res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
  }
};

exports.delCustomerPolicy = async (req, res) => {
  try {
    const getUser = await models.users.findOne({ where: { id: req.user.id } });
    if (getUser) {
      const deleted = await models.customer_policy.destroy({
        where: { id_customer_policy: req.body.id_customer_policy }
      });

      if (deleted) {
        output = { status: { code: 200, message: 'Success delete Customer Policy' } };
      } else {
        output = { status: { code: 404, message: 'Customer Policy not found' } };
      }
    }
  } catch (error) {
    output = { status: { code: 500, message: error.message } };
  }

  const errorsFromMiddleware = await customErrorMiddleware(req);
  if (!errorsFromMiddleware) {
    res.status(output.status.code).send(output);
  } else {
    res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
  }
};
