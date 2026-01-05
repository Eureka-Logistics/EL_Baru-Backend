const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where } = require('sequelize');
const ExcelJS = require('exceljs');

exports.getCustomer = async (req, res) => {
    try {

        models.customer.hasMany(models.alamat, { targetKey: 'id_customer', foreignKey: 'id_customer' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDataCust = await models.customer.findAndCountAll(
                {
                    distinct: true,
                    where: {
                        ...(req.query.status ? { status: Number(req.query.status) } : {}),
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    kode_customer: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },
                                {
                                    nama_perusahaan: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    }
                                },

                            ]
                        } : {}
                    },
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.alamat,
                            required: false
                        }
                    ],
                    order: [['id_customer', 'desc']]
                },

            )

            // const getCode = await models.customer.findAll(
            //     {
            //         limit: 1,
            //         order: [['id_customer', 'desc']]
            //     }
            // )

            // //---///
            // // const getcodeSp = getCode

            // const getcodeSp = getCode[0].kode_customer.substring(3, 8)
            // console.log("🚀 ~ file: customer.controller.js:66 ~ exports.getCustomer= ~ getcodeSp:", getcodeSp)


            // const spCode = Number(getcodeSp) + 1
            // console.log("🚀 ~ file: customer.controller.js:69 ~ exports.getCustomer= ~ spCode:", spCode)

            if (getDataCust) {
                let no = (getDataCust.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getDataCust.rows.map((item) => {
                    return {
                        no: no++,
                        custId: item.id_customer,
                        custCode: item.kode_customer,
                        custName: item.nama_perusahaan,
                        // custAddress: item.alamat_kantor,
                        custStuff: item.jenis_barang,
                        custBirth: item.tgl_berdiri,
                        yearBirthL: item.tahun_berdiri,
                        custNpwp: item.npwp,
                        custAddresNpwp: item.alamat_npwp,
                        custTelephone: item.telepon,
                        custAddress: item.alamats.map((i) => {
                            return {
                                idAddress: i.id,
                                address: i.alamat,
                                city: i.kota
                            }
                        })
                        // custHp: item.hp,
                        // custCurency: item.mata_uang


                    }
                })
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {
                        totalData: getDataCust.count,
                        totalPage: Math.ceil(getDataCust.count / req.query.limit),
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

exports.getCustomerDetail = async (req, res) => {
    try {
        models.customer.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                },

            }
        )
        if (getUser) {
            const getCust = await models.customer.findOne(
                {
                    ...req.query.id_customer ? {
                        where: {
                            id_customer: req.query.id_customer
                        }
                    } : {},
                    include: [
                        {
                            model: models.users
                        }
                    ]
                },

            )
            // const sales = await models.users.findOne(
            //     {
            //         where:{
            //             id:getCust.id_sales
            //         }
            //     }
            // )
            if (getCust) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    sales: getCust.users == null ? "-" : getCust.users.nama_lengkap,
                    data: getCust
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

exports.delCustomer = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }

        )
        if (getUser) {
            const updStat = await models.customer.update(
                {
                    status: 0
                },
                {
                    where: {
                        id_customer: req.body.id_customer
                    }
                }
            )
            if (updStat) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success delete Data'
                    },
                }
            }
            else {
                output = {
                    status: {
                        code: 402,
                        message: 'failed delete Data'
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

exports.cretaCustomer = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getCust = await models.customer.findOne(
                {
                    where: {
                        nama_perusahaan: req.body.nama_perusahaan,
                    }
                }
            )

            if (!getCust) {
                const getCodeCustomer = await models.customer.findAll(
                    {
                        order: [['id_customer', 'desc']],
                        limit: 1,
                        where: {
                            kode_customer: {
                                [Op.like]: `%C${getUser.id_bu}%`
                            },
                        }
                    }
                )

                if (getCodeCustomer.length === 0) {
                    // Helper untuk default aman
                    const val = (v, d) => (v === undefined || v === null || v === '' ? d : v);
                    const toDateOnly = (v, d) => core.moment(val(v, d)).format('YYYY-MM-DD');
                    const stringifyArr = (v) => Array.isArray(v) ? JSON.stringify(v) : v;

                    const payload = {
                        parent_id: 0,
                        id_sales: getUser.id,
                        id_bu: getUser.id_bu,
                        akun: "",
                        kode_customer: 'C' + getUser.id_bu + '0000001',
                        nama_perusahaan: val(req.body.nama_perusahaan, ''),
                        perusahaan: val(req.body.nama_perusahaan, ''),
                        jenis_usaha: val(req.body.jenis_usaha, ''),
                        jenis_barang: val(req.body.jenis_barang, ''),
                        jenis_transaksi: stringifyArr(val(req.body.jenis_transaksi, '')),
                        jenis_layanan: stringifyArr(val(req.body.jenis_layanan, '')),
                        jenis_entitas: val(req.body.jenis_entitas, null),
                        tgl_bediri: toDateOnly(req.body.tgl_berdiri, Date.now()),
                        tahun_berdiri: val(req.body.tahun_berdiri, ''),
                        npwp: val(req.body.npwp, ''),
                        alamat_npwp: val(req.body.alamat_npwp, ''),
                        ktp: val(req.body.ktp, ''),
                        tdp: val(req.body.tdp, ''),
                        siup: val(req.body.siup, ''),
                        pkp: val(req.body.pkp, ''),
                        tax_pic: val(req.body.tax_pic, ''),
                        tax_position: val(req.body.tax_position, ''),
                        tax_email: val(req.body.tax_email, ''),
                        tax_phone_office: val(req.body.tax_phone_office, null),
                        tax_mobile: val(req.body.tax_mobile, null),
                        invoice_pic: val(req.body.invoice_pic, ''),
                        invoice_address: val(req.body.invoice_address, ''),
                        invoice_position: val(req.body.invoice_position, ''),
                        invoice_phone_office: val(req.body.invoice_phone_office, null),
                        invoice_mobile: val(req.body.invoice_mobile, null),
                        invoice_email: val(req.body.invoice_email, ''),
                        pic_office: val(req.body.pic_office, ''),
                        pic_position: val(req.body.pic_position, ''),
                        pic_phone: val(req.body.pic_phone, ''),
                        pic_number: val(req.body.pic_number, ''),
                        pic_fax: val(req.body.pic_fax, ''),
                        pic_email: val(req.body.pic_email, ''),
                        pic_birth: val(req.body.pic_birth, null),
                        alamat_kantor: val(req.body.alamat_kantor, ''),
                        telepon: val(req.body.telepon, ''),
                        hp: val(req.body.hp, ''),
                        fax: val(req.body.fax, ''),
                        email: val(req.body.email, ''),
                        bank_pic: val(req.body.bank_pic, ''),
                        bank_position: val(req.body.bank_position, ''),
                        bank_phone_office: val(req.body.bank_phone_office, null),
                        bank_mobile: val(req.body.bank_mobile, null),
                        bank_email: val(req.body.bank_email, ''),
                        nama_bank: val(req.body.nama_bank, ''),
                        nama_akun: val(req.body.nama_akun, ''),
                        no_rek: val(req.body.no_rek, ''),
                        mata_uang: val(req.body.mata_uang, 'Rupiah (Rp)'),
                        top: val(req.body.top, 0),
                        jenis_pembayaran: val(req.body.jenis_pembayaran, 'Cash'),
                        jenis_angkutan: 'undefined',
                        kemasan: val(req.body.kemasan, ''),
                        unique_cus: 0,
                        foto_kantor: val(req.body.foto_kantor, ''),
                        foto_pic: val(req.body.foto_pic, ''),
                        foto_ktp: val(req.body.foto_ktp, ''),
                        foto_npwp: val(req.body.foto_npwp, ''),
                        manager: val(req.body.manager, 'N'),
                        manager_memo: val(req.body.manager_memo, ''),
                        manager_date: toDateOnly(req.body.manager_date, Date.now()),
                        akunting: val(req.body.akunting, 'N'),
                        akunting_memo: val(req.body.akunting_memo, ''),
                        akunting_date: toDateOnly(req.body.akunting_date, Date.now()),
                        direktur: val(req.body.direktur, 'N'),
                        direktur_memo: val(req.body.direktur_memo, ''),
                        direktur_date: toDateOnly(req.body.direktur_date, Date.now()),
                        mou_file: val(req.body.mou_file, 'N'),
                        mou_number: val(req.body.mou_number, null),
                        mou_expired: req.body.mou_expired ? core.moment(req.body.mou_expired).format('YYYY-MM-DD') : null,
                        surat_pelayanan: val(req.body.surat_pelayanan, 'N'),
                        surat_pelayanan_number: val(req.body.surat_pelayanan_number, null),
                        surat_pelayanan_expired: req.body.surat_pelayanan_expired ? core.moment(req.body.surat_pelayanan_expired).format('YYYY-MM-DD') : null,
                        tgl_bergabung: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                        status: 1,
                        status_bp: 0,
                        lat: 0.0000000,
                        lon: 0.0000000,
                    };

                    const insertData = await models.customer.create(payload)
                    
                    if (insertData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success set Customer'
                            },
                        }
                    } else {
                        output = {
                            status: {
                                code: 402,
                                message: 'failed set Customer'
                            },
                        }
                    }
                } else {
                    const getCode = Number(getCodeCustomer[0].kode_customer.substring(3, 11))
                    const getcharacterNumber = getCode.toString()
                    const codeUrut = getCode + 1

                    if (codeUrut > 9999999) {
                        output = {
                            status: {
                                code: 400,
                                message: 'Gagal menginput data kode sudah maks di 9999999'
                            }
                        }
                    } else {
                        var zeroCode

                        if (getcharacterNumber.length == 1) {
                            var zeroCode = "000000"
                        } else if (getcharacterNumber.length == 2) {
                            var zeroCode = "00000"
                        } else if (getcharacterNumber.length == 3) {
                            var zeroCode = "0000"
                        } else if (getcharacterNumber.length == 4) {
                            var zeroCode = "000"
                        } else if (getcharacterNumber.length == 5) {
                            var zeroCode = "00"
                        } else if (getcharacterNumber.length == 6) {
                            var zeroCode = "0"
                        } else if (getcharacterNumber.length == 7) {
                            var zeroCode = ""
                        }

                        const val2 = (v, d) => (v === undefined || v === null || v === '' ? d : v);
                        const toDateOnly2 = (v, d) => core.moment(val2(v, d)).format('YYYY-MM-DD');
                        const stringifyArr2 = (v) => Array.isArray(v) ? JSON.stringify(v) : v;

                        const payload2 = {
                            parent_id: 0,
                            id_sales: getUser.id,
                            id_bu: getUser.id_bu,
                            akun: "",
                            kode_customer: 'C' + getUser.id_bu + zeroCode + codeUrut,
                            nama_perusahaan: val2(req.body.nama_perusahaan, ''),
                            perusahaan: val2(req.body.nama_perusahaan, ''),
                            jenis_usaha: val2(req.body.jenis_usaha, ''),
                            jenis_barang: val2(req.body.jenis_barang, ''),
                            jenis_transaksi: stringifyArr2(val2(req.body.jenis_transaksi, '')),
                            jenis_layanan: stringifyArr2(val2(req.body.jenis_layanan, '')),
                            jenis_entitas: val2(req.body.jenis_entitas, null),
                            tgl_bediri: toDateOnly2(req.body.tgl_berdiri, Date.now()),
                            tahun_berdiri: val2(req.body.tahun_berdiri, ''),
                            npwp: val2(req.body.npwp, ''),
                            alamat_npwp: val2(req.body.alamat_npwp, ''),
                            ktp: val2(req.body.ktp, ''),
                            tdp: val2(req.body.tdp, ''),
                            siup: val2(req.body.siup, ''),
                            pkp: val2(req.body.pkp, ''),
                            tax_pic: val2(req.body.tax_pic, ''),
                            tax_position: val2(req.body.tax_position, ''),
                            tax_email: val2(req.body.tax_email, ''),
                            tax_phone_office: val2(req.body.tax_phone_office, null),
                            tax_mobile: val2(req.body.tax_mobile, null),
                            invoice_pic: val2(req.body.invoice_pic, ''),
                            invoice_address: val2(req.body.invoice_address, ''),
                            invoice_position: val2(req.body.invoice_position, ''),
                            invoice_phone_office: val2(req.body.invoice_phone_office, null),
                            invoice_mobile: val2(req.body.invoice_mobile, null),
                            invoice_email: val2(req.body.invoice_email, ''),
                            pic_office: val2(req.body.pic_office, ''),
                            pic_position: val2(req.body.pic_position, ''),
                            pic_phone: val2(req.body.pic_phone, ''),
                            pic_number: val2(req.body.pic_number, ''),
                            pic_fax: val2(req.body.pic_fax, ''),
                            pic_email: val2(req.body.pic_email, ''),
                            pic_birth: val2(req.body.pic_birth, null),
                            alamat_kantor: val2(req.body.alamat_kantor, ''),
                            telepon: val2(req.body.telepon, ''),
                            hp: val2(req.body.hp, ''),
                            fax: val2(req.body.fax, ''),
                            email: val2(req.body.email, ''),
                            bank_pic: val2(req.body.bank_pic, ''),
                            bank_position: val2(req.body.bank_position, ''),
                            bank_phone_office: val2(req.body.bank_phone_office, null),
                            bank_mobile: val2(req.body.bank_mobile, null),
                            bank_email: val2(req.body.bank_email, ''),
                            nama_bank: val2(req.body.nama_bank, ''),
                            nama_akun: val2(req.body.nama_akun, ''),
                            no_rek: val2(req.body.no_rek, ''),
                            mata_uang: val2(req.body.mata_uang, 'Rupiah (Rp)'),
                            top: val2(req.body.top, 0),
                            jenis_pembayaran: val2(req.body.jenis_pembayaran, 'Cash'),
                            jenis_angkutan: 'undefined',
                            kemasan: val2(req.body.kemasan, ''),
                            unique_cus: 0,
                            foto_kantor: val2(req.body.foto_kantor, ''),
                            foto_pic: val2(req.body.foto_pic, ''),
                            foto_ktp: val2(req.body.foto_ktp, ''),
                            foto_npwp: val2(req.body.foto_npwp, ''),
                            manager: val2(req.body.manager, 'N'),
                            manager_memo: val2(req.body.manager_memo, ''),
                            manager_date: toDateOnly2(req.body.manager_date, Date.now()),
                            akunting: val2(req.body.akunting, 'N'),
                            akunting_memo: val2(req.body.akunting_memo, ''),
                            akunting_date: toDateOnly2(req.body.akunting_date, Date.now()),
                            direktur: val2(req.body.direktur, 'N'),
                            direktur_memo: val2(req.body.direktur_memo, ''),
                            direktur_date: toDateOnly2(req.body.direktur_date, Date.now()),
                            mou_file: val2(req.body.mou_file, 'N'),
                            mou_number: val2(req.body.mou_number, null),
                            mou_expired: req.body.mou_expired ? core.moment(req.body.mou_expired).format('YYYY-MM-DD') : null,
                            surat_pelayanan: val2(req.body.surat_pelayanan, 'N'),
                            surat_pelayanan_number: val2(req.body.surat_pelayanan_number, null),
                            surat_pelayanan_expired: req.body.surat_pelayanan_expired ? core.moment(req.body.surat_pelayanan_expired).format('YYYY-MM-DD') : null,
                            tgl_bergabung: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                            status: 1,
                            status_bp: 0,
                            lat: 0.0000000,
                            lon: 0.0000000,
                        };

                        const insertData = await models.customer.create(payload2)

                        if (insertData) {
                            output = {
                                status: {
                                    code: 200,
                                    message: 'Success set Customer'
                                },
                            }
                        } else {
                            output = {
                                status: {
                                    code: 402,
                                    message: 'failed set Customer'
                                },
                            }
                        }
                    }
                }
            } else {
                output = {
                    status: {
                        code: 403,
                        message: 'Customer already exist'
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

exports.getAlamatCustomer = async (req, res) => {
    try {

        models.alamat.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });


        // const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getAddress = await models.alamat.findAll(
                {

                    ...req.query.id_customer ? {
                        where: {
                            id_customer: req.query.id_customer
                        }
                    } : {},
                    include: [
                        {
                            model: models.customer
                        }
                    ],
                    order: [['id', 'desc']]
                },

            )
            if (getAddress) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: req.query.id_customer ? getAddress.map((i) => {
                        return {
                            customerAddressId: i.id,
                            customerId: i.id_customer,
                            customer: i.customer.nama_perusahaan,
                            pic: i.pic,
                            jabatan: i.jabatan,
                            hp: i.hp,
                            email: i.email,
                            foto: i.foto,
                            alamat: i.alamat,
                            alamat_detail: i.alamat_detail,
                            kecamatan: i.kecamatan,
                            id_kecamatan: i.id_kecamatan,
                            id_kota: i.id_kota,
                            id_provinsi: i.id_provinsi,
                            provinsi: i.m_wil_provinsi == null ? "-" : i.m_wil_provinsi.nama_provinsi,
                            kota: i.kota,
                            kode_wilayah: i.kode_wilayah,
                            kode_provinsi: i.kode_provinsi,

                            ritase: i.ritase,
                            lat: i.lat,
                            lon: i.lon

                        }
                    }) : {}
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

exports.editCustomer = async (req, res) => {
    try {

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
                // Hanya update field yang dikirim (parsial)
                const allowed = [
                    'kode_customer','nama_perusahaan','perusahaan','jenis_barang','jenis_usaha',
                    'jenis_transaksi','jenis_layanan','jenis_entitas','tgl_berdiri','tahun_berdiri',
                    'npwp','alamat_npwp','alamat_kantor','telepon','hp','mata_uang','jenis_pembayaran',
                    'tax_phone_office','tax_position','bank_phone_office','bank_pic','bank_mobile','invoice_mobile',
                    'tax_mobile','top','pic_office','pic_phone','pic_position','pic_email','pic_birth','pic_fax',
                    'ktp','tdp','tax_pic','tax_email','nama_bank','nama_akun','no_rek','bank_email','bank_position',
                    'invoice_pic','invoice_position','invoice_email','invoice_phone_office','mou_file','mou_number',
                    'mou_expired','surat_pelayanan','surat_pelayanan_number','surat_pelayanan_expired'
                ];
                const payload = {};
                for (const key of allowed) {
                    if (Object.prototype.hasOwnProperty.call(req.body, key) && req.body[key] !== undefined && req.body[key] !== null) {
                        payload[key] = req.body[key];
                    }
                }
                if (payload.jenis_transaksi) payload.jenis_transaksi = Array.isArray(payload.jenis_transaksi) ? JSON.stringify(payload.jenis_transaksi) : payload.jenis_transaksi;
                if (payload.jenis_layanan) payload.jenis_layanan = Array.isArray(payload.jenis_layanan) ? JSON.stringify(payload.jenis_layanan) : payload.jenis_layanan;
                // tgl_berdiri -> tgl_bediri (abaikan update bila kosong/invalid)
                if (Object.prototype.hasOwnProperty.call(payload, 'tgl_berdiri')) {
                    const v = payload.tgl_berdiri;
                    const m = core.moment(v);
                    if (v !== '' && v !== 'Invalid date' && m.isValid()) {
                        payload.tgl_bediri = m.format('YYYY-MM-DD');
                    }
                    delete payload.tgl_berdiri;
                }
                // Normalisasi tanggal: kosong/invalid => null; valid => YYYY-MM-DD
                const normalizeDate = (v) => {
                    if (v === '' || v === 'Invalid date') return null;
                    const m = core.moment(v);
                    return m.isValid() ? m.format('YYYY-MM-DD') : null;
                };
                if (Object.prototype.hasOwnProperty.call(payload, 'pic_birth')) payload.pic_birth = normalizeDate(payload.pic_birth);
                if (Object.prototype.hasOwnProperty.call(payload, 'mou_expired')) payload.mou_expired = normalizeDate(payload.mou_expired);
                if (Object.prototype.hasOwnProperty.call(payload, 'surat_pelayanan_expired')) payload.surat_pelayanan_expired = normalizeDate(payload.surat_pelayanan_expired);
                // Normalisasi kolom numerik agar tidak mengirimkan string kosong ke DB
                if (payload.top !== undefined) {
                    if (payload.top === '') {
                        payload.top = 0;
                    } else {
                        const parsedTop = parseInt(payload.top, 10);
                        payload.top = Number.isNaN(parsedTop) ? 0 : parsedTop;
                    }
                }
                if (payload.tax_phone_office === '') payload.tax_phone_office = 0;
                if (payload.invoice_phone_office === '') payload.invoice_phone_office = 0;
                if (payload.bank_phone_office === '') payload.bank_phone_office = 0;
                if (payload.top === '') payload.top = 0;

                const updateData = await models.customer.update(
                    payload,
                    {
                        where: {
                            id_customer: req.body.id_customer
                        }
                    }
                )
            if (updateData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success update Customer'
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

exports.getSelectCreatAddress = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getCustomer = await models.customer.findAll({})
            const getProvinsi = await models.m_wil_provinsi.findAll({})
            const getKota = await models.m_wil_kota.findAll(
                {
                    ...req.query.idProv ? {
                        where: {
                            id_provinsi: req.query.idProv

                        }
                    } : {}
                }
            )
            const getKecamatan = await models.m_wil_kecamatan.findAll(
                {
                    ...req.query.idKota ? {
                        where: {
                            id_kota: req.query.idKota
                        }
                    } : {}
                }
            )

            if (getCustomer && getKecamatan && getKota && getProvinsi) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    customer: getCustomer.map((i) => {
                        return {
                            id: i.id_customer,
                            customer: i.nama_perusahaan,
                            customerCode: i.kode_customer
                        }
                    }),
                    provinsi: getProvinsi.map((i) => {
                        return {
                            id: i.id_provinsi,
                            provName: i.nama_provinsi
                        }
                    }),
                    kota: req.query.idProv ? getKota.map((i) => {
                        return {
                            id: i.id_kota,
                            kotaName: i.nama_kota
                        }
                    }) : {},
                    kecamatan: req.query.idKota ? getKecamatan.map((i) => {
                        return {
                            id: i.id_kecamatan,
                            kecamatanName: i.nama_kecamatan
                        }
                    }) : {}
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
exports.createCustomerAddress = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getData = await models.alamat.create(
                {
                    'id_customer': req.body.id_customer,
                    'pic': req.body.pic,
                    'jabatan': req.body.jabatan,
                    'hp': req.body.hp,
                    'email': req.body.email,
                    'foto': "",
                    'alamat': req.body.alamat,
                    'alamat_detail': req.body.alamat,
                    'kecamatan': "",
                    'kota': "",
                    'kode_wilayah': req.body.kode_wilayah,
                    'kode_provinsi': "",
                    'ritase': req.body.ritase,
                    'id_kecamatan': req.body.id_kecamatan,
                    'id_kota': req.body.id_kota,
                    'id_provinsi': req.body.id_provinsi,
                    'lat': req.body.lat,
                    'lon': req.body.lon

                }
            )
            if (getData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success create address customer'
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
exports.editCustomerAddress = async (req, res) => {
    try {

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updateData = await models.alamat.update(
                {
                    // 'id_customer': req.body.id_customer,
                    pic: req.body.pic,
                    jabatan: req.body.jabatan,
                    hp: req.body.hp,
                    email: req.body.email,
                    alamat: req.body.alamat,
                    alamat_detail: req.body.alamat,
                    kecamatan: req.body.kecamatan,
                    kota: req.body.kota,
                    kode_wilayah: req.body.kode_wilayah,
                    ritase: req.body.ritase,
                    id_kecamatan: req.body.id_kecamatan,
                    id_kota: req.body.id_kota,
                    id_provinsi: req.body.id_provinsi,
                    lat: req.body.lat,
                    lon: req.body.lon

                },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )
            if (updateData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success update alamat'
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

exports.getCustomerDetailAlamat = async (req, res) => {
    try {

        models.alamat.belongsTo(models.m_wil_provinsi, { targetKey: 'id_provinsi', foreignKey: 'id_provinsi' });

        const getUser = await models.users.findAll(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDetail = await models.alamat.findAll(
                {
                    where: {
                        id: req.query.id
                    },
                    include: [
                        {
                            model: models.m_wil_provinsi
                        }
                    ]
                }
            )
            if (getDetail) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: req.query.id ? getDetail.map((i) => {
                        return {
                            customerAddressId: i.id,
                            customerId: i.id_customer,
                            // customer: i.customer.nama_perusahaan,
                            pic: i.pic,
                            jabatan: i.jabatan,
                            hp: i.hp,
                            email: i.email,
                            foto: i.foto,
                            alamat: i.alamat,
                            alamat_detail: i.alamat_detail,
                            kecamatan: i.kecamatan,
                            id_kecamatan: i.id_kecamatan,
                            id_kota: i.id_kota,
                            id_provinsi: i.id_provinsi,
                            provinsi: i.m_wil_provinsi == null ? "-" : i.m_wil_provinsi.nama_provinsi,
                            kota: i.kota,
                            kode_wilayah: i.kode_wilayah,
                            kode_provinsi: i.kode_provinsi,
                            ritase: i.ritase,
                            lat: i.lat,
                            lon: i.lon

                        }
                    }) : {}

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

exports.getSelectCustomer = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            // const getCustomerCode = await models.customer.findAll(
            //     {
            //         limit:1,
            //         order:[['id_customer','desc']]
            //     }
            // )


            //---///
            // const getcodeSp = getCode

            // const getcode = Number(getCode[0].msp.substring(2, 7))
            // // console.log("🚀 ~ file: sp.controller.js:36 ~ exports.getSelectCreateSp= ~ getcodeSp:", getcodeSp)
            // const getcharacterNumber = getcodeSp.toString()
            // const spCode = getcodeSp + 1
            // const getDate = getCode[0].msp.substring(11, 13)
            // // console.log("🚀 ~ file: sp.controller.js:39 ~ exports.getSelectCreateSp= ~ getDate:", getDate)
            // const kodeCabang = getUser.kode_cabang

            const getCustomer = await models.customer.findAll(
                {
                    // where: {
                    //     status: 1
                    // }
                }
            )
            const getProvinsi = await models.m_wil_provinsi.findAll(
                {

                }
            )
            if (getCustomer && getProvinsi) {


                output = {
                    status: {
                        code: 200,
                        message: "succes get data"
                    },
                    customer: getCustomer.map((i) => {
                        return {
                            customerId: i.id_customer,
                            customerName: i.nama_perusahaan
                        }
                    }),
                    provinsi: getProvinsi.map((i) => {
                        return {
                            idProvinsi: i.id_provinsi,
                            provinsiName: i.nama_provinsi
                        }
                    })
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


exports.createInvoiceAddress = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const createData = await models.customer_npwp.create(
                {
                    'customer_id': req.body.customer_id,
                    'pic_name': req.body.pic_name,
                    'pic_position': req.body.pic_position,
                    'pic_phone': req.body.pic_phone,
                    'pic_number': req.body.pic_number,
                    'pic_email': req.body.pic_email,
                    'pic_fax': req.body.pic_fax,
                    'npwp': req.body.npwp,
                    'address_npwp': req.body.address_npwp,
                    'format_npwp': req.body.format_npwp,
                    'address_office': req.body.address_office,
                    'address_google': req.body.address_google,
                    'latitude': 0,
                    'longitude': 0,
                    'date_created': core.moment(Date.now()),
                    'date_update': Date.now(),

                }
            )
            if (createData) {
                output = {
                    status: {
                        code: 200,
                        message: "succes create invoice Address"
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
exports.GetInvoiceAddress = async (req, res) => {
    try {
        models.customer_npwp.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'customer_id' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.customer_npwp.findAll(
                {
                    ...req.query.id_customer ? {
                        where: {
                            customer_id: req.query.id_customer
                        }
                    } : {},
                    include: [
                        {
                            model: models.customer
                        }
                    ]


                }
            )
            if (getData) {
                output = {
                    status: {
                        code: 200,
                        message: "succes get data"
                    },
                    data: req.query.id_customer ? getData.map((i) => {
                        return {
                            invoiceAddressId: i.npwp_id,
                            customerId: i.customer_id,
                            customer: i.customer.nama_perusahaan,
                            picName: i.pic_name == null ? "-" : i.pic_name,
                            picPosition: i.pic_position == null ? "-" : i.pic_position,
                            picPhone: i.pic_phone == null ? "-" : i.pic_phone,
                            picNumber: i.pic_number == null ? "-" : i.pic_number,
                            picEmail: i.pic_email == null ? "-" : i.pic_email,
                            picFax: i.pic_fax == null ? "-" : i.pic_fax,
                            npwp: i.npwp == null ? "-" : i.npwp,
                            addressNpwp: i.address_npwp == null ? "-" : i.address_npwp,
                            formatNpwp: i.format_npwp == null ? "-" : i.format_npwp,
                            addressOffice: i.address_office == null ? "-" : i.address_office,
                            addressGoogle: i.address_google == null ? "-" : i.address_google,
                            // item: i

                        }
                    }) : {}
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
exports.GetDetailInvoiceAddress = async (req, res) => {
    try {
        models.customer_npwp.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'customer_id' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.customer_npwp.findAll(
                {
                    where: {
                        npwp_id: req.query.npwp_id
                    },
                    include: [
                        {
                            model: models.customer
                        }
                    ]


                }
            )
            if (getData) {
                output = {
                    status: {
                        code: 200,
                        message: "succes get data"
                    },
                    data: req.query.npwp_id ? getData.map((i) => {
                        return {
                            customerId: i.customer.id_customer,
                            customer: i.customer.nama_perusahaan,
                            picName: i.pic_name == null ? "-" : i.pic_name,
                            picPosition: i.pic_position == null ? "-" : i.pic_position,
                            picPhone: i.pic_phone == null ? "-" : i.pic_phone,
                            picNumber: i.pic_number == null ? "-" : i.pic_number,
                            picEmail: i.pic_email == null ? "-" : i.pic_email,
                            picFax: i.pic_fax == null ? "-" : i.pic_fax,
                            npwp: i.npwp == null ? "-" : i.npwp,
                            // addressNpwp:i.address_npwp == null ? "-":i.address_npwp,
                            addressNpwp: i.address_npwp == null ? "-" : i.address_npwp,
                            formatNpwp: i.format_npwp == null ? "-" : i.format_npwp,
                            addressOffice: i.address_office == null ? "-" : i.address_office,
                            addressGoogle: i.address_google == null ? "-" : i.address_google,

                        }
                    }) : {}
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
exports.editInovoiceAddress = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const editData = await models.customer_npwp.update(
                {
                    customer_id: req.body.customer_id,
                    pic_name: req.body.pic_name,
                    pic_position: req.body.pic_position,
                    pic_phone: req.body.pic_phone,
                    pic_number: req.body.pic_number,
                    pic_email: req.body.pic_email,
                    pic_fax: req.body.pic_fax,
                    npwp: req.body.npwp,
                    address_npwp: req.body.address_npwp,
                    format_npwp: req.body.format_npwp,
                    address_office: req.body.address_office,
                    address_google: req.body.address_google,
                },
                {
                    where: {
                        npwp_id: req.body.invoice_address_id
                    }
                }
            )
            if (editData) {
                output = {
                    status: {
                        code: 200,
                        message: "succes edit alamat invoice"
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


exports.getBuReport = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getBu = await models.m_bu.findAll(

            )
            const getBuBrench = await models.m_bu_brench.findAll(
                {
                    ...req.query.id_bu ? {
                        where: {
                            status: "1",
                            id_bu: req.query.id_bu
                        }
                    } : {}
                }
            )
            if (getBu) {
                output = {
                    status: {
                        code: 200,
                        message: "succes get bu"
                    },
                    data: getBu,
                    buBrench: req.query.id_bu ? getBuBrench : {},
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

exports.getCabang = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getCabang = await models.m_pengadaan.findAll(
                {
                    group: ['msp']
                }
            )
            if (getCabang) {
                output = {
                    status: {
                        code: 200,
                        message: "Succes Get Data"
                    },
                    data: getCabang.map((i) => i.msp)

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

exports.getReportCustomer = async (req, res) => {
    try {
        if (!models.m_pengadaan.associations.salesName) {
            models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales', as: 'salesName' });
        }
        if (!models.m_pengadaan.associations.adminName) {
            models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_admin', as: 'adminName' });
        }
        // models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales', });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        // models.m_pengadaan.belongsTo(models.m_chat, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        // models.m_pengadaan.belongsTo(models.m_chat, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_approve.belongsTo(models.users, { targetKey: 'id', foreignKey: 'sales' });

        models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });



        // Setup associations for m_pengadaan_detail
        if (!models.m_pengadaan_detail.associations.muat) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat', as: 'muat' });
        }
        if (!models.m_pengadaan_detail.associations.bongkar) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'bongkar' });
        }
        if (!models.m_pengadaan_detail.associations.m_sm) {
            models.m_pengadaan_detail.hasMany(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        }


        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const yearNow = core.moment(Date.now).format('YYYY')
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            // Format tanggal seperti PHP: Y-m-d 00:00:00 sampai Y-m-d 23:59:59
            const dateFirst = req.query.date_first || req.query.startDate;
            const dateUntil = req.query.date_until || req.query.endDate;
            
            let startDate, endDate;
            if (dateFirst && dateUntil) {
                startDate = core.moment(dateFirst).format('YYYY-MM-DD 00:00:00');
                endDate = core.moment(dateUntil).format('YYYY-MM-DD 23:59:59');
            }

            const getData = await models.m_pengadaan.findAndCountAll(
                {
                    order: [['id_mp', 'desc']],
                    where: {
                        ...dateFirst && dateUntil ? {
                            tgl_pickup: {
                                [Op.between]: [startDate, endDate],
                            }
                        } : {},

                        ...req.query.kodecbg || req.query.cabang ? {
                            msp: { [Op.like]: `%${req.query.kodecbg || req.query.cabang}%` }
                        } : {},

                        ...req.query.customer_id || req.query.customerId ? {
                            id_customer: req.query.customer_id || req.query.customerId
                        } : {},

                        ...req.query.keyword ? {
                            msp: {
                                [Op.like]: `%${req.query.keyword}%`
                            },
                        } : {},
                    },
                    // } : {},
                    // group: 'msp',
                    // attributes: [['msp']],

                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.users,
                            as: "salesName",
                            where: {
                                ...req.query.buId ? {
                                    id_bu: req.query.buId
                                } : {},
                                ...req.query.bubrenchId || req.query.sales_brench ? {
                                    id_bu_brench: req.query.bubrenchId || req.query.sales_brench
                                } : {},
                                ...req.query.sales ? {
                                    nama_lengkap: req.query.sales
                                } : {},
                            },
                            attributes: ['nama_lengkap', 'id']
                        },
                        {
                            model: models.users,
                            as: "adminName",
                            attributes: ['nama_lengkap']
                        },
                        {
                            model: models.customer,
                            required: false,
                            attributes: ['nama_perusahaan', 'id_customer']
                        },
                        {
                            model: models.m_pengadaan_detail,
                            required: false,
                            include: [
                                {
                                    model: models.alamat,
                                    as: 'muat',
                                    required: false,
                                    attributes: ['kota', 'id']
                                },
                                {
                                    model: models.alamat,
                                    as: 'bongkar',
                                    required: false,
                                    attributes: ['kota', 'id']
                                },
                                {
                                    model: models.m_sm,
                                    required: false,
                                    attributes: ['msm', 'id_msm']
                                }
                            ]
                        },
                        {
                            model: models.m_status_order,
                            required: true,
                            where: {
                                [Op.or]: [
                                    { kendaraan_operasional: 'Y' },
                                    { kendaraan_purchasing: 'Y' }
                                ]
                            },
                            include: [
                                { 
                                    model: models.users,
                                    attributes: ['nama_lengkap']
                                }
                            ]
                        },
                    ]

                }
            )


            const currentPage = Number(req.query.page) || 1; // Halaman saat ini
            const itemsPerPage = Number(req.query.limit) || 10; // Jumlah item per halaman (default 10)
            const startIndex = (currentPage - 1) * itemsPerPage + 1;
            
            // Total data dari query (sebelum filtering di JavaScript)
            const totalDataFromQuery = getData.count || 0;

            if (getData.rows) {
                let sub_total = 0;
                let sub_totaldb = 0;
                let resultIndex = 0;

                const result = getData.rows.map((item, index) => {
                    // Filter hanya yang kendaraan_operasional == 'Y' OR kendaraan_purchasing == 'Y'
                    // Note: Sebenarnya sudah difilter di query level, tapi tetap cek untuk safety
                    if (item.m_status_order && 
                        item.m_status_order.kendaraan_operasional !== 'Y' && 
                        item.m_status_order.kendaraan_purchasing !== 'Y') {
                        return null;
                    }

                    // Format destination seperti PHP: komut->kota dan msm untuk setiap detail
                    let destinationStr = '';
                    const details = item.m_pengadaan_details || [];
                    if (details.length > 0) {
                        const destinationParts = [];
                        for (const detail of details) {
                            const kotaMuat = detail.muat?.kota || '';
                            const kotaBongkar = detail.bongkar?.kota || '';
                            const msm = detail.m_sms && detail.m_sms.length > 0 ? detail.m_sms[0].msm : '';
                            
                            if (kotaMuat && kotaBongkar) {
                                destinationParts.push(`${kotaMuat}->${kotaBongkar}`);
                            }
                            if (msm) {
                                destinationParts.push(msm);
                            }
                        }
                        destinationStr = destinationParts.join('\n');
                    }

                    // Hitung price_perhitungan berdasarkan logika createDetailSp
                    // sum(((harga * jumlah)+semua biaya)-diskon)+pajak dari table m_pengadaan_detail
                    let price_perhitungan = 0;
                    if (details.length > 0) {
                        for (const detail of details) {
                            // totalProduk = harga * jumlah
                            const totalProduk = (detail.harga || 0) * (detail.jumlah || 0);
                            
                            // Semua biaya dari detail
                            const semuaBiaya = (detail.biaya_overtonase || 0) + 
                                             (detail.harga_muat || 0) + 
                                             (detail.harga_bongkar || 0) + 
                                             (detail.biaya_multidrop || 0) + 
                                             (detail.biaya_lain || 0) + 
                                             (detail.biaya_mel || 0) + 
                                             (detail.biaya_tambahan || 0) + 
                                             (detail.biaya_multimuat || 0);
                            
                            // subtotalDetail = totalProduk + semua biaya
                            const subtotalDetail = totalProduk + semuaBiaya;
                            
                            // Hitung diskon
                            const diskonPersen = detail.diskon || 0;
                            const diskonNilai = diskonPersen ? (diskonPersen / 100) * subtotalDetail : 0;
                            
                            // baseAmount = subtotalDetail - diskonNilai
                            const baseAmount = subtotalDetail - diskonNilai;
                            
                            // Hitung pajak
                            const pajakPersen = detail.pajak || 0;
                            const pajakNilai = pajakPersen ? (pajakPersen / 100) * baseAmount : 0;
                            
                            // total = baseAmount + pajakNilai
                            const total = baseAmount + pajakNilai;
                            
                            // Sum untuk price_perhitungan
                            price_perhitungan += total;
                        }
                    }

                    // pricereal diambil dari total_keseluruhan di table m_pengadaan
                    const pricereal = item.total_keseluruhan || 0;

                    // Hitung selisih
                    const selisih_total = price_perhitungan - pricereal;

                    // Update total untuk summary langsung di sini
                    sub_total += price_perhitungan;
                    sub_totaldb += pricereal;

                    // Tentukan status seperti PHP
                    let statusText = '';
                    if (item.status === '0') {
                        statusText = 'DO Cancel';
                    } else {
                        let alto = '';
                        let altp = '';
                        
                        if (item.m_status_order?.operasional === '0' || !item.m_status_order?.operasional) {
                            alto = 'ops waiting';
                        } else {
                            alto = item.m_status_order?.kendaraan_operasional === 'Y' ? 'Ops Ready' : 'Ops No Ready';
                        }

                        if (item.m_status_order?.purchasing === '0' || !item.m_status_order?.purchasing) {
                            altp = 'purch waiting';
                        } else {
                            altp = item.m_status_order?.kendaraan_purchasing === 'Y' ? 'Purch Ready' : 'Purch No Ready';
                        }
                        statusText = `${alto} dan ${altp}`;
                    }

                    const kendaraan = details.length > 0 ? details[0].kendaraan : '-';

                    const resultItem = {
                        no: startIndex + resultIndex++,
                        idmp: item.id_mp,
                        sp: item.msp,
                        spk: item.mspk,
                        salesName: item.salesName == null ? "-" : item.salesName.nama_lengkap,
                        adminName: item.adminName == null ? "-" : item.adminName.nama_lengkap,
                        perusahaan: item.customer?.nama_perusahaan || '-',
                        destination: destinationStr || '-',
                        pickupDate: item.tgl_pickup ? core.moment(item.tgl_pickup).format('DD-MM-YYYY') : '-',
                        orderDate: item.tgl_order ? core.moment(item.tgl_order).format('DD-MM-YYYY') : '-',
                        kendaraan: kendaraan,
                        price_perhitungan: price_perhitungan,
                        pricereal: pricereal,
                        selisih: selisih_total,
                        hasSelisih: selisih_total !== 0,
                        status: item.status,
                        statusText: statusText,
                        kendaraan_operasional: item.m_status_order?.kendaraan_operasional || '',
                        kendaraan_purchasing: item.m_status_order?.kendaraan_purchasing || '',
                        id_sales: item.id_sales || ''
                    };

                    return resultItem;
                });

                // Filter out null results
                const filteredResult = result.filter(item => item !== null);

                // Hitung totalData dan totalPage dari query count
                const totalData = totalDataFromQuery;
                const totalPage = Math.ceil(totalData / itemsPerPage);
                const canLoadMore = currentPage < totalPage;

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {
                        totalData: totalData,
                        totalPage: totalPage,
                        limit: itemsPerPage,
                        currentPage: currentPage,
                        canLoadMore: canLoadMore,
                        order: filteredResult,
                        summary: {
                            sub_total: sub_total,
                            sub_totaldb: sub_totaldb,
                            selisih_total: sub_total - sub_totaldb
                        }
                    }
                };
            } else {
                const totalData = getData.count || 0;
                const totalPage = Math.ceil(totalData / itemsPerPage);
                const canLoadMore = currentPage < totalPage;
                
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {
                        totalData: totalData,
                        totalPage: totalPage,
                        limit: itemsPerPage,
                        currentPage: currentPage,
                        canLoadMore: canLoadMore,
                        order: [],
                        summary: {
                            sub_total: 0,
                            sub_totaldb: 0,
                            selisih_total: 0
                        }
                    }
                };
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

exports.getCustomerAll = async (req, res) => {
  try {
    models.customer.hasMany(models.alamat, {
      targetKey: 'id_customer',
      foreignKey: 'id_customer'
    });

    const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

    const getDataCust = await models.customer.findAndCountAll({
      distinct: true,
      where: {
        ...(req.query.status !== undefined && req.query.status !== '' ? { status: req.query.status } : {}),
        ...req.query.keyword ? {
          [Op.or]: [
            { kode_customer: { [Op.like]: `%${req.query.keyword}%` } },
            { nama_perusahaan: { [Op.like]: `%${req.query.keyword}%` } }
          ]
        } : {}
      },
      limit,
      offset,
      include: [
        {
          model: models.alamat,
          required: false
        }
      ],
      order: [['id_customer', 'desc']]
    });

    let no = (getDataCust.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
    const result = getDataCust.rows.map((item) => ({
      no: no++,
      custId: item.id_customer,
      custCode: item.kode_customer,
      custName: item.nama_perusahaan,
      custStuff: item.jenis_barang,
      custBirth: item.tgl_berdiri,
      yearBirthL: item.tahun_berdiri,
      custNpwp: item.npwp,
      custAddresNpwp: item.alamat_npwp,
      custTelephone: item.telepon,
      custAddress: item.alamats.map((i) => ({
        idAddress: i.id,
        address: i.alamat,
        city: i.kota
      }))
    }));

    const output = {
      status: {
        code: 200,
        message: 'Success get Data'
      },
      data: {
        totalData: getDataCust.count,
        totalPage: Math.ceil(getDataCust.count / req.query.limit),
        limit: Number(req.query.limit),
        currentPage: Number(req.query.page),
        order: result
      }
    };

    res.status(200).send(output);

  } catch (error) {
    res.status(500).send({
      status: {
        code: 500,
        message: error.message
      }
    });
  }
};

exports.exportReportCustomerExcel = async (req, res) => {
    try {
        // Setup associations (sama dengan getReportCustomer)
        if (!models.m_pengadaan.associations.salesName) {
            models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales', as: 'salesName' });
        }
        if (!models.m_pengadaan.associations.adminName) {
            models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_admin', as: 'adminName' });
        }
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });

        // Setup associations for m_pengadaan_detail
        if (!models.m_pengadaan_detail.associations.muat) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat', as: 'muat' });
        }
        if (!models.m_pengadaan_detail.associations.bongkar) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'bongkar' });
        }
        if (!models.m_pengadaan_detail.associations.m_sm) {
            models.m_pengadaan_detail.hasMany(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        }

        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (!getUser) {
            return res.status(401).json({
                status: {
                    code: 401,
                    message: 'Unauthorized'
                }
            });
        }

        // Format tanggal
        const dateFirst = req.query.date_first || req.query.startDate;
        const dateUntil = req.query.date_until || req.query.endDate;
        
        let startDate, endDate;
        if (dateFirst && dateUntil) {
            startDate = core.moment(dateFirst).format('YYYY-MM-DD 00:00:00');
            endDate = core.moment(dateUntil).format('YYYY-MM-DD 23:59:59');
        }

        // Query data tanpa pagination
        const getData = await models.m_pengadaan.findAll({
            order: [['id_mp', 'desc']],
            where: {
                ...dateFirst && dateUntil ? {
                    tgl_pickup: {
                        [Op.between]: [startDate, endDate],
                    }
                } : {},

                ...req.query.kodecbg || req.query.cabang ? {
                    msp: { [Op.like]: `%${req.query.kodecbg || req.query.cabang}%` }
                } : {},

                ...req.query.customer_id || req.query.customerId ? {
                    id_customer: req.query.customer_id || req.query.customerId
                } : {},

                ...req.query.keyword ? {
                    msp: {
                        [Op.like]: `%${req.query.keyword}%`
                    },
                } : {},
            },
            include: [
                {
                    model: models.users,
                    as: "salesName",
                    where: {
                        ...req.query.buId ? {
                            id_bu: req.query.buId
                        } : {},
                        ...req.query.bubrenchId || req.query.sales_brench ? {
                            id_bu_brench: req.query.bubrenchId || req.query.sales_brench
                        } : {},
                        ...req.query.sales ? {
                            nama_lengkap: req.query.sales
                        } : {},
                    },
                    attributes: ['nama_lengkap', 'id']
                },
                {
                    model: models.users,
                    as: "adminName",
                    attributes: ['nama_lengkap']
                },
                {
                    model: models.customer,
                    required: false,
                    attributes: ['nama_perusahaan', 'id_customer']
                },
                {
                    model: models.m_pengadaan_detail,
                    required: false,
                    attributes: ['kendaraan', 'kendaraan_mitra', 'id_mpd'],
                    include: [
                        {
                            model: models.alamat,
                            as: 'muat',
                            required: false,
                            attributes: ['kota', 'alamat', 'alamat_detail', 'kecamatan']
                        },
                        {
                            model: models.alamat,
                            as: 'bongkar',
                            required: false,
                            attributes: ['kota', 'alamat', 'alamat_detail', 'kecamatan']
                        },
                        {
                            model: models.m_sm,
                            required: false,
                            attributes: ['msm', 'id_msm']
                        }
                    ]
                },
                {
                    model: models.m_status_order,
                    required: true,
                    where: {
                        [Op.or]: [
                            { kendaraan_operasional: 'Y' },
                            { kendaraan_purchasing: 'Y' }
                        ]
                    }
                },
            ]
        });

        // Prepare Excel data dengan tracking untuk merge cells
        const excelRows = [];
        const mergeRanges = []; // Untuk menyimpan range merge
        let rowNo = 1; // Dimulai dari 1 sesuai permintaan
        let currentExcelRow = 2; // Baris Excel dimulai dari 2 (setelah header)

        for (const item of getData) {
            // Filter hanya yang kendaraan_operasional == 'Y' OR kendaraan_purchasing == 'Y'
            if (item.m_status_order && 
                item.m_status_order.kendaraan_operasional !== 'Y' && 
                item.m_status_order.kendaraan_purchasing !== 'Y') {
                continue;
            }

            const details = item.m_pengadaan_details || [];
            
            // Hitung total SM untuk menentukan berapa baris yang akan di-merge
            let totalSms = 0;
            for (const detail of details) {
                const sms = detail.m_sms || [];
                totalSms += sms.length;
            }
            
            // Jika tidak ada SM, tetap buat 1 baris
            if (totalSms === 0) totalSms = 1;
            
            const startRow = currentExcelRow;
            const endRow = currentExcelRow + totalSms - 1;
            
            // Hitung price_perhitungan
            let price_perhitungan = 0;
            if (details.length > 0) {
                for (const detail of details) {
                    const totalProduk = (detail.harga || 0) * (detail.jumlah || 0);
                    const semuaBiaya = (detail.biaya_overtonase || 0) + 
                                     (detail.harga_muat || 0) + 
                                     (detail.harga_bongkar || 0) + 
                                     (detail.biaya_multidrop || 0) + 
                                     (detail.biaya_lain || 0) + 
                                     (detail.biaya_mel || 0) + 
                                     (detail.biaya_tambahan || 0) + 
                                     (detail.biaya_multimuat || 0);
                    const subtotalDetail = totalProduk + semuaBiaya;
                    const diskonPersen = detail.diskon || 0;
                    const diskonNilai = diskonPersen ? (diskonPersen / 100) * subtotalDetail : 0;
                    const baseAmount = subtotalDetail - diskonNilai;
                    const pajakPersen = detail.pajak || 0;
                    const pajakNilai = pajakPersen ? (pajakPersen / 100) * baseAmount : 0;
                    const total = baseAmount + pajakNilai;
                    price_perhitungan += total;
                }
            }

            const pricereal = item.total_keseluruhan || 0;

            // Ambil detail pertama untuk baris utama
            const firstDetail = details.length > 0 ? details[0] : null;
            const firstMsm = firstDetail && firstDetail.m_sms && firstDetail.m_sms.length > 0 
                ? firstDetail.m_sms[0].msm 
                : '';

            // Format alamat muat (lengkap dengan semua bagian)
            let alamatMuat = '';
            if (firstDetail && firstDetail.muat) {
                const muat = firstDetail.muat;
                const parts = [];
                if (muat.alamat) parts.push(muat.alamat);
                if (muat.alamat_detail) parts.push(muat.alamat_detail);
                if (muat.kecamatan) parts.push(muat.kecamatan);
                if (muat.kota) parts.push(muat.kota);
                alamatMuat = parts.join(', ').trim();
            }

            // Format alamat bongkar (lengkap dengan semua bagian)
            let alamatBongkar = '';
            if (firstDetail && firstDetail.bongkar) {
                const bongkar = firstDetail.bongkar;
                const parts = [];
                if (bongkar.alamat) parts.push(bongkar.alamat);
                if (bongkar.alamat_detail) parts.push(bongkar.alamat_detail);
                if (bongkar.kecamatan) parts.push(bongkar.kecamatan);
                if (bongkar.kota) parts.push(bongkar.kota);
                alamatBongkar = parts.join(', ').trim();
            }

            // Format tujuan
            let tujuan = '';
            if (firstDetail && firstDetail.muat && firstDetail.bongkar) {
                const kotaMuat = firstDetail.muat.kota || '';
                const kotaBongkar = firstDetail.bongkar.kota || '';
                if (kotaMuat && kotaBongkar) {
                    tujuan = `${kotaMuat}->${kotaBongkar}`;
                }
            }

            // Tentukan status seperti di getReportCustomer
            let statusText = '';
            if (item.status === '0') {
                statusText = 'DO Cancel';
            } else {
                let alto = '';
                let altp = '';
                
                if (item.m_status_order?.operasional === '0' || !item.m_status_order?.operasional) {
                    alto = 'ops waiting';
                } else {
                    alto = item.m_status_order?.kendaraan_operasional === 'Y' ? 'Ops Ready' : 'Ops No Ready';
                }

                if (item.m_status_order?.purchasing === '0' || !item.m_status_order?.purchasing) {
                    altp = 'purch waiting';
                } else {
                    altp = item.m_status_order?.kendaraan_purchasing === 'Y' ? 'Purch Ready' : 'Purch No Ready';
                }
                statusText = `${alto} dan ${altp}`;
            }

            // Baris pertama dengan data lengkap (SP + SM pertama dari detail pertama)
            excelRows.push({
                no: rowNo++,
                noSP: item.msp || '',
                noSM: firstMsm,
                perusahaan: item.customer?.nama_perusahaan || '',
                sales: item.salesName?.nama_lengkap || '',
                tujuan: tujuan,
                alamatMuat: alamatMuat,
                alamatDestinasi: alamatBongkar,
                tglPickup: item.tgl_pickup ? core.moment(item.tgl_pickup).format('DD-MM-YYYY') : '',
                orderDate: item.tgl_order ? core.moment(item.tgl_order).format('DD-MM-YYYY') : '',
                kendaraan: firstDetail?.kendaraan || '',
                price: price_perhitungan,
                realprice: pricereal,
                status: statusText
            });
            currentExcelRow++;

            // Baris tambahan untuk setiap m_sm lainnya dari semua detail
            // Loop semua detail
            for (let i = 0; i < details.length; i++) {
                const detail = details[i];
                const sms = detail.m_sms || [];
                
                // Untuk detail pertama, skip SM pertama karena sudah di baris utama
                // Untuk detail lainnya, ambil semua SM
                const startIndex = (i === 0 && sms.length > 0) ? 1 : 0;
                
                for (let j = startIndex; j < sms.length; j++) {
                    const sm = sms[j];
                    
                    // Format alamat untuk SM ini (lengkap dengan semua bagian)
                    let smAlamatMuat = '';
                    if (detail.muat) {
                        const muat = detail.muat;
                        const parts = [];
                        if (muat.alamat) parts.push(muat.alamat);
                        if (muat.alamat_detail) parts.push(muat.alamat_detail);
                        if (muat.kecamatan) parts.push(muat.kecamatan);
                        if (muat.kota) parts.push(muat.kota);
                        smAlamatMuat = parts.join(', ').trim();
                    }

                    let smAlamatBongkar = '';
                    if (detail.bongkar) {
                        const bongkar = detail.bongkar;
                        const parts = [];
                        if (bongkar.alamat) parts.push(bongkar.alamat);
                        if (bongkar.alamat_detail) parts.push(bongkar.alamat_detail);
                        if (bongkar.kecamatan) parts.push(bongkar.kecamatan);
                        if (bongkar.kota) parts.push(bongkar.kota);
                        smAlamatBongkar = parts.join(', ').trim();
                    }

                    // Format tujuan untuk SM ini
                    let smTujuan = '';
                    if (detail.muat && detail.bongkar) {
                        const kotaMuat = detail.muat.kota || '';
                        const kotaBongkar = detail.bongkar.kota || '';
                        if (kotaMuat && kotaBongkar) {
                            smTujuan = `${kotaMuat}->${kotaBongkar}`;
                        }
                    }

                    excelRows.push({
                        no: '',
                        noSP: '',
                        noSM: sm.msm || '',
                        perusahaan: '',
                        sales: '',
                        tujuan: smTujuan,
                        alamatMuat: smAlamatMuat,
                        alamatDestinasi: smAlamatBongkar,
                        tglPickup: '',
                        orderDate: '',
                        kendaraan: '',
                        price: '',
                        realprice: '',
                        status: ''
                    });
                    currentExcelRow++;
                }
            }
            
            // Simpan range untuk merge (hanya jika ada lebih dari 1 baris)
            if (endRow > startRow) {
                // Merge kolom: No (A), No SP (B), Perusahaan (D), Sales (E), Tgl Pickup (I), Order Date (J), Kendaraan (K), Price (L), Realprice (M), Status (N)
                mergeRanges.push(
                    { start: startRow, end: endRow, col: 'A' }, // No
                    { start: startRow, end: endRow, col: 'B' }, // No SP
                    { start: startRow, end: endRow, col: 'D' }, // Perusahaan
                    { start: startRow, end: endRow, col: 'E' }, // Sales
                    { start: startRow, end: endRow, col: 'I' }, // Tgl Pickup
                    { start: startRow, end: endRow, col: 'J' }, // Order Date
                    { start: startRow, end: endRow, col: 'K' }, // Kendaraan
                    { start: startRow, end: endRow, col: 'L' }, // Price
                    { start: startRow, end: endRow, col: 'M' }, // Realprice
                    { start: startRow, end: endRow, col: 'N' }  // Status
                );
            }
        }

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report Customer');

        // Set column headers
        worksheet.columns = [
            { header: 'No', key: 'no', width: 8 },
            { header: 'No SP', key: 'noSP', width: 20 },
            { header: 'No SM', key: 'noSM', width: 20 },
            { header: 'Perusahaan', key: 'perusahaan', width: 40 },
            { header: 'Sales', key: 'sales', width: 20 },
            { header: 'Tujuan', key: 'tujuan', width: 25 },
            { header: 'Alamat Muat', key: 'alamatMuat', width: 50 },
            { header: 'Alamat Destinasi', key: 'alamatDestinasi', width: 50 },
            { header: 'Tgl Pickup', key: 'tglPickup', width: 15 },
            { header: 'Order Date', key: 'orderDate', width: 15 },
            { header: 'Kendaraan', key: 'kendaraan', width: 20 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Realprice', key: 'realprice', width: 15 },
            { header: 'Status', key: 'status', width: 15 }
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Add data rows
        excelRows.forEach(row => {
            const excelRow = worksheet.addRow(row);
            // Set alignment untuk kolom yang di-merge
            excelRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }; // No
            excelRow.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' }; // No SP
            excelRow.getCell(4).alignment = { vertical: 'middle', horizontal: 'left' }; // Perusahaan
            excelRow.getCell(5).alignment = { vertical: 'middle', horizontal: 'left' }; // Sales
            excelRow.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' }; // Tgl Pickup
            excelRow.getCell(10).alignment = { vertical: 'middle', horizontal: 'center' }; // Order Date
            excelRow.getCell(11).alignment = { vertical: 'middle', horizontal: 'center' }; // Kendaraan
            excelRow.getCell(12).alignment = { vertical: 'middle', horizontal: 'right' }; // Price
            excelRow.getCell(13).alignment = { vertical: 'middle', horizontal: 'right' }; // Realprice
            excelRow.getCell(14).alignment = { vertical: 'middle', horizontal: 'center' }; // Status
        });

        // Merge cells untuk baris yang sama SP
        mergeRanges.forEach(range => {
            worksheet.mergeCells(`${range.col}${range.start}:${range.col}${range.end}`);
            // Set alignment untuk merged cells
            const cell = worksheet.getCell(`${range.col}${range.start}`);
            let horizontalAlign = 'center';
            if (range.col === 'D' || range.col === 'E') {
                // Perusahaan dan Sales: left align
                horizontalAlign = 'left';
            } else if (range.col === 'L' || range.col === 'M') {
                // Price dan Realprice: right align
                horizontalAlign = 'right';
            }
            cell.alignment = { vertical: 'middle', horizontal: horizontalAlign };
        });

        // Set response headers
        const filename = `report_customer_${core.moment().format('YYYYMMDD_HHmmss')}.xlsx`;
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Write Excel file to response
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error exportReportCustomerExcel:', error);
        
        if (!res.headersSent) {
            res.status(500).json({
                status: {
                    code: 500,
                    message: error.message
                }
            });
        } else {
            console.error('Headers already sent, cannot send error response');
        }
    }
};


