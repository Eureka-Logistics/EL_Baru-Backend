const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize } = require('sequelize');

// Get all data uang jalan PTJ with pagination
exports.getAllUangJalanPTJ = async (req, res) => {
    try {
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const whereCondition = {};

            // Add filters if provided
            if (req.query.id_uang_jalan) {
                whereCondition.id_uang_jalan = req.query.id_uang_jalan;
            }
            if (req.query.id_driver) {
                whereCondition.id_driver = req.query.id_driver;
            }
            if (req.query.id_mp) {
                whereCondition.id_mp = req.query.id_mp;
            }

            const getUJPTJ = await models.uang_jalan_ptj.findAndCountAll({
                where: whereCondition,
                order: [['id_uj_ptj', 'DESC']],
                limit: limit,
                offset: offset,
            });

            if (getUJPTJ.rows) {
                let no = (getUJPTJ.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                const result = getUJPTJ.rows.map((item) => {
                    return {
                        no: no++,
                        id_uj_ptj: item.id_uj_ptj,
                        id_uang_jalan: item.id_uang_jalan,
                        id_driver: item.id_driver,
                        id_mp: item.id_mp,
                        id_unit: item.id_unit,
                        makan_value: item.makan_value,
                        parkir_value: item.parkir_value,
                        tol_value: item.tol_value,
                        timbangan_value: item.timbangan_value,
                        penyeberangan_value: item.penyeberangan_value,
                        overtonase_value: item.overtonase_value,
                        karantina_value: item.karantina_value,
                        kawalan_value: item.kawalan_value,
                        pass_bandara_value: item.pass_bandara_value,
                        user_name: item.user_name,
                        date_created: item.date_created,
                        finance_name: item.finance_name,
                        finance_date: item.finance_date
                    }
                });

                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Get Data'
                    },
                    data: {
                        totalData: getUJPTJ.count,
                        totalPage: Math.ceil(getUJPTJ.count / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        data: result
                    }
                }
            }
        }
    } catch (error) {
        output = {
            status: {
                code: 500,
                message: error.message
            }
        }
    }

    const errorsFromMiddleware = await customErrorMiddleware(req);

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
}

// Get detail uang jalan PTJ by ID
exports.getDetailUangJalanPTJ = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const getUJPTJ = await models.uang_jalan_ptj.findOne({
                where: {
                    id_uj_ptj: req.query.id_uj_ptj
                }
            });

            if (getUJPTJ) {
                const data = {
                    id_uj_ptj: getUJPTJ.id_uj_ptj,
                    id_uang_jalan: getUJPTJ.id_uang_jalan,
                    id_driver: getUJPTJ.id_driver,
                    id_mp: getUJPTJ.id_mp,
                    id_unit: getUJPTJ.id_unit,
                    makan_img: getUJPTJ.makan_img,
                    makan_value: getUJPTJ.makan_value,
                    bbm_img: getUJPTJ.bbm_img,
                    parkir_img: getUJPTJ.parkir_img,
                    parkir_value: getUJPTJ.parkir_value,
                    tol_img: getUJPTJ.tol_img,
                    tol_value: getUJPTJ.tol_value,
                    timbangan_img: getUJPTJ.timbangan_img,
                    timbangan_value: getUJPTJ.timbangan_value,
                    penyeberangan_img: getUJPTJ.penyeberangan_img,
                    penyeberangan_value: getUJPTJ.penyeberangan_value,
                    bongkar_muat_img: getUJPTJ.bongkar_muat_img,
                    overtonase_img: getUJPTJ.overtonase_img,
                    overtonase_value: getUJPTJ.overtonase_value,
                    karantina_img: getUJPTJ.karantina_img,
                    karantina_value: getUJPTJ.karantina_value,
                    kawalan_img: getUJPTJ.kawalan_img,
                    kawalan_value: getUJPTJ.kawalan_value,
                    pass_bandara_img: getUJPTJ.pass_bandara_img,
                    pass_bandara_value: getUJPTJ.pass_bandara_value,
                    user_name: getUJPTJ.user_name,
                    date_created: getUJPTJ.date_created ? core.moment(getUJPTJ.date_created).format("YYYY-MM-DD HH:mm:ss") : null,
                    id_user_ops: getUJPTJ.id_user_ops,
                    ops_date: getUJPTJ.ops_date ? core.moment(getUJPTJ.ops_date).format("YYYY-MM-DD HH:mm:ss") : null,
                    finance_id: getUJPTJ.finance_id,
                    finance_spv: getUJPTJ.finance_spv,
                    finance_name: getUJPTJ.finance_name,
                    finance_date: getUJPTJ.finance_date ? core.moment(getUJPTJ.finance_date).format("YYYY-MM-DD HH:mm:ss") : null
                };

                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Get Data Detail'
                    },
                    data: data
                }
            } else {
                output = {
                    status: {
                        code: 404,
                        message: 'Data tidak ditemukan'
                    }
                }
            }
        }
    } catch (error) {
        output = {
            status: {
                code: 500,
                message: error.message
            }
        }
    }

    const errorsFromMiddleware = await customErrorMiddleware(req);

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
}

