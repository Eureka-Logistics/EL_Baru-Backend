const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where, DATE } = require('sequelize');

const ExcelJS = require("exceljs");
const moment = require('moment');


exports.getARList = async (req, res) => {
    try {
        models.m_ar.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
        models.m_ar.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });

        models.m_ar.hasMany(models.m_ar_detail, {
            foreignKey: {
                name: 'id_ar'
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
            const getAR = await models.m_ar.findAndCountAll(
                {
                    order: [['id_ar', 'desc']],
                    where: {

                    },
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.customer
                        },
                        {
                            model: models.mitra
                        },
                        {
                            model: models.m_ar_detail
                        }
                    ]
                }
            )

            if (getAR.rows) {
                let no = (getAR.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getAR.rows.map((item) => {
                    var date;
                    if (core.moment(item.tgl_invoice_ar).format('M') == 1) {
                        date = "Jan"
                    }
                    if (core.moment(item.tgl_invoice_ar).format('M') == 2) {
                        date = "Feb"
                    }
                    if (core.moment(item.tgl_invoice_ar).format('M') == 3) {
                        date = "Mar"
                    }
                    if (core.moment(item.tgl_invoice_ar).format('M') == 4) {
                        date = "Apr"
                    }
                    if (core.moment(item.tgl_invoice_ar).format('M') == 5) {
                        date = "Mei"
                    }
                    if (core.moment(item.tgl_invoice_ar).format('M') == 6) {
                        date = "Jun"
                    }
                    if (core.moment(item.tgl_invoice_ar).format('M') == 7) {
                        date = "Jul"
                    }
                    if (core.moment(item.tgl_invoice_ar).format('M') == 8) {
                        date = "Agu"
                    }
                    if (core.moment(item.tgl_invoice_ar).format('M') == 9) {
                        date = "Sep"
                    }
                    if (core.moment(item.tgl_invoice_ar).format('M') == 10) {
                        date = "Okt"
                    }
                    if (core.moment(item.tgl_invoice_ar).format('M') == 11) {
                        date = "Nov"
                    }
                    if (core.moment(item.tgl_invoice_ar).format('M') == 12) {
                        date = "Des"
                    }
                    return {
                        no: no++,
                        // mount: core.moment(item.tgl_invoice_ar).format('MM-YY'),
                        id_ar: item.id_ar,
                        month: date + "-" + core.moment(item.tgl_invoice_ar).format('YY'),
                        no_Invoice_AR: item.no_invoice_ar,
                        alamat_Invoice: item.alamat_invoice,
                        no_Faktur: item.no_faktur_ar,
                        no_Faktur_Pajak: item.no_faktur_pajak,
                        pic: item.pic,
                        customer: item.customer.nama_perusahaan,
                        mitra: item.mitra.nama_mitra,
                        via: item.via + " " + item.service,
                        tgl_Invoice: core.moment(item.tgl_invoice_ar).format('YYYY-MM-DD hh:mm:ss'),
                        tgl_Kirim_Invoice: item.tgl_kirim_invoice,
                        total_Penjualan: item.total_penjualan,
                        detail: item.m_ar_details.map((m_ar_detail) => {
                            return {
                                id_ard: m_ar_detail.id_ard,
                                id_msm: m_ar_detail.id_msm,
                                msm: m_ar_detail.msm,
                                items: m_ar_detail.items,
                                tgl_Berangkat: m_ar_detail.tgl_berangkat,
                                tgl_Tiba: m_ar_detail.tgl_tiba,
                                total_Harga: m_ar_detail.total_harga,
                                total_Tagihan: m_ar_detail.total_tagihan,
                                no_Kwitansi: m_ar_detail.no_kwitansi,
                                tgl_Pembayaran: core.moment(m_ar_detail.tgl_pembayaran).format('YYYY-MM-DD hh:mm:ss'),
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
                        totalData: getAR.count,
                        totalPage: Math.ceil(getAR.count / req.query.limit),
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

exports.getARDetail = async (req, res) => {
    try {
        models.m_ar.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
        models.m_ar.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });

        models.m_ar.hasMany(models.m_ar_detail, {
            foreignKey: {
                name: 'id_ar'
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
            const getARDetail = await models.m_ar.findOne(
                {
                    where: {
                        id_ar: req.query.id_ar
                    },
                    include: [
                        {
                            model: models.customer
                        },
                        {
                            model: models.mitra
                        },
                        {
                            model: models.m_ar_detail
                        }
                    ]
                }
            )

            if (getARDetail) {
                const result = {
                    id_ar: getARDetail.id_ar,
                    id_customer: getARDetail.id_customer,
                    customer: getARDetail.customer.nama_perusahaan,
                    id_mitra: getARDetail.id_mitra,
                    mitra: getARDetail.mitra.nama_mitra,
                    pic: getARDetail.pic,
                    alamat_Invoice: getARDetail.alamat_Invoice,
                    no_invoice_ar: getARDetail.no_invoice_ar,
                    no_faktur_ar: getARDetail.no_faktur_ar,
                    no_faktur_pajak: getARDetail.no_faktur_pajak,
                    id_faktur: getARDetail.id_faktur,
                    service: getARDetail.service,
                    via: getARDetail.via,
                    ppn: getARDetail.ppn,
                    pph: getARDetail.pph,
                    top: getARDetail.top,
                    memo: getARDetail.memo,
                    total_ppn: getARDetail.total_ppn,
                    total_pph: getARDetail.total_pph,
                    total_penjualan: getARDetail.total_penjualan,
                    sales_invoice_id: getARDetail.sales_invoice_id,
                    invoiceDate: core.moment(getARDetail.tgl_invoice_ar).format('YYYY-MM-DD hh:mm:ss'),
                    detail: getARDetail.m_ar_details.map((m_ar_detail) => {
                        return {
                            id_ard: m_ar_detail.id_ard,
                            id_msm: m_ar_detail.id_msm,
                            msm: m_ar_detail.msm,
                            items: m_ar_detail.items,
                            tgl_Berangkat: m_ar_detail.tgl_berangkat,
                            tgl_Tiba: m_ar_detail.tgl_tiba,
                            total_Harga: m_ar_detail.total_harga,
                            total_Tagihan: m_ar_detail.total_tagihan,
                            no_Kwitansi: m_ar_detail.no_kwitansi,
                            tgl_Pembayaran: core.moment(m_ar_detail.tgl_pembayaran).format('YYYY-MM-DD hh:mm:ss'),
                        }
                    })
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

exports.getARDetail_2 = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getDetailAR = await models.m_ar_detail.findOne(
                {
                    where: {
                        id_ard: req.query.id_ard
                    },
                }
            )

            const getAdmin = await models.users.findOne(
                {
                    where: {
                        id: getDetailAR.admin
                    }
                }
            )

            const getMitra = await models.mitra.findOne(
                {
                    where: {
                        id_mitra: getDetailAR.id_mitra
                    }
                }
            )

            const getMitra2 = await models.mitra.findOne(
                {
                    where: {
                        id_mitra: getDetailAR.id_mitra2
                    }
                }
            )

            if (getDetailAR) {
                const result = {
                    id_ard: getDetailAR.id_ard,
                    id_ar: getDetailAR.id_ar,
                    id_msm: getDetailAR.id_msm,
                    msm: getDetailAR.msm,
                    id_mitra: getDetailAR.id_mitra,
                    mitra: getMitra.nama_mitra,
                    id_mitra2: getDetailAR.id_mitra2,
                    mitra2: getMitra2.nama_mitra,
                    do: getDetailAR.do,
                    items: getDetailAR.items,
                    service: getDetailAR.service,
                    via: getDetailAR.via,
                    tgl_berangkat: getDetailAR.tgl_berangkat,
                    tgl_berangkat_kapal: getDetailAR.tgl_berangkat_kapal,
                    tgl_tiba: getDetailAR.tgl_tiba,
                    berat: getDetailAR.berat,
                    qty: getDetailAR.qty,
                    koli: getDetailAR.koli,
                    volume: getDetailAR.volume,
                    harga: getDetailAR.harga,
                    overtonase: getDetailAR.overtonase,
                    biaya_overtonase: getDetailAR.biaya_overtonase,
                    biaya_muat: getDetailAR.biaya_muat,
                    biaya_bongkar: getDetailAR.biaya_bongkar,
                    biaya_kg_laut: getDetailAR.biaya_kg_laut,
                    biaya_volume: getDetailAR.biaya_volume,
                    biaya_inap: getDetailAR.biaya_inap,
                    biaya_multidrop: getDetailAR.biaya_multidrop,
                    biaya_multimuat: getDetailAR.biaya_multimuat,
                    biaya_lain: getDetailAR.biaya_lain,
                    biaya_tol: getDetailAR.biaya_tol,
                    biaya_tol: getDetailAR.biaya_tol,
                    biaya_overtonase: getDetailAR.biaya_overtonase,
                    biaya_muat: getDetailAR.biaya_muat,
                    biaya_bongkar: getDetailAR.biaya_bongkar,
                    biaya_kg_laut: getDetailAR.biaya_kg_laut,
                    biaya_volume: getDetailAR.biaya_volume,
                    biaya_inap: getDetailAR.biaya_inap,
                    biaya_multidrop: getDetailAR.biaya_multidrop,
                    biaya_multimuat: getDetailAR.biaya_multimuat,
                    biaya_lain: getDetailAR.biaya_lain,
                    biaya_tol: getDetailAR.biaya_tol,
                    biaya_putar: getDetailAR.biaya_putar,
                    biaya_insentif: getDetailAR.biaya_insentif,
                    biaya_portal: getDetailAR.biaya_portal,
                    biaya_packing: getDetailAR.biaya_packing,
                    biaya_noppn: getDetailAR.biaya_noppn,
                    biaya_nopph: getDetailAR.biaya_nopph,
                    bongkar_noppn: getDetailAR.bongkar_noppn,
                    bongkar_lain: getDetailAR.bongkar_lain,
                    potongan_bongkar: getDetailAR.potongan_bongkar,
                    potongan_overtonase: getDetailAR.potongan_overtonase,
                    potongan_multidrop: getDetailAR.potongan_multidrop,
                    potongan_rusak: getDetailAR.potongan_rusak,
                    potongan_biaya_sewa: getDetailAR.potongan_biaya_sewa,
                    potongan_diskon: getDetailAR.potongan_diskon,
                    potongan_lain: getDetailAR.potongan_lain,
                    potongan_inap: getDetailAR.potongan_inap,
                    asuransi: getDetailAR.asuransi,
                    inap_ppn: getDetailAR.inap_ppn,
                    pas_bandara: getDetailAR.pas_bandara,
                    admin: getDetailAR.admin,
                    nama_admin: getAdmin.nama_lengkap,
                    no_kwitansi: getDetailAR.no_kwitansi,
                    total_pengganti: getDetailAR.total_pengganti,
                    total_harga: getDetailAR.total_harga,
                    total_tagihan: getDetailAR.total_tagihan,
                    tgl_pembayaran: getDetailAR.tgl_pembayaran,
                    tgl_update: getDetailAR.tgl_update,
                    keterangan_bayar: getDetailAR.keterangan_bayar,
                }

                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Get Data Detail AR'
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

exports.createAR = async (req, res) => {
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

        const getCode = await models.m_ar.findAll(
            {
                order: [['id_ar', 'desc']],
                limit: 1,
                where: {
                    no_invoice_ar: {
                        [Op.like]: `%${getPerusahaan.id_bu}-IV-%`
                    },
                }
            }
        )

        const dateNow = core.moment(Date.now()).format('YY')

        if (getCode.length === 0) {
            const createAR = await models.m_ar.create(
                {
                    'proforma': "Y",
                    'proforma_date': "0000-00-00 00:00:00",
                    'print': "N",
                    'print_qty': 0,
                    'id_customer': req.body.id_customer,
                    'id_mitra': req.body.id_mitra,
                    'id_sales': 0,
                    'pic': req.body.pic,
                    'alamat_invoice': req.body.alamat_invoice,
                    'no_invoice_ar': getPerusahaan.id_bu + "-IV-" + dateNow + "-" + "000001",
                    'tgl_invoice_ar': Date.now(),
                    'tgl_kirim_invoice': "0000-00-00",
                    'no_faktur_ar': req.body.no_faktur_ar,
                    'no_faktur_pajak': req.body.no_faktur_pajak,
                    'id_faktur': req.body.id_faktur,
                    'service': req.body.service,
                    'via': req.body.via,
                    'is_nbp': null,
                    'ppn': req.body.ppn,
                    'pph': req.body.pph,
                    'top': req.body.top,
                    'memo': req.body.memo,
                    'discount_persen': null,
                    'discount_amount': null,
                    'total_ppn': req.body.total_ppn,
                    'total_pph': req.body.total_pph,
                    'total_penjualan': req.body.total_penjualan,
                    'status_kirim': 0,
                    'status_pajak': 0,
                    'tgl_create': Date.now(),
                    'tgl_update': "0000-00-00 00:00:00",
                    'sales_invoice_id': req.body.sales_invoice_id,
                    'id_admin': getUser.id,
                }
            )
            
            if (createAR) {
                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Menambahkan Data AR'
                    }
                }
            }
        } else {
            const getCodeAR = Number(getCode[0].no_invoice_ar.substring(9, 16))
            const codeAR = getCodeAR + 1

            const getcharacterNumber = codeAR.toString()

            const getDate = getCode[0].no_invoice_ar.substring(6, 8)

            if (codeAR > 999999) {
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

                    const createAR = await models.m_ar.create(
                        {
                            'proforma': "Y",
                            'proforma_date': "0000-00-00 00:00:00",
                            'print': "N",
                            'print_qty': 0,
                            'id_customer': req.body.id_customer,
                            'id_mitra': req.body.id_mitra,
                            'id_sales': 0,
                            'pic': req.body.pic,
                            'alamat_invoice': req.body.alamat_invoice,
                            'no_invoice_ar': getPerusahaan.id_bu + "-IV-" + getDate + "-" + zeroCode + codeAR,
                            'tgl_invoice_ar': Date.now(),
                            'tgl_kirim_invoice': "0000-00-00",
                            'no_faktur_ar': req.body.no_faktur_ar,
                            'no_faktur_pajak': req.body.no_faktur_pajak,
                            'id_faktur': req.body.id_faktur,
                            'service': req.body.service,
                            'via': req.body.via,
                            'is_nbp': null,
                            'ppn': req.body.ppn,
                            'pph': req.body.pph,
                            'top': req.body.top,
                            'memo': req.body.memo,
                            'discount_persen': null,
                            'discount_amount': null,
                            'total_ppn': req.body.total_ppn,
                            'total_pph': req.body.total_pph,
                            'total_penjualan': req.body.total_penjualan,
                            'status_kirim': 0,
                            'status_pajak': 0,
                            'tgl_create': Date.now(),
                            'tgl_update': "0000-00-00 00:00:00",
                            'sales_invoice_id': req.body.sales_invoice_id,
                            'id_admin': getUser.id,
                        }
                    )
                    
                    if (createAR) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Berhasil Menambahkan Data AR'
                            }
                        }
                    }
                } else {
                    const createAR = await models.m_ar.create(
                        {
                            'proforma': "Y",
                            'proforma_date': "0000-00-00 00:00:00",
                            'print': "N",
                            'print_qty': 0,
                            'id_customer': req.body.id_customer,
                            'id_mitra': req.body.id_mitra,
                            'id_sales': 0,
                            'pic': req.body.pic,
                            'alamat_invoice': req.body.alamat_invoice,
                            'no_invoice_ar': getPerusahaan.id_bu + "-IV-" + dateNow + "-" + "000001",
                            'tgl_invoice_ar': Date.now(),
                            'tgl_kirim_invoice': "0000-00-00",
                            'no_faktur_ar': req.body.no_faktur_ar,
                            'no_faktur_pajak': req.body.no_faktur_pajak,
                            'id_faktur': req.body.id_faktur,
                            'service': req.body.service,
                            'via': req.body.via,
                            'is_nbp': null,
                            'ppn': req.body.ppn,
                            'pph': req.body.pph,
                            'top': req.body.top,
                            'memo': req.body.memo,
                            'discount_persen': null,
                            'discount_amount': null,
                            'total_ppn': req.body.total_ppn,
                            'total_pph': req.body.total_pph,
                            'total_penjualan': req.body.total_penjualan,
                            'status_kirim': 0,
                            'status_pajak': 0,
                            'tgl_create': Date.now(),
                            'tgl_update': "0000-00-00 00:00:00",
                            'sales_invoice_id': req.body.sales_invoice_id,
                            'id_admin': getUser.id,
                        }
                    )
                    
                    if (createAR) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Berhasil Menambahkan Data AR'
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

exports.createARDetail = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        const getSM = await models.m_sm.findOne(
            {
                where: {
                    id_msm: req.body.id_msm
                }
            }
        )

        const createARDetail = await models.m_ar_detail.create(
        {
            'id_ar': req.query.id_ar,
            'id_msm': getSM.id_msm,
            'msm': getSM.msm,
            'id_mitra': getSM.id_mitra,
            'id_mitra2': getSM.id_mitra_2,
            'do': getSM.do,
            'items': req.body.items,
            'service': req.body.service,
            'via': req.body.via,
            'tgl_berangkat': req.body.tgl_berangkat,
            'tgl_berangkat_kapal': getSM.kapal_berangkat,
            'tgl_tiba': "0000-00-00",
            'berat': getSM.berat,
            'qty': getSM.qty,
            'koli': getSM.koli,
            'volume': req.body.volume,
            'harga': req.body.harga,
            'harga_type': req.body.service === 'charter' ? 'hargaCharter' : 'hargaRetailer',
            'overtonase': req.body.overtonase,
            'biaya_overtonase': req.body.biaya_overtonase,
            'biaya_muat': req.body.biaya_muat,
            'biaya_bongkar': req.body.biaya_bongkar,
            'biaya_kg_laut': req.body.biaya_kg_laut,
            'biaya_volume': req.body.biaya_volume,
            'biaya_inap': req.body.biaya_inap,
            'biaya_multidrop': req.body.biaya_multidrop,
            'biaya_multimuat': req.body.biaya_multimuat,
            'biaya_lain': req.body.biaya_lain,
            'biaya_mel': req.body.biaya_mel,
            'biaya_tol': req.body.biaya_tol,
            'biaya_putar': req.body.biaya_putar,
            'biaya_insentif': req.body.biaya_insentif,
            'biaya_portal': req.body.biaya_portal,
            'biaya_packing': req.body.biaya_packing,
            'biaya_noppn': req.body.biaya_noppn,
            'biaya_nopph': req.body.biaya_nopph,
            'bongkar_noppn': req.body.bongkar_noppn,
            'bongkar_lain': req.body.bongkar_lain,
            'potongan_bongkar': req.body.potongan_bongkar,
            'potongan_overtonase': req.body.potongan_overtonase,
            'potongan_multidrop': req.body.potongan_multidrop,
            'potongan_rusak': req.body.potongan_rusak,
            'potongan_biaya_sewa': req.body.potongan_biaya_sewa,
            'potongan_diskon': req.body.potongan_diskon,
            'potongan_lain': req.body.potongan_lain,
            'potongan_inap': req.body.potongan_inap,
            'asuransi': req.body.asuransi,
            'inap_ppn': req.body.inap_ppn,
            'pas_bandara': req.body.pas_bandara,
            'admin': getUser.id,
            'no_kwitansi': req.body.no_kwitansi,
            'total_pengganti': req.body.total_pengganti,
            'total_harga': req.body.total_harga,
            'total_tagihan': req.body.total_tagihan,
            'tgl_pembayaran': "0000-00-00 00:00:00",
            'tgl_update': getSM.tgl_update,
            'keterangan_bayar': ""
        }
    )
    if (createARDetail) {
        output = {
            status: {
                code: 200,
                message: 'Berhasil Menambahkan Data AR Detail'
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

exports.editAR = async (req, res) => {
    try {
        const getCustomer = await models.customer.findOne(
            {
                where: {
                    id_customer: req.body.id_customer
                }
            }
        )

        const getMitra = await models.mitra.findOne(
            {
                where: {
                    id_mitra: req.body.id_mitra
                }
            }
        )


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        const editAR = await models.m_ar.update(
        {
            'id_customer': getCustomer.id_customer,
            'id_mitra': getMitra.id_mitra,
            'id_sales': 0,
            'pic': req.body.pic,
            'alamat_invoice': req.body.alamat_invoice,
            'no_invoice_ar': req.body.no_invoice_ar,
            'tgl_kirim_invoice': req.body.tgl_kirim_invoice,
            'no_faktur_ar': req.body.no_faktur_ar,
            'no_faktur_pajak': req.body.no_faktur_pajak,
            'id_faktur': req.body.id_faktur,
            'service': req.body.service,
            'via': req.body.via,
            'is_nbp': null,
            'ppn': req.body.ppn,
            'pph': req.body.pph,
            'top': req.body.top,
            'memo': req.body.memo,
            'discount_persen': null,
            'discount_amount': null,
            'total_ppn': req.body.total_ppn,
            'total_pph': req.body.total_pph,
            'total_penjualan': req.body.total_penjualan,
            'status_kirim': 0,
            'status_pajak': 0,
            'tgl_update': Date.now(),
            'sales_invoice_id': req.body.sales_invoice_id,
            'id_admin': getUser.id,
        },
        {
            where: {
                id_ar: req.query.id_ar
            },
        },
    )
    if (editAR) {
        output = {
            status: {
                code: 200,
                message: 'Berhasil Mengubah Data AR'
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

exports.editARDetail = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        const getSM = await models.m_sm.findOne(
            {
                where: {
                    id_msm: req.body.id_msm
                }
            }
        )

        const editARDetail = await models.m_ar_detail.update(
            {
                'id_msm': getSM.id_msm,
                'msm': getSM.msm,
                'id_mitra': getSM.id_mitra,
                'id_mitra2': getSM.id_mitra_2,
                'do': getSM.do,
                'items': req.body.items,
                'service': req.body.service,
                'via': req.body.via,
                'tgl_berangkat_kapal': getSM.kapal_berangkat,
                'tgl_tiba': req.body.tgl_tiba,
                'berat': getSM.berat,
                'qty': getSM.qty,
                'koli': getSM.koli,
                'volume': req.body.volume,
                'harga': req.body.harga,
                'harga_type': req.body.service === 'charter' ? 'hargaCharter' : 'hargaRetailer',
                'overtonase': req.body.overtonase,
                'biaya_overtonase': req.body.biaya_overtonase,
                'biaya_muat': req.body.biaya_muat,
                'biaya_bongkar': req.body.biaya_bongkar,
                'biaya_kg_laut': req.body.biaya_kg_laut,
                'biaya_volume': req.body.biaya_volume,
                'biaya_inap': req.body.biaya_inap,
                'biaya_multidrop': req.body.biaya_multidrop,
                'biaya_multimuat': req.body.biaya_multimuat,
                'biaya_lain': req.body.biaya_lain,
                'biaya_mel': req.body.biaya_mel,
                'biaya_tol': req.body.biaya_tol,
                'biaya_putar': req.body.biaya_putar,
                'biaya_insentif': req.body.biaya_insentif,
                'biaya_portal': req.body.biaya_portal,
                'biaya_packing': req.body.biaya_packing,
                'biaya_noppn': req.body.biaya_noppn,
                'biaya_nopph': req.body.biaya_nopph,
                'bongkar_noppn': req.body.bongkar_noppn,
                'bongkar_lain': req.body.bongkar_lain,
                'potongan_bongkar': req.body.potongan_bongkar,
                'potongan_overtonase': req.body.potongan_overtonase,
                'potongan_multidrop': req.body.potongan_multidrop,
                'potongan_rusak': req.body.potongan_rusak,
                'potongan_biaya_sewa': req.body.potongan_biaya_sewa,
                'potongan_diskon': req.body.potongan_diskon,
                'potongan_lain': req.body.potongan_lain,
                'potongan_inap': req.body.potongan_inap,
                'asuransi': req.body.asuransi,
                'inap_ppn': req.body.inap_ppn,
                'pas_bandara': req.body.pas_bandara,
                'admin': getUser.id,
                'no_kwitansi': req.body.no_kwitansi,
                'total_pengganti': req.body.total_pengganti,
                'total_harga': req.body.total_harga,
                'total_tagihan': req.body.total_tagihan,
                'tgl_pembayaran': "0000-00-00 00:00:00",
                'tgl_update': Date.now(),
                'keterangan_bayar': ""
            },
            {
                where: {
                    id_ard: req.query.id_ard
                }
            }
        )
    if (editARDetail) {
        output = {
            status: {
                code: 200,
                message: 'Berhasil Mengubah Data AR Detail'
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

exports.exportFaktur = async (req, res) => {
    try {
        // First, fetch the data from database
        const arIds = req.body.id_ar; // Array of id_ar from request body
        
        // Set up model associations
        models.m_ar.belongsTo(models.customer, { 
            foreignKey: 'id_customer'
        });

        // Fetch AR data with customer information
        const arData = await models.m_ar.findAll({
            where: {
                id_ar: {
                    [Op.in]: arIds
                }
            },
            include: [{
                model: models.customer,
                required: true
            }],
            order: [['id_ar', 'ASC']]
        });

        const workbook = new ExcelJS.Workbook();

        // Sheet 1: Faktur
        const fakturSheet = workbook.addWorksheet("Faktur");

        // Set kolom terlebih dahulu
        fakturSheet.columns = [
            { header: "", key: "baris", width: 8 },
            { header: "", key: "tanggalFaktur", width: 15 },
            { header: "", key: "jenisFaktur", width: 15 },
            { header: "", key: "kodeTransaksi", width: 15 },
            { header: "", key: "keteranganTambahan", width: 20 },
            { header: "", key: "dokumenPendukung", width: 20 },
            { header: "", key: "referensi", width: 20 },
            { header: "", key: "capFasilitas", width: 15 },
            { header: "", key: "idTkuPenjual", width: 25 },
            { header: "", key: "npwpPembeli", width: 20 },
            { header: "", key: "jenisIdPembeli", width: 15 },
            { header: "", key: "negaraPembeli", width: 15 },
            { header: "", key: "nomorDokumenPembeli", width: 20 },
            { header: "", key: "namaPembeli", width: 20 },
            { header: "", key: "alamatPembeli", width: 30 },
            { header: "", key: "emailPembeli", width: 25 },
            { header: "", key: "idTkuPembeli", width: 25 }
        ];

        // Merge cells A1 dan B1 untuk NPWP Penjual
        fakturSheet.mergeCells("A1:B1");
        fakturSheet.getCell("A1").value = "NPWP Penjual";
        
        // Set NPWP Penjual berdasarkan id_bu dari AR pertama dalam daftar
        // Menggunakan AR pertama untuk konsistensi seluruh dokumen
        let npwpPenjual = "0854748878009000"; // Default value if no data or id_bu is different
        if (arData.length > 0) {
            if (arData[0].id_bu === 11) {
                npwpPenjual = "0031440456009000";
            } else if (arData[0].id_bu === 21) {
                npwpPenjual = "0854748878009000";
            }
        }
        
        // Letakkan NPWP Penjual di cell C1
        fakturSheet.getCell("C1").value = npwpPenjual;

        // Set header di baris 3
        const headers = [
            "Baris",
            "Tanggal Faktur",
            "Jenis Faktur",
            "Kode Transaksi",
            "Keterangan Tambahan",
            "Dokumen Pendukung",
            "Referensi",
            "Cap Fasilitas",
            "ID TKU Penjual",
            "NPWP/NIK Pembeli",
            "Jenis ID Pembeli",
            "Negara Pembeli",
            "Nomor Dokumen Pembeli",
            "Nama Pembeli",
            "Alamat Pembeli",
            "Email Pembeli",
            "ID TKU Pembeli"
        ];

        const headerRow = fakturSheet.getRow(3);
        headers.forEach((header, index) => {
            headerRow.getCell(index + 1).value = header;
        });

        // Transform database data to sheet format
        const fakturData = arData.map((ar, index) => {
            // Determine idTkuPenjual based on id_bu
            let idTkuPenjual = "0854748878009000000000"; // Default value
            if (ar.id_bu === 11) {
                idTkuPenjual = "0031440456009000000000";
            } else if (ar.id_bu === 21) {
                idTkuPenjual = "0854748878009000000000";
            }
            
            // Set a default value for idTkuPembeli if it's empty
            let idTkuPembeli = ar.customer?.tax_position || '';
            if (!idTkuPembeli || idTkuPembeli.trim() === '') {
                idTkuPembeli = "00000000000000000000"; // Default static value for empty ID TKU Pembeli
            }
            
            return {
                baris: (index + 1).toString(),
                tanggalFaktur: moment(ar.tgl_invoice_ar).format('DD/MM/YYYY'),
                jenisFaktur: "Normal",
                kodeTransaksi: "05",
                keteranganTambahan: "-",
                dokumenPendukung: "-",
                referensi: ar.no_invoice_ar,
                capFasilitas: "-",
                idTkuPenjual: idTkuPenjual,
                npwpPembeli: ar.customer?.npwp || '-',
                jenisIdPembeli: "TIN",
                negaraPembeli: "IDN",
                nomorDokumenPembeli: "-",
                namaPembeli: ar.customer?.nama_perusahaan || '-',
                alamatPembeli: ar.customer?.alamat_kantor || '-',
                emailPembeli: ar.customer?.email || '-',
                idTkuPembeli: idTkuPembeli
            };
        });

        // Masukkan data ke sheet Faktur (mulai dari baris 4)
        fakturData.forEach((data, index) => {
            const row = fakturSheet.getRow(index + 4);
            Object.keys(data).forEach((key, colIndex) => {
                row.getCell(colIndex + 1).value = data[key];
            });
        });
        
        // Tambahkan row END di akhir data Faktur
        const endRowFaktur = fakturSheet.getRow(fakturData.length + 4);
        endRowFaktur.getCell(1).value = "END";

        // Styling untuk header Faktur
        const styleHeaderRow = fakturSheet.getRow(3);
        styleHeaderRow.font = { bold: true };
        styleHeaderRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // Border untuk header
        styleHeaderRow.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Sheet 2: Detail Faktur
        const detailFakturSheet = workbook.addWorksheet("DetailFaktur");

        // Set kolom untuk DetailFaktur
        detailFakturSheet.columns = [
            { header: "", key: "baris", width: 8 },
            { header: "", key: "jenisBarang", width: 15 },
            { header: "", key: "kodeBarang", width: 15 },
            { header: "", key: "namaBarang", width: 25 },
            { header: "", key: "satuan", width: 15 },
            { header: "", key: "hargaSatuan", width: 15 },
            { header: "", key: "jumlahBarang", width: 15 },
            // Removed "totalHarga" column
            { header: "", key: "diskon", width: 15 },
            { header: "", key: "dpp", width: 15 },
            { header: "", key: "dppNilaiLain", width: 15 },
            { header: "", key: "tarifPPN", width: 15 },
            { header: "", key: "ppn", width: 15 },
            { header: "", key: "tarifPPnBM", width: 15 },
            { header: "", key: "ppnbm", width: 15 }
        ];

        // Set header di baris 1 untuk DetailFaktur
        const detailHeaders = [
            "Baris",
            "Barang/Jasa",
            "Kode Barang Jasa",
            "Nama Barang/Jasa",
            "Nama Satuan Ukur",
            "Harga Satuan",
            "Jumlah Barang Jasa",
            // Removed "Total Harga" header
            "Total Diskon",
            "DPP",
            "DPP Nilai Lain",
            "Tarif PPN",
            "PPN",
            "Tarif PPnBM",
            "PPnBM"
        ];

        const detailHeaderRow = detailFakturSheet.getRow(1);
        detailHeaders.forEach((header, index) => {
            detailHeaderRow.getCell(index + 1).value = header;
        });

        // MODIFIED SECTION: Fetch one detail per AR instead of all details
        let currentRow = 2; // Start from row 2 after headers
        for (const ar of arData) {
            // Fetch ONLY ONE AR detail record (the first one)
            const arDetail = await models.m_ar_detail.findOne({
                where: {
                    id_ar: ar.id_ar
                },
                order: [['id_ard', 'ASC']]
            });

            // Skip if no detail found
            if (!arDetail) continue;
            
            const row = detailFakturSheet.getRow(currentRow);
            
            // Calculate total diskon
            const totalDiskon = (arDetail.potongan_bongkar || 0) +
                (arDetail.potongan_overtonase || 0) +
                (arDetail.potongan_multidrop || 0) +
                (arDetail.potongan_rusak || 0) +
                (arDetail.potongan_biaya_sewa || 0) +
                (arDetail.potongan_diskon || 0) +
                (arDetail.potongan_lain || 0) +
                (arDetail.potongan_inap || 0);

            // MODIFIED: Get the subtotal from m_ar instead of arDetail.harga
            const subtotal = ar.subtotal || 0;
            
            // Apply new conditions based on is_nbp
            let hargaSatuan = 0;
            let totalHarga = 0;
            let dpp = 0;
            let ppn = 0;
            let tarifPPN = 12; // Tarif PPN default static 12%
            
            // Set jumlah barang to static value 1
            const qty = 1; // Static value 1 as per requirement
            
            if (ar.is_nbp === 1) {
                // If is_nbp = 1, then hargaSatuan = subtotal
                hargaSatuan = subtotal;
                totalHarga = hargaSatuan * qty;
                dpp = hargaSatuan; // DPP = hargaSatuan for is_nbp = 1
                ppn = Math.round(dpp * (tarifPPN/100)); // PPN = dpp * (11/100)
            } else {
                // If is_nbp = 0, calculate according to your formula
                hargaSatuan = Math.round(subtotal * 0.99);
                totalHarga = hargaSatuan * qty;
                // REVISED: Calculate DPP using the formula total harga × 100/101.1
                dpp = Math.round(totalHarga * (100/101.1));
                ppn = Math.round(dpp * (tarifPPN/100)); // PPN = dpp * (11/100)
            }
            
            // DPP Nilai Lain
            const dppNilaiLain = 0; // Set to 0 as per requirement

            row.values = [
                currentRow - 1, // Baris
                "B", // Jenis (static as per requirement)
                "060000", // Kode Barang (static)
                "JASA ANGKUTAN BARANG", // Nama Barang (static)
                "UM.0030", // Satuan (static)
                hargaSatuan, // Harga satuan based on is_nbp condition
                qty, // Jumlah barang statis 1
                // Removed totalHarga from export
                totalDiskon, // Total dari semua potongan
                dpp, // DPP calculated based on is_nbp condition
                dppNilaiLain, // DPP Nilai Lain (set to 0)
                tarifPPN, // Tarif PPN 11%
                ppn, // PPN calculated based on DPP
                0, // Tarif PPnBM set to 0 (static)
                0 // PPnBM
            ];

            currentRow++;
        }
        
        // Tambahkan row END di akhir data DetailFaktur
        const endRowDetailFaktur = detailFakturSheet.getRow(currentRow);
        endRowDetailFaktur.getCell(1).value = "END";

        // Styling untuk sheet DetailFaktur
        // Style header
        const detailHeaderRow1 = detailFakturSheet.getRow(1);
        detailHeaderRow1.font = { bold: true };
        detailHeaderRow1.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" }
        };

        // Border untuk header
        detailHeaderRow1.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });

        // Format angka untuk kolom nominal (tanpa comma)
        // Updated column references since "Total Harga" (H) was removed
        ["F", "G", "H", "I", "J", "L", "N"].forEach((col) => {
            detailFakturSheet.getColumn(col).numFmt = "0";
        });

        // Format numeric untuk kolom tarif (without decimal)
        // Changed to display integers instead of decimals
        // Updated column references since "Total Harga" (H) was removed
        ["K", "M"].forEach((col) => {
            detailFakturSheet.getColumn(col).numFmt = "0";
        });

        // Alignment untuk semua data
        for (let i = 1; i <= detailFakturSheet.columnCount; i++) {
            detailFakturSheet.getColumn(i).alignment = {
                vertical: "middle",
                horizontal: "left"
            };
        }

        // Set response headers
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition", 
            "attachment; filename=faktur_data.xlsx"
        );

        // Write workbook to response
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Download Excel Error:", error);
        res.status(500).send({
            status: {
                code: 500,
                message: "Terjadi kesalahan saat mengunduh file: " + error.message
            }
        });
    }
};