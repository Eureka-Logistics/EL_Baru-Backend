const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where } = require('sequelize');

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



        // if (!models.m_pengadaan_detail.associations.kotaTujuan) {
        //     models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'kotaTujuan' });
        // }
        if (!models.m_pengadaan.associations.gl) {
            models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_gl', as: 'gl' });
        }
        if (!models.m_pengadaan.associations.asm) {
            models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_asm', as: 'asm' });
        }
        if (!models.m_pengadaan.associations.mgr) {
            models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_mgr', as: 'mgr' });
        }
        if (!models.m_pengadaan.associations.kacab) {
            models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_kacab', as: 'kacab' });
        }
        if (!models.m_pengadaan.associations.amd) {
            models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_amd', as: 'amd' });
        }

        // models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat' });
        // models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });


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

            const startDate = core.moment(req.query.startDate); // Tanggal awal dalam format yang sesuai
            const endDate = core.moment(req.query.endDate);

            const getData = await models.m_pengadaan.findAndCountAll(
                {
                    order: [['id_mp', 'desc']],
                    // ...req.query.statusSP ? {
                    where: {
                        tgl_order: {
                            [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
                        },

                        ...req.query.keyword ? {
                            msp: {
                                [Op.like]: `%${req.query.keyword}%`
                            },
                        } : {},

                        // ...req.query.tglPickup ? {
                        //     tgl_pickup: req.query.tglPickup
                        // } : {},
                        ...req.query.tglBongkar ? {
                            tgl_bongkar: req.query.tglBongkar
                        } : {},

                        ...req.query.customerId ? {
                            id_customer: req.query.customerId
                        } : {},
                        ...req.query.cabang ? {
                            msp: { [Op.like]: `%${req.query.cabang}` }
                        } : {},
                        // `...req.query.sales ? {
                        //     id_sales: req.query.sales
                        // } : {},`
                        ...req.query.startDate && req.query.endDate ? {
                            tgl_pickup: {
                                [Op.between]: [startDate, endDate],
                            }
                        } : {},
                        ...req.query.statusSP ? { status: req.query.statusSP } : {},
                        // [Op.and]: [
                        //     // Sequelize.where(Sequelize.col('m_status_order.purchasing'), {
                        //     //     [Op.ne]: 0
                        //     // }),
                        //     Sequelize.where(Sequelize.col('m_status_order.kendaraan_purchasing'), '=', 'Y')
                        // ]


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
                            // required: true,
                            where: {
                                ...req.query.buId ? {
                                    id_bu: req.query.buId
                                } : {},
                                ...req.query.bubrenchId ? {
                                    id_bu_brench: req.query.bubrenchId
                                } : {},
                                ...req.query.sales ? {
                                    nama_lengkap: req.query.sales
                                } : {},
                            },
                            attributes: ['nama_lengkap']
                        },
                        {
                            model: models.users,
                            as: "adminName",
                            // required: true,
                            // where: {
                            //     ...req.query.buId ? {
                            //         id_bu: req.query.buId
                            //     } : {},
                            // },
                            // attributes: ['nama_lengkap']
                        },
                        {
                            model: models.customer,
                            required: false,


                        },
                        {
                            model: models.m_pengadaan_detail,
                            required: false,
                            // include: [
                            //     {
                            //         model: models.alamat,
                            //         as: 'kotaAsal',
                            //         attributes: ['kota'],
                            //         // where: { id: { [Op.in]: bongkar } }
                            //     },
                            //     {
                            //         model: models.alamat,
                            //         as: 'kotaTujuan',
                            //         attributes: ['kota'],
                            //         // where: { id: { [Op.in]: muat } }
                            //     }
                            // ]

                        },

                        {
                            model: models.m_status_order,
                            required: true,
                            where: {
                                purchasing: {
                                    [Op.ne]: 0
                                },
                                kendaraan_purchasing: "Y",
                            },

                            include: [
                                { model: models.users }
                            ]

                        },
                        {
                            model: models.m_bu_employee,
                            as: 'gl',
                            attributes: ['fullname']
                        },
                        {
                            model: models.m_bu_employee,
                            as: 'asm',
                            attributes: ['fullname']
                        },
                        {
                            model: models.m_bu_employee,
                            as: 'mgr',
                            attributes: ['fullname']

                        },
                        {
                            model: models.m_bu_employee,
                            as: 'kacab',
                            attributes: ['fullname']

                        },
                        {
                            model: models.m_bu_employee,
                            as: 'amd',
                            attributes: ['fullname']

                        },
                    ]

                }
            )


            if (getData.rows) {

                const currentPage = Number(req.query.page) || 1; // Halaman saat ini
                const itemsPerPage = Number(req.query.limit) || 10; // Jumlah item per halaman
                const startIndex = (currentPage - 1) * itemsPerPage + 1;

                // let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = await Promise.all(getData.rows.map(async (item, index) => {
                    const bongkar = item.m_pengadaan_details.map((i) => i.id_albongkar);
                    const muat = item.m_pengadaan_details.map((i) => i.id_almuat);
                    const kendaraan = item.m_pengadaan_details.map((i) => i.kendaraan);
                    // console.log("🚀 ~ file: sp.controller.js:4728 ~ result ~ bongkar:", bongkar.slice(-1).pop())
                    // var bongkaranId
                    const getBongkar = await models.alamat.findOne({
                        ...bongkar.slice(-1).pop() != undefined ? {
                            where: {
                                id: bongkar.slice(-1).pop()
                            }
                        } : ""
                    });
                    const getMuat = await models.alamat.findOne({
                        ...muat[0] != undefined ? {
                            where: {
                                id: muat[0]
                            }
                        } : ""
                    });
                    const destination = getMuat?.kota + " - " + getBongkar?.kota;



                    return {
                        no: startIndex + index,
                        idmp: item.id_mp,
                        sp: item.msp,
                        spk: item.mspk,
                        salesName: item.salesName == null ? "-" : item.salesName.nama_lengkap,
                        adminName: item.adminName == null ? "-" : item.adminName.nama_lengkap,
                        jenisBarang: item.jenis_barang,
                        via: item.via,
                        starus: item.status == 1 ? "Aktif" : "Tidak Aktif",
                        orderDate: item.tgl_order,
                        pickupDate: item.tgl_pickup,
                        perusahaan: item.customer?.nama_perusahaan,
                        kendaraan: kendaraan[0] == null ? "-" : kendaraan[0],
                        service: item.service,
                        pickupDate: core.moment(item.tgl_pickup).format('YYYY-MM-DD HH:mm:ss'),
                        approveSales: item.m_status_order?.act_sales,
                        dateApproveSales: core.moment(item.m_status_order?.tgl_act_1).format('YYYY-MM-DD HH:mm:ss'),
                        approveAct: item.m_status_order?.act_akunting,
                        dateApproveAct: core.moment(item.m_status_order?.tgl_act_3).format('YYYY-MM-DD HH:mm:ss'),
                        approveOps: item.m_status_order?.kendaraan_operasional,
                        idops: item.m_status_order?.operasional,
                        operationalName: item.m_status_order?.user == null ? "" : item.m_status_order.user.nama_lengkap,
                        dateApproveOps: core.moment(item.m_status_order?.tgl_act_4).format('YYYY-MM-DD HH:mm:ss'),
                        approvePurch: item.m_status_order?.kendaraan_purchasing,
                        dateApprovePurch: core.moment(item.m_status_order?.tgl_act_5).format('YYYY-MM-DD HH:mm:ss'),
                        destination: destination,
                        biaya: item.total_keseluruhan,

                    };
                }));
                const searchTerm = req.query.destination || "";
                const searchResults = result.filter(item => item.destination.toLowerCase().includes(searchTerm.toLowerCase()));


                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {
                        totalData: getData.count,
                        totalPage: Math.ceil(getData.count / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        order: searchTerm ? searchResults : result
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