// Create new uang jalan PTJ
exports.createUangJalanPTJ = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const createData = await models.uang_jalan_ptj.create({
                id_uang_jalan: req.body.id_uang_jalan || null,
                id_driver: req.body.id_driver || null,
                id_mp: req.body.id_mp || null,
                id_unit: req.body.id_unit || null,
                makan_img: req.body.makan_img || null,
                makan_value: req.body.makan_value || 0,
                bbm_img: req.body.bbm_img || null,
                parkir_img: req.body.parkir_img || null,
                parkir_value: req.body.parkir_value || 0,
                tol_img: req.body.tol_img || null,
                tol_value: req.body.tol_value || 0,
                timbangan_img: req.body.timbangan_img || null,
                timbangan_value: req.body.timbangan_value || 0,
                penyeberangan_img: req.body.penyeberangan_img || null,
                penyeberangan_value: req.body.penyeberangan_value || 0,
                bongkar_muat_img: req.body.bongkar_muat_img || null,
                overtonase_img: req.body.overtonase_img || null,
                overtonase_value: req.body.overtonase_value || 0,
                karantina_img: req.body.karantina_img || null,
                karantina_value: req.body.karantina_value || 0,
                kawalan_img: req.body.kawalan_img || null,
                kawalan_value: req.body.kawalan_value || 0,
                pass_bandara_img: req.body.pass_bandara_img || null,
                pass_bandara_value: req.body.pass_bandara_value || 0,
                user_name: getUser.name,
                date_created: Date.now(),
                id_user_ops: req.body.id_user_ops || null,
                ops_date: req.body.ops_date || null,
                finance_id: req.body.finance_id || null,
                finance_spv: req.body.finance_spv || null,
                finance_name: req.body.finance_name || null,
                finance_date: req.body.finance_date || null
            });

            if (createData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Sukses berhasil menambahkan data'
                    },
                    data: {
                        id_uj_ptj: createData.id_uj_ptj
                    }
                }
            }
        }
    } catch (error) {
        output = {
            status: {
                code: 500,
                message: error.message
            }
        }
    }

    const errorsFromMiddleware = await customErrorMiddleware(req);

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
}

