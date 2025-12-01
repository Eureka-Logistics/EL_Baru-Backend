const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where } = require('sequelize');
const db = require('../../config/db.config')


exports.getSelectTarif = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getMuatKota = await models.m_wil_kota.findAll(
                {
                    ...req.query.keywordMuat ? {
                        where: {
                            [Op.or]: [
                                {
                                    nama_kota: {
                                        [Op.like]: `%${req.query.keywordMuat}%`
                                    },
                                },
                            ]
                        }
                    } : {}
                }
            )

            const getTujuanKota = await models.m_wil_kota.findAll(
                {
                    ...req.query.keywordTujuan ? {
                        where: {
                            [Op.or]: [
                                {
                                    nama_kota: {
                                        [Op.like]: `%${req.query.keywordTujuan}%`
                                    },
                                },
                            ]
                        }
                    } : {}
                }
            )

            const getCustomer = await models.customer.findAll(
                {
                    ...req.query.keywordCustomer ? {
                        where: {
                            [Op.or]: [
                                {
                                    nama_perusahaan: {
                                        [Op.like]: `%${req.query.keywordCustomer}%`
                                    },
                                },
                            ]
                        }
                    } : {}
                }
            )

            const getJenisKendaraan = await models.kendaraan_jenis.findAll(
                {
                    ...req.query.keywordJenis ? {
                        where: {
                            [Op.or]: [
                                {
                                    nama_kendaraan_jenis: {
                                        [Op.like]: `%${req.query.keywordJenis}%`
                                    },
                                },
                            ]
                        }
                    } : {}
                }
            )

            const getPrice = await models.m_tarif_eureka.findOne(
                {
                    ...req.query.idMuat && req.query.idBogkar && req.query.service_type ? {
                        where: {
                            id_muat_kota: req.query.idMuat,
                            id_tujuan_kota: req.query.idBogkar,
                            id_kendaraan_jenis: req.query.idJenisKendaraan,
                            service_type: req.query.service_type,
                        }
                    } : {}
                }
            )


            // Data Code Tarif Customer
            let getCodeTrifCustomer = await models.m_tarif_customer.findAll(
                {
                    order: [['id_tarif_customer', 'desc']],
                    limit: 1,
                    where: {
                        kode_tarif_customer: {
                            [Op.like]: `%TC%`
                        },
                    }
                }
            );

            let tarifCodeCustomer = 1; // Nilai default jika getCodeTrifCustomer kosong
            let zeroCodeTrfCustomer = "0000000"; // Nilai default jika getCodeTrifCustomer kosong

            if (getCodeTrifCustomer.length > 0) {
                const getcodeTarifCustomer = Number(getCodeTrifCustomer[0].kode_tarif_customer.substring(2, 11));
                tarifCodeCustomer = getcodeTarifCustomer + 1;

                const getCharCustomer = tarifCodeCustomer.toString();

                if (getCharCustomer.length < 8) {
                    zeroCodeTrfCustomer = "0".repeat(8 - getCharCustomer.length);
                }
            }


            // ============

            // Data Code Tarif Eureka
            const getCodeTrfEureka = await models.m_tarif_eureka.findAll(
                {
                    order: [['id_tarif_eureka', 'desc']],
                    limit: 1,
                    where: {
                        kode_tarif_eureka: {
                            [Op.like]: `%TE%`
                        },
                    }
                }
            )

            const getcodeTarifEureka = Number(getCodeTrfEureka[0].kode_tarif_eureka.substring(2, 11))
            const tarifCodeTrfEureka = getcodeTarifEureka + 1

            const getCharEureka = tarifCodeTrfEureka.toString()

            var zeroCodeTrfEureka

            if (getCharEureka.length == 1) {
                var zeroCodeTrfEureka = "0000000"
            } else if (getCharEureka.length == 2) {
                var zeroCodeTrfEureka = "000000"
            } else if (getCharEureka.length == 3) {
                var zeroCodeTrfEureka = "00000"
            } else if (getCharEureka.length == 4) {
                var zeroCodeTrfEureka = "0000"
            } else if (getCharEureka.length == 5) {
                var zeroCodeTrfEureka = "000"
            } else if (getCharEureka.length == 6) {
                var zeroCodeTrfEureka = "00"
            } else if (getCharEureka.length == 7) {
                var zeroCodeTrfEureka = "0"
            } else if (getCharEureka.length == 8) {
                var zeroCodeTrfEureka = ""
            }
            // ============

            // Data Code Tarif Mitra
            let getCodeTrfMitra = await models.m_tarif_mitra.findAll(
                {
                    order: [['id_price_mitra', 'desc']],
                    limit: 1,
                    where: {
                        kode_tarif_mitra: {
                            [Op.like]: `%TM%`
                        },
                    }
                }
            );

            let tarifCodeTrfMitra = 1; // Nilai default jika getCodeTrfMitra kosong
            let zeroCodeTrfMitra = "0000000"; // Nilai default jika getCodeTrfMitra kosong

            if (getCodeTrfMitra.length > 0) {
                const getcodeTarifMitra = Number(getCodeTrfMitra[0].kode_tarif_mitra.substring(2, 11));
                tarifCodeTrfMitra = getcodeTarifMitra + 1;

                const getCharMitra = tarifCodeTrfMitra.toString();

                if (getCharMitra.length < 8) {
                    zeroCodeTrfMitra = "0".repeat(8 - getCharMitra.length);
                }
            }

            // ============



            if (getMuatKota && getTujuanKota && getCustomer && getJenisKendaraan) {
                const kodeTarifMitra = 'TM' + zeroCodeTrfMitra + tarifCodeTrfMitra;
                const kodeTarifCustomer = 'TC' + zeroCodeTrfCustomer + tarifCodeCustomer;
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },

                    kodeTarif: {
                        kodeTarifCustomer: kodeTarifCustomer,
                        kodeTarifEureka: 'TE' + zeroCodeTrfEureka + tarifCodeTrfEureka,
                        kodeTarifMitra: kodeTarifMitra,
                    },
                    muatKota: getMuatKota.map((i) => {
                        return {
                            idKota: i.id_kota,
                            namaKota: i.nama_kota
                        }
                    }),
                    tujuanKota: getTujuanKota.map((i) => {
                        return {
                            idKota: i.id_kota,
                            namaKota: i.nama_kota
                        }
                    }),
                    customer: getCustomer.map((i) => {
                        return {
                            idCustomer: i.id_customer,
                            Customer: i.nama_perusahaan,
                        }
                    }),
                    jenisKendaraan: getJenisKendaraan.map((i) => {
                        return {
                            idjenisKendaraan: i.id_kendaraan_jenis,
                            jenisKendaraan: i.nama_kendaraan_jenis
                        }
                    }),
                    serviceType: [
                        {
                            'serviceType': 'retailer'
                        },
                        {
                            'serviceType': 'charter'
                        },
                    ],
                    IdPriceEureka: req.query.idMuat && req.query.idBogkar && req.query.idJenisKendaraan && req.query.service_type ? getPrice === null ? "-" : getPrice.id_tarif_eureka : {},
                    getPrice: req.query.idMuat && req.query.idBogkar && req.query.idJenisKendaraan && req.query.service_type ? getPrice === null ? "tarif belum ada" : getPrice.tarif : {},
                    via: [
                        {
                            "via": "darat"
                        },
                        {
                            "via": "laut"
                        },
                        {
                            "via": "udara"
                        },
                    ],
                    satuan: [
                        {
                            "satuan": "KG"
                        },
                        {
                            "satuan": "TON"
                        }
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

//tarif Customer
exports.createTarifCustomer = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getTarif = await models.m_tarif_customer.findOne(
                {
                    where: {
                        id_muat_kota: req.body.id_muat_kota,
                        id_tujuan_kota: req.body.id_tujuan_kota,
                        id_customer: req.body.id_customer,
                        id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                        service_type: req.body.service_type,
                        status: 'Y',
                    }
                }
            )
            // console.log(getTarif)

            const getCode = await models.m_tarif_customer.findAll(
                {
                    order: [['id_tarif_customer', 'desc']],
                    limit: 1,
                    where: {
                        kode_tarif_customer: {
                            [Op.like]: `%TC%`
                        },
                    }
                }
            )

            if (!getTarif) {
                if (getCode.length === 0 || (getCode.length > 0 && getCode[0].kode_tarif_customer && getCode[0].kode_tarif_customer.includes("TC23"))) {
                    const CreateData = await models.m_tarif_customer.create(
                        {
                            'kode_tarif_customer': "TC00000001",
                            // 'id_price_eureka': req.body.id_muat_kota,
                            'id_muat_kota': req.body.id_muat_kota,
                            'id_tujuan_kota': req.body.id_tujuan_kota,
                            'id_tarif_eureka': req.body.id_price_eureka,
                            'id_customer': req.body.id_customer,
                            'id_kendaraan_jenis': req.body.id_kendaraan_jenis,
                            'service_type': req.body.service_type,
                            'via': req.body.via,
                            'jenis_kiriman': req.body.jenis_kiriman,
                            'diskon_percent': req.body.diskon_percent,
                            'diskon_rupiah': req.body.diskon_rupiah,
                            'biaya_jalan': req.body.biaya_jalan,
                            'total_biaya': req.body.total_biaya,
                            'biaya_muat': req.body.biaya_muat,
                            'biaya_bongkar': req.body.biaya_bongkar,
                            'biaya_overtonase': req.body.biaya_overtonase,
                            'biaya_multimuat': req.body.biaya_multimuat,
                            'biaya_multidrop': req.body.biaya_multidrop,
                            'biaya_mel': req.body.biaya_mel,
                            'biaya_tambahan': req.body.biaya_tambahan,
                            'biaya_lain': req.body.biaya_lain,
                            'min_tonas_1': req.body.min_tonas_1,
                            'min_tonase_2': req.body.min_tonase_2,
                            'min_tonase_3': req.body.min_tonase_3,
                            'min_tonase_4': req.body.min_tonase_4,
                            'min_tonase_5': req.body.min_tonase_5,
                            'tarif_2': req.body.tarif_2,
                            'tarif_3': req.body.tarif_3,
                            'tarif_4': req.body.tarif_4,
                            'tarif_5': req.body.tarif_5,
                            'id_bu_brench': req.body.id_bu_branch,
                            'id_bu': req.body.id_bu,
                            'status': 'N',
                            'kode_surat': req.body.kode_surat,
                            'biaya_overtonase': req.body.biaya_overtonase,
                            'date_created': core.moment(Date.now()).format('YYYY-MM-DD HH:mm'),
                            'pic': '1',

                        }
                    )
                    if (CreateData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Sukses menambah tarif customer'
                            },
                        }
                    }
                } else {
                    const getcodeTarif = Number(getCode[0].kode_tarif_customer.substring(2, 11))
                    const tarifCode = getcodeTarif + 1

                    const getcharacterNumber = tarifCode.toString()

                    if (tarifCode > 99999999) {
                        output = {
                            status: {
                                code: 400,
                                message: 'Gagal menginput data kode sudah maks di 99999999'
                            }
                        }
                    } else {
                        var zeroCode

                        if (getcharacterNumber.length == 1) {
                            var zeroCode = "0000000"
                        } else if (getcharacterNumber.length == 2) {
                            var zeroCode = "000000"
                        } else if (getcharacterNumber.length == 3) {
                            var zeroCode = "00000"
                        } else if (getcharacterNumber.length == 4) {
                            var zeroCode = "0000"
                        } else if (getcharacterNumber.length == 5) {
                            var zeroCode = "000"
                        } else if (getcharacterNumber.length == 6) {
                            var zeroCode = "00"
                        } else if (getcharacterNumber.length == 7) {
                            var zeroCode = "0"
                        } else if (getcharacterNumber.length == 8) {
                            var zeroCode = ""
                        }

                        const CreateData = await models.m_tarif_customer.create(
                            {
                                'kode_tarif_customer': "TC" + zeroCode + tarifCode,
                                'id_muat_kota': req.body.id_muat_kota,
                                'id_tujuan_kota': req.body.id_tujuan_kota,
                                'id_tarif_eureka': req.body.id_price_eureka,
                                'id_customer': req.body.id_customer,
                                'id_kendaraan_jenis': req.body.id_kendaraan_jenis,
                                'service_type': req.body.service_type,
                                'via': req.body.via,
                                'jenis_kiriman': req.body.jenis_kiriman,
                                'diskon_percent': req.body.diskon_percent,
                                'diskon_rupiah': req.body.diskon_rupiah,
                                'biaya_jalan': req.body.biaya_jalan,
                                'total_biaya': req.body.total_biaya,
                                'biaya_muat': req.body.biaya_muat,
                                'biaya_bongkar': req.body.biaya_bongkar,
                                'biaya_overtonase': req.body.biaya_overtonase,
                                'biaya_multimuat': req.body.biaya_multimuat,
                                'biaya_multidrop': req.body.biaya_multidrop,
                                'biaya_mel': req.body.biaya_mel,
                                'biaya_tambahan': req.body.biaya_tambahan,
                                'biaya_lain': req.body.biaya_lain,
                                'id_bu_brench': req.body.id_bu_branch,
                                'id_bu': req.body.id_bu,
                                'status': 'N',
                                'kode_surat': req.body.kode_surat,
                                'date_created': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                'pic': '1',
                                'min_tonas_1': req.body.min_tonas_1,
                                'min_tonase_2': req.body.min_tonase_2,
                                'min_tonase_3': req.body.min_tonase_3,
                                'min_tonase_4': req.body.min_tonase_4,
                                'min_tonase_5': req.body.min_tonase_5,
                                'tarif_2': req.body.tarif_2,
                                'tarif_3': req.body.tarif_3,
                                'tarif_4': req.body.tarif_4,
                                'tarif_5': req.body.tarif_5,

                            }
                        )
                        if (CreateData) {
                            output = {
                                status: {
                                    code: 200,
                                    message: 'Sukses menambah tarif customer'
                                },
                            }
                        }
                    }
                }
            } else {
                output = {
                    status: {
                        code: 402,
                        message: 'Tarif Sudah Tersedia'
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

exports.editTariffCustomer = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            // const getData = await models.m_tarif_customer.findAll(
            //     {
            //         where: {
            //             id_muat_kota: req.body.id_muat_kota,
            //             id_tujuan_kota: req.body.id_tujuan_kota,
            //             id_customer: req.body.id_customer,
            //             id_kendaraan_jenis: req.body.id_kendaraan_jenis,
            //         }
            //     }
            // )
            // if (!getData) {
            const updateData = await models.m_tarif_customer.update(
                {

                    id_muat_kota: req.body.id_muat_kota,
                    id_tujuan_kota: req.body.id_tujuan_kota,
                    id_price_eureka: req.body.id_price_eureka,
                    id_customer: req.body.id_customer,
                    id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                    service_type: req.body.service_type,
                    jenis_kiriman: req.body.jenis_kiriman,
                    diskon_percent: req.body.diskon_percent,
                    diskon_rupiah: req.body.diskon_rupiah,
                    biaya_jalan: req.body.biaya_jalan,
                    total_biaya: req.body.total_biaya,
                    biaya_muat: req.body.biaya_muat,
                    biaya_bongkar: req.body.biaya_bongkar,
                    biaya_overtonase: req.body.biaya_overtonase,
                    biaya_multimuat: req.body.biaya_multimuat,
                    biaya_multidrop: req.body.biaya_multidrop,
                    biaya_mel: req.body.biaya_mel,
                    biaya_tambahan: req.body.biaya_tambahan,
                    biaya_lain: req.body.biaya_lain,
                    biaya_muat: req.body.biaya_muat,
                    biaya_overtonase: req.body.biaya_overtonase,
                    via: req.body.via,
                    min_tonas_1: req.body.min_tonas_1,
                    min_tonase_2: req.body.min_tonase_2,
                    min_tonase_3: req.body.min_tonase_3,
                    min_tonase_4: req.body.min_tonase_4,
                    min_tonase_5: req.body.min_tonase_5,
                    tarif_2: req.body.tarif_2,
                    tarif_3: req.body.tarif_3,
                    tarif_4: req.body.tarif_4,
                    tarif_5: req.body.tarif_5,
                    id_bu_brench: req.body.id_bu_branch,
                    id_bu: req.body.id_bu,
                    status: req.body.status,
                    kode_surat: req.body.kode_surat,

                },
                {
                    where: {
                        id_tarif_customer: req.body.id_price
                    }
                }
            )
            if (updateData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Succes update tarif'
                    }
                }
            }
        }


        // }


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

