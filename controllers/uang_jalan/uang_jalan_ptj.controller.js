const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize } = require('sequelize');

// Get all PTJ with pagination
exports.getAllPTJ = async (req, res) => {
    try {
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        })

        if (getUser) {
            const whereClause = {};
            
            // Filter by id_user if provided
            if (req.query.id_user) {
                whereClause.id_user = req.query.id_user;
            }
            
            // Filter by id_user_ops if provided
            if (req.query.id_user_ops) {
                whereClause.id_user_ops = req.query.id_user_ops;
            }
            
            // Filter by id_uang_jalan if provided
            if (req.query.id_uang_jalan) {
                whereClause.id_uang_jalan = req.query.id_uang_jalan;
            }
            
            // Filter by date range if provided
            if (req.query.start_date && req.query.end_date) {
                whereClause.date_created = {
                    [Op.between]: [
                        new Date(req.query.start_date + ' 00:00:00'),
                        new Date(req.query.end_date + ' 23:59:59')
                    ]
                };
            } else if (req.query.start_date) {
                whereClause.date_created = {
                    [Op.gte]: new Date(req.query.start_date + ' 00:00:00')
                };
            } else if (req.query.end_date) {
                whereClause.date_created = {
                    [Op.lte]: new Date(req.query.end_date + ' 23:59:59')
                };
            }

            const getPTJ = await models.uang_jalan_ptj.findAndCountAll({
                where: whereClause,
                order: [['id_uj_ptj', 'DESC']],
                limit: limit,
                offset: offset
            })

            if (getPTJ.rows) {
                let no = (getPTJ.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getPTJ.rows.map((item) => {
                    return {
                        no: no++,
                        id_uj_ptj: item.id_uj_ptj,
                        id_uang_jalan: item.id_uang_jalan,
                        bbm_img: item.bbm_img,
                        bbm_value: item.bbm_value,
                        makan_img: item.makan_img,
                        makan_value: item.makan_value,
                        parkir_img: item.parkir_img,
                        parkir_value: item.parkir_value,
                        tol_img: item.tol_img,
                        tol_value: item.tol_value,
                        tkbm_img: item.tkbm_img,
                        tkm_value: item.tkm_value,
                        penyeberangan_img: item.penyeberangan_img,
                        penyeberangan_value: item.penyeberangan_value,
                        overtonase_img: item.overtonase_img,
                        overtonase_value: item.overtonase_value,
                        timbangan_img: item.timbangan_img,
                        timbangan_value: item.timbangan_value,
                        pass_bandara_img: item.pass_bandara_img,
                        pass_bandara_value: item.pass_bandara_value,
                        karantina_img: item.karantina_img,
                        karantina_value: item.karantina_value,
                        kawalan_img: item.kawalan_img,
                        kawalan_value: item.kawalan_value,
                        id_user: item.id_user,
                        user_name: item.user_name,
                        date_created: item.date_created ? core.moment(item.date_created).format("YYYY-MM-DD HH:mm:ss") : null,
                        date_updated: item.date_updated ? core.moment(item.date_updated).format("YYYY-MM-DD HH:mm:ss") : null,
                        id_user_ops: item.id_user_ops,
                        ops_name: item.ops_name,
                        ops_apv: item.ops_apv,
                        ops_date: item.ops_date ? core.moment(item.ops_date).format("YYYY-MM-DD HH:mm:ss") : null,
                        id_user_finance: item.id_user_finance,
                        finance_apv: item.finance_apv,
                        finance_name: item.finance_name,
                        finance_date: item.finance_date ? core.moment(item.finance_date).format("YYYY-MM-DD HH:mm:ss") : null
                    }
                })

                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Get Data'
                    },
                    data: {
                        totalData: getPTJ.count,
                        totalPage: Math.ceil(getPTJ.count / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        ptj: result
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

    const errorsFromMiddleware = await customErrorMiddleware(req)

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output)
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
    }
}

// Get PTJ by ID
exports.getPTJById = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        })

        if (getUser) {
            const getPTJ = await models.uang_jalan_ptj.findOne({
                where: {
                    id_uj_ptj: req.query.id_uj_ptj
                }
            })

            if (getPTJ) {
                const data = {
                    id_uj_ptj: getPTJ.id_uj_ptj,
                    id_uang_jalan: getPTJ.id_uang_jalan,
                    bbm_img: getPTJ.bbm_img,
                    bbm_value: getPTJ.bbm_value,
                    makan_img: getPTJ.makan_img,
                    makan_value: getPTJ.makan_value,
                    parkir_img: getPTJ.parkir_img,
                    parkir_value: getPTJ.parkir_value,
                    tol_img: getPTJ.tol_img,
                    tol_value: getPTJ.tol_value,
                    tkbm_img: getPTJ.tkbm_img,
                    tkm_value: getPTJ.tkm_value,
                    penyeberangan_img: getPTJ.penyeberangan_img,
                    penyeberangan_value: getPTJ.penyeberangan_value,
                    overtonase_img: getPTJ.overtonase_img,
                    overtonase_value: getPTJ.overtonase_value,
                    timbangan_img: getPTJ.timbangan_img,
                    timbangan_value: getPTJ.timbangan_value,
                    pass_bandara_img: getPTJ.pass_bandara_img,
                    pass_bandara_value: getPTJ.pass_bandara_value,
                    karantina_img: getPTJ.karantina_img,
                    karantina_value: getPTJ.karantina_value,
                    kawalan_img: getPTJ.kawalan_img,
                    kawalan_value: getPTJ.kawalan_value,
                    id_user: getPTJ.id_user,
                    user_name: getPTJ.user_name,
                    date_created: getPTJ.date_created ? core.moment(getPTJ.date_created).format("YYYY-MM-DD HH:mm:ss") : null,
                    date_updated: getPTJ.date_updated ? core.moment(getPTJ.date_updated).format("YYYY-MM-DD HH:mm:ss") : null,
                    id_user_ops: getPTJ.id_user_ops,
                    ops_name: getPTJ.ops_name,
                    ops_apv: getPTJ.ops_apv,
                    ops_date: getPTJ.ops_date ? core.moment(getPTJ.ops_date).format("YYYY-MM-DD HH:mm:ss") : null,
                    id_user_finance: getPTJ.id_user_finance,
                    finance_apv: getPTJ.finance_apv,
                    finance_name: getPTJ.finance_name,
                    finance_date: getPTJ.finance_date ? core.moment(getPTJ.finance_date).format("YYYY-MM-DD HH:mm:ss") : null
                }

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

    const errorsFromMiddleware = await customErrorMiddleware(req)

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output)
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
    }
}

