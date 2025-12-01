const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, } = require('sequelize');



exports.getDataUangJalanPeriode = async (req, res) => {
    try {
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getUJPeriode = await models.uang_jalan_periode.findAndCountAll(
                {
                    order: [['id_uang_jalan_periode', 'desc']],
                    limit: limit,
                    offset: offset,
                }
            )

            if (getUJPeriode.rows) {
                let no = (getUJPeriode.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getUJPeriode.rows.map((item) => {
                    return {
                        no: no++,
                        id_uang_jalan_periode: item.id_uang_jalan_periode,
                        kode_Periode: item.kode_periode,
                        tgl_Mulai: item.tgl_mulai,
                        tgl_Akhir: item.tgl_akhir,
                        total_Nominal: item.total_nominal
                    }
                })

                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Get Data'
                    },
                    data: {
                        totalData: getUJPeriode.count,
                        totalPage: Math.ceil(getUJPeriode.count / req.query.limit),
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

exports.getDataUangJalanPeriodeDetail = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getUJPeriodeDetail = await models.uang_jalan_periode.findOne(
                {
                    where: {
                        id_uang_jalan_periode: req.query.id_uang_jalan_periode,
                    }
                }
            )

            if (getUJPeriodeDetail) {
                const data = {
                    kode_periode: getUJPeriodeDetail.kode_periode,
                    tgl_mulai: getUJPeriodeDetail.tgl_mulai,
                    tgl_akhir: getUJPeriodeDetail.tgl_akhir,
                    total_nominal: getUJPeriodeDetail.total_nominal,
                    tgl_created: core.moment(getUJPeriodeDetail.tgl_created).format("YYYY-MM-DD HH:mm:ss"),
                }

                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Get Data Detail'
                    },
                    data: data
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

exports.createUangJalanPeriode = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const datenow = core.moment(Date.now()).format('YY')
            const BulanNow = core.moment(Date.now()).format('MM')
            
            const getCode = await models.uang_jalan_periode.findAll(
                {
                    order: [['id_uang_jalan_periode', 'desc']],
                    limit: 1,
                    where: {
                        kode_periode: {
                            [Op.like]: `%P${datenow}%`
                        },
                    }
                }
            )

            if (getCode.length === 0) {
                const createData = await models.uang_jalan_periode.create(
                    {
                        kode_periode: 'P' + datenow + BulanNow + '01',
                        tgl_mulai: req.body.tgl_mulai,
                        tgl_akhir: req.body.tgl_akhir,
                        total_nominal: req.body.total_nominal,
                        id_user: req.user.id,
                        tgl_created: Date.now()
                    }
                )

                if (createData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Sukses berhasil menambahkan data'
                        },
                    }
                }
            } else {
                const getcode = Number(getCode[0].kode_periode.substring(5, 8))
                const CodeUrut = getcode + 1

                const getcharacterNumber = CodeUrut.toString()

                const getTahun = getCode[0].kode_periode.substring(1, 3)
                const getBulan = getCode[0].kode_periode.substring(3, 5)

                if (CodeUrut > 99) {
                    output = {
                        status: {
                            code: 400,
                            message: 'Gagal menginput data kode sudah maks di 99'
                        }
                    }
                } else if (datenow === getTahun & BulanNow === getBulan) {
                    var zeroCode

                    if (getcharacterNumber.length == 1) {
                        var zeroCode = "0"
                    } else if (getcharacterNumber.length == 2) {
                        var zeroCode = ""
                    }

                    const createData = await models.uang_jalan_periode.create(
                        {
                            kode_periode: 'P' + datenow + BulanNow + zeroCode + CodeUrut,
                            tgl_mulai: req.body.tgl_mulai,
                            tgl_akhir: req.body.tgl_akhir,
                            total_nominal: req.body.total_nominal,
                            id_user: req.user.id,
                            tgl_created: Date.now()
                        }
                    )

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Sukses berhasil menambahkan data'
                            },
                        }
                    }
                } else {
                    const createData = await models.uang_jalan_periode.create(
                        {
                            kode_periode: 'P' + datenow + BulanNow + '01',
                            tgl_mulai: req.body.tgl_mulai,
                            tgl_akhir: req.body.tgl_akhir,
                            total_nominal: req.body.total_nominal,
                            id_user: req.user.id,
                            tgl_created: Date.now()
                        }
                    )

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Sukses berhasil menambahkan data'
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

exports.editUangJalanPeriode = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const updateData = await models.uang_jalan_periode.update(
                {
                    tgl_mulai: req.body.tgl_mulai,
                    tgl_akhir: req.body.tgl_akhir,
                    total_nominal: req.body.total_nominal,
                    id_user: req.user.id
                },
                {
                     where: {
                         id_uang_jalan_periode: req.query.id_uang_jalan_periode
                     }
                }
            )

            if (updateData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Sukses berhasil mengubah data'
                    },
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

exports.createUangJalanTransfer = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const dataUangJalanPeriode = await models.uang_jalan_periode.findOne(
                {
                    where: {
                        id_uang_jalan_periode: req.body.id_uang_jalan_periode,
                    }
                }
            )
            
            const getCode = await models.uang_jalan.findOne(
                {
                    where: {
                        kode_tf: {
                            [Op.like]: `%${dataUangJalanPeriode.kode_periode}%`
                        },
                    }
                }
            )

            if (!getCode) {
                const createData = await models.uang_jalan.create(
                    {
                        id_uang_jalan_periode: req.body.id_uang_jalan_periode,
                        kode_tf: dataUangJalanPeriode.kode_periode + '-' + '0001',
                        id_mp: req.body.id_mp,
                        id_driver: req.body.id_driver,
                        norek_penerima: req.body.norek_penerima,
                        tgl_transaksi: req.body.tgl_transaksi,
                        total_nominal: req.body.total_nominal,
                        bbm_muatan: req.body.bbm_muatan,
                        timbangan: req.body.timbangan,
                        tol: req.body.tol,
                        parkir: req.body.parkir,
                        bongkar_muat: req.body.bongkar_muat,
                        makan: req.body.makan,
                        operasional: req.body.operasional,
                        memo: req.body.memo,
                        ptj: req.body.ptj,
                        nominal_ptj: req.body.nominal_ptj,
                        tgl_ptj: req.body.tgl_ptj,
                        ket_ptj: req.body.ket_ptj,
                        date_created: Date.now()
                    }
                )

                if (createData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Sukses berhasil menambahkan data'
                        },
                    }
                }
            } else {
                const getCodeUJ = await models.uang_jalan.findAll(
                    {
                         order: [['id_uang_jalan', 'desc']],
                        limit: 1,
                        where: {
                            kode_tf: {
                                [Op.like]: `%${dataUangJalanPeriode.kode_periode}%`
                            },
                        }
                    }
                )

                const getcode = Number(getCodeUJ[0].kode_tf.substring(8, 12))
                const CodeUrut = getcode + 1

                const getcharacterNumber = CodeUrut.toString()

                if (CodeUrut > 9999) {
                    output = {
                        status: {
                            code: 400,
                            message: 'Gagal menginput data kode sudah maks di 9999'
                        }
                    }
                } else {
                    var zeroCode

                    if (getcharacterNumber.length == 1) {
                        var zeroCode = "000"
                    } else if (getcharacterNumber.length == 2) {
                        var zeroCode = "00"
                    } else if (getcharacterNumber.length == 3) {
                        var zeroCode = "0"
                    } else if (getcharacterNumber.length == 4) {
                        var zeroCode = ""
                    }

                    const createData = await models.uang_jalan.create(
                        {
                            id_uang_jalan_periode: req.body.id_uang_jalan_periode,
                            kode_tf: dataUangJalanPeriode.kode_periode + '-' + zeroCode + CodeUrut,
                            id_mp: req.body.id_mp,
                            id_driver: req.body.id_driver,
                            norek_penerima: req.body.norek_penerima,
                            tgl_transaksi: req.body.tgl_transaksi,
                            total_nominal: req.body.total_nominal,
                            bbm_muatan: req.body.bbm_muatan,
                            timbangan: req.body.timbangan,
                            tol: req.body.tol,
                            parkir: req.body.parkir,
                            bongkar_muat: req.body.bongkar_muat,
                            makan: req.body.makan,
                            operasional: req.body.operasional,
                            memo: req.body.memo,
                            ptj: req.body.ptj,
                            nominal_ptj: req.body.nominal_ptj,
                            tgl_ptj: req.body.tgl_ptj,
                            ket_ptj: req.body.ket_ptj,
                            date_created: Date.now()
                        }
                    )

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Sukses berhasil menambahkan data'
                            },
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