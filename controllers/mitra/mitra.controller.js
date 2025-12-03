const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where } = require('sequelize');



exports.getSelectFilterMitra = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        const dataStatus = [
            {
                value: "tidak_aktif",
                status: "Tidak Aktif"
            },
            {
                value: "aktif",
                status: "Aktif"
            },
            {
                value: "habis_kontrak",
                status: "habis_kontrak"
            },
        ]

        if (getUser) {
            output = {
                status: {
                    code: 200,
                    massage: "Berhasil Get Data"
                },
                data: dataStatus
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
exports.getSelectCreatMitraPic = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getMitra = await models.mitra.findAll(
                {
                    where: {
                        status: 1
                    }
                }
            )

            const mapping = getMitra.map((i) => {
                return {
                    idMitra: i.id_mitra,
                    mitra: i.nama_mitra,
                    type: i.type
                }
            })

            const dataJabatan = [
                {
                    jabatan: "DIREKTUR"
                },
                {
                    jabatan: "OPERASIONAL"
                },
                {
                    jabatan: "FINANCE"
                },
            ]


            if (getMitra)
                output = {
                    status: {
                        code: 200,
                        massage: "Berhasil Get Data"
                    },
                    mitra: mapping,
                    jabatan: dataJabatan,
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

exports.getSelectMitra = async (req, res) => {
    try {
        models.m_bu_employee.belongsTo(models.users, { targetKey: 'id_karyawan', foreignKey: 'id_employee' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getPurchasing = await models.users.findAll(
                {
                    // ...req.query.divisi && req.query.kode_cabang ? {
                    where: {
                        divisi: "purchasing",
                        // id_bu: getCabang.id_bu,
                        // id_bu_brench: getCabang.id_bu_brench,
                        // category: "Partnership & Purchasing"

                    },
                    // } : {},

                }
            )

            if (getPurchasing) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success Get Data'
                    },
                    marketing: getPurchasing.map((i) => {
                        return {
                            id: i.id,
                            id_bu: i.id_bu,
                            id_bu_brench: i.id_bu_brench,
                            // nik: i.code_employee,
                            fullname: i.nama_lengkap,
                        }
                    }),
                    ToP: [
                        {
                            ToP: "DP"
                        },
                        {
                            ToP: "Check"
                        },
                        {
                            ToP: "Transfer"
                        },
                        {
                            ToP: "Cash"
                        },

                    ],

                    jenisPembayaran: [
                        {
                            "value": "TUNAI MUKA",
                            "name": "DP"
                        },
                        {
                            "value": "TUNAI",
                            "name": "CASH"
                        },
                        {
                            "value": "CHECK",
                            "name": "CHECK"
                        },
                        {
                            "value": "TRANSFER",
                            "name": "TRANSFER"
                        },
                        {
                            "value": "CREDIT CARD",
                            "name": "CREDIT CARD"
                        },

                    ]

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

exports.getMitra = async (req, res) => {
    try {
        models.mitra.belongsTo(models.users, { targetKey: 'id', foreignKey: 'pic_id' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            // var aktif
            // var tidakaktif
            // var habisKontrak

            const getDate = core.moment(Date.now()).format("YYYY-MM-DD")

            const whereClause = {};

            if (req.query.status) {
                if (req.query.status === "aktif") {
                    whereClause.status = 1;
                    whereClause.akhir_kontrak = { [Op.gt]: getDate };
                } else if (req.query.status === "tidak_aktif") {
                    whereClause.status = 0;
                } else if (req.query.status === "habis_kontrak") {
                    whereClause.status = 1;
                    whereClause.akhir_kontrak = { [Op.lte]: getDate };
                }
            }
            if (req.query.keyword) {
                whereClause[Op.or] = [
                    {
                        kode_mitra: {
                            [Op.like]: `%${req.query.keyword}%`,
                        },
                    },
                    {
                        nama_mitra: {
                            [Op.like]: `%${req.query.keyword}%`,
                        },
                    },
                ];
            }



            const Mitra = await models.mitra.findAndCountAll(
                {
                    where: whereClause,
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.users
                        }
                    ],
                    order: [['id_mitra', 'desc']]
                },
            )

            if (Mitra.rows) {
                let no = (Mitra.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = Mitra.rows.map((item) => {
                    return {
                        no: no++,
                        mitraId: item.id_mitra,
                        mitraCode: item.kode_mitra,
                        mitraTitle: item.title,
                        mitraName: item.nama_mitra,
                        mitraAddress: item.alamat,
                        jenis_usaha: item.jenis_usaha == null ? "-" : item.jenis_usaha,
                        kepemilikan: item.kepemilikan == null ? "-" : item.kepemilikan,
                        homepage: item.homepage == null ? "-" : item.homepage,
                        pic: item.pic,
                        jumlah_unit: item.jumlah_unit,
                        direktur: item.direktur,
                        jumlah_armada: item.jumlah_armada,
                        jumlah_sdm_operasional: item.jumlah_sdm_operasional,
                        cabang: item.cabang,
                        jenis_kiriman: item.jenis_kiriman,
                        jenis_mitra: item.jenis_mitra,
                        wilayah: item.wilayah,
                        tujuan: item.tujuan,
                        tahun_berdiri: item.tahun_berdiri,
                        tahun_awal: item.tahun_awal,
                        tahun_awal_kontrak: item.tahun_awal_kontrak,
                        telp: item.telp,
                        fax: item.fax,
                        npwp_id: item.npwp_id,
                        status_usaha: item.status_usaha,
                        npwp_address: item.npwp_address,
                        nama_bank: item.nama_bank,
                        no_rek: item.no_rek,
                        // custStuff: item.jenis_barang,
                        // custBirth: item.tgl_berdiri,
                        // yearBirthL: item.tahun_berdiri,
                        // custNpwp: item.npwp,
                        // custAddresNpwp: item.alamat_npwp,
                        mitraTelephone: item.telepon,
                        kontrak: item.tahun_awal_kontrak,
                        awalKontrak: item.awal_kontrak,
                        akhirKontrak: item.akhir_kontrak,
                        perpanjangOtomatis: item.is_auto_extend == 0 ? "tidak" : "iya",
                        // status: item.status == 1 ? "aktif" : "tidak aktif",
                        pic: item.user == null ? "-" : item.user.nama_lengkap,
                        status: item.status == 1 && item.akhir_kontrak <= getDate ? "habis kontrak" : item.status == 0 ? "tidak aktif" : "aktif"
                        // custHp: item.hp,
                        // custCurency: item.mata_uang
                    }
                })
                output = {
                    status: {
                        code: 200,
                        message: 'Success Get Data'
                    },
                    data: {
                        totalData: Mitra.count,
                        totalPage: Math.ceil(Mitra.count / req.query.limit),
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
exports.getMitraDetail = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getMitra = await models.mitra.findOne(
                {
                    where: {
                        id_mitra: req.query.id_mitra
                    }
                }
            )
            const getPicMitra = await models.users.findOne(
                {
                    where: {
                        id: getMitra.pic_id
                    }
                }
            )
            if (getMitra) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success Get Data'
                    },
                    pic: getPicMitra == null || getPicMitra == 0 ? "-" : getPicMitra.nama_lengkap,
                    data: getMitra
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
exports.getMitraPic = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getData = await models.mitra_pic.findAll(
                {
                    where: {
                        id_mitra: req.query.mitra_id
                    }
                }
            )


            if (getData) {
                output = {
                    status: {
                        code: 200,
                        massage: "succes Get data"
                    },

                    data: getData
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



exports.createMitra = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getMitra = await models.mitra.findOne(
                {
                    where: {
                        nama_mitra: req.body.nama_mitra
                    }
                }
            )

            if (!getMitra) {
                const getCodeMitra = await models.mitra.findAll(
                    {
                        order: [['id_mitra', 'desc']],
                        limit: 1,
                        where: {
                            kode_mitra: {
                                [Op.like]: `%M${getUser.id_bu}%`
                            },
                        }
                    }
                )

                if (getCodeMitra.length === 0) {
                    const awal_kontrak = core.moment(req.body.awal_kontrak);
                    const akhir_kontrak = core.moment(req.body.akhir_kontrak);
                    const kontrak = akhir_kontrak.diff(awal_kontrak, 'years');

                    const createMit = await models.mitra.create(
                        {
                            'kode_mitra': `M${getUser.id_bu}0000001`,
                            'kode': req.body.kode,
                            'qrcode': "",
                            'title': req.body.title,
                            'nama_mitra': req.body.nama_mitra,
                            'jenis': req.body.jenis,
                            'jenis_usaha': req.body.jenis_usaha,
                            'kepemilikan': req.body.kepemilikan,
                            'jumlah_armada': req.body.jumlah_armada,
                            'jumlah_sdm_operasional': req.body.jumlah_sdm_operasional,
                            'cabang': req.body.cabang,
                            'jenis_kiriman': req.body.jenis_kiriman,
                            'wilayah': req.body.wilayah,
                            'tujuan': req.body.tujuan,
                            'tahun_awal_kontrak': core.moment(req.body.awal_kontrak).format('YYYY'),
                            'awal_kontrak': req.body.awal_kontrak,
                            'akhir_kontrak': req.body.akhir_kontrak,
                            'kontrak': kontrak,
                            'direktur': req.body.direktur,
                            'tahun_berdiri': req.body.tahun_berdiri === "" ? "1970" : core.moment(req.body.tahun_berdiri).format('YYYY'),
                            'npwp_id': req.body.npwp_id,
                            'npwp_name': req.body.npwp_name,
                            'npwp_address': req.body.npwp_address,
                            'npwp_jalan': req.body.npwp_jalan,
                            'npwp_blok': req.body.npwp_blok,
                            'npwp_nomor': req.body.npwp_nomor,
                            'npwp_rt': req.body.npwp_rt,
                            'npwp_rw': req.body.npwp_rw,
                            'npwp_kelurahan': req.body.npwp_kelurahan,
                            'npwp_kecamatan': req.body.npwp_kecamatan,
                            'npwp_kota': req.body.npwp_kota,
                            'npwp_provinsi': req.body.npwp_provinsi,
                            'npwp_kodepos': req.body.npwp_kodepos,
                            'is_taxable': req.body.is_taxable === "" ? "0" : req.body.is_taxable,
                            'telepon': req.body.telepon,
                            'contact_person': req.body.contact_person,
                            'telp': req.body.telp,
                            'fax': req.body.fax,
                            'email': req.body.email,
                            'alamat': req.body.alamat,
                            'homepage': req.body.homepage,
                            'pembayaran': req.body.pembayaran,
                            'nama_bank': req.body.nama_bank,
                            'nama_akun': req.body.nama_akun,
                            'no_rek': req.body.no_rek,
                            'currency': "Rupiah (Rp)",
                            'po_legalitas': req.body.po_legalitas,
                            'ktp_legalitas': req.body.ktp_legalitas,
                            'akta_pendirian': req.body.akta_pendirian,
                            'akta_perubahan_dasar': req.body.akta_perubahan_dasar,
                            'akta_susunan_direksi': req.body.akta_susunan_direksi,
                            'surat_domisili': req.body.surat_domisili,
                            'npwp_legalitas': req.body.npwp_legalitas,
                            'nppkp_legalitas': req.body.nppkp_legalitas,
                            'siup_legalitas': req.body.siup_legalitas,
                            'ijin_pendirian': req.body.ijin_pendirian,
                            'ppmd_legalitas': req.body.ppmd_legalitas,
                            'ijin_usaha': req.body.ijin_usaha,
                            'tdp_legalitas': req.body.tdp_legalitas,
                            'surat_kuasa': req.body.surat_kuasa,
                            'skt_legalitas': null,
                            'status_usaha': req.body.status_usaha,
                            'lama_bekerja': 0,
                            'jenis_kartu_kredit': null,
                            'bank_penerbit': null,
                            'laporan_keuangan': req.body.laporan_keuangan,
                            'lama_usaha': 0,
                            'omset_bulanan': 0,
                            'asset_tanah': req.body.asset_tanah,
                            'asset_bangunan': req.body.asset_bangunan,
                            'asset_kendaraan': req.body.asset_kendaraan,
                            'asset_mesin': req.body.asset_mesin,
                            'affiliasi': "",
                            'jumlah_unit': req.body.jumlah_unit,
                            'periode_sewa': req.body.periode_sewa,
                            'nilai_sewa': req.body.nilai_sewa,
                            'nilai_ruu': req.body.nilai_ruu,
                            'top': req.body.top,
                            'metode_pembayaran': req.body.metode_pembayaran === "" ? "TUNAI" : req.body.metode_pembayaran,
                            'qty_motor': req.body.qty_motor,
                            'rp_motor': 0,
                            'qty_grandmax': req.body.qty_grandmax,
                            'rp_grandmax': 0,
                            'qty_l300': req.body.qty_l300,
                            'rp_l300': 0,
                            'qty_traga': req.body.qty_traga,
                            'rp_traga': 0,
                            'qty_cde': req.body.qty_cde,
                            'rp_cde': 0,
                            'qty_cdd': req.body.qty_cdd,
                            'rp_cdd': 0,
                            'qty_fuso': req.body.qty_fuso,
                            'rp_fuso': 0,
                            'qty_wingbox': req.body.qty_wingbox,
                            'rp_wingbox': 0,
                            'qty_trailer20': req.body.qty_trailer20,
                            'rp_trailer20': 0,
                            'qty_trailer40': req.body.qty_trailer40,
                            'rp_trailer40': 0,
                            'status': 1,
                            'status_ph': 0,
                            'pph_app': 1,
                            'affiliasi': '',
                            'elogs': 'Y',
                            'race': 'Y',
                            'note': '',
                            'pic_id': req.body.pic_id,
                            'type': req.body.type,
                            'memo': req.body.memo,
                            'date_created': Date.now(),
                            'is_auto_extend': 0,
                        }
                    )

                    if (createMit) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Sukses tambah mitra'
                            }
                        }
                    }
                } else {
                    const getCode = Number(getCodeMitra[0].kode_mitra.substring(3, 11))
                    const codeUrut = getCode + 1

                    const getcharacterNumber = codeUrut.toString()

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

                        const awal_kontrak = core.moment(req.body.awal_kontrak);
                        const akhir_kontrak = core.moment(req.body.akhir_kontrak);
                        const kontrak = akhir_kontrak.diff(awal_kontrak, 'years');

                        const createMit = await models.mitra.create(
                            {
                                'kode_mitra': "M" + getUser.id_bu + zeroCode + codeUrut,
                                'kode': req.body.kode,
                                'qrcode': "",
                                'title': req.body.title,
                                'nama_mitra': req.body.nama_mitra,
                                'jenis': req.body.jenis,
                                'jenis_usaha': req.body.jenis_usaha,
                                'kepemilikan': req.body.kepemilikan,
                                'jumlah_armada': req.body.jumlah_armada,
                                'jumlah_sdm_operasional': req.body.jumlah_sdm_operasional,
                                'cabang': req.body.cabang,
                                'jenis_kiriman': req.body.jenis_kiriman,
                                'wilayah': req.body.wilayah,
                                'tujuan': req.body.tujuan,
                                'tahun_awal_kontrak': core.moment(req.body.awal_kontrak).format('YYYY'),
                                'awal_kontrak': req.body.awal_kontrak,
                                'akhir_kontrak': req.body.akhir_kontrak,
                                'kontrak': kontrak,
                                'direktur': req.body.direktur,
                                'tahun_berdiri': req.body.tahun_berdiri === "" ? "1970" : core.moment(req.body.tahun_berdiri).format('YYYY'),
                                'npwp_id': req.body.npwp_id,
                                'npwp_name': req.body.npwp_name,
                                'npwp_address': req.body.npwp_address,
                                'npwp_jalan': req.body.npwp_jalan,
                                'npwp_blok': req.body.npwp_blok,
                                'npwp_nomor': req.body.npwp_nomor,
                                'npwp_rt': req.body.npwp_rt,
                                'npwp_rw': req.body.npwp_rw,
                                'npwp_kelurahan': req.body.npwp_kelurahan,
                                'npwp_kecamatan': req.body.npwp_kecamatan,
                                'npwp_kota': req.body.npwp_kota,
                                'npwp_provinsi': req.body.npwp_provinsi,
                                'npwp_kodepos': req.body.npwp_kodepos,
                                'is_taxable': req.body.is_taxable === "" ? "0" : req.body.is_taxable,
                                'telepon': req.body.telepon,
                                'contact_person': req.body.contact_person,
                                'telp': req.body.telp,
                                'fax': req.body.fax,
                                'email': req.body.email,
                                'alamat': req.body.alamat,
                                'homepage': req.body.homepage,
                                'pembayaran': req.body.pembayaran,
                                'nama_bank': req.body.nama_bank,
                                'nama_akun': req.body.nama_akun,
                                'no_rek': req.body.no_rek,
                                'currency': "Rupiah (Rp)",
                                'po_legalitas': req.body.po_legalitas,
                                'ktp_legalitas': req.body.ktp_legalitas,
                                'akta_pendirian': req.body.akta_pendirian,
                                'akta_perubahan_dasar': req.body.akta_perubahan_dasar,
                                'akta_susunan_direksi': req.body.akta_susunan_direksi,
                                'surat_domisili': req.body.surat_domisili,
                                'npwp_legalitas': req.body.npwp_legalitas,
                                'nppkp_legalitas': req.body.nppkp_legalitas,
                                'siup_legalitas': req.body.siup_legalitas,
                                'ijin_pendirian': req.body.ijin_pendirian,
                                'ppmd_legalitas': req.body.ppmd_legalitas,
                                'ijin_usaha': req.body.ijin_usaha,
                                'tdp_legalitas': req.body.tdp_legalitas,
                                'surat_kuasa': req.body.surat_kuasa,
                                'skt_legalitas': null,
                                'status_usaha': req.body.status_usaha,
                                'lama_bekerja': 0,
                                'jenis_kartu_kredit': null,
                                'bank_penerbit': null,
                                'laporan_keuangan': req.body.laporan_keuangan,
                                'lama_usaha': 0,
                                'omset_bulanan': 0,
                                'asset_tanah': req.body.asset_tanah,
                                'asset_bangunan': req.body.asset_bangunan,
                                'asset_kendaraan': req.body.asset_kendaraan,
                                'asset_mesin': req.body.asset_mesin,
                                'affiliasi': "",
                                'jumlah_unit': req.body.jumlah_unit,
                                'periode_sewa': req.body.periode_sewa,
                                'nilai_sewa': req.body.nilai_sewa,
                                'nilai_ruu': req.body.nilai_ruu,
                                'top': req.body.top,
                                'metode_pembayaran': req.body.metode_pembayaran === "" ? "TUNAI" : req.body.metode_pembayaran,
                                'qty_motor': req.body.qty_motor,
                                'rp_motor': 0,
                                'qty_grandmax': req.body.qty_grandmax,
                                'rp_grandmax': 0,
                                'qty_l300': req.body.qty_l300,
                                'rp_l300': 0,
                                'qty_traga': req.body.qty_traga,
                                'rp_traga': 0,
                                'qty_cde': req.body.qty_cde,
                                'rp_cde': 0,
                                'qty_cdd': req.body.qty_cdd,
                                'rp_cdd': 0,
                                'qty_fuso': req.body.qty_fuso,
                                'rp_fuso': 0,
                                'qty_wingbox': req.body.qty_wingbox,
                                'rp_wingbox': 0,
                                'qty_trailer20': req.body.qty_trailer20,
                                'rp_trailer20': 0,
                                'qty_trailer40': req.body.qty_trailer40,
                                'rp_trailer40': 0,
                                'status': 1,
                                'status_ph': 0,
                                'pph_app': 1,
                                'affiliasi': '',
                                'elogs': 'Y',
                                'race': 'Y',
                                'note': '',
                                'pic_id': req.body.pic_id,
                                'type': req.body.type,
                                'memo': req.body.memo,
                                'date_created': Date.now(),
                                'is_auto_extend': 0,
                            }
                        )

                        if (createMit) {
                            output = {
                                status: {
                                    code: 200,
                                    message: 'Sukses tambah mitra'
                                }
                            }
                        }
                    }
                }
            } else {
                output = {
                    status: {
                        code: 402,
                        message: 'Nama Mitra sudah tersedia'
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
exports.updateMitra = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getMitra = await models.mitra.findOne(
                {
                    where: {
                        nama_mitra: req.body.nama_mitra
                    }
                }
            )

            // if (!getMitra) {
            const awal_kontrak = core.moment(req.body.awal_kontrak);
            const akhir_kontrak = core.moment(req.body.akhir_kontrak);
            const kontrak = akhir_kontrak.diff(awal_kontrak, 'years');

            const updData = await models.mitra.update(
                {
                    'kode': req.body.kode,
                    'qrcode': "",
                    'title': req.body.title,
                    'nama_mitra': req.body.nama_mitra,
                    'jenis': req.body.jenis,
                    'jenis_usaha': req.body.jenis_usaha,
                    'kepemilikan': req.body.kepemilikan,
                    'jumlah_armada': req.body.jumlah_armada,
                    'jumlah_sdm_operasional': req.body.jumlah_sdm_operasional,
                    'cabang': req.body.cabang,
                    'jenis_kiriman': req.body.jenis_kiriman,
                    'wilayah': req.body.wilayah,
                    'tujuan': req.body.tujuan,
                    'tahun_awal_kontrak': core.moment(req.body.awal_kontrak).format('YYYY'),
                    'awal_kontrak': req.body.awal_kontrak,
                    'akhir_kontrak': req.body.akhir_kontrak,
                    'kontrak': kontrak,
                    'direktur': req.body.direktur,
                    'tahun_berdiri': req.body.tahun_berdiri === "" ? "1970" : core.moment(req.body.tahun_berdiri).format('YYYY'),
                    'npwp_id': req.body.npwp_id,
                    'npwp_name': req.body.npwp_name,
                    'npwp_address': req.body.npwp_address,
                    'npwp_jalan': req.body.npwp_jalan,
                    'npwp_blok': req.body.npwp_blok,
                    'npwp_nomor': req.body.npwp_nomor,
                    'npwp_rt': req.body.npwp_rt,
                    'npwp_rw': req.body.npwp_rw,
                    'npwp_kelurahan': req.body.npwp_kelurahan,
                    'npwp_kecamatan': req.body.npwp_kecamatan,
                    'npwp_kota': req.body.npwp_kota,
                    'npwp_provinsi': req.body.npwp_provinsi,
                    'npwp_kodepos': req.body.npwp_kodepos,
                    'is_taxable': req.body.is_taxable === "" ? "0" : req.body.is_taxable,
                    'telepon': req.body.telepon,
                    'contact_person': req.body.contact_person,
                    'telp': req.body.telp,
                    'fax': req.body.fax,
                    'email': req.body.email,
                    'alamat': req.body.alamat,
                    'homepage': req.body.homepage,
                    'pembayaran': req.body.pembayaran,
                    'nama_bank': req.body.nama_bank,
                    'nama_akun': req.body.nama_akun,
                    'no_rek': req.body.no_rek,
                    'currency': "Rupiah (Rp)",
                    'po_legalitas': req.body.po_legalitas,
                    'ktp_legalitas': req.body.ktp_legalitas,
                    'akta_pendirian': req.body.akta_pendirian,
                    'akta_perubahan_dasar': req.body.akta_perubahan_dasar,
                    'akta_susunan_direksi': req.body.akta_susunan_direksi,
                    'surat_domisili': req.body.surat_domisili,
                    'npwp_legalitas': req.body.npwp_legalitas,
                    'nppkp_legalitas': req.body.nppkp_legalitas,
                    'siup_legalitas': req.body.siup_legalitas,
                    'ijin_pendirian': req.body.ijin_pendirian,
                    'ppmd_legalitas': req.body.ppmd_legalitas,
                    'ijin_usaha': req.body.ijin_usaha,
                    'tdp_legalitas': req.body.tdp_legalitas,
                    'surat_kuasa': req.body.surat_kuasa,
                    'skt_legalitas': null,
                    'status_usaha': req.body.status_usaha,
                    'lama_bekerja': 0,
                    'jenis_kartu_kredit': null,
                    'bank_penerbit': null,
                    'laporan_keuangan': req.body.laporan_keuangan,
                    'lama_usaha': 0,
                    'omset_bulanan': 0,
                    'asset_tanah': req.body.asset_tanah,
                    'asset_bangunan': req.body.asset_bangunan,
                    'asset_kendaraan': req.body.asset_kendaraan,
                    'asset_mesin': req.body.asset_mesin,
                    'affiliasi': "",
                    'jumlah_unit': req.body.jumlah_unit,
                    'periode_sewa': req.body.periode_sewa,
                    'nilai_sewa': req.body.nilai_sewa,
                    'nilai_ruu': req.body.nilai_ruu,
                    'top': req.body.top,
                    'metode_pembayaran': req.body.metode_pembayaran === "" ? "TUNAI" : req.body.metode_pembayaran,
                    'qty_motor': req.body.qty_motor,
                    'rp_motor': 0,
                    'qty_grandmax': req.body.qty_grandmax,
                    'rp_grandmax': 0,
                    'qty_l300': req.body.qty_l300,
                    'rp_l300': 0,
                    'qty_traga': req.body.qty_traga,
                    'rp_traga': 0,
                    'qty_cde': req.body.qty_cde,
                    'rp_cde': 0,
                    'qty_cdd': req.body.qty_cdd,
                    'rp_cdd': 0,
                    'qty_fuso': req.body.qty_fuso,
                    'rp_fuso': 0,
                    'qty_wingbox': req.body.qty_wingbox,
                    'rp_wingbox': 0,
                    'qty_trailer20': req.body.qty_trailer20,
                    'rp_trailer20': 0,
                    'qty_trailer40': req.body.qty_trailer40,
                    'rp_trailer40': 0,
                    'status': 1,
                    'status_ph': 0,
                    'pph_app': 1,
                    'affiliasi': '',
                    'elogs': 'Y',
                    'race': 'Y',
                    'note': '',
                    'pic_id': req.body.pic_id,
                    'type': req.body.type,
                    'memo': req.body.memo,
                    'date_created': Date.now(),
                    'is_auto_extend': 0,
                },
                {
                    where: {
                        id_mitra: req.body.id_mitra
                    }
                }
            )

            if (updData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success Update Data'
                    }
                }
            }
            // } else {
            //     output = {
            //         status: {
            //             code: 402,
            //             message: 'Nama Mitra sudah tersedia'
            //         }
            //     }
            // }
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
exports.deleteMitra = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const del = await models.mitra.update(
                {
                    status: "0"
                },
                {
                    where: {
                        id_mitra: req.body.id
                    }
                }
            )
            if (del) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success delete mitra'
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



exports.createMitraPic = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                id: req.user.id
            }
        )

        if (getUser) {
            const creataData = await models.mitra_pic.create(
                {
                    'id_mitra': req.body.id_mitra,
                    'nama': req.body.nama,
                    'telepon': req.body.telepon,
                    'email': req.body.email,
                    'jabatan': req.body.jabatan,
                    'ktp': req.body.ktp,
                }
            )

            if (creataData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil menambah data mitra PIC'
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
exports.editMitraPic = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const editData = await models.mitra_pic.update(
                {
                    nama: req.body.nama,
                    telepon: req.body.telepon,
                    email: req.body.email,
                    jabatan: req.body.jabatan,
                    ktp: req.body.ktp,
                },
                {
                    where: {
                        id_mitra_pic: req.body.id_mitra_pic
                    }
                }
            )
            if (editData) {
                output = {
                    status: {
                        code: 200,
                        massage: "Berhasil mengubah data mitra PIC"
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
exports.deleteMitraPic = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const delData = await models.mitra_pic.destroy(
                {
                    where: {
                        id_mitra_pic: req.body.id_mitra_pic
                    }
                }
            )

            if (delData) {
                output = {
                    status: {
                        code: 200,
                        message: "Berhasil menghapus data mitra PIC"
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

exports.createMitracabang = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getData = await models.mitra_norekcabang.findOne(
                {
                    where: {
                        id_mitra: req.body.id_mitra,
                        bank: req.body.bank,
                        account_number: req.body.account_number,
                        status: 1,
                    }
                }
            )
            if (!getData) {
                const createData = await models.mitra_norekcabang.create(
                    {
                        id_mitra: req.body.id_mitra,
                        bank: req.body.bank,
                        account_name: req.body.account_name,
                        account_number: req.body.account_number,
                        cabang_pic: req.body.cabang_pic,
                        cabang_email: req.body.cabang_email,
                        cabang_telp: req.body.cabang_telp,
                        status: 1,

                    }
                )
                if (createData) {
                    output = {
                        status: {
                            code: 200,
                            message: "Berhasil menambah norek cabang"
                        }
                    }
                }
            }
            else {
                output = {
                    status: {
                        code: 200,
                        message: "Norek Cabang sudah ada"
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

exports.getMitraCabang = async (req, res) => {
    try {
        models.mitra_norekcabang.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.mitra_norekcabang.findAndCountAll(
                {
                    where: {
                        status: 1,
                        id_mitra: req.query.id_mitra
                    },
                    include: [
                        {
                            model: models.mitra
                        }
                    ],
                    limit: limit,
                    offset: offset
                }
            )
            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id: item.id_mitra_norekcabang,
                        idmitra: item.id_mitra,
                        mitra: item.mitra.nama_mitra,
                        bank: item.bank,
                        account_name: item.account_name,
                        cabang_pic: item.cabang_pic,
                        cabang_email: item.cabang_email,
                        cabang_telp: item.cabang_telp,
                        // status: item.status,
                        account_number: item.account_number,
                        createdDate: core.moment(item.date_created).format('YYYY-MM-DD HH:mm:ss'),




                    }
                })

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

exports.editMitracabang = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getData = await models.mitra_norekcabang.findOne(
                {
                    where: {
                        id_mitra: req.body.id_mitra,
                        bank: req.body.bank,
                        account_number: req.body.account_number,
                        status: 1,
                    }
                }
            )
            if (!getData) {
                const createData = await models.mitra_norekcabang.update(
                    {
                        id_mitra: req.body.id_mitra,
                        bank: req.body.bank,
                        account_name: req.body.account_name,
                        account_number: req.body.account_number,
                        cabang_pic: req.body.cabang_pic,
                        cabang_email: req.body.cabang_email,
                        cabang_telp: req.body.cabang_telp,

                    },
                    {
                        where: {
                            id_mitra_norekcabang: req.body.id
                        }
                    }
                )
                if (createData) {
                    output = {
                        status: {
                            code: 200,
                            message: "Berhasil update norek cabang"
                        }
                    }
                }
            }
            else {
                output = {
                    status: {
                        code: 200,
                        message: "Norek Cabang sudah ada"
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

exports.deleteMitracabang = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {


            const createData = await models.mitra_norekcabang.update(
                {
                    status: 0

                },
                {
                    where: {
                        id_mitra_norekcabang: req.body.id
                    }
                }
            )
            if (createData) {
                output = {
                    status: {
                        code: 200,
                        message: "Berhasil delete norek cabang"
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

exports.getMitraAll = async (req, res) => {
  try {
    models.mitra.belongsTo(models.users, { targetKey: 'id', foreignKey: 'pic_id' });

    const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
    const getDate = core.moment(Date.now()).format("YYYY-MM-DD");

    const whereClause = {};

    // Filter berdasarkan status
    if (req.query.status) {
      if (req.query.status === "aktif") {
        whereClause.status = 1;
        whereClause.akhir_kontrak = { [Op.gt]: getDate };
      } else if (req.query.status === "tidak_aktif") {
        whereClause.status = 0;
      } else if (req.query.status === "habis_kontrak") {
        whereClause.status = 1;
        whereClause.akhir_kontrak = { [Op.lte]: getDate };
      }
    }

    // Filter berdasarkan keyword
    if (req.query.keyword) {
      whereClause[Op.or] = [
        {
          kode_mitra: {
            [Op.like]: `%${req.query.keyword}%`,
          },
        },
        {
          nama_mitra: {
            [Op.like]: `%${req.query.keyword}%`,
          },
        },
      ];
    }

    // Ambil data mitra
    const Mitra = await models.mitra.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        {
          model: models.users,
          attributes: ['nama_lengkap']
        }
      ],
      order: [['id_mitra', 'desc']]
    });

    let no = (Mitra.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
    const result = Mitra.rows.map((item) => ({
      no: no++,
      mitraId: item.id_mitra,
      mitraCode: item.kode_mitra,
      mitraTitle: item.title,
      mitraName: item.nama_mitra,
      mitraAddress: item.alamat,
      jenis_usaha: item.jenis_usaha ?? "-",
      kepemilikan: item.kepemilikan ?? "-",
      homepage: item.homepage ?? "-",
      pic: item.user?.nama_lengkap ?? "-",
      jumlah_unit: item.jumlah_unit,
      direktur: item.direktur,
      jumlah_armada: item.jumlah_armada,
      jumlah_sdm_operasional: item.jumlah_sdm_operasional,
      cabang: item.cabang,
      jenis_kiriman: item.jenis_kiriman,
      jenis_mitra: item.jenis_mitra,
      wilayah: item.wilayah,
      tujuan: item.tujuan,
      tahun_berdiri: item.tahun_berdiri,
      tahun_awal: item.tahun_awal,
      tahun_awal_kontrak: item.tahun_awal_kontrak,
      telp: item.telp,
      fax: item.fax,
      npwp_id: item.npwp_id,
      status_usaha: item.status_usaha,
      npwp_address: item.npwp_address,
      nama_bank: item.nama_bank,
      no_rek: item.no_rek,
      mitraTelephone: item.telepon,
      kontrak: item.tahun_awal_kontrak,
      awalKontrak: item.awal_kontrak,
      akhirKontrak: item.akhir_kontrak,
      perpanjangOtomatis: item.is_auto_extend == 0 ? "tidak" : "iya",
      status:
        item.status == 1 && item.akhir_kontrak <= getDate
          ? "habis kontrak"
          : item.status == 0
          ? "tidak aktif"
          : "aktif"
    }));

    const output = {
      status: {
        code: 200,
        message: 'Success Get Data'
      },
      data: {
        totalData: Mitra.count,
        totalPage: Math.ceil(Mitra.count / req.query.limit),
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

