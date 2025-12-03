const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where, DATE } = require('sequelize');


exports.getAPlist = async (req, res) => {
    try {
        models.m_ap.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });

        models.m_ap.hasMany(models.m_ap_detail, {
            foreignKey: {
                name: 'id_ap'
            }
        });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getDataAp = await models.m_ap.findAndCountAll(
                {
                    order: [['id_ap', 'desc']],
                    where: {
                        is_deleted: 0,
                        ...req.query.filterYear ? {
                            no_invoice_ap: {
                                [Op.like]: `%${req.query.filterYear}`
                            },
                        } : {},
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    no_invoice_mitra: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },
                                },
                            ]
                        } : {}
                    },
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.mitra
                        },
                        {
                            model: models.m_ap_detail
                        }
                    ]
                }
            )

            if (getDataAp.rows) {
                let no = (getDataAp.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0

                const result = getDataAp.rows.map((item) => {
                    return {
                        no: no++,
                        id_ap: item.id_ap,
                        no_Invoice_AP: item.no_invoice_ap,
                        tgl_Invoice: core.moment(item.tgl_invoice_ap).format('YYYY-MM-DD hh:mm:ss'),
                        no_Invoice_Mitra: item.no_invoice_mitra,
                        no_Faktur: item.no_faktur,
                        tgl_Terima_Invoice: item.tgl_terima_invoice,
                        via: item.service + " " + item.via,
                        total_Harga: item.total_harga,
                        detail: item.m_ap_details.map((m_ap_detail) => {
                            return {
                                id_apd: m_ap_detail.id_apd,
                                id_msm: m_ap_detail.id_msm,
                                jenis_Angkut: m_ap_detail.jenis_angkut,
                                no_Surat_Jalan: m_ap_detail.no_surat_jalan,
                                tgl_Kirim: core.moment(m_ap_detail.tgl_kirim).format('YYYY-MM-DD hh:mm:ss'),
                                tgl_Terima: core.moment(m_ap_detail.tgl_terima).format('YYYY-MM-DD hh:mm:ss'),
                                subTotal: m_ap_detail.subtotal
                            }
                        })
                    }
                })

                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Get Data'
                    },
                    data: {
                        totalData: getDataAp.count,
                        totalPage: Math.ceil(getDataAp.count / req.query.limit),
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

exports.getAPDetail = async (req, res) => {
    try {
        models.m_ap.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
        models.m_ar.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });

        models.m_ap.hasMany(models.m_ap_detail, {
            foreignKey: {
                name: 'id_ap'
            }
        });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getAPDetail = await models.m_ap.findOne(
                {
                    where: {
                        id_ap: req.query.id_ap
                    },
                    include: [
                        {
                            model: models.mitra
                        },
                        {
                            model: models.m_ap_detail
                        }
                    ]
                }
            )

            if (getAPDetail) {
                const result = {
                    id_ap: getAPDetail.id_ap,
                    id_mitra: getAPDetail.id_mitra,
                    no_invoice_mitra: getAPDetail.no_invoice_mitra,
                    mitra: getAPDetail.mitra.nama_mitra,
                    no_invoice_ap: getAPDetail.no_invoice_ap,
                    tgl_invoice_ap: getAPDetail.tgl_invoice_ap,
                    no_faktur: getAPDetail.no_faktur,
                    tgl_terima_invoice: getAPDetail.tgl_terima_invoice,
                    via: getAPDetail.service + " " + getAPDetail.via,
                    top: getAPDetail.top,
                    ppn: getAPDetail.ppn,
                    pph: getAPDetail.pph,
                    jenis_pph: getAPDetail.jenis_pph,
                    biaya_lain: getAPDetail.biaya_lain,
                    total_harga: getAPDetail.total_harga,
                    total_biaya_noppn: getAPDetail.total_biaya_noppn,
                    total_biaya_nopph: getAPDetail.total_biaya_nopph,
                    total_ppn: getAPDetail.total_ppn,
                    total_pph: getAPDetail.total_pph,
                    total_keseluruhan: getAPDetail.total_keseluruhan,
                    ket_biayalain: getAPDetail.ket_biayalain,
                    memo: getAPDetail.memo,
                    // detail: getARDetail.m_ar_details.map((m_ar_detail) => {
                    //     return {
                    //         id_ard: m_ar_detail.id_ard,
                    //         id_msm: m_ar_detail.id_msm,
                    //         msm: m_ar_detail.msm,
                    //         items: m_ar_detail.items,
                    //         tgl_Berangkat: m_ar_detail.tgl_berangkat,
                    //         tgl_Tiba: m_ar_detail.tgl_tiba,
                    //         total_Harga: m_ar_detail.total_harga,
                    //         total_Tagihan: m_ar_detail.total_tagihan,
                    //         no_Kwitansi: m_ar_detail.no_kwitansi,
                    //         tgl_Pembayaran: core.moment(m_ar_detail.tgl_pembayaran).format('YYYY-MM-DD hh:mm:ss'),
                    //     }
                    // })
                }

                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Get Data Detail'
                    },
                    data: {
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

    const errorsFromMiddleware = await customErrorMiddleware(req)

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output)
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
    }
}