exports.deleteTarifCustomer = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const delData = await models.m_tarif_customer.update(
                {
                    status: "N"
                },
                {
                    where: {
                        id_tarif_customer: req.body.id_price
                    }
                }
            )
            if (delData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Succes delete data'
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

exports.getTarifCustomer = async (req, res) => {
    try {
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
        if (!models.m_tarif_customer.associations.kotaAsal) {
            models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_muat_kota', as: 'kotaAsal' });
        }
        if (!models.m_tarif_customer.associations.kotaTujuan) {
            models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_tujuan_kota', as: 'kotaTujuan' });
        }

        models.m_tarif_customer.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_tarif_customer.belongsTo(models.m_tarif_eureka, { targetKey: 'id_tarif_eureka', foreignKey: 'id_tarif_eureka' });
        models.m_tarif_customer.belongsTo(models.kendaraan_jenis, { targetKey: 'id_kendaraan_jenis', foreignKey: 'id_kendaraan_jenis' });
        models.m_tarif_customer.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getData = await models.m_tarif_customer.findAndCountAll(
                {
                    order: [['id_tarif_customer', 'desc']],
                    where: {
                        ...(req.query.status ? { status: req.query.status } : {}),
                        ...req.query.keyword ? {
                            [Op.or]: [
                            { kode_tarif_customer: { [Op.like]: `%${req.query.keyword}%` } },
                            { kode_surat:           { [Op.like]: `%${req.query.keyword}%` } },
                            { jenis_kiriman:        { [Op.like]: `%${req.query.keyword}%` } },
                            { via:                  { [Op.like]: `%${req.query.keyword}%` } },
                            { service_type:         { [Op.like]: `%${req.query.keyword}%` } }
                            ]
                        } : {},
                        ...req.query.id_price ? {
                            id_price: req.query.id_price
                        } : {},
                        ...req.query.id_muat_kota ? {
                            id_muat_kota: req.query.id_muat_kota
                        } : {},
                        ...req.query.id_tujuan_kota ? {
                            id_tujuan_kota: req.query.id_tujuan_kota
                        } : {},
                        ...req.query.id_kendaraan_jenis ? {
                            id_kendaraan_jenis: req.query.id_kendaraan_jenis
                        } : {},
                        ...req.query.id_customer ? {
                            id_customer: req.query.id_customer
                        } : {},
                        ...req.query.id_bu ? {
                            id_bu: req.query.id_bu
                        } : {},
                    },
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.m_wil_kota,
                            as: 'kotaAsal'
                        },
                        {
                            model: models.m_wil_kota,
                            as: 'kotaTujuan'
                        },
                        {
                            model: models.customer
                        },
                        {
                            model: models.kendaraan_jenis
                        },
                        {
                            model: models.m_tarif_eureka
                        },
                        {
                            model: models.m_bu
                        }
                    ]
                }
            )
            if (getData.rows) {
                // res.send(req.query.berat)

                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((i) => {
                    // console.log("ahahahahah" + i.min_tonase_5)
                    var tarif;
                    var tonase;
                    if (req.query.berat >= i.min_tonase_5 && i.min_tonase_5 != 0) {
                        tarif = i.tarif_5
                        tonase = i.min_tonase_5
                        // console.log("anjg 5" + i.min_tonase_5)

                        return {
                            no: no++,
                            id_price: i.id_tarif_customer,
                            id_price_eureka: i.m_tarif_eureka == null ? "-" : i.m_tarif_eureka.id_tarif_eureka,
                            tarifEureka: i.m_tarif_eureka == null ? "-" : i.m_tarif_eureka.tarif,
                            kode_tarif: i.kode_tarif_customer,
                            id_bu_branch: i.id_bu_brench,
                            status: i.status,
                            kode_surat: i.kode_surat,
                            id_muat_kota: i.id_muat_kota,
                            id_tujuan_kota: i.id_tujuan_kota,
                            id_kendaraan_jenis: i.id_kendaraan_jenis,
                            id_customer: i.id_customer,
                            customer: i.customer?.nama_perusahaan,
                            jenisKiriman: i.jenis_kiriman,
                            // kendaraan_jenis: i.kendaraan_jenis.nama_kendaraan_jenis,
                            kendaraanJenis: i.kendaraan_jeni?.nama_kendaraan_jenis,
                            via: i.via,
                            service_type: i.service_type,
                            kotaAsal: i.kotaAsal?.nama_kota,
                            kotaTujuan: i.kotaTujuan?.nama_kota,
                            diskonPercent: i.diskon_percent,
                            diskonRupiah: i.diskon_rupiah,
                            biaya_muat: 0,
                            biaya_bongkar: 0,
                            biaya_overtonase: 0,
                            biaya_multimuat: 0,
                            biaya_multidrop: 0,
                            biaya_mel: 0,
                            biaya_bongkar: 0,
                            biaya_tambahan: 0,
                            biaya_jalan: tarif,
                            minimal_tonase: tonase,
                            total_biaya: i.total_biaya == null || i.total_biaya == 0 ? "-" : i.total_biaya,
                            biaya_lain: i.biaya_lain,
                            id_bu: i.id_bu,
                            bu_name: i.m_bu?.name_bu,
                            bu_code: i.m_bu?.code_bu,
                            date_created: core.moment(i.date_created).format('YYYY-MM-DD HH:mm:ss ')



                        }
                    }
                    else if (req.query.berat >= i.min_tonase_4 && i.min_tonase_4 != 0) {
                        tarif = i.tarif_4
                        tonase = i.min_tonase_4
                        // console.log("anjg 4" + i.min_tonase_4)

                        return {
                            no: no++,
                            id_price: i.id_tarif_customer,
                            id_price_eureka: i.m_tarif_eureka == null ? "-" : i.m_tarif_eureka.id_tarif_eureka,
                            tarifEureka: i.m_tarif_eureka == null ? "-" : i.m_tarif_eureka.tarif,
                            kode_tarif: i.kode_tarif_customer,
                            id_bu_branch: i.id_bu_brench,
                            status: i.status,
                            kode_surat: i.kode_surat,
                            id_muat_kota: i.id_muat_kota,
                            id_tujuan_kota: i.id_tujuan_kota,
                            id_kendaraan_jenis: i.id_kendaraan_jenis,
                            id_customer: i.id_customer,
                            customer: i.customer?.nama_perusahaan,
                            jenisKiriman: i.jenis_kiriman,
                            // kendaraan_jenis: i.kendaraan_jenis.nama_kendaraan_jenis,
                            kendaraanJenis: i.kendaraan_jeni?.nama_kendaraan_jenis,
                            via: i.via,
                            service_type: i.service_type,
                            kotaAsal: i.kotaAsal?.nama_kota,
                            kotaTujuan: i.kotaTujuan?.nama_kota,
                            diskonPercent: i.diskon_percent,
                            diskonRupiah: i.diskon_rupiah,
                            biaya_muat: 0,
                            biaya_bongkar: 0,
                            biaya_overtonase: 0,
                            biaya_multimuat: 0,
                            biaya_multidrop: 0,
                            biaya_mel: 0,
                            biaya_bongkar: 0,
                            biaya_tambahan: 0,
                            biaya_jalan: tarif,
                            minimal_tonase: tonase,
                            total_biaya: i.total_biaya == null || i.total_biaya == 0 ? "-" : i.total_biaya,
                            biaya_lain: i.biaya_lain,
                            id_bu: i.id_bu,
                            bu_name: i.m_bu?.name_bu,
                            bu_code: i.m_bu?.code_bu,
                            date_created: core.moment(i.date_created).format('YYYY-MM-DD HH:mm:ss ')



                        }
                    }
                    else if (req.query.berat >= i.min_tonase_3 && i.min_tonase_3 != 0) {
                        tarif = i.tarif_3
                        tonase = i.min_tonase_3
                        // console.log("anjg 3" + i.min_tonase_3)

                        return {
                            no: no++,
                            id_price: i.id_tarif_customer,
                            id_price_eureka: i.m_tarif_eureka == null ? "-" : i.m_tarif_eureka.id_tarif_eureka,
                            tarifEureka: i.m_tarif_eureka == null ? "-" : i.m_tarif_eureka.tarif,
                            kode_tarif: i.kode_tarif_customer,
                            id_bu_branch: i.id_bu_brench,
                            status: i.status,
                            kode_surat: i.kode_surat,
                            id_muat_kota: i.id_muat_kota,
                            id_tujuan_kota: i.id_tujuan_kota,
                            id_kendaraan_jenis: i.id_kendaraan_jenis,
                            id_customer: i.id_customer,
                            customer: i.customer?.nama_perusahaan,
                            jenisKiriman: i.jenis_kiriman,
                            // kendaraan_jenis: i.kendaraan_jenis.nama_kendaraan_jenis,
                            kendaraanJenis: i.kendaraan_jeni?.nama_kendaraan_jenis,
                            via: i.via,
                            service_type: i.service_type,
                            kotaAsal: i.kotaAsal?.nama_kota,
                            kotaTujuan: i.kotaTujuan?.nama_kota,
                            diskonPercent: i.diskon_percent,
                            diskonRupiah: i.diskon_rupiah,
                            biaya_muat: 0,
                            biaya_bongkar: 0,
                            biaya_overtonase: 0,
                            biaya_multimuat: 0,
                            biaya_multidrop: 0,
                            biaya_mel: 0,
                            biaya_bongkar: 0,
                            biaya_tambahan: 0,
                            biaya_jalan: tarif,
                            minimal_tonase: tonase,
                            total_biaya: i.total_biaya == null || i.total_biaya == 0 ? "-" : i.total_biaya,
                            biaya_lain: i.biaya_lain,
                            id_bu: i.id_bu,
                            bu_name: i.m_bu?.name_bu,
                            bu_code: i.m_bu?.code_bu,
                            date_created: core.moment(i.date_created).format('YYYY-MM-DD HH:mm:ss ')



                        }
                    }
                    else if (req.query.berat >= i.min_tonase_2 && i.min_tonase_2 != 0) {
                        tarif = i.tarif_2
                        tonase = i.min_tonase_2
                        // console.log("anjg 2" + i.min_tonase_2)

                        return {
                            no: no++,
                            id_price: i.id_tarif_customer,
                            id_price_eureka: i.m_tarif_eureka == null ? "-" : i.m_tarif_eureka.id_tarif_eureka,
                            tarifEureka: i.m_tarif_eureka == null ? "-" : i.m_tarif_eureka.tarif,
                            kode_tarif: i.kode_tarif_customer,
                            id_bu_branch: i.id_bu_brench,
                            status: i.status,
                            kode_surat: i.kode_surat,
                            id_muat_kota: i.id_muat_kota,
                            id_tujuan_kota: i.id_tujuan_kota,
                            id_kendaraan_jenis: i.id_kendaraan_jenis,
                            id_customer: i.id_customer,
                            customer: i.customer?.nama_perusahaan,
                            jenisKiriman: i.jenis_kiriman,
                            // kendaraan_jenis: i.kendaraan_jenis.nama_kendaraan_jenis,
                            kendaraanJenis: i.kendaraan_jeni?.nama_kendaraan_jenis,
                            via: i.via,
                            service_type: i.service_type,
                            kotaAsal: i.kotaAsal?.nama_kota,
                            kotaTujuan: i.kotaTujuan?.nama_kota,
                            diskonPercent: i.diskon_percent,
                            diskonRupiah: i.diskon_rupiah,
                            biaya_muat: 0,
                            biaya_bongkar: 0,
                            biaya_overtonase: 0,
                            biaya_multimuat: 0,
                            biaya_multidrop: 0,
                            biaya_mel: 0,
                            biaya_bongkar: 0,
                            biaya_tambahan: 0,
                            biaya_jalan: tarif,
                            minimal_tonase: tonase,
                            total_biaya: i.total_biaya == null || i.total_biaya == 0 ? "-" : i.total_biaya,
                            biaya_lain: i.biaya_lain,
                            id_bu: i.id_bu,
                            bu_name: i.m_bu?.name_bu,
                            bu_code: i.m_bu?.code_bu,
                            date_created: core.moment(i.date_created).format('YYYY-MM-DD HH:mm:ss ')



                        }
                    }
                    else if (req.query.berat >= i.min_tonase_1 || req.query.berat >= 0) {
                        tarif = i.biaya_jalan
                        tonase = i.min_tonase_1
                        // console.log("anjg 1" + i.min_tonase_1)
                        return {
                            no: no++,
                            id_price: i.id_tarif_customer,
                            id_price_eureka: i.m_tarif_eureka == null ? "-" : i.m_tarif_eureka.id_tarif_eureka,
                            tarifEureka: i.m_tarif_eureka == null ? "-" : i.m_tarif_eureka.tarif,
                            kode_tarif: i.kode_tarif_customer,
                            id_bu_branch: i.id_bu_brench,
                            status: i.status,
                            kode_surat: i.kode_surat,
                            id_muat_kota: i.id_muat_kota,
                            id_tujuan_kota: i.id_tujuan_kota,
                            id_kendaraan_jenis: i.id_kendaraan_jenis,
                            id_customer: i.id_customer,
                            customer: i.customer?.nama_perusahaan,
                            jenisKiriman: i.jenis_kiriman,
                            // kendaraan_jenis: i.kendaraan_jenis.nama_kendaraan_jenis,
                            kendaraanJenis: i.kendaraan_jeni?.nama_kendaraan_jenis,
                            via: i.via,
                            service_type: i.service_type,
                            kotaAsal: i.kotaAsal?.nama_kota,
                            kotaTujuan: i.kotaTujuan?.nama_kota,
                            diskonPercent: i.diskon_percent,
                            diskonRupiah: i.diskon_rupiah,
                            biaya_muat: 0,
                            biaya_bongkar: 0,
                            biaya_overtonase: 0,
                            biaya_multimuat: 0,
                            biaya_multidrop: 0,
                            biaya_mel: 0,
                            biaya_bongkar: 0,
                            biaya_tambahan: 0,
                            biaya_jalan: tarif,
                            minimal_tonase: tonase,
                            total_biaya: i.total_biaya == null || i.total_biaya == 0 ? "-" : i.total_biaya,
                            biaya_lain: i.biaya_lain,
                            id_bu: i.id_bu,
                            bu_name: i.m_bu?.name_bu,
                            bu_code: i.m_bu?.code_bu,
                            date_created: core.moment(i.date_created).format('YYYY-MM-DD HH:mm:ss ')



                        }
                    }
                    else if (req.query.berat == "all" || "" || null) {
                        return {
                            no: no++,
                            id_price: i.id_tarif_customer,
                            id_price_eureka: i.m_tarif_eureka == null ? "-" : i.m_tarif_eureka.id_tarif_eureka,
                            tarifEureka: i.m_tarif_eureka == null ? "-" : i.m_tarif_eureka.tarif,
                            kode_tarif: i.kode_tarif_customer,
                            id_bu_branch: i.id_bu_brench,
                            status: i.status,
                            kode_surat: i.kode_surat,
                            id_muat_kota: i.id_muat_kota,
                            id_tujuan_kota: i.id_tujuan_kota,
                            id_kendaraan_jenis: i.id_kendaraan_jenis,
                            id_customer: i.id_customer,
                            customer: i.customer?.nama_perusahaan,
                            jenisKiriman: i.jenis_kiriman,
                            // kendaraan_jenis: i.kendaraan_jenis.nama_kendaraan_jenis,
                            kendaraanJenis: i.kendaraan_jeni?.nama_kendaraan_jenis,
                            via: i.via,
                            service_type: i.service_type,
                            kotaAsal: i.kotaAsal?.nama_kota,
                            kotaTujuan: i.kotaTujuan?.nama_kota,
                            diskonPercent: i.diskon_percent,
                            diskonRupiah: i.diskon_rupiah,
                            biaya_muat: 0,
                            biaya_bongkar: 0,
                            biaya_overtonase: 0,
                            biaya_multimuat: 0,
                            biaya_multidrop: 0,
                            biaya_mel: 0,
                            biaya_bongkar: 0,
                            biaya_tambahan: 0,
                            biaya_jalan: i.biaya_jalan,
                            minimal_tonase: 0,
                            total_biaya: i.total_biaya == null || i.total_biaya == 0 ? "-" : i.total_biaya,
                            biaya_lain: i.biaya_lain,
                            id_bu: i.id_bu,
                            bu_name: i.m_bu?.name_bu,
                            bu_code: i.m_bu?.code_bu,
                            date_created: core.moment(i.date_created).format('YYYY-MM-DD HH:mm:ss ')

                        }
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
// exports.getTarifCustomer = async (req, res) => {
//     try {
//         const getUser = await models.users.findOne(
//             {
//                 where: {
//                     id: req.user.id
//                 }
//             }
//         )
//         if (getUser) {
//             const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

//             // if (req.query.id_muat_kota == null && req.query.id_tujuan_kota == null && req.query.id_kendaraan_jenis == null) {
//             //     `SELECT
//             // a.*,
//             // d.nama_perusahaan,
//             // e.nama_kendaraan_jenis,
//             // b.nama_kota as kota_muat,
//             // c.nama_kota as kota_tujuan 
//             // FROM m_tarif_customer a
//             // INNER JOIN m_wil_kota b ON b.id_kota=a.id_muat_kota
//             // INNER JOIN m_wil_kota c ON c.id_kota=a.id_tujuan_kota
//             // INNER JOIN customer d ON d.id_customer=a.id_customer
//             // INNER JOIN kendaraan_jenis e ON e.id_kendaraan_jenis = a.id_kendaraan_jenis`

//             // }

//             const query = await db.query(`SELECT
//             a.*,
//             d.nama_perusahaan,
//             e.nama_kendaraan_jenis,
//             b.nama_kota as kota_muat,
//             c.nama_kota as kota_tujuan 
//             FROM m_tarif_customer a
//             INNER JOIN m_wil_kota b ON b.id_kota=a.id_muat_kota
//             INNER JOIN m_wil_kota c ON c.id_kota=a.id_tujuan_kota
//             INNER JOIN customer d ON d.id_customer=a.id_customer
//             INNER JOIN kendaraan_jenis e ON e.id_kendaraan_jenis = a.id_kendaraan_jenis
//             WHERE a.id_price LIKE'${req.query.id_price}%' AND a.id_muat_kota LIKE'%${req.query.id_muat_kota}%' AND a.id_tujuan_kota LIKE'%${req.query.id_tujuan_kota}%' AND e.id_kendaraan_jenis LIKE'%${req.query.id_kendaraan_jenis}%' 
//             ORDER BY a.id_price DESC
//             LIMIT ${req.query.limit} OFFSET ${req.query.page}`,
//             )



//             if (query) {
//                 output = {
//                     status: {
//                         code: 200,
//                         message: 'Success get data'
//                     },
//                     // totalData: query.count,
//                     // totalPage: Math.ceil(query.count / req.query.limit),
//                     limit: Number(req.query.limit),
//                     currentPage: Number(req.query.page),
//                     data: query,
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

exports.getDetailCustomer = async (req, res) => {
    try {


        if (!models.m_tarif_customer.associations.kotaAsal) {
            models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_muat_kota', as: 'kotaAsal' });
        }
        if (!models.m_tarif_customer.associations.kotaTujuan) {
            models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_tujuan_kota', as: 'kotaTujuan' });
        }

        // models.m_tarif_customer.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_tarif_customer.belongsTo(models.kendaraan_jenis, { targetKey: 'id_kendaraan_jenis', foreignKey: 'id_kendaraan_jenis' });
        models.m_tarif_customer.belongsTo(models.m_tarif_eureka, { targetKey: 'id_tarif_eureka', foreignKey: 'id_tarif_eureka' });

        // models.m_tarif_customer.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_tarif_customer.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_tarif_customer.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_tarif_customer.findAll(
                {
                    ...req.query.id_price ? {
                        where: {
                            id_tarif_customer: req.query.id_price
                        },
                        include: [
                            {
                                model: models.customer
                            },
                            {
                                model: models.m_wil_kota,
                                as: 'kotaAsal'
                            },
                            {
                                model: models.m_wil_kota,
                                as: 'kotaTujuan'
                            },
                            {
                                model: models.kendaraan_jenis
                            },
                            {
                                model: models.m_tarif_eureka
                            },
                            {
                                model: models.m_bu
                            },

                        ]
                    } : {}
                }

            )
            if (getData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get data'
                    },
                    order: req.query.id_price ? getData.map((item) => {
                        return {

                            id_price: item.id_tarif_customer,
                            id_price_eureka: item.m_tarif_eureka == null ? "-" : item.m_tarif_eureka.id_tarif_eureka,
                            tarifEureka: item.m_tarif_eureka == null ? "-" : item.m_tarif_eureka.tarif,
                            kode_tarif: item.kode_tarif_customer,
                            id_bu_branch: item.id_bu_brench,
                            status: item.status,
                            kode_surat: item.kode_surat,
                            id_muat_kota: item.id_muat_kota,
                            id_tujuan_kota: item.id_tujuan_kota,
                            id_kendaraan_jenis: item.id_kendaraan_jenis,
                            id_customer: item.id_customer,
                            customer: item.customer?.nama_perusahaan,
                            jenisKiriman: item.jenis_kiriman,
                            // kendaraan_jenis: item.kendaraan_jenis.nama_kendaraan_jenis,
                            kendaraanJenis: item.kendaraan_jeni.nama_kendaraan_jenis,
                            via: item.via,
                            service_type: item.service_type,
                            kotaAsal: item.kotaAsal?.nama_kota,
                            kotaTujuan: item.kotaTujuan?.nama_kota,
                            diskon_percent: item.diskon_percent,
                            diskon_rupiah: item.diskon_rupiah,
                            biaya_muat: item.biaya_muat,
                            biaya_bongkar: item.biaya_bongkar,
                            biaya_overtonase: item.biaya_overtonase,
                            biaya_multimuat: item.biaya_multimuat,
                            biaya_multidrop: item.biaya_multidrop,
                            biaya_mel: item.biaya_mel,
                            biaya_bongkar: item.biaya_bongkar,
                            biaya_tambahan: item.biaya_tambahan,
                            biaya_jalan: item.biaya_jalan,
                            total_biaya: item.total_biaya == null || item.total_biaya == 0 ? "-" : item.total_biaya,
                            biaya_lain: item.biaya_lain,
                            min_tonas_1: item.min_tonas_1,
                            min_tonase_2: item.min_tonase_2,
                            min_tonase_3: item.min_tonase_3,
                            min_tonase_4: item.min_tonase_4,
                            min_tonase_5: item.min_tonase_5,
                            tarif_2: item.tarif_2,
                            tarif_3: item.tarif_3,
                            tarif_4: item.tarif_4,
                            tarif_5: item.tarif_5,
                            id_bu: item.id_bu,
                            bu_name: item.m_bu?.name_bu,
                            bu_code: item.m_bu?.code_bu,
                            date_created: core.moment(item.date_created).format('YYYY-MM-DD HH:mm:ss ')
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


//tarif Eureka
// exports.getTarifEureka = async (req, res) => {
//     try {
//         const getUser = await models.users.findOne(
//             {
//                 where: {
//                     id: req.user.id
//                 }
//             }
//         )
//         if (getUser) {
//             // const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


//             const query = await db.query(`SELECT a.*,
//             b.nama_kota as kota_muat,
//             c.nama_kota as kota_tujuan,
//             d.nama_kendaraan_jenis
//             FROM m_tarif_eureka a
//             INNER JOIN m_wil_kota b ON b.id_kota=a.id_muat_kota
//             INNER JOIN m_wil_kota c ON c.id_kota=a.id_tujuan_kota
//             INNER JOIN kendaraan_jenis d ON d.id_kendaraan_jenis = a.id_kendaraan_jenis
//             WHERE a.id_muat_kota LIKE'%${req.query.id_muat_kota}%' AND a.id_tujuan_kota LIKE'%${req.query.id_tujuan_kota}%' AND d.id_kendaraan_jenis LIKE'%${req.query.id_kendaraan_jenis}%'
//             ORDER BY a.id_price DESC
//             LIMIT ${req.query.limit} OFFSET ${req.query.page}`,
//             )

//             if (query) {
//                 // console.log("🚀 ~ file: tarif.controller.js:277 ~ exports.getTartif= ~ query:", query)

//                 output = {
//                     status: {
//                         code: 200,
//                         message: 'Success get data'
//                     },
//                     // totalData: query.count,
//                     // totalPage: Math.ceil(query.count / req.query.limit),
//                     limit: Number(req.query.limit),
//                     currentPage: Number(req.query.page),
//                     data: query,
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
exports.getTarifEureka = async (req, res) => {
    try {
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
        if (!models.m_tarif_eureka.associations.kotaAsal) {
            models.m_tarif_eureka.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_muat_kota', as: 'kotaAsal' });
        }
        if (!models.m_tarif_eureka.associations.kotaTujuan) {
            models.m_tarif_eureka.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_tujuan_kota', as: 'kotaTujuan' });
        }

        // models.m_tarif_eureka.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_tarif_eureka.belongsTo(models.kendaraan_jenis, { targetKey: 'id_kendaraan_jenis', foreignKey: 'id_kendaraan_jenis' });
        models.m_tarif_eureka.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_tarif_eureka.findAndCountAll(
                {
                    order: [['id_tarif_eureka', 'desc']],
                    where: {
                        status: 'Y',
                        ...req.query.id_price ? {
                            id_price: req.query.id_price
                        } : {},
                        ...req.query.id_muat_kota ? {
                            id_muat_kota: req.query.id_muat_kota
                        } : {},
                        ...req.query.id_tujuan_kota ? {
                            id_tujuan_kota: req.query.id_tujuan_kota
                        } : {},
                        ...req.query.id_kendaraan_jenis ? {
                            id_kendaraan_jenis: req.query.id_kendaraan_jenis
                        } : {},
                        ...req.query.id_bu ? {
                            id_bu: req.query.id_bu
                        } : {},
                        // ...req.query.id_customer ? {
                        //     id_customer: req.query.id_customer
                        // } : {},
                    },
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.m_wil_kota,
                            as: 'kotaAsal'
                        },
                        {
                            model: models.m_wil_kota,
                            as: 'kotaTujuan'
                        },
                        // {
                        //     model: models.customer
                        // },
                        {
                            model: models.kendaraan_jenis
                        },
                        {
                            model: models.m_bu
                        },
                    ]
                }
            )
            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id_price: item.id_tarif_eureka,
                        id_muat_kota: item.id_muat_kota,
                        id_tujuan_kota: item.id_tujuan_kota,
                        id_kendaraan_jenis: item.id_kendaraan_jenis,
                        service_type: item.service_type,
                        via: item.via,
                        jenis_kiriman: item.jenis_kiriman,
                        tarif: item.tarif,
                        maintenance_cost: item.maintenance_cost,
                        variable_cost: item.variable_cost,
                        fixed_cost: item.fixed_cost,
                        amount: item.amount,
                        percent: item.percent,
                        ritase: item.ritase,
                        max_tonase: item.max_tonase,
                        satuan: item.satuan,
                        harga_selanjutnya: item.harga_selanjutnya,
                        uang_jalan: item.uang_jalan,
                        kotaAsal: item.kotaAsal?.nama_kota,
                        kotaTujuan: item.kotaTujuan?.nama_kota,
                        kendaraanJenis: item.kendaraan_jeni?.nama_kendaraan_jenis,
                        id_bu: item.id_bu,
                        bu_name: item.m_bu?.name_bu,
                        bu_code: item.m_bu?.code_bu,
                        date_created: core.moment(item.date_created).format('YYYY-MM-DD HH:MM:SS '),


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
exports.getDetailtarifEureka = async (req, res) => {
    try {

        if (!models.m_tarif_eureka.associations.kotaAsal) {
            models.m_tarif_eureka.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_muat_kota', as: 'kotaAsal' });
        }
        if (!models.m_tarif_eureka.associations.kotaTujuan) {
            models.m_tarif_eureka.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_tujuan_kota', as: 'kotaTujuan' });
        }

        // models.m_tarif_eureka.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_tarif_eureka.belongsTo(models.kendaraan_jenis, { targetKey: 'id_kendaraan_jenis', foreignKey: 'id_kendaraan_jenis' });
        models.m_tarif_eureka.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_tarif_eureka.findAll(
                {
                    ...req.query.id_price ? {
                        where: {
                            id_tarif_eureka: req.query.id_price
                        },
                        include: [
                            {
                                model: models.m_wil_kota,
                                as: 'kotaAsal'
                            },
                            {
                                model: models.m_wil_kota,
                                as: 'kotaTujuan'
                            },
                            // {
                            //     model: models.customer
                            // },
                            {
                                model: models.kendaraan_jenis
                            },
                            {
                                model: models.m_bu
                            },
                        ]
                    } : {}
                }
            )
            if (getData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get data'
                    },
                    data: req.query.id_price ? getData.map((item) => {
                        return {
                            id_price: item.id_tarif_eureka,
                            id_muat_kota: item.id_muat_kota,
                            id_tujuan_kota: item.id_tujuan_kota,
                            id_kendaraan_jenis: item.id_kendaraan_jenis,
                            service_type: item.service_type,
                            via: item.via,
                            jenis_kiriman: item.jenis_kiriman,
                            tarif: item.tarif,
                            maintenance_cost: item.maintenance_cost,
                            variable_cost: item.variable_cost,
                            fixed_cost: item.fixed_cost,
                            amount: item.amount,
                            percent: item.percent,
                            ritase: item.ritase,
                            max_tonase: item.max_tonase,
                            satuan: item.satuan,
                            harga_selanjutnya: item.harga_selanjutnya,
                            uang_jalan: item.uang_jalan,
                            kotaAsal: item.kotaAsal?.nama_kota,
                            kotaTujuan: item.kotaTujuan?.nama_kota,
                            kendaraanJenis: item.kendaraan_jeni?.nama_kendaraan_jenis,
                            id_bu: item.id_bu,
                            bu_name: item.m_bu?.name_bu,
                            bu_code: item.m_bu?.code_bu,
                            date_created: core.moment(item.date_created).format('YYYY-MM-DD HH:MM:SS '),
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

exports.creatTarifEureka = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getTarif = await models.m_tarif_eureka.findOne(
                {
                    where: {
                        id_muat_kota: req.body.id_muat_kota,
                        service_type: req.body.service_type,
                        id_tujuan_kota: req.body.id_tujuan_kota,
                        id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                        status: "Y"
                    }
                }
            )

            const getCode = await models.m_tarif_eureka.findAll(
                {
                    order: [['id_tarif_eureka', 'desc']],
                    limit: 1,
                    where: {
                        kode_tarif_eureka: {
                            [Op.like]: `%TE%`
                        },
                    }
                }
            )

            if (!getTarif) {
                if (getCode.length === 0) {
                    const createData = await models.m_tarif_eureka.create(
                        {
                            'id_muat_kota': req.body.id_muat_kota,
                            'id_tujuan_kota': req.body.id_tujuan_kota,
                            'id_kendaraan_jenis': req.body.id_kendaraan_jenis,
                            'kode_tarif_eureka': 'TE00000001',
                            'service_type': req.body.service_type,
                            'via': req.body.via,
                            'jenis_kiriman': req.body.jenis_kiriman,
                            'tarif': req.body.tarif,
                            'maintenance_cost': req.body.maintenance_cost,
                            'variable_cost': req.body.variable_cost,
                            'fixed_cost': req.body.fixed_cost,
                            'amount': req.body.amount,
                            'percent': req.body.percent,
                            'ritase': req.body.ritase,
                            'max_tonase': req.body.max_tonase,
                            'satuan': req.body.satuan,
                            'harga_selanjutnya': req.body.harga_selanjutnya,
                            'uang_jalan': req.body.uang_jalan,
                            'status': 'Y',
                            'date_created': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                            'id_user': req.user.id,
                        }
                    )

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Sukses menambah tarif eureka'
                            }
                        }
                    }
                } else {
                    const getcodeTarif = Number(getCode[0].kode_tarif_eureka.substring(2, 11))
                    const tarifCode = getcodeTarif + 1

                    const getcharacterNumber = tarifCode.toString()

                    if (tarifCode > 99999999) {
                        output = {
                            status: {
                                code: 400,
                                message: 'Gagal menginput data kode sudah maks di 99999999'
                            }
                        }
                    } else {
                        var zeroCode

                        if (getcharacterNumber.length == 1) {
                            var zeroCode = "0000000"
                        } else if (getcharacterNumber.length == 2) {
                            var zeroCode = "000000"
                        } else if (getcharacterNumber.length == 3) {
                            var zeroCode = "00000"
                        } else if (getcharacterNumber.length == 4) {
                            var zeroCode = "0000"
                        } else if (getcharacterNumber.length == 5) {
                            var zeroCode = "000"
                        } else if (getcharacterNumber.length == 6) {
                            var zeroCode = "00"
                        } else if (getcharacterNumber.length == 7) {
                            var zeroCode = "0"
                        } else if (getcharacterNumber.length == 8) {
                            var zeroCode = ""
                        }

                        const createData = await models.m_tarif_eureka.create(
                            {
                                'id_muat_kota': req.body.id_muat_kota,
                                'id_tujuan_kota': req.body.id_tujuan_kota,
                                'id_kendaraan_jenis': req.body.id_kendaraan_jenis,
                                'kode_tarif_eureka': 'TE' + zeroCode + tarifCode,
                                'service_type': req.body.service_type,
                                'via': req.body.via,
                                'jenis_kiriman': req.body.jenis_kiriman,
                                'tarif': req.body.tarif,
                                'maintenance_cost': req.body.maintenance_cost,
                                'variable_cost': req.body.variable_cost,
                                'fixed_cost': req.body.fixed_cost,
                                'amount': req.body.amount,
                                'percent': req.body.percent,
                                'ritase': req.body.ritase,
                                'max_tonase': req.body.max_tonase,
                                'satuan': req.body.satuan,
                                'harga_selanjutnya': req.body.harga_selanjutnya,
                                'uang_jalan': req.body.uang_jalan,
                                'status': 'Y',
                                'date_created': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                'id_user': req.user.id,
                            }
                        )

                        if (createData) {
                            output = {
                                status: {
                                    code: 200,
                                    message: 'Sukses menambah tarif eureka'
                                }
                            }
                        }
                    }
                }
            } else {
                output = {
                    status: {
                        code: 402,
                        message: 'Tarif Sudah Tersedia'
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

exports.updateTarifEureka = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updData = await models.m_tarif_eureka.update(
                {
                    id_muat_kota: req.body.id_muat_kota,
                    id_tujuan_kota: req.body.id_tujuan_kota,
                    id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                    service_type: req.body.service_type,
                    via: req.body.via,
                    jenis_kiriman: req.body.jenis_kiriman,
                    maintenance_cost: req.body.maintenance_cost,
                    variable_cost: req.body.variable_cost,
                    fixed_cost: req.body.fixed_cost,
                    amount: req.body.amount,
                    percent: req.body.percent,
                    tarif: req.body.tarif,
                    max_tonase: req.body.max_tonase,
                    satuan: req.body.satuan,
                    harga_selanjutnya: req.body.harga_selanjutnya,
                    ritase: req.body.ritase,
                    uang_jalan: req.body.uang_jalan,
                    id_bu: req.body.id_bu,

                },
                {
                    where: {
                        id_tarif_eureka: req.body.id_price
                    }
                }
            )
            if (updData) {
                output = {
                    status: {
                        code: 200,
                        message: 'succes update Eureka Tarif'
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

exports.delTarifEureka = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updData = await models.m_tarif_eureka.update(
                {
                    status: "N"
                },
                {
                    where: {
                        id_tarif_eureka: req.body.id_price
                    }
                }
            )
            if (updData) {
                output = {
                    status: {
                        code: 200,
                        message: 'succes delete Eureka Tarif'
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


//tarif mitra

// exports.getTarifMitra = async (req, res) => {

//     try {
//         const getUser = await models.users.findOne(
//             {
//                 where: {
//                     id: req.user.id
//                 }
//             }
//         )
//         if (getUser) {
//             const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


//             const query = await db.query(`SELECT
//             a.*,
//             d.nama_mitra,
//             e.nama_kendaraan_jenis,
//             b.nama_kota as kota_muat,
//             c.nama_kota as kota_tujuan 
//             FROM m_tarif_mitra a
//             INNER JOIN m_wil_kota b ON b.id_kota=a.id_muat_kota
//             INNER JOIN m_wil_kota c ON c.id_kota=a.id_tujuan_kota
//             INNER JOIN mitra d ON d.id_mitra=a.id_mitra
//             INNER JOIN kendaraan_jenis e ON e.id_kendaraan_jenis = a.id_kendaraan_jenis
//             WHERE a.status="Y"
//             ORDER BY a.id_price_mitra DESC
//             LIMIT ${req.query.limit} OFFSET ${req.query.page}`,
//             )

//             if (query) {
//                 // console.log("🚀 ~ file: tarif.controller.js:277 ~ exports.getTartif= ~ query:", query)

//                 output = {
//                     status: {
//                         code: 200,
//                         message: 'Success get data'
//                     },
//                     // totalData: query.count,
//                     // totalPage: Math.ceil(query.count / req.query.limit),
//                     limit: Number(req.query.limit),
//                     currentPage: Number(req.query.page),
//                     data: query,
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
exports.getTarifMitra = async (req, res) => {
    try {
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
        if (!models.m_tarif_mitra.associations.kotaAsal) {
            models.m_tarif_mitra.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_muat_kota', as: 'kotaAsal' });
        }
        if (!models.m_tarif_mitra.associations.kotaTujuan) {
            models.m_tarif_mitra.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_tujuan_kota', as: 'kotaTujuan' });
        }

        models.m_tarif_mitra.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
        models.m_tarif_mitra.belongsTo(models.kendaraan_jenis, { targetKey: 'id_kendaraan_jenis', foreignKey: 'id_kendaraan_jenis' });
        models.m_tarif_mitra.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_tarif_mitra.findAndCountAll(
                {
                    order: [['id_price_mitra', 'desc']],
                    where: {
                        ...(req.query.status ? { status: req.query.status } : {}),
                        ...req.query.keyword ? {
                            [Op.or]: [
                            { kode_tarif_mitra: { [Op.like]: `%${req.query.keyword}%` } },
                            { jenis_kiriman: { [Op.like]: `%${req.query.keyword}%` } },
                            { via: { [Op.like]: `%${req.query.keyword}%` } },
                            { service_type: { [Op.like]: `%${req.query.keyword}%` } }
                            ]
                        } : {},
                        ...req.query.id_price_mitra ? {
                            id_price_mitra: req.query.id_price_mitra
                        } : {},
                        ...req.query.id_muat_kota ? {
                            id_muat_kota: req.query.id_muat_kota
                        } : {},
                        ...req.query.id_tujuan_kota ? {
                            id_tujuan_kota: req.query.id_tujuan_kota
                        } : {},
                        ...req.query.id_kendaraan_jenis ? {
                            id_kendaraan_jenis: req.query.id_kendaraan_jenis
                        } : {},
                        ...req.query.id_mitra ? {
                            id_mitra: req.query.id_mitra
                        } : {},
                        ...req.query.id_bu ? {
                            id_bu: req.query.id_bu
                        } : {},

                    },
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.m_wil_kota,
                            as: 'kotaAsal'
                        },
                        {
                            model: models.m_wil_kota,
                            as: 'kotaTujuan'
                        },
                        {
                            model: models.mitra,
                            where: {
                                ...req.query.keyword ? {
                                    nama_mitra: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },
                                } : {}
                            }
                        },
                        {
                            model: models.kendaraan_jenis
                        },
                        {
                            model: models.m_bu
                        },
                    ]
                }
            )
            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id_price_mitra: item.id_price_mitra,
                        kode_tarif: item.kode_tarif_mitra,
                        id_muat_kota: item.id_muat_kota,
                        id_tujuan_kota: item.id_tujuan_kota,
                        id_kendaraan_jenis: item.id_kendaraan_jenis,
                        id_mitra: item.id_mitra,
                        mitra: item.mitra?.nama_mitra,
                        via: item.via,
                        service_type: item.service_type,
                        jenis_kiriman: item.jenis_kiriman,
                        tarif: item.tarif,
                        max_tonase: item.max_tonase,
                        satuan: item.satuan,
                        IdPriceEureka: item.IdPriceEureka,
                        ritase: item.ritase,
                        uang_jalan: item.uang_jalan,
                        status: item.status,
                        kotaAsal: item.kotaAsal?.nama_kota,
                        kotaTujuan: item.kotaTujuan?.nama_kota,
                        kendaraanJenis: item.kendaraan_jeni?.nama_kendaraan_jenis,
                        id_bu: item.id_bu,
                        bu_name: item.m_bu?.name_bu,
                        bu_code: item.m_bu?.code_bu,
                        kode_surat: item.kode_surat,
                        date_created: core.moment(item.date_created).format('YYYY-MM-DD HH:mm:ss '),

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

exports.getDetailTarifMitra = async (req, res) => {
    try {

        if (!models.m_tarif_mitra.associations.kotaAsal) {
            models.m_tarif_mitra.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_muat_kota', as: 'kotaAsal' });
        }
        if (!models.m_tarif_mitra.associations.kotaTujuan) {
            models.m_tarif_mitra.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_tujuan_kota', as: 'kotaTujuan' });
        }

        models.m_tarif_mitra.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
        models.m_tarif_mitra.belongsTo(models.kendaraan_jenis, { targetKey: 'id_kendaraan_jenis', foreignKey: 'id_kendaraan_jenis' });
        models.m_tarif_mitra.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_tarif_mitra.findAll(
                {
                    ...req.query.id_price ? {
                        where: {
                            id_price_mitra: req.query.id_price
                        },
                        include: [
                            {
                                model: models.m_wil_kota,
                                as: 'kotaAsal'
                            },
                            {
                                model: models.m_wil_kota,
                                as: 'kotaTujuan'
                            },
                            {
                                model: models.mitra
                            },
                            {
                                model: models.kendaraan_jenis
                            },
                            {
                                model: models.m_bu
                            },
                        ]
                    } : {}
                }
            )
            if (getData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get data'
                    },
                    order: req.query.id_price ? getData.map((item) => {
                        return {
                            id_price_mitra: item.id_price_mitra,
                            kode_tarif: item.kode_tarif_mitra,
                            id_muat_kota: item.id_muat_kota,
                            id_tujuan_kota: item.id_tujuan_kota,
                            id_kendaraan_jenis: item.id_kendaraan_jenis,
                            id_mitra: item.id_mitra,
                            mitra: item.mitra?.nama_mitra,
                            service_type: item.service_type,
                            via: item.via,
                            jenis_kiriman: item.jenis_kiriman,
                            tarif: item.tarif,
                            max_tonase: item.max_tonase,
                            satuan: item.satuan,
                            IdPriceEureka: item.IdPriceEureka,
                            ritase: item.ritase,
                            uang_jalan: item.uang_jalan,
                            status: item.status,
                            kotaAsal: item.kotaAsal?.nama_kota,
                            kotaTujuan: item.kotaTujuan?.nama_kota,
                            kendaraanJenis: item.kendaraan_jeni?.nama_kendaraan_jenis,
                            id_bu: item.id_bu,
                            bu_name: item.m_bu?.name_bu,
                            bu_code: item.m_bu?.code_bu,
                            kode_surat: item.kode_surat,
                            date_created: core.moment(item.date_created).format('YYYY-MM-DD HH:mm:ss '),
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

exports.updateTarifMitra = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updateData = await models.m_tarif_mitra.update(
                {
                    id_muat_kota: req.body.id_muat_kota,
                    id_tujuan_kota: req.body.id_tujuan_kota,
                    id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                    id_mitra: req.body.id_mitra,
                    service_type: req.body.service_type,
                    via: req.body.via,
                    jenis_kiriman: req.body.jenis_kiriman,
                    tarif: req.body.tarif,
                    max_tonase: req.body.max_tonase,
                    satuan: req.body.satuan,
                    IdPriceEureka: req.body.id_tarif_eureka,
                    ritase: req.body.ritase,
                    uang_jalan: req.body.uang_jalan,
                    kode_surat: req.body.kode_surat,
                    id_bu: req.body.id_bu,
                    status: req.body.status,
                    date_created: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                    id_user: req.user.id,
                },
                {
                    where: {
                        id_price_mitra: req.body.id_price_mitra
                    }
                }
            )
            if (updateData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Succes update tarif mitra'
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

exports.delTarifMitra = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            // Cek apakah data exists sebelum delete
            const checkData = await models.m_tarif_mitra.findOne({
                where: {
                    id_price_mitra: req.body.id_price_mitra
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
                // Hard delete - benar-benar menghapus data dari database
                const delData = await models.m_tarif_mitra.destroy({
                    where: {
                        id_price_mitra: req.body.id_price_mitra
                    }
                })
                
                if (delData > 0) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Succes delete data'
                        }
                    }
                } else {
                    output = {
                        status: {
                            code: 400,
                            message: 'Gagal menghapus data'
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

exports.creatTarifMitra = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getTarif = await models.m_tarif_mitra.findOne(
                {
                    where: {
                        id_muat_kota: req.body.id_muat_kota,
                        id_tujuan_kota: req.body.id_tujuan_kota,
                        id_mitra: req.body.id_mitra,
                        id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                        service_type: req.body.service_type,
                        status: 'Y',
                    }
                }
            )

            const getCode = await models.m_tarif_mitra.findAll(
                {
                    order: [['id_price_mitra', 'desc']],
                    limit: 1,
                    where: {
                        kode_tarif_mitra: {
                            [Op.like]: `%TM%`
                        },
                    }
                }
            )

            if (!getTarif) {
                if (getCode.length === 0 || (getCode.length > 0 && getCode[0].kode_tarif_mitra && getCode[0].kode_tarif_mitra.includes("TM23"))) {
                    const createData = await models.m_tarif_mitra.create(
                        {
                            'kode_tarif_mitra': "TM00000001",
                            'id_muat_kota': req.body.id_muat_kota,
                            'id_tujuan_kota': req.body.id_tujuan_kota,
                            'id_kendaraan_jenis': req.body.id_kendaraan_jenis,
                            'id_mitra': req.body.id_mitra,
                            'service_type': req.body.service_type,
                            'jenis_kiriman': req.body.jenis_kiriman,
                            'via': req.body.via,
                            'tarif': req.body.tarif,
                            'max_tonase': req.body.max_tonase,
                            'ritase': req.body.ritase,
                            'uang_jalan': req.body.uang_jalan,
                            'kode_surat': req.body.kode_surat,
                            'status': 'N',
                            'date_created': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                            'id_user': req.user.id,
                        }
                    )

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Sukses menambah tarif mitra'
                            }
                        }
                    }
                } else {
                    const getcodeTarif = Number(getCode[0].kode_tarif_mitra.substring(2, 11))
                    const tarifCode = getcodeTarif + 1

                    const getcharacterNumber = tarifCode.toString()

                    if (tarifCode > 99999999) {
                        output = {
                            status: {
                                code: 400,
                                message: 'Gagal menginput data kode sudah maks di 99999999'
                            }
                        }
                    } else {
                        var zeroCode

                        if (getcharacterNumber.length == 1) {
                            var zeroCode = "0000000"
                        } else if (getcharacterNumber.length == 2) {
                            var zeroCode = "000000"
                        } else if (getcharacterNumber.length == 3) {
                            var zeroCode = "00000"
                        } else if (getcharacterNumber.length == 4) {
                            var zeroCode = "0000"
                        } else if (getcharacterNumber.length == 5) {
                            var zeroCode = "000"
                        } else if (getcharacterNumber.length == 6) {
                            var zeroCode = "00"
                        } else if (getcharacterNumber.length == 7) {
                            var zeroCode = "0"
                        } else if (getcharacterNumber.length == 8) {
                            var zeroCode = ""
                        }

                        const createData = await models.m_tarif_mitra.create(
                            {
                                'kode_tarif_mitra': 'TM' + zeroCode + tarifCode,
                                'id_muat_kota': req.body.id_muat_kota,
                                'id_tujuan_kota': req.body.id_tujuan_kota,
                                'id_kendaraan_jenis': req.body.id_kendaraan_jenis,
                                'id_mitra': req.body.id_mitra,
                                'service_type': req.body.service_type,
                                'jenis_kiriman': req.body.jenis_kiriman,
                                'via': req.body.via,
                                'tarif': req.body.tarif,
                                'max_tonase': req.body.max_tonase,
                                'satuan': req.body.satuan,
                                'IdPriceEureka': req.body.id_tarif_eureka,
                                'ritase': req.body.ritase,
                                'uang_jalan': req.body.uang_jalan,
                                'kode_surat': req.body.kode_surat,
                                'status': 'N',
                                'date_created': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                'id_user': req.user.id,
                                'id_bu': req.body.id_bu,
                            }
                        )

                        if (createData) {
                            output = {
                                status: {
                                    code: 200,
                                    message: 'Sukses menambah tarif mitra'
                                }
                            }
                        }
                    }
                }
            } else {
                output = {
                    status: {
                        code: 402,
                        message: 'Tarif Sudah Tersedia'
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

// Create Tarif Customer dengan Konfirmasi
exports.createTarifCustomerWithConfirmation = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: { id: req.user.id }
        });

        if (!getUser) {
            return res.status(401).send({
                status: { code: 401, message: 'Unauthorized' }
            });
        }

        // Check existing tarif customer (yang masih aktif, bukan yang sudah dihapus)
        const existingTarif = await models.m_tarif_customer.findOne({
            where: {
                id_muat_kota: req.body.id_muat_kota,
                id_tujuan_kota: req.body.id_tujuan_kota,
                id_customer: req.body.id_customer,
                id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                service_type: req.body.service_type,
                via: req.body.via,
                jenis_kiriman: req.body.jenis_kiriman,
                status: { [Op.in]: ['Y', 'N'] }
            }
        });

        if (existingTarif) {
            // Tarif sudah ada, kembalikan informasi untuk konfirmasi
            res.status(200).send({
                status: { code: 402, message: 'Tarif sudah ada' },
                data: {
                    exists: true,
                    existingTarifId: existingTarif.id_tarif_customer,
                    message: 'Tarif sudah ada, yakin ganti?'
                }
            });
        } else {
            // Tarif belum ada, langsung create
            const getCode = await models.m_tarif_customer.findAll({
                order: [['id_tarif_customer', 'desc']],
                limit: 1,
                where: {
                    kode_tarif_customer: { [Op.like]: `%TC%` }
                }
            });

            let kodeTarifCustomer;
            if (getCode.length === 0 || (getCode.length > 0 && getCode[0].kode_tarif_customer && getCode[0].kode_tarif_customer.includes("TC23"))) {
                kodeTarifCustomer = "TC00000001";
            } else {
                const getcodeTarif = Number(getCode[0].kode_tarif_customer.substring(2, 11));
                const tarifCode = getcodeTarif + 1;
                const getcharacterNumber = tarifCode.toString();

                if (tarifCode > 99999999) {
                    return res.status(400).send({
                        status: { code: 400, message: 'Gagal menginput data kode sudah maks di 99999999' }
                    });
                }

                let zeroCode = "";
                if (getcharacterNumber.length == 1) zeroCode = "0000000";
                else if (getcharacterNumber.length == 2) zeroCode = "000000";
                else if (getcharacterNumber.length == 3) zeroCode = "00000";
                else if (getcharacterNumber.length == 4) zeroCode = "0000";
                else if (getcharacterNumber.length == 5) zeroCode = "000";
                else if (getcharacterNumber.length == 6) zeroCode = "00";
                else if (getcharacterNumber.length == 7) zeroCode = "0";

                kodeTarifCustomer = "TC" + zeroCode + tarifCode;
            }

            const createData = await models.m_tarif_customer.create({
                kode_tarif_customer: kodeTarifCustomer,
                id_muat_kota: req.body.id_muat_kota,
                id_tujuan_kota: req.body.id_tujuan_kota,
                id_tarif_eureka: req.body.id_price_eureka,
                id_customer: req.body.id_customer,
                id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                service_type: req.body.service_type,
                via: req.body.via,
                jenis_kiriman: req.body.jenis_kiriman,
                diskon_percent: req.body.diskon_percent,
                diskon_rupiah: req.body.diskon_rupiah,
                biaya_jalan: req.body.biaya_jalan,
                total_biaya: req.body.total_biaya,
                biaya_muat: req.body.biaya_muat,
                biaya_bongkar: req.body.biaya_bongkar,
                biaya_overtonase: req.body.biaya_overtonase,
                biaya_multimuat: req.body.biaya_multimuat,
                biaya_multidrop: req.body.biaya_multidrop,
                biaya_mel: req.body.biaya_mel,
                biaya_tambahan: req.body.biaya_tambahan,
                biaya_lain: req.body.biaya_lain,
                id_bu_brench: req.body.id_bu_branch,
                id_bu: req.body.id_bu,
                status: 'N',
                kode_surat: req.body.kode_surat,
                date_created: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                pic: '1',
                min_tonas_1: req.body.min_tonas_1,
                min_tonase_2: req.body.min_tonase_2,
                min_tonase_3: req.body.min_tonase_3,
                min_tonase_4: req.body.min_tonase_4,
                min_tonase_5: req.body.min_tonase_5,
                tarif_2: req.body.tarif_2,
                tarif_3: req.body.tarif_3,
                tarif_4: req.body.tarif_4,
                tarif_5: req.body.tarif_5,
                id_bu: req.body.id_bu,
            });

            res.status(200).send({
                status: { code: 200, message: 'Tarif customer berhasil dibuat' },
                data: {
                    exists: false,
                    message: 'Tarif customer berhasil dibuat',
                    tarifId: createData.id_tarif_customer
                }
            });
        }

    } catch (error) {
        res.status(500).send({
            status: { code: 500, message: error.message }
        });
    }
};

// Replace Tarif Customer
exports.replaceTarifCustomer = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: { id: req.user.id }
        });

        if (!getUser) {
            return res.status(401).send({
                status: { code: 401, message: 'Unauthorized' }
            });
        }

        const { existingTarifId, confirmReplace, ...tarifData } = req.body;

        if (confirmReplace !== 'yes') {
            return res.status(400).send({
                status: { code: 400, message: 'Konfirmasi replace diperlukan' }
            });
        }

        // Nonaktifkan tarif lama (set ke D untuk deleted)
        await models.m_tarif_customer.update(
            { status: 'D' },
            { where: { id_tarif_customer: existingTarifId } }
        );

        // Generate kode tarif customer baru
        const getCode = await models.m_tarif_customer.findAll({
            order: [['id_tarif_customer', 'desc']],
            limit: 1,
            where: {
                kode_tarif_customer: { [Op.like]: `%TC%` }
            }
        });

        let kodeTarifCustomer;
        if (getCode.length === 0 || (getCode.length > 0 && getCode[0].kode_tarif_customer && getCode[0].kode_tarif_customer.includes("TC23"))) {
            kodeTarifCustomer = "TC00000001";
        } else {
            const getcodeTarif = Number(getCode[0].kode_tarif_customer.substring(2, 11));
            const tarifCode = getcodeTarif + 1;
            const getcharacterNumber = tarifCode.toString();

            if (tarifCode > 99999999) {
                return res.status(400).send({
                    status: { code: 400, message: 'Gagal menginput data kode sudah maks di 99999999' }
                });
            }

            let zeroCode = "";
            if (getcharacterNumber.length == 1) zeroCode = "0000000";
            else if (getcharacterNumber.length == 2) zeroCode = "000000";
            else if (getcharacterNumber.length == 3) zeroCode = "00000";
            else if (getcharacterNumber.length == 4) zeroCode = "0000";
            else if (getcharacterNumber.length == 5) zeroCode = "000";
            else if (getcharacterNumber.length == 6) zeroCode = "00";
            else if (getcharacterNumber.length == 7) zeroCode = "0";

            kodeTarifCustomer = "TC" + zeroCode + tarifCode;
        }

        // Insert tarif customer baru
        const newTarifCustomer = await models.m_tarif_customer.create({
            kode_tarif_customer: kodeTarifCustomer,
            id_muat_kota: tarifData.id_muat_kota,
            id_tujuan_kota: tarifData.id_tujuan_kota,
            id_tarif_eureka: tarifData.id_price_eureka,
            id_customer: tarifData.id_customer,
            id_kendaraan_jenis: tarifData.id_kendaraan_jenis,
            service_type: tarifData.service_type,
            via: tarifData.via,
            jenis_kiriman: tarifData.jenis_kiriman,
            diskon_percent: tarifData.diskon_percent,
            diskon_rupiah: tarifData.diskon_rupiah,
            biaya_jalan: tarifData.biaya_jalan,
            total_biaya: tarifData.total_biaya,
            biaya_muat: tarifData.biaya_muat,
            biaya_bongkar: tarifData.biaya_bongkar,
            biaya_overtonase: tarifData.biaya_overtonase,
            biaya_multimuat: tarifData.biaya_multimuat,
            biaya_multidrop: tarifData.biaya_multidrop,
            biaya_mel: tarifData.biaya_mel,
            biaya_tambahan: tarifData.biaya_tambahan,
            biaya_lain: tarifData.biaya_lain,
            id_bu_brench: tarifData.id_bu_branch,
            id_bu: tarifData.id_bu,
            status: 'N',
            kode_surat: tarifData.kode_surat,
            date_created: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            pic: '1',
            min_tonas_1: tarifData.min_tonas_1,
            min_tonase_2: tarifData.min_tonase_2,
            min_tonase_3: tarifData.min_tonase_3,
            min_tonase_4: tarifData.min_tonase_4,
            min_tonase_5: tarifData.min_tonase_5,
            tarif_2: tarifData.tarif_2,
            tarif_3: tarifData.tarif_3,
            tarif_4: tarifData.tarif_4,
            tarif_5: tarifData.tarif_5,
        });

        res.status(200).send({
            status: { code: 200, message: 'Tarif customer berhasil diganti' },
            data: {
                message: 'Tarif lama telah dinonaktifkan dan tarif baru berhasil dibuat',
                newTarifId: newTarifCustomer.id_tarif_customer
            }
        });

    } catch (error) {
        res.status(500).send({
            status: { code: 500, message: error.message }
        });
    }
};

// Create Tarif Eureka dengan Konfirmasi
exports.createTarifEurekaWithConfirmation = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: { id: req.user.id }
        });

        if (!getUser) {
            return res.status(401).send({
                status: { code: 401, message: 'Unauthorized' }
            });
        }

        // Check existing tarif eureka (yang masih aktif, bukan yang sudah dihapus)
        const existingTarif = await models.m_tarif_eureka.findOne({
            where: {
                id_muat_kota: req.body.id_muat_kota,
                id_tujuan_kota: req.body.id_tujuan_kota,
                id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                service_type: req.body.service_type,
                via: req.body.via,
                jenis_kiriman: req.body.jenis_kiriman,
                id_bu: req.body.id_bu,
                status: { [Op.in]: ['Y', 'N'] }
            }
        });

        if (existingTarif) {
            // Tarif sudah ada, kembalikan informasi untuk konfirmasi
            res.status(200).send({
                status: { code: 402, message: 'Tarif sudah ada' },
                data: {
                    exists: true,
                    existingTarifId: existingTarif.id_tarif_eureka,
                    message: 'Tarif sudah ada, yakin ganti?'
                }
            });
        } else {
            // Tarif belum ada, langsung create
            // Tentukan prefix berdasarkan id_bu
            let prefix = "TE"; // Default untuk id_bu = 11 (PT Eureka Logistics)
            if (req.body.id_bu == 21) {
                prefix = "TR"; // Untuk id_bu = 21 (PT Raja Cepat Nusantara)
            }

            const getCode = await models.m_tarif_eureka.findAll({
                order: [['id_tarif_eureka', 'desc']],
                limit: 1,
                where: {
                    kode_tarif_eureka: { [Op.like]: `${prefix}%` }
                }
            });

            let kodeTarifEureka;
            if (getCode.length === 0 || (getCode.length > 0 && getCode[0].kode_tarif_eureka && getCode[0].kode_tarif_eureka.includes(`${prefix}23`))) {
                kodeTarifEureka = `${prefix}00000001`;
            } else {
                const getcodeTarif = Number(getCode[0].kode_tarif_eureka.substring(2, 11));
                const tarifCode = getcodeTarif + 1;
                const getcharacterNumber = tarifCode.toString();

                if (tarifCode > 99999999) {
                    return res.status(400).send({
                        status: { code: 400, message: 'Gagal menginput data kode sudah maks di 99999999' }
                    });
                }

                let zeroCode = "";
                if (getcharacterNumber.length == 1) zeroCode = "0000000";
                else if (getcharacterNumber.length == 2) zeroCode = "000000";
                else if (getcharacterNumber.length == 3) zeroCode = "00000";
                else if (getcharacterNumber.length == 4) zeroCode = "0000";
                else if (getcharacterNumber.length == 5) zeroCode = "000";
                else if (getcharacterNumber.length == 6) zeroCode = "00";
                else if (getcharacterNumber.length == 7) zeroCode = "0";

                kodeTarifEureka = prefix + zeroCode + tarifCode;
            }

            const createData = await models.m_tarif_eureka.create({
                kode_tarif_eureka: kodeTarifEureka,
                id_muat_kota: req.body.id_muat_kota,
                id_tujuan_kota: req.body.id_tujuan_kota,
                id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                service_type: req.body.service_type,
                via: req.body.via,
                jenis_kiriman: req.body.jenis_kiriman,
                ritase: req.body.ritase,
                uang_jalan: req.body.uang_jalan,
                maintenance_cost: req.body.maintenance_cost,
                variable_cost: req.body.variable_cost,
                fixed_cost: req.body.fixed_cost,
                amount: req.body.amount,
                percent: req.body.percent,
                tarif: req.body.tarif,
                nett_price: req.body.nett_price,
                status: 'N',
                max_tonase: req.body.max_tonase,
                harga_selanjutnya: req.body.harga_selanjutnya,
                satuan: req.body.satuan,
                date_created: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                id_user: req.user.id,
                id_bu: req.body.id_bu,
            });

            res.status(200).send({
                status: { code: 200, message: 'Tarif eureka berhasil dibuat' },
                data: {
                    exists: false,
                    message: 'Tarif eureka berhasil dibuat',
                    tarifId: createData.id_tarif_eureka
                }
            });
        }

    } catch (error) {
        res.status(500).send({
            status: { code: 500, message: error.message }
        });
    }
};

// Replace Tarif Eureka
exports.replaceTarifEureka = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: { id: req.user.id }
        });

        if (!getUser) {
            return res.status(401).send({
                status: { code: 401, message: 'Unauthorized' }
            });
        }

        const { existingTarifId, confirmReplace, ...tarifData } = req.body;

        if (confirmReplace !== 'yes') {
            return res.status(400).send({
                status: { code: 400, message: 'Konfirmasi replace diperlukan' }
            });
        }

        // Nonaktifkan tarif lama (set ke D untuk deleted)
        await models.m_tarif_eureka.update(
            { status: 'D' },
            { where: { id_tarif_eureka: existingTarifId } }
        );

        // Generate kode tarif eureka baru
        const getCode = await models.m_tarif_eureka.findAll({
            order: [['id_tarif_eureka', 'desc']],
            limit: 1,
            where: {
                kode_tarif_eureka: { [Op.like]: `%TE%` }
            }
        });

        let kodeTarifEureka;
        if (getCode.length === 0 || (getCode.length > 0 && getCode[0].kode_tarif_eureka && getCode[0].kode_tarif_eureka.includes("TE23"))) {
            kodeTarifEureka = "TE00000001";
        } else {
            const getcodeTarif = Number(getCode[0].kode_tarif_eureka.substring(2, 11));
            const tarifCode = getcodeTarif + 1;
            const getcharacterNumber = tarifCode.toString();

            if (tarifCode > 99999999) {
                return res.status(400).send({
                    status: { code: 400, message: 'Gagal menginput data kode sudah maks di 99999999' }
                });
            }

            let zeroCode = "";
            if (getcharacterNumber.length == 1) zeroCode = "0000000";
            else if (getcharacterNumber.length == 2) zeroCode = "000000";
            else if (getcharacterNumber.length == 3) zeroCode = "00000";
            else if (getcharacterNumber.length == 4) zeroCode = "0000";
            else if (getcharacterNumber.length == 5) zeroCode = "000";
            else if (getcharacterNumber.length == 6) zeroCode = "00";
            else if (getcharacterNumber.length == 7) zeroCode = "0";

            kodeTarifEureka = "TE" + zeroCode + tarifCode;
        }

        // Insert tarif eureka baru
        const newTarifEureka = await models.m_tarif_eureka.create({
            kode_tarif_eureka: kodeTarifEureka,
            id_muat_kota: tarifData.id_muat_kota,
            id_tujuan_kota: tarifData.id_tujuan_kota,
            id_kendaraan_jenis: tarifData.id_kendaraan_jenis,
            service_type: tarifData.service_type,
            via: tarifData.via,
            jenis_kiriman: tarifData.jenis_kiriman,
            ritase: tarifData.ritase,
            uang_jalan: tarifData.uang_jalan,
            maintenance_cost: tarifData.maintenance_cost,
            variable_cost: tarifData.variable_cost,
            fixed_cost: tarifData.fixed_cost,
            amount: tarifData.amount,
            percent: tarifData.percent,
            tarif: tarifData.tarif,
            nett_price: tarifData.nett_price,
            status: 'N',
            max_tonase: tarifData.max_tonase,
            harga_selanjutnya: tarifData.harga_selanjutnya,
            satuan: tarifData.satuan,
            date_created: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            id_user: req.user.id,
        });

        res.status(200).send({
            status: { code: 200, message: 'Tarif eureka berhasil diganti' },
            data: {
                message: 'Tarif lama telah dinonaktifkan dan tarif baru berhasil dibuat',
                newTarifId: newTarifEureka.id_tarif_eureka
            }
        });

    } catch (error) {
        res.status(500).send({
            status: { code: 500, message: error.message }
        });
    }
};

// Create Tarif Mitra dengan Konfirmasi
exports.createTarifMitraWithConfirmation = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: { id: req.user.id }
        });

        if (!getUser) {
            return res.status(401).send({
                status: { code: 401, message: 'Unauthorized' }
            });
        }

        // Check existing tarif mitra (yang masih aktif, bukan yang sudah dihapus)
        const existingTarif = await models.m_tarif_mitra.findOne({
            where: {
                id_muat_kota: req.body.id_muat_kota,
                id_tujuan_kota: req.body.id_tujuan_kota,
                id_mitra: req.body.id_mitra,
                id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                service_type: req.body.service_type,
                via: req.body.via,
                jenis_kiriman: req.body.jenis_kiriman,
                status: { [Op.in]: ['Y', 'N'] }
            }
        });

        if (existingTarif) {
            // Tarif sudah ada, kembalikan informasi untuk konfirmasi
            res.status(200).send({
                status: { code: 402, message: 'Tarif sudah ada' },
                data: {
                    exists: true,
                    existingTarifId: existingTarif.id_price_mitra,
                    message: 'Tarif sudah ada, yakin ganti?'
                }
            });
        } else {
            // Tarif belum ada, langsung create
            const getCode = await models.m_tarif_mitra.findAll({
                order: [['id_price_mitra', 'desc']],
                limit: 1,
                where: {
                    kode_tarif_mitra: { [Op.like]: `%TM%` }
                }
            });

            let kodeTarifMitra;
            if (getCode.length === 0 || (getCode.length > 0 && getCode[0].kode_tarif_mitra && getCode[0].kode_tarif_mitra.includes("TM23"))) {
                kodeTarifMitra = "TM00000001";
            } else {
                const getcodeTarif = Number(getCode[0].kode_tarif_mitra.substring(2, 11));
                const tarifCode = getcodeTarif + 1;
                const getcharacterNumber = tarifCode.toString();

                if (tarifCode > 99999999) {
                    return res.status(400).send({
                        status: { code: 400, message: 'Gagal menginput data kode sudah maks di 99999999' }
                    });
                }

                let zeroCode = "";
                if (getcharacterNumber.length == 1) zeroCode = "0000000";
                else if (getcharacterNumber.length == 2) zeroCode = "000000";
                else if (getcharacterNumber.length == 3) zeroCode = "00000";
                else if (getcharacterNumber.length == 4) zeroCode = "0000";
                else if (getcharacterNumber.length == 5) zeroCode = "000";
                else if (getcharacterNumber.length == 6) zeroCode = "00";
                else if (getcharacterNumber.length == 7) zeroCode = "0";

                kodeTarifMitra = "TM" + zeroCode + tarifCode;
            }

            const createData = await models.m_tarif_mitra.create({
                kode_tarif_mitra: kodeTarifMitra,
                id_muat_kota: req.body.id_muat_kota,
                id_tujuan_kota: req.body.id_tujuan_kota,
                id_mitra: req.body.id_mitra,
                id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                service_type: req.body.service_type,
                via: req.body.via,
                jenis_kiriman: req.body.jenis_kiriman,
                tarif: req.body.tarif,
                max_tonase: req.body.max_tonase,
                satuan: req.body.satuan,
                IdPriceEureka: req.body.id_tarif_eureka,
                kode_surat: req.body.kode_surat,
                status: 'N',
                date_created: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                id_user: req.user.id,
                id_bu: req.body.id_bu,
            });

            res.status(200).send({
                status: { code: 200, message: 'Tarif mitra berhasil dibuat' },
                data: {
                    exists: false,
                    message: 'Tarif mitra berhasil dibuat',
                    tarifId: createData.id_price_mitra
                }
            });
        }

    } catch (error) {
        res.status(500).send({
            status: { code: 500, message: error.message }
        });
    }
};

// Replace Tarif Mitra
exports.replaceTarifMitra = async (req, res) => {
    try {
        const getUser = await models.users.findOne({
            where: { id: req.user.id }
        });

        if (!getUser) {
            return res.status(401).send({
                status: { code: 401, message: 'Unauthorized' }
            });
        }

        const { existingTarifId, confirmReplace, ...tarifData } = req.body;

        if (confirmReplace !== 'yes') {
            return res.status(400).send({
                status: { code: 400, message: 'Konfirmasi replace diperlukan' }
            });
        }

        // Nonaktifkan tarif lama (set ke D untuk deleted)
        await models.m_tarif_mitra.update(
            { status: 'D' },
            { where: { id_price_mitra: existingTarifId } }
        );

        // Generate kode tarif mitra baru
        const getCode = await models.m_tarif_mitra.findAll({
            order: [['id_price_mitra', 'desc']],
            limit: 1,
            where: {
                kode_tarif_mitra: { [Op.like]: `%TM%` }
            }
        });

        let kodeTarifMitra;
        if (getCode.length === 0 || (getCode.length > 0 && getCode[0].kode_tarif_mitra && getCode[0].kode_tarif_mitra.includes("TM23"))) {
            kodeTarifMitra = "TM00000001";
        } else {
            const getcodeTarif = Number(getCode[0].kode_tarif_mitra.substring(2, 11));
            const tarifCode = getcodeTarif + 1;
            const getcharacterNumber = tarifCode.toString();

            if (tarifCode > 99999999) {
                return res.status(400).send({
                    status: { code: 400, message: 'Gagal menginput data kode sudah maks di 99999999' }
                });
            }

            let zeroCode = "";
            if (getcharacterNumber.length == 1) zeroCode = "0000000";
            else if (getcharacterNumber.length == 2) zeroCode = "000000";
            else if (getcharacterNumber.length == 3) zeroCode = "00000";
            else if (getcharacterNumber.length == 4) zeroCode = "0000";
            else if (getcharacterNumber.length == 5) zeroCode = "000";
            else if (getcharacterNumber.length == 6) zeroCode = "00";
            else if (getcharacterNumber.length == 7) zeroCode = "0";

            kodeTarifMitra = "TM" + zeroCode + tarifCode;
        }

        // Insert tarif mitra baru
        const newTarifMitra = await models.m_tarif_mitra.create({
            kode_tarif_mitra: kodeTarifMitra,
            id_muat_kota: tarifData.id_muat_kota,
            id_tujuan_kota: tarifData.id_tujuan_kota,
            id_mitra: tarifData.id_mitra,
            id_kendaraan_jenis: tarifData.id_kendaraan_jenis,
            service_type: tarifData.service_type,
            via: tarifData.via,
            jenis_kiriman: tarifData.jenis_kiriman,
            tarif: tarifData.tarif,
            max_tonase: tarifData.max_tonase,
            satuan: tarifData.satuan,
            IdPriceEureka: tarifData.id_tarif_eureka,
            kode_surat: tarifData.kode_surat,
            status: 'N',
            date_created: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            id_user: req.user.id,
        });

        res.status(200).send({
            status: { code: 200, message: 'Tarif mitra berhasil diganti' },
            data: {
                message: 'Tarif lama telah dinonaktifkan dan tarif baru berhasil dibuat',
                newTarifId: newTarifMitra.id_price_mitra
            }
        });

    } catch (error) {
        res.status(500).send({
            status: { code: 500, message: error.message }
        });
    }
};