// Create new PTJ
exports.createPTJ = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        })

        if (getUser) {
            const createData = await models.uang_jalan_ptj.create({
                id_user: req.user.id,
                id_uang_jalan: req.body.id_uang_jalan || null,
                bbm_img: req.body.bbm_img,
                bbm_value: req.body.bbm_value,
                makan_img: req.body.makan_img,
                makan_value: req.body.makan_value,
                parkir_img: req.body.parkir_img,
                parkir_value: req.body.parkir_value,
                tol_img: req.body.tol_img,
                tol_value: req.body.tol_value,
                tkbm_img: req.body.tkbm_img,
                tkm_value: req.body.tkm_value,
                penyeberangan_img: req.body.penyeberangan_img,
                penyeberangan_value: req.body.penyeberangan_value,
                overtonase_img: req.body.overtonase_img,
                overtonase_value: req.body.overtonase_value,
                timbangan_img: req.body.timbangan_img,
                timbangan_value: req.body.timbangan_value,
                pass_bandara_img: req.body.pass_bandara_img,
                pass_bandara_value: req.body.pass_bandara_value,
                karantina_img: req.body.karantina_img,
                karantina_value: req.body.karantina_value,
                kawalan_img: req.body.kawalan_img,
                kawalan_value: req.body.kawalan_value,
                user_name: req.body.user_name,
                id_user_ops: req.body.id_user_ops,
                ops_name: req.body.ops_name,
                ops_apv: req.body.ops_apv,
                ops_date: req.body.ops_date,
                id_user_finance: req.body.id_user_finance,
                finance_apv: req.body.finance_apv,
                finance_name: req.body.finance_name,
                finance_date: req.body.finance_date,
                date_created: Date.now()
            })

            if (createData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Sukses berhasil menambahkan data PTJ'
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

    const errorsFromMiddleware = await customErrorMiddleware(req)

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output)
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
    }
}

// Update PTJ
exports.updatePTJ = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        })

        if (getUser) {
            // Check if PTJ exists
            const getPTJ = await models.uang_jalan_ptj.findOne({
                where: {
                    id_uj_ptj: req.query.id_uj_ptj
                }
            })

            if (!getPTJ) {
                output = {
                    status: {
                        code: 404,
                        message: 'Data PTJ tidak ditemukan'
                    }
                }
            } else {
                const updateData = await models.uang_jalan_ptj.update({
                    id_uang_jalan: req.body.id_uang_jalan,
                    bbm_img: req.body.bbm_img,
                    bbm_value: req.body.bbm_value,
                    makan_img: req.body.makan_img,
                    makan_value: req.body.makan_value,
                    parkir_img: req.body.parkir_img,
                    parkir_value: req.body.parkir_value,
                    tol_img: req.body.tol_img,
                    tol_value: req.body.tol_value,
                    tkbm_img: req.body.tkbm_img,
                    tkm_value: req.body.tkm_value,
                    penyeberangan_img: req.body.penyeberangan_img,
                    penyeberangan_value: req.body.penyeberangan_value,
                    overtonase_img: req.body.overtonase_img,
                    overtonase_value: req.body.overtonase_value,
                    timbangan_img: req.body.timbangan_img,
                    timbangan_value: req.body.timbangan_value,
                    pass_bandara_img: req.body.pass_bandara_img,
                    pass_bandara_value: req.body.pass_bandara_value,
                    karantina_img: req.body.karantina_img,
                    karantina_value: req.body.karantina_value,
                    kawalan_img: req.body.kawalan_img,
                    kawalan_value: req.body.kawalan_value,
                    user_name: req.body.user_name,
                    id_user_ops: req.body.id_user_ops,
                    ops_name: req.body.ops_name,
                    ops_apv: req.body.ops_apv,
                    ops_date: req.body.ops_date,
                    id_user_finance: req.body.id_user_finance,
                    finance_apv: req.body.finance_apv,
                    finance_name: req.body.finance_name,
                    finance_date: req.body.finance_date,
                    date_updated: Date.now()
                }, {
                    where: {
                        id_uj_ptj: req.query.id_uj_ptj
                    }
                })

                if (updateData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Sukses berhasil mengubah data PTJ'
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

    const errorsFromMiddleware = await customErrorMiddleware(req)

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output)
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
    }
}

// Delete PTJ
exports.deletePTJ = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        })

        if (getUser) {
            // Check if PTJ exists
            const getPTJ = await models.uang_jalan_ptj.findOne({
                where: {
                    id_uj_ptj: req.query.id_uj_ptj
                }
            })

            if (!getPTJ) {
                output = {
                    status: {
                        code: 404,
                        message: 'Data PTJ tidak ditemukan'
                    }
                }
            } else {
                const deleteData = await models.uang_jalan_ptj.destroy({
                    where: {
                        id_uj_ptj: req.query.id_uj_ptj
                    }
                })

                if (deleteData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Sukses berhasil menghapus data PTJ'
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

    const errorsFromMiddleware = await customErrorMiddleware(req)

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output)
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
    }
}