// Update uang jalan PTJ
exports.updateUangJalanPTJ = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const checkData = await models.uang_jalan_ptj.findOne({
                where: {
                    id_uj_ptj: req.query.id_uj_ptj
                }
            });

            if (!checkData) {
                output = {
                    status: {
                        code: 404,
                        message: 'Data tidak ditemukan'
                    }
                }
            } else {
                const updateData = await models.uang_jalan_ptj.update({
                    id_uang_jalan: req.body.id_uang_jalan !== undefined ? req.body.id_uang_jalan : checkData.id_uang_jalan,
                    id_driver: req.body.id_driver !== undefined ? req.body.id_driver : checkData.id_driver,
                    id_mp: req.body.id_mp !== undefined ? req.body.id_mp : checkData.id_mp,
                    id_unit: req.body.id_unit !== undefined ? req.body.id_unit : checkData.id_unit,
                    makan_img: req.body.makan_img !== undefined ? req.body.makan_img : checkData.makan_img,
                    makan_value: req.body.makan_value !== undefined ? req.body.makan_value : checkData.makan_value,
                    bbm_img: req.body.bbm_img !== undefined ? req.body.bbm_img : checkData.bbm_img,
                    parkir_img: req.body.parkir_img !== undefined ? req.body.parkir_img : checkData.parkir_img,
                    parkir_value: req.body.parkir_value !== undefined ? req.body.parkir_value : checkData.parkir_value,
                    tol_img: req.body.tol_img !== undefined ? req.body.tol_img : checkData.tol_img,
                    tol_value: req.body.tol_value !== undefined ? req.body.tol_value : checkData.tol_value,
                    timbangan_img: req.body.timbangan_img !== undefined ? req.body.timbangan_img : checkData.timbangan_img,
                    timbangan_value: req.body.timbangan_value !== undefined ? req.body.timbangan_value : checkData.timbangan_value,
                    penyeberangan_img: req.body.penyeberangan_img !== undefined ? req.body.penyeberangan_img : checkData.penyeberangan_img,
                    penyeberangan_value: req.body.penyeberangan_value !== undefined ? req.body.penyeberangan_value : checkData.penyeberangan_value,
                    bongkar_muat_img: req.body.bongkar_muat_img !== undefined ? req.body.bongkar_muat_img : checkData.bongkar_muat_img,
                    overtonase_img: req.body.overtonase_img !== undefined ? req.body.overtonase_img : checkData.overtonase_img,
                    overtonase_value: req.body.overtonase_value !== undefined ? req.body.overtonase_value : checkData.overtonase_value,
                    karantina_img: req.body.karantina_img !== undefined ? req.body.karantina_img : checkData.karantina_img,
                    karantina_value: req.body.karantina_value !== undefined ? req.body.karantina_value : checkData.karantina_value,
                    kawalan_img: req.body.kawalan_img !== undefined ? req.body.kawalan_img : checkData.kawalan_img,
                    kawalan_value: req.body.kawalan_value !== undefined ? req.body.kawalan_value : checkData.kawalan_value,
                    pass_bandara_img: req.body.pass_bandara_img !== undefined ? req.body.pass_bandara_img : checkData.pass_bandara_img,
                    pass_bandara_value: req.body.pass_bandara_value !== undefined ? req.body.pass_bandara_value : checkData.pass_bandara_value,
                    id_user_ops: req.body.id_user_ops !== undefined ? req.body.id_user_ops : checkData.id_user_ops,
                    ops_date: req.body.ops_date !== undefined ? req.body.ops_date : checkData.ops_date,
                    finance_id: req.body.finance_id !== undefined ? req.body.finance_id : checkData.finance_id,
                    finance_spv: req.body.finance_spv !== undefined ? req.body.finance_spv : checkData.finance_spv,
                    finance_name: req.body.finance_name !== undefined ? req.body.finance_name : checkData.finance_name,
                    finance_date: req.body.finance_date !== undefined ? req.body.finance_date : checkData.finance_date
                }, {
                    where: {
                        id_uj_ptj: req.query.id_uj_ptj
                    }
                });

                if (updateData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Sukses berhasil mengubah data'
                        }
                    }
                }
            }
        }
    } catch (error) {
        output = {
            status: {
                code: 500,
                message: error.message
            }
        }
    }

    const errorsFromMiddleware = await customErrorMiddleware(req);

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
}

// Delete uang jalan PTJ
exports.deleteUangJalanPTJ = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const checkData = await models.uang_jalan_ptj.findOne({
                where: {
                    id_uj_ptj: req.query.id_uj_ptj
                }
            });

            if (!checkData) {
                output = {
                    status: {
                        code: 404,
                        message: 'Data tidak ditemukan'
                    }
                }
            } else {
                const deleteData = await models.uang_jalan_ptj.destroy({
                    where: {
                        id_uj_ptj: req.query.id_uj_ptj
                    }
                });

                if (deleteData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Sukses berhasil menghapus data'
                        }
                    }
                }
            }
        }
    } catch (error) {
        output = {
            status: {
                code: 500,
                message: error.message
            }
        }
    }

    const errorsFromMiddleware = await customErrorMiddleware(req);

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
}
