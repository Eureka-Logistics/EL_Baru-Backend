const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where, DATE } = require('sequelize');


exports.getReturnList = async (req, res) => {
    try {
        models.m_sm_retur.belongsTo(models.m_sm, { targetKey: 'id_msm', foreignKey: 'id_msm' });
        models.m_sm_retur.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
        models.m_sm_retur.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver' });
        models.m_sm_retur.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit' });
        models.m_sm_retur.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'penerima' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getReturn = await models.m_sm_retur.findAndCountAll(
                {
                    order: [['id_msm_retur', 'desc']],
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.m_sm
                        },
                        {
                            model: models.mitra
                        },
                        {
                            model: models.m_driver
                        },
                        {
                            model: models.kendaraan
                        },
                        {
                            model: models.customer
                        }
                    ]
                }
            )

            if (getReturn.rows) {
                let no = (getReturn.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getReturn.rows.map((item) => {
                    return {
                        no: no++,
                        id_msm_retur: item.id_msm_retur,
                        no_retur: item.no_retur,
                        nama_barang: item.nama_barang,
                        nilai_barang: item.nilai_barang,
                        kategori: item.kategori,
                        keterangan: item.keterangan,
                        penerima: item.customer === null ? '' : item.customer.nama_perusahaan
                    }
                })

                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Get Data'
                    },
                    data: {
                        totalData: getReturn.count,
                        totalPage: Math.ceil(getReturn.count / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        order: result
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

exports.getReturnListDetail = async (req, res) => {
    try {
        models.m_sm_retur.belongsTo(models.m_sm, { targetKey: 'id_msm', foreignKey: 'id_msm' });
        models.m_sm_retur.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
        models.m_sm_retur.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver' });
        models.m_sm_retur.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit' });
        models.m_sm_retur.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'penerima' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getReturn = await models.m_sm_retur.findOne(
                {
                    where: {
                      id_msm_retur: req.query.id_msm_retur  
                    },
                    include: [
                        {
                            model: models.m_sm
                        },
                        {
                            model: models.mitra
                        },
                        {
                            model: models.m_driver
                        },
                        {
                            model: models.kendaraan
                        },
                        {
                            model: models.customer
                        }
                    ]
                }
            )

            if (getReturn) {
                const result = {
                    id_msm_retur: getReturn.id_msm_retur,
                    id_msm: getReturn.id_msm,
                    no_retur: getReturn.no_retur,
                    id_mitra: getReturn.id_mitra,
                    id_unit: getReturn.id_unit,
                    id_driver: getReturn.id_driver,
                    nama_barang: getReturn.nama_barang,
                    berat: getReturn.berat,
                    qty: getReturn.qty,
                    koli: getReturn.koli,
                    nilai_barang: getReturn.nilai_barang,
                    kategori: getReturn.kategori,
                    keterangan: getReturn.keterangan,
                    foto: getReturn.foto,
                    penerima: getReturn.penerima,
                    id_pool: getReturn.id_pool,
                    id_admin: getReturn.id_admin
                }

                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Get Data Detail'
                    },
                    data: {
                        order: result
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

exports.createReturn = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        const getPerusahaan = await models.m_bu.findOne(
            {
                where: {
                    id_bu: getUser.id_bu
                }
            }
        )

        const getCode = await models.m_sm_retur.findAll(
            {
                order: [['id_msm_retur', 'desc']],
                limit: 1,
                where: {
                    no_retur: {
                        [Op.like]: `%${getPerusahaan.id_bu}-RT-%`
                    }
                }
            }
        )

        const dateNow = core.moment(Date.now()).format('YY')

        if (getCode.length === 0) {
            const createData = await models.m_sm_retur.create(
                {
                    id_msm: req.body.id_msm,
                    no_retur: getPerusahaan.id_bu + '-RT-' + dateNow + '-' + '000001',
                    id_mitra: req.body.id_mitra,
                    id_unit: req.body.id_unit,
                    id_driver: req.body.id_driver,
                    nama_barang: req.body.nama_barang,
                    berat: req.body.berat,
                    qty: req.body.qty,
                    koli: req.body.koli,
                    nilai_barang: req.body.nilai_barang,
                    kategori: req.body.kategori,
                    keterangan: req.body.keterangan,
                    foto: null,
                    penerima: req.body.penerima,
                    id_pool: 1,
                    id_admin: getUser.id,
                    date_created: Date.now()
                }
            )
            
            if (createData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Sukses menambahkan data return'
                    }
                }
            }
        } else {
            const getCodeReturn = Number(getCode[0].no_retur.substring(9, 16))
            const codeUrut = getCodeReturn + 1

            const getcharacterNumber = codeUrut.toString()

            const getDate = getCode[0].no_retur.substring(6, 8)

            if (codeUrut > 999999) {
                output = {
                    status: {
                        code: 400,
                        message: 'Gagal menginput data kode sudah maks di 999999'
                    }
                }
            } else {
                if (dateNow === getDate) {
                    var zeroCode

                    if (getcharacterNumber.length == 1) {
                        var zeroCode = "00000"
                    } else if (getcharacterNumber.length == 2) {
                        var zeroCode = "0000"
                    } else if (getcharacterNumber.length == 3) {
                        var zeroCode = "000"
                    } else if (getcharacterNumber.length == 4) {
                        var zeroCode = "00"
                    } else if (getcharacterNumber.length == 5) {
                        var zeroCode = "0"
                    } else if (getcharacterNumber.length == 6) {
                        var zeroCode = ""
                    }

                    const createData = await models.m_sm_retur.create(
                        {
                            id_msm: req.body.id_msm,
                            no_retur: getPerusahaan.id_bu + '-RT-' + dateNow + '-' + zeroCode + codeUrut,
                            id_mitra: req.body.id_mitra,
                            id_unit: req.body.id_unit,
                            id_driver: req.body.id_driver,
                            nama_barang: req.body.nama_barang,
                            berat: req.body.berat,
                            qty: req.body.qty,
                            koli: req.body.koli,
                            nilai_barang: req.body.nilai_barang,
                            kategori: req.body.kategori,
                            keterangan: req.body.keterangan,
                            foto: null,
                            penerima: req.body.penerima,
                            id_pool: 1,
                            id_admin: getUser.id,
                            date_created: Date.now()
                        }
                    )
                
                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Sukses menambahkan data return'
                            }
                        }
                    }
                } else {
                    const createData = await models.m_sm_retur.create(
                        {
                            id_msm: req.body.id_msm,
                            no_retur: getPerusahaan.id_bu + '-RT-' + dateNow + '-' + '000001',
                            id_mitra: req.body.id_mitra,
                            id_unit: req.body.id_unit,
                            id_driver: req.body.id_driver,
                            nama_barang: req.body.nama_barang,
                            berat: req.body.berat,
                            qty: req.body.qty,
                            koli: req.body.koli,
                            nilai_barang: req.body.nilai_barang,
                            kategori: req.body.kategori,
                            keterangan: req.body.keterangan,
                            foto: null,
                            penerima: req.body.penerima,
                            id_pool: 1,
                            id_admin: getUser.id,
                            date_created: Date.now()
                        }
                    )
                    
                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Sukses menambahkan data return'
                            }
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

exports.editReturn = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        const editData = await models.m_sm_retur.update(
            {
                id_msm: req.body.id_msm,
                id_mitra: req.body.id_mitra,
                id_unit: req.body.id_unit,
                id_driver: req.body.id_driver,
                nama_barang: req.body.nama_barang,
                berat: req.body.berat,
                qty: req.body.qty,
                koli: req.body.koli,
                nilai_barang: req.body.nilai_barang,
                kategori: req.body.kategori,
                keterangan: req.body.keterangan,
                foto: null,
                penerima: req.body.penerima
            },
            {
                where: {
                    id_msm_retur: req.query.id_msm_retur
                }
            }
        )
        
        if (editData) {
            output = {
                status: {
                    code: 200,
                    message: 'Sukses mengubah data return'
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