exports.createAP = async (req, res) => {
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

        const getCode = await models.m_ap.findAll(
            {
                order: [['id_ap', 'desc']],
                limit: 1,
                where: {
                    no_invoice_ap: {
                        [Op.like]: `%${getPerusahaan.id_bu}-AP-%`
                    }
                }
            }
        )

        const dateNow = core.moment(Date.now()).format('YY')

        if (getCode.length === 0) {
            const createData = await models.m_ap.create(
                {
                    'id_mitra': req.body.id_mitra,
                    'no_invoice_ap': getPerusahaan.id_bu + "-AP-" + dateNow + "-" + "000001",
                    'tgl_invoice_ap': Date.now(),
                    'no_invoice_mitra': req.body.no_invoice_mitra,
                    'no_faktur': req.body.no_faktur,
                    'referensi_id_ap': 0,
                    'referensi_ap': "",
                    'referensi_type': "",
                    'referensi_invoice': "",
                    'referensi_nominal': 0,
                    'referensi_note': "",
                    'tgl_terima_invoice': req.body.tgl_terima_invoice,
                    'service': req.body.service,
                    'via': req.body.via,
                    'top': req.body.top,
                    'ppn': req.body.ppn,
                    'pph': req.body.pph,
                    'jenis_pph': req.body.jenis_pph,
                    'biaya_lain': req.body.biaya_lain,
                    'total_harga': "",
                    'total_biaya_noppn': 0,
                    'total_biaya_nopph': 0,
                    'total_ppn': 0,
                    'total_pph': 0,
                    'total_keseluruhan': 0,
                    'ket_biayalain': req.body.ket_biayalain,
                    'memo': req.body.memo,
                    'tgl_create': Date.now(),
                    'tgl_update': Date.now(),
                    'id_user': getUser.id,
                    'custom_id': 0,
                    'purchase_invoice_id': null,
                    'purchase_addon_invoice_id': null,
                    'is_deleted': 0,
                }
            )

            if (createData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Sukses Tambah Data AP'
                    },
                }
            }
        } else {
            const getCodeAP = Number(getCode[0].no_invoice_ap.substring(9, 16))
            const codeAP = getCodeAP + 1

            const getcharacterNumber = codeAP.toString()

            const getDate = getCode[0].no_invoice_ap.substring(6, 8)

            if (codeAP > 999999) {
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

                    const createData = await models.m_ap.create(
                        {
                            'id_mitra': req.body.id_mitra,
                            'no_invoice_ap': getPerusahaan.id_bu + "-AP-" + getDate + "-" + zeroCode + codeAP,
                            'tgl_invoice_ap': Date.now(),
                            'no_invoice_mitra': req.body.no_invoice_mitra,
                            'no_faktur': req.body.no_faktur,
                            'referensi_id_ap': 0,
                            'referensi_ap': "",
                            'referensi_type': "",
                            'referensi_invoice': "",
                            'referensi_nominal': 0,
                            'referensi_note': "",
                            'tgl_terima_invoice': req.body.tgl_terima_invoice,
                            'service': req.body.service,
                            'via': req.body.via,
                            'top': req.body.top,
                            'ppn': req.body.ppn,
                            'pph': req.body.pph,
                            'jenis_pph': req.body.jenis_pph,
                            'biaya_lain': req.body.biaya_lain,
                            'total_harga': "",
                            'total_biaya_noppn': 0,
                            'total_biaya_nopph': 0,
                            'total_ppn': 0,
                            'total_pph': 0,
                            'total_keseluruhan': 0,
                            'ket_biayalain': req.body.ket_biayalain,
                            'memo': req.body.memo,
                            'tgl_create': Date.now(),
                            'tgl_update': Date.now(),
                            'id_user': getUser.id,
                            'custom_id': 0,
                            'purchase_invoice_id': null,
                            'purchase_addon_invoice_id': null,
                            'is_deleted': 0,
                        }
                    )

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Sukses Tambah Data AP'
                            },
                        }
                    }
                } else {
                    const createData = await models.m_ap.create(
                        {
                            'id_mitra': req.body.id_mitra,
                            'no_invoice_ap': getPerusahaan.id_bu + "-AP-" + dateNow + "-" + "000001",
                            'tgl_invoice_ap': Date.now(),
                            'no_invoice_mitra': req.body.no_invoice_mitra,
                            'no_faktur': req.body.no_faktur,
                            'referensi_id_ap': 0,
                            'referensi_ap': "",
                            'referensi_type': "",
                            'referensi_invoice': "",
                            'referensi_nominal': 0,
                            'referensi_note': "",
                            'tgl_terima_invoice': req.body.tgl_terima_invoice,
                            'service': req.body.service,
                            'via': req.body.via,
                            'top': req.body.top,
                            'ppn': req.body.ppn,
                            'pph': req.body.pph,
                            'jenis_pph': req.body.jenis_pph,
                            'biaya_lain': req.body.biaya_lain,
                            'total_harga': "",
                            'total_biaya_noppn': 0,
                            'total_biaya_nopph': 0,
                            'total_ppn': 0,
                            'total_pph': 0,
                            'total_keseluruhan': 0,
                            'ket_biayalain': req.body.ket_biayalain,
                            'memo': req.body.memo,
                            'tgl_create': Date.now(),
                            'tgl_update': Date.now(),
                            'id_user': getUser.id,
                            'custom_id': 0,
                            'purchase_invoice_id': null,
                            'purchase_addon_invoice_id': null,
                            'is_deleted': 0,
                        }
                    )

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Sukses Tambah Data AP'
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

exports.editAP = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const editData = await models.m_ap.update(
                {
                    'id_mitra': req.body.id_mitra,
                    'no_invoice_mitra': req.body.no_invoice_mitra,
                    'no_faktur': req.body.no_faktur,
                    // 'referensi_id_ap': 0,
                    // 'referensi_ap': "",
                    // 'referensi_type': "",
                    // 'referensi_invoice': "",
                    // 'referensi_nominal': 0,
                    // 'referensi_note': "",
                    'tgl_terima_invoice': req.body.tgl_terima_invoice,
                    'service': req.body.service,
                    'via': req.body.via,
                    'top': req.body.top,
                    'ppn': req.body.ppn,
                    'pph': req.body.pph,
                    'jenis_pph': req.body.jenis_pph,
                    'biaya_lain': req.body.biaya_lain,
                    // 'total_harga': "",
                    // 'total_biaya_noppn': 0,
                    // 'total_biaya_nopph': 0,
                    // 'total_ppn': 0,
                    // 'total_pph': 0,
                    // 'total_keseluruhan': 0,
                    'ket_biayalain': req.body.ket_biayalain,
                    'memo': req.body.memo,
                    // 'tgl_create': Date.now(),
                    'tgl_update': Date.now(),
                    'id_user': getUser.id,
                    // 'custom_id': 0,
                    // 'purchase_invoice_id': null,
                    // 'purchase_addon_invoice_id': null,
                    // 'is_deleted': 0,
                },
                {
                    where: {
                        id_ap: req.query.id_ap
                    }
                }
            )

            if (editData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Sukses Edit Data AP'
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



exports.createAPDetail = async (req, res) => {
    try {
        const getSM = await models.m_sm.findOne(
            {
                where: {
                    id_msm: req.body.id_msm
                }
            }
        )

        const createData = await models.m_ap_detail.create(
            {
                'id_ap': req.query.id_ap,
                'id_mpod': 1,
                'jenis_angkut': req.body.jenis_angkut,
                'no_surat_jalan': req.body.no_surat_jalan,
                'id_msm': req.body.id_msm,
                'sumber': "elogs",
                'tgl_kirim': req.body.tgl_kirim,
                'tgl_terima': req.body.tgl_terima,
                'berat': getSM.berat,
                'volume': 0,
                'qty': getSM.qty,
                'berdasarkan': "all",
                'berdasarkan_addon': "all",
                'harga': req.body.harga,
                'overtonase': req.body.overtonase,
                'biaya_overtonase': req.body.biaya_overtonase,
                'biaya_bongkar': req.body.biaya_bongkar,
                'biaya_bongkar_addon': req.body.biaya_bongkar_addon,
                'biaya_muat': req.body.biaya_muat,
                'biaya_multidrop': req.body.biaya_multidrop,
                'biaya_inap': req.body.biaya_inap,
                'biaya_mel': req.body.biaya_mel,
                'biaya_putar': req.body.biaya_putar,
                'biaya_insentif': req.body.biaya_insentif,
                'biaya_lain': req.body.biaya_lain,
                'potongan_bongkar': req.body.potongan_bongkar,
                'potongan_overtonase': req.body.potongan_overtonase,
                'potongan_multidrop': req.body.potongan_multidrop,
                'potongan_inap': req.body.potongan_inap,
                'potongan_rusak': req.body.potongan_rusak,
                'potongan_biaya_sewa': req.body.potongan_biaya_sewa,
                'potongan_lain': req.body.potongan_lain,
                'asuransi': req.body.asuransi,
                'biaya_noppn': req.body.biaya_noppn,
                'biaya_nopph': req.body.biaya_nopph,
                'jumlah_harga': req.body.jumlah_harga,
                'jumlah_biaya': req.body.jumlah_biaya,
                'jumlah_potongan': req.body.jumlah_potongan,
                'subtotal': req.body.subtotal,
                'tgl_update': Date.now(),
            }
        )

        if (createData) {
            output = {
                status: {
                    code: 200,
                    message: 'Sukses Tambah Data AP Detail'
                },
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

exports.getDetailAP = async (req, res) => {
    try {
        models.m_ap_detail.belongsTo(models.m_ap, { targetKey: 'id_ap', foreignKey: 'id_ap' });
        models.m_ap_detail.belongsTo(models.m_sm, { targetKey: 'id_msm', foreignKey: 'id_msm' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getAPDetail = await models.m_ap_detail.findOne(
                {
                    where: {
                        id_apd: req.query.id_apd
                    },
                    include: [
                        {
                            model: models.m_ap
                        },
                        {
                            model: models.m_sm
                        }
                    ]
                }
            )

            if (getAPDetail) {
                const result = {
                    id_apd: getAPDetail.id_apd,
                    jenis_angkut: getAPDetail.jenis_angkut,
                    no_surat_jalan: getAPDetail.no_surat_jalan,
                    sumber: getAPDetail.sumber,
                    tgl_kirim: getAPDetail.tgl_kirim,
                    tgl_terima: getAPDetail.tgl_terima,
                    berat: getAPDetail.berat,
                    volume: getAPDetail.volume,
                    qty: getAPDetail.qty,
                    harga: getAPDetail.harga,
                    overtonase: getAPDetail.overtonase,
                    biaya_overtonase: getAPDetail.biaya_overtonase,
                    biaya_bongkar: getAPDetail.biaya_bongkar,
                    biaya_bongkar_addon: getAPDetail.biaya_bongkar_addon,
                    biaya_muat: getAPDetail.biaya_muat,
                    biaya_multidrop: getAPDetail.biaya_multidrop,
                    biaya_inap: getAPDetail.biaya_inap,
                    biaya_mel: getAPDetail.biaya_mel,
                    biaya_putar: getAPDetail.biaya_putar,
                    biaya_insentif: getAPDetail.biaya_insentif,
                    biaya_lain: getAPDetail.biaya_lain,
                    potongan_bongkar: getAPDetail.potongan_bongkar,
                    potongan_overtonase: getAPDetail.potongan_overtonase,
                    potongan_multidrop: getAPDetail.potongan_multidrop,
                    potongan_inap: getAPDetail.potongan_inap,
                    potongan_rusak: getAPDetail.potongan_rusak,
                    potongan_biaya_sewa: getAPDetail.potongan_biaya_sewa,
                    potongan_lain: getAPDetail.potongan_lain,
                    asuransi: getAPDetail.asuransi,
                    biaya_noppn: getAPDetail.biaya_noppn,
                    biaya_nopph: getAPDetail.biaya_nopph,
                    jumlah_harga: getAPDetail.jumlah_harga,
                    jumlah_biaya: getAPDetail.jumlah_biaya,
                    jumlah_potongan: getAPDetail.jumlah_potongan,
                    subtotal: getAPDetail.subtotal,
                    dataAP: {
                        id_ap: getAPDetail.id_ap,
                        no_invoice_ap: getAPDetail.m_ap.no_invoice_ap,
                        tgl_invoice_ap: getAPDetail.m_ap.tgl_invoice_ap,
                        no_faktur: getAPDetail.m_ap.no_faktur,
                        tgl_terima_invoice: getAPDetail.m_ap.tgl_terima_invoice,
                        via: getAPDetail.m_ap.service + ' ' + getAPDetail.m_ap.via,
                        total_harga: getAPDetail.m_ap.total_harga,
                    },
                    dataSM: {
                        id_msm: getAPDetail.id_msm,
                        msm: getAPDetail.m_sm.msm,
                        tgl_muat: getAPDetail.m_sm.tgl_muat,
                        tgl_bongkar: getAPDetail.m_sm.tgl_bongkar,
                        tgl_terima_inv: getAPDetail.m_sm.tgl_terima_inv,
                    }
                }

                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Get Data Detail'
                    },
                    data: {
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

    const errorsFromMiddleware = await customErrorMiddleware(req)

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output)
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
    }
}

exports.editAPDetail = async (req, res) => {
    try {
        const getSM = await models.m_sm.findOne(
            {
                where: {
                    id_msm: req.body.id_msm
                }
            }
        )

        const editData = await models.m_ap_detail.update(
            {
                'id_ap': req.body.id_ap,
                'jenis_angkut': req.body.jenis_angkut,
                'no_surat_jalan': req.body.no_surat_jalan,
                'id_msm': req.body.id_msm,
                'tgl_kirim': req.body.tgl_kirim,
                'tgl_terima': req.body.tgl_terima,
                'berat': getSM.berat,
                'volume': 0,
                'qty': getSM.qty,
                'harga': req.body.harga,
                'overtonase': req.body.overtonase,
                'biaya_overtonase': req.body.biaya_overtonase,
                'biaya_bongkar': req.body.biaya_bongkar,
                'biaya_bongkar_addon': req.body.biaya_bongkar_addon,
                'biaya_muat': req.body.biaya_muat,
                'biaya_multidrop': req.body.biaya_multidrop,
                'biaya_inap': req.body.biaya_inap,
                'biaya_mel': req.body.biaya_mel,
                'biaya_putar': req.body.biaya_putar,
                'biaya_insentif': req.body.biaya_insentif,
                'biaya_lain': req.body.biaya_lain,
                'potongan_bongkar': req.body.potongan_bongkar,
                'potongan_overtonase': req.body.potongan_overtonase,
                'potongan_multidrop': req.body.potongan_multidrop,
                'potongan_inap': req.body.potongan_inap,
                'potongan_rusak': req.body.potongan_rusak,
                'potongan_biaya_sewa': req.body.potongan_biaya_sewa,
                'potongan_lain': req.body.potongan_lain,
                'asuransi': req.body.asuransi,
                'biaya_noppn': req.body.biaya_noppn,
                'biaya_nopph': req.body.biaya_nopph,
                'jumlah_harga': req.body.jumlah_harga,
                'jumlah_biaya': req.body.jumlah_biaya,
                'jumlah_potongan': req.body.jumlah_potongan,
                'subtotal': req.body.subtotal,
                'tgl_update': Date.now(),
            },
            {
                where: {
                    id_apd: req.query.id_apd
                }
            }
        )

        if (editData) {
            output = {
                status: {
                    code: 200,
                    message: 'Sukses Edit Data AP Detail'
                },
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

// exports.getSelectAP = async (req, res) => {
//     try {
//         const getUser = await models.users.findOne(
//             {
//                 where: {
//                     id: req.user.id
//                 }
//             }
//         )
//         if (getUser) {
//             // const dataUser = await models.users.findOne(
//             //     {
//             //         where: {
//             //             id: req.user.id
//             //         }
//             //     }
//             // )

//             const getSJ = await models.m_sm.findAll(
//                 {
//                     ...req.query.mitraId ? {
//                         where: {

//                             [Op.or]: [
//                                 {
//                                     id_mitra_pickup: req.query.mitraId
//                                 },
//                                 {
//                                     id_mitra: req.query.mitraId
//                                 },
//                                 {
//                                     id_mitra_2: req.query.mitraId
//                                 },
//                             ],
//                             ...req.query.keyword ? {
//                                 msm: { [Op.like]: `%${req.query.keyword}%` }
//                             } : {},
//                         }
//                     } : {},
//                     order: [['id_msm', 'desc']],
//                     limit: 150
//                 }
//             )

//             const getMitra = await models.mitra.findAll(
//                 {
//                     where: {
//                         status: 1
//                     }
//                 }
//             )

//             const getDataPerusahaan = await models.users.findOne(
//                 {
//                     where: {
//                         id: req.user.id
//                     }
//                 }
//             )
//             const perusahaanUser = getDataPerusahaan.perusahaan
//             const yearNow = core.moment(Date.now()).format("YYYY")

//             const getNoInvoice = await models.m_ap.findOne(
//                 {
//                     order: [['id_ap', 'desc']],
//                     limit: 1,
//                     where: {
//                         no_invoice_ap: {
//                             [Op.like]: `%${perusahaanUser}%`
//                         }
//                     }
//                 }
//             )

//             var date;
//             if (core.moment(Date.now()).format('M') == 1) {
//                 date = "I"
//             }
//             if (core.moment(Date.now()).format('M') == 2) {
//                 date = "II"
//             }
//             if (core.moment(Date.now()).format('M') == 3) {
//                 date = "III"
//             }
//             if (core.moment(Date.now()).format('M') == 4) {
//                 date = "IV"
//             }
//             if (core.moment(Date.now()).format('M') == 5) {
//                 date = "V"
//             }
//             if (core.moment(Date.now()).format('M') == 6) {
//                 date = "VI"
//             }
//             if (core.moment(Date.now()).format('M') == 7) {
//                 date = "VII"
//             }
//             if (core.moment(Date.now()).format('M') == 8) {
//                 date = "VIII"
//             }
//             if (core.moment(Date.now()).format('M') == 9) {
//                 date = "IX"
//             }
//             if (core.moment(Date.now()).format('M') == 10) {
//                 date = "X"
//             }
//             if (core.moment(Date.now()).format('M') == 11) {
//                 date = "XI"
//             }
//             if (core.moment(Date.now()).format('M') == 12) {
//                 date = "XII"
//             }

//             // console.log("🚀 ~ file: ap.controller.js:148 ~ exports.createAP= ~ getNoInvoice:", getNoInvoice.no_invoice_ap)
//             const getNumberInvoice = Number(getNoInvoice.no_invoice_ap.substring(0, 4))
//             // console.log("🚀 ~ file: ap.controller.js:152 ~ exports.createAP= ~ getNumberInvoice:", getNumberInvoice)
//             const getcharacterNumber = getNumberInvoice.toString()
//             const numberCode = getNumberInvoice + 1
//             // console.log("🚀 ~ file: ap.controller.js:155 ~ exports.createAP= ~ numberCode:", numberCode)
//             const getYear = getNoInvoice.no_invoice_ap.substring(16, 20)
//             // console.log("🚀 ~ file: ap.controller.js:157 ~ exports.createAP= ~ getYear:", getYear)
//             const invoice = numberCode + "/" + "AP" + "/" + getDataPerusahaan.perusahaan + "/" + date + "/" + core.moment(Date.now()).format("YYYY")

//             if (getMitra) {
//                 const response = {

//                     PT: getDataPerusahaan.perusahaan,
//                     IdUser: getDataPerusahaan.id,
//                     namaUser: getDataPerusahaan.nama_lengkap,
//                     NoInvoice: yearNow == core.moment(Date.now()).format("YYYY") ? invoice : "0001" + "/" + "AP" + "/" + getDataPerusahaan.perusahaan + "/" + date + "/" + core.moment(Date.now()).format("YYYY"),

//                     mitra: getMitra.map((i) => {
//                         return {
//                             value: i.id_mitra,
//                             mitra: i.kode_mitra + " / " + i.nama_mitra
//                         }
//                     }),

//                     sj: req.query.mitraId ? getSJ.map((i) => {
//                         return {
//                             smId: i.id_msm,
//                             sj: i.msm
//                         }
//                     }) : {},
//                     via: [
//                         {
//                             "via": "Darat"
//                         },
//                         {
//                             "via": "Laut"
//                         },
//                         {
//                             "via": "Udara"
//                         },
//                     ],
//                     service: [
//                         {
//                             "service": "Retail"
//                         },
//                         {
//                             "service": "Charter"
//                         },
//                     ],
//                     PPn: [
//                         {
//                             "Value": 1.1,
//                             "PPn": "PPN 1.1%"
//                         },
//                         {
//                             "Value": 11,
//                             "PPn": "PPN 11%"
//                         },
//                         {
//                             "Value": 1.0,
//                             "PPn": "PPN 1.0%"
//                         },
//                         {
//                             "Value": 0.0,
//                             "PPn": "Non PPN"
//                         },
//                     ],
//                     jenisPPh: [
//                         {
//                             "Value": 0,
//                             "jenis": "PPH Dari Total"
//                         },
//                         {
//                             "Value": 1,
//                             "jenis": "PPH Dari subTotal"
//                         },
//                         {
//                             "Value": 2,
//                             "jenis": "PPH Dari Total Non PPN"
//                         },
//                     ],
//                     sumber: [
//                         {
//                             "sumber": "Surat Muat"
//                         },
//                         {
//                             "sumber": "ID RACE"
//                         },
//                         {
//                             "sumber": "Surat Muat Udara"
//                         },
//                     ]
//                 }
//                 if (response) {
//                     output = {
//                         status: {
//                             code: 200,
//                             message: 'Success get Data'
//                         },
//                         data: response

//                     }
//                 }

//             }
//         }
//     } catch (error) {
//         output = {
//             status: {
//                 code: 500,
//                 message: error.message
//             }
//         }
//     }

//     const errorsFromMiddleware = await customErrorMiddleware(req)

//     if (!errorsFromMiddleware) {
//         res.status(output.status.code).send(output)
//     } else {
//         res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
//     }
// }

// exports.addDetail = async (req, res) => {
//     try {
//         const getUser = await models.users.findOne(
//             {
//                 where: {
//                     id: req.user.id
//                 }
//             }
//         )
//         if (getUser) {
//             const getData = await models.m_sm.findOne(
//                 {
//                     where: {
//                         id_msm: req.query.idSm
//                     }
//                 }
//             )
//             if (getData) {
//                 models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });

//                 const getDetailPengadaan = await models.m_pengadaan_detail.findOne(

//                     {
//                         where: {
//                             id_mpd: getData.id_mpd
//                         },
//                         include: [
//                             {
//                                 model: models.alamat
//                             }
//                         ]
//                     }
//                 )
//                 if (getDetailPengadaan) {

//                     models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });

//                     const getPengadaan = await models.m_pengadaan.findOne(
//                         {
//                             where: {
//                                 id_mp: getDetailPengadaan.id_mp
//                             },
//                             include: [
//                                 {
//                                     model: models.customer
//                                 }
//                             ]
//                         }
//                     )
//                     if (getPengadaan) {
//                         output = {
//                             status: {
//                                 code: 200,
//                                 message: 'Success get Data'
//                             },
//                             idCustomer: getPengadaan.customer.id_customer,
//                             customer: getPengadaan.customer.nama_perusahaan,
//                             tujuan: getDetailPengadaan.alamat.kota,
//                             jenisBarang: getPengadaan.jenis_barang,
//                             jumlah: getDetailPengadaan.qty,
//                             TD: core.moment(getPengadaan.tgl_pickup).format('YYYY-MM-DD HH:mm:ss'),
//                             TA: core.moment(getPengadaan.tgl_bongkar).format('YYYY-MM-DD HH:mm:ss'),
//                             harga: getDetailPengadaan.harga,
//                         }
//                     }
//                 }
//                 // output = {
//                 //     status: {
//                 //         code: 200,
//                 //         message: 'Success get Data'
//                 //     },
//                 //     data: getData

//                 // }
//             }
//         }
//     } catch (error) {
//         output = {
//             status: {
//                 code: 500,
//                 message: error.message
//             }
//         }
//     }

//     const errorsFromMiddleware = await customErrorMiddleware(req)

//     if (!errorsFromMiddleware) {
//         res.status(output.status.code).send(output)
//     } else {
//         res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
//     }
// }