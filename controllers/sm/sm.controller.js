const { includes } = require('lodash');
const core = require('../../config/core.config')
const models = core.models();
const axios = require('axios');
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where, DATE } = require('sequelize');
const CryptoJS = core.CryptoJS


exports.filterSM = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getCabang = await models.users.findAll(
                {
                    order: [['id', 'desc']],
                    group: ['kode_cabang']
                }
            )
            const getMitra = await models.mitra.findAll(
                {
                    order: [['id_mitra', 'desc']]
                }
            )

            const getBu = await models.m_bu.findAll(
                {
                    where: {
                        status: 1
                    }
                }
            )
            const getBuBrench = await models.m_bu_brench.findAll(
                {
                    where: {
                        status: 1
                    }
                }
            )
            if (getCabang) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    cabang: getCabang.map((i) => {
                        return { kodeCabang: i.kode_cabang }
                    }),
                    mitra: getMitra.map((i) => {
                        return {
                            mitraId: i.id_mitra,
                            NamaMitra: i.nama_mitra,
                            type: i.type
                        }
                    }),
                    bu: getBu.map((i) => {
                        return {
                            buId: i.id_bu,
                            NamaMitra: i.name_bu
                        }
                    }),
                    bu_brench: getBuBrench.map((i) => {
                        return {
                            buBrenchId: i.id_bu_brench,
                            code: i.code_bu_brench
                        }
                    }),
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

exports.getSelectEdit = async (req, res) => {
    try {

        // models.kendaraan.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getTipe = await models.kendaraan_jenis.findAll(
                {
                    where: {
                        status: 1
                    }
                }
            )

            const getMitra = await models.mitra.findAll(
                {
                    where: {
                        status: 1
                    }
                }
            )
            const getKendaraan = await models.kendaraan.findAll(
                {
                    ...req.query.idMitra ? {
                        where: {
                            status: 1,
                            id_vendor: req.query.idMitra
                        }
                    } : {}
                }
            )

            const getDriver = await models.m_driver.findAll(
                {
                    ...req.query.id_driver ? {
                        where: {
                            id: req.query.id_driver
                        }
                    } : {}
                }
            )
            if (getDriver && getKendaraan && getMitra) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    Mitra: getMitra.map((i) => {
                        return {
                            mitraId: i.id_mitra,
                            mitra: i.nama_mitra
                        }
                    }),
                    Tipe: getTipe.map((i) => {
                        return {
                            id: i.id_kendaraan_jenis,
                            jenis: i.nama_kendaraan_jenis
                        }
                    }),
                    kendaraan: req.query.idMitra ? getKendaraan.map((i) => {
                        return {
                            id: i.id,
                            kodeKendaraan: i.kode_kendaraan,
                            nopol: i.no_polisi,
                            DriverId: i.id_driver

                        }
                    }) : {},
                    driver: req.query.id_driver ? getDriver.map((i) => {
                        return {
                            id: i.id,
                            nama: i.nama,
                            DriverId: i.id_driver,
                            noTelp: i.no_telp,
                            noTelp2: i.no_telp2

                        }
                    }) : {},

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

exports.getSm = async (req, res) => {
    try {

        models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });

        // kota muat

        if (!models.alamat.associations.kotaMuat) {
            models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaMuat' });
        }
        if (!models.m_pengadaan_detail.associations.muat) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat', as: 'muat' });
        }
        //kota bongkar
        if (!models.m_pengadaan_detail.associations.bongkar) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'bongkar' });
        }
        if (!models.alamat.associations.kotaBongkar) {
            models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaBongkar' });
        }

        //mitra pickup
        if (!models.m_sm.associations.mitraPickup) {
            models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra_pickup', as: 'mitraPickup' });
        }
        //mitra 1
        if (!models.m_sm.associations.mitra1) {
            models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra', as: 'mitra1' });
        }
        //mitra 2
        if (!models.m_sm.associations.mitra2) {
            models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra_2', as: 'mitra2' });
        }

        //driver mitra pickup
        if (!models.m_sm.associations.driverMitraPickUp) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver', as: 'driverMitraPickUp' });
        }
        //driver 1
        if (!models.m_sm.associations.driver1) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver', as: 'driver1' });
        }
        //driver mitra 2
        if (!models.m_sm.associations.driver2) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver_2', as: 'driver2' });
        }
        //driver mitra 3
        if (!models.m_sm.associations.driver3) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver_3', as: 'driver3' });
        }

        //unit mitra 1
        if (!models.m_sm.associations.unit1) {
            models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit', as: 'unit1' });
        }
        //unit mitra 2
        if (!models.m_sm.associations.unit2) {
            models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit_2', as: 'unit2' });
        }
        //unit mitra 3
        if (!models.m_sm.associations.unit3) {
            models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit_3', as: 'unit3' });
        }





        // models.m_pengadaan_detail.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_supir' });

        // if (!models.m_pengadaan_detail.associations.kendaraanUnit) {
        //     models.m_pengadaan_detail.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit', as: 'kendaraanUnit' });
        // }
        // models.m_pengadaan_detail.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'kendaraan' });

        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_sm.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });
        models.m_sm.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench' });


        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_sm.findAndCountAll(
                {
                    order: [['id_msm', 'desc']],
                    where: {
                        is_deleted: 0,
                        ...req.query.id_bu ? {
                            id_bu: req.query.id_bu
                        } : {},
                        ...req.query.id_bu_brench ? {
                            id_bu_brench: req.query.id_bu_brench

                        } : {},
                        // ...req.query.kodeCabang ? {
                        //     msm: { [Op.like]: `%${req.query.kodeCabang}%` }
                        // } : {},
                        ...req.query.mitra1 ? {
                            id_mitra_pickup: req.query.mitra1
                        } : {},
                        ...req.query.mitra2 ? {
                            id_mitra: req.query.mitra2
                        } : {},
                        ...req.query.mitra3 ? {
                            id_mitra_2: req.query.mitra3
                        } : {},
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    msm: {
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
                            model: models.m_bu
                        },
                        {
                            model: models.m_bu_brench
                        },
                        {
                            model: models.mitra,
                            as: 'mitraPickup'
                        },
                        {
                            model: models.mitra,
                            as: 'mitra1'
                        },
                        {
                            model: models.mitra,
                            as: 'mitra2'
                        },
                        {
                            model: models.m_driver,
                            as: 'driver1'
                        },
                        {
                            model: models.m_driver,
                            as: 'driver2'
                        },
                        {
                            model: models.m_driver,
                            as: 'driver3'
                        },
                        {
                            model: models.kendaraan,
                            as: 'unit1'
                        },
                        {
                            model: models.kendaraan,
                            as: 'unit2'
                        },
                        {
                            model: models.kendaraan,
                            as: 'unit3'
                        },
                        {

                            model: models.m_pengadaan_detail,
                            required: false,
                            include: [
                                {
                                    model: models.m_pengadaan,
                                    include: [
                                        {
                                            model: models.customer
                                        }
                                    ]

                                },
                                {
                                    model: models.alamat,
                                    as: 'muat',
                                    required: false,
                                    include: [
                                        {
                                            model: models.m_wil_kota,
                                            as: 'kotaMuat'
                                        }
                                    ]
                                },
                                {
                                    model: models.alamat,
                                    as: 'bongkar',
                                    required: true,
                                    include: [
                                        {
                                            model: models.m_wil_kota,
                                            as: 'kotaBongkar'
                                        }
                                    ]
                                },
                                // {
                                //     model: models.kendaraan,
                                //     as: 'kendaraanUnit'
                                // },
                                // {
                                //     model: models.m_driver
                                // }
                            ]
                        }
                    ]
                }
            )
            if (getData.rows) {


                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((item) => {

                    return {
                        no: no++,
                        id: item.id_msm,
                        sm: item.msm,
                        sp: item.m_pengadaan_detail?.m_pengadaan?.msp,
                        customer: item.m_pengadaan_detail?.m_pengadaan?.customer.nama_perusahaan,
                        service: item.m_pengadaan_detail?.m_pengadaan?.service,
                        type: item.m_pengadaan_detail.no_sj == "KPU" ? 1 : 0,
                        // tglPickup: item.m_pengadaan_detail?.m_pengadaan?.tgl_pickup,
                        pickupDate: core.moment(item.m_pengadaan_detail?.m_pengadaan?.tgl_pickup).format("YYYY-MM-DD"),
                        destination: (item.m_pengadaan_detail?.muat?.kota == null ? item.m_pengadaan_detail?.muat?.kota?.kotaMuat?.nama_kota : item.m_pengadaan_detail?.muat?.kota) + "-" + (item.m_pengadaan_detail?.bongkar?.kota == null ? item.m_pengadaan_detail?.bongkar?.kota?.kotaBongkar?.nama_kota : item.m_pengadaan_detail?.bongkar?.kota),
                        tglPickup: core.moment(item.tgl_muat).format("YYYY-MM-DD HH:mm:ss") == null ? "-" : core.moment(item.tgl_muat).format("YYYY-MM-DD HH:mm:ss"),
                        kapal: item.nama_kapal,
                        other: item,
                        // destinoation2: item.m_pengadaan_detail?.bongkar?.kota == null ? item.m_pengadaan_detail?.bongkar?.kota?.kotaBongkar?.nama_kota : item.m_pengadaan_detail?.bongkar?.kota,
                        // muat: item.m_pengadaan_detail == null ? item.m_pengadaan_detail?.muat?.kota : (item.m_pengadaan_detail.muat?.kotaMuat?.nama_kota) == null ? "-" : item.m_pengadaan_detail === null ? item.m_pengadaan_detail?.muat?.kota : (item.m_pengadaan_detail.muat?.kotaMuat?.nama_kota),  ///// TESTING KOTA MUAT
                        // bongkar: item.m_pengadaan_detail === null ? item.m_pengadaan_detail?.bongkar?.kota : (item.m_pengadaan_detail?.bongkar?.kotaBongkar?.nama_kota) == null ? "-" : item.m_pengadaan_detail === null ? item.m_pengadaan_detail?.bongkar?.kota : (item.m_pengadaan_detail?.bongkar?.kotaBongkar?.nama_kota),  ////TESTING KOTA BONGKAR
                        // vendor: item.m_pengadaan_detail === null ? "-" : item.m_pengadaan_detail.kendaraanUnit === null ? "-" : item.m_pengadaan_detail.kendaraanUnit.vendor,
                        "###PickUpMitra": "------------------------------------------",
                        kendaraanPickup: item.unit1 == null || item.unit1 == 0 ? "-" : item.unit1.jenis_kendaraan,
                        mitraPickup: item.mitraPickup == null ? "-" : item.mitraPickup.nama_mitra,
                        driver1: item.pickup_supir == null ? "-" : item.pickup_supir,
                        unit1: item.pickup_nopol == null ? "-" : item.pickup_nopol,
                        "###Mitra1": "------------------------------------------",
                        kendaraanMitra1: item.unit2 == null || item.unit2.jenis_kendaraan == 0 ? "-" : item.unit2.jenis_kendaraan,
                        mitra1: item.mitra1 == null ? "-" : item.mitra1.nama_mitra,
                        driver2: item.supir == null ? "-" : item.supir,
                        unit2: item.nopol == null ? "-" : item.nopol,
                        // kendaraan: item.kendaraan,
                        "###Mitra2": "------------------------------------------",
                        kendaraanMitra2: item.unit3 == null || item.unit3.jenis_kendaraan == 0 ? "-" : item.unit3.jenis_kendaraan,
                        mitra2: item.mitra2 == null ? "-" : item.mitra2.nama_mitra,
                        driver3: item.supir_2 == null ? "-" : item.supir_2,
                        unit3: item.nopol_2 == null ? "-" : item.nopol_2,
                        "########": "------------------------------------------",
                        bu: item.m_bu == null ? "-" : item.m_bu.name_bu,
                        bu_brench: item.m_bu_brench == null ? "-" : item.m_bu_brench.code_bu_brench,



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

exports.smDetail = async (req, res) => {
    try {

        models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });

        // kota muat

        if (!models.alamat.associations.kotaMuat) {
            models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaMuat' });
        }
        if (!models.m_pengadaan_detail.associations.muat) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat', as: 'muat' });
        }
        //kota bongkar
        if (!models.m_pengadaan_detail.associations.bongkar) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'bongkar' });
        }
        if (!models.alamat.associations.kotaBongkar) {
            models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaBongkar' });
        }

        //mitra pickup
        if (!models.m_sm.associations.mitraPickup) {
            models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra_pickup', as: 'mitraPickup' });
        }
        //mitra 1
        if (!models.m_sm.associations.mitra1) {
            models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra', as: 'mitra1' });
        }
        //mitra 2
        if (!models.m_sm.associations.mitra2) {
            models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra_2', as: 'mitra2' });
        }

        //driver mitra pickup
        if (!models.m_sm.associations.driverMitraPickUp) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver', as: 'driverMitraPickUp' });
        }
        //driver 1
        if (!models.m_sm.associations.driver1) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver', as: 'driver1' });
        }
        //driver mitra 2
        if (!models.m_sm.associations.driver2) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver_2', as: 'driver2' });
        }
        //driver mitra 3
        if (!models.m_sm.associations.driver3) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver_3', as: 'driver3' });
        }

        //unit mitra 1
        if (!models.m_sm.associations.unit1) {
            models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit', as: 'unit1' });
        }
        //unit mitra 2
        if (!models.m_sm.associations.unit2) {
            models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit_2', as: 'unit2' });
        }
        //unit mitra 3
        if (!models.m_sm.associations.unit3) {
            models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit_3', as: 'unit3' });
        }





        // models.m_pengadaan_detail.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_supir' });

        // if (!models.m_pengadaan_detail.associations.kendaraanUnit) {
        //     models.m_pengadaan_detail.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit', as: 'kendaraanUnit' });
        // }
        // models.m_pengadaan_detail.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'kendaraan' });

        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_sm.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });
        models.m_sm.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench' });


        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_sm.findAll(
                {
                    order: [['id_msm', 'desc']],
                    where: {
                        [Op.or]: [
                            {
                                id_msm: req.query.id_msm,
                            },

                            {
                                id_mpd: req.query.id_mpd,
                            }
                        ],

                        is_deleted: 0,
                        ...req.query.id_bu ? {
                            id_bu: req.query.id_bu
                        } : {},
                        ...req.query.id_bu_brench ? {
                            id_bu_brench: req.query.id_bu_brench

                        } : {},
                        ...req.query.kodeCabang ? {
                            msm: { [Op.like]: `%${req.query.kodeCabang}%` }
                        } : {},
                        ...req.query.mitra1 ? {
                            id_mitra_pickup: req.query.mitra1
                        } : {},
                        ...req.query.mitra2 ? {
                            id_mitra: req.query.mitra2
                        } : {},
                        ...req.query.mitra3 ? {
                            id_mitra_2: req.query.mitra3
                        } : {},
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    msm: {
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
                            model: models.m_bu
                        },
                        {
                            model: models.m_bu_brench
                        },
                        {
                            model: models.mitra,
                            as: 'mitraPickup'
                        },
                        {
                            model: models.mitra,
                            as: 'mitra1'
                        },
                        {
                            model: models.mitra,
                            as: 'mitra2'
                        },
                        {
                            model: models.m_driver,
                            as: 'driver1'
                        },
                        {
                            model: models.m_driver,
                            as: 'driver2'
                        },
                        {
                            model: models.m_driver,
                            as: 'driver3'
                        },
                        {
                            model: models.kendaraan,
                            as: 'unit1'
                        },
                        {
                            model: models.kendaraan,
                            as: 'unit2'
                        },
                        {
                            model: models.kendaraan,
                            as: 'unit3'
                        },
                        {

                            model: models.m_pengadaan_detail,
                            required: false,
                            include: [
                                {
                                    model: models.m_pengadaan,
                                    include: [
                                        {
                                            model: models.customer
                                        }
                                    ]

                                },
                                {
                                    model: models.alamat,
                                    as: 'muat',
                                    required: false,
                                    include: [
                                        {
                                            model: models.m_wil_kota,
                                            as: 'kotaMuat'
                                        }
                                    ]
                                },
                                {
                                    model: models.alamat,
                                    as: 'bongkar',
                                    required: true,
                                    include: [
                                        {
                                            model: models.m_wil_kota,
                                            as: 'kotaBongkar'
                                        }
                                    ]
                                },
                                // {
                                //     model: models.kendaraan,
                                //     as: 'kendaraanUnit'
                                // },
                                // {
                                //     model: models.m_driver
                                // }
                            ]
                        }
                    ]
                }
            )
            // console.log("🚀 ~ file: sm.controller.js:732 ~ exports.smDetail= ~ getData:", getData[0].id_mpd)

            const getidPickup = await models.m_pengadaan_detail.findOne(
                {
                    where: {
                        id_mpd: getData[0].id_mpd
                    }
                }
            )

            if (getData) {
                const getAlamat = await models.alamat.findOne(
                    {
                        where: {
                            id: getidPickup.id_almuat
                        }
                    }
                )

                const getSupirNumber1 = await models.m_driver.findOne(
                    {
                        where: {
                            id: getData[0].id_driver
                        }
                    }
                )
                // res.send(getSupirNumber1)
                const getSupirNumber2 = await models.m_driver.findOne(
                    {
                        where: {
                            id: getData[0].id_driver_2
                        }
                    }
                )
                const getSupirNumber3 = await models.m_driver.findOne(
                    {
                        where: {
                            id: getData[0].id_driver_3
                        }
                    }
                )
                const getKendaraanNumber1 = await models.kendaraan.findOne(
                    {
                        where: {
                            id: getData[0].id_unit
                        }
                    }
                )
                // res.send(getKendaraanNumber1)
                const getKendaraanNumber2 = await models.kendaraan.findOne(
                    {
                        where: {
                            id: getData[0].id_unit_2
                        }
                    }
                )
                const getKendaraanNumber3 = await models.kendaraan.findOne(
                    {
                        where: {
                            id: getData[0].id_unit_3
                        }
                    }
                )


                // let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.map((item) => {


                    return {
                        // no: no++,
                        id: item.id_msm,
                        sm: item.msm,
                        sp: item.m_pengadaan_detail?.m_pengadaan?.msp,
                        customer: item.m_pengadaan_detail?.m_pengadaan?.customer.nama_perusahaan,
                        id_customer: item.m_pengadaan_detail?.m_pengadaan?.id_customer,
                        service: item.m_pengadaan_detail?.m_pengadaan?.service,
                        // tglPickup: item.m_pengadaan_detail?.m_pengadaan?.tgl_pickup,
                        pickupDate: core.moment(item.m_pengadaan_detail?.m_pengadaan?.tgl_pickup).format("YYYY-MM-DD"),
                        destination: (item.m_pengadaan_detail?.muat?.kota == null ? item.m_pengadaan_detail?.muat?.kota?.kotaMuat?.nama_kota : item.m_pengadaan_detail?.muat?.kota) + "-" + (item.m_pengadaan_detail?.bongkar?.kota == null ? item.m_pengadaan_detail?.bongkar?.kota?.kotaBongkar?.nama_kota : item.m_pengadaan_detail?.bongkar?.kota),
                        tglPickup: core.moment(item.tgl_muat).format("YYYY-MM-DD HH:mm:ss") == null ? "-" : core.moment(item.tgl_muat).format("YYYY-MM-DD HH:mm:ss"),
                        pickupAddress: getAlamat.alamat,
                        kapal: item.nama_kapal == null ? "-" : item.nama_kapal,
                        weight: item.m_pengadaan_detail == null ? "-" : item.m_pengadaan_detail.berat,
                        koli: item.m_pengadaan_detail == null ? "-" : item.m_pengadaan_detail.koli,
                        items: item.m_pengadaan_detail?.m_pengadaan?.jenis_barang,
                        do: item.m_pengadaan_detail == null ? "-" : item.m_pengadaan_detail.do,
                        memo: item.m_pengadaan_detail?.m_pengadaan?.memo,
                        // pickupAddress: Promise.all(getData.map(async (i) => {
                        //     const getPickupid = await models.m_pengadaan_detail.findOne(
                        //         {
                        //             where: {
                        //                 id_mpd: i.id_mpd
                        //             }
                        //         }
                        //     )
                        //     const getPickupAddress = await models.alamat.findOne(
                        //         {
                        //             where: {
                        //                 id: getPickupid.id_almuat
                        //             }
                        //         }
                        //     )
                        //     return {
                        //         pickupAddress: getPickupAddress.alamat
                        //     }
                        // })),
                        // destinoation2: item.m_pengadaan_detail?.bongkar?.kota == null ? item.m_pengadaan_detail?.bongkar?.kota?.kotaBongkar?.nama_kota : item.m_pengadaan_detail?.bongkar?.kota,
                        // muat: item.m_pengadaan_detail == null ? item.m_pengadaan_detail?.muat?.kota : (item.m_pengadaan_detail.muat?.kotaMuat?.nama_kota) == null ? "-" : item.m_pengadaan_detail === null ? item.m_pengadaan_detail?.muat?.kota : (item.m_pengadaan_detail.muat?.kotaMuat?.nama_kota),  ///// TESTING KOTA MUAT
                        // bongkar: item.m_pengadaan_detail === null ? item.m_pengadaan_detail?.bongkar?.kota : (item.m_pengadaan_detail?.bongkar?.kotaBongkar?.nama_kota) == null ? "-" : item.m_pengadaan_detail === null ? item.m_pengadaan_detail?.bongkar?.kota : (item.m_pengadaan_detail?.bongkar?.kotaBongkar?.nama_kota),  ////TESTING KOTA BONGKAR
                        // vendor: item.m_pengadaan_detail === null ? "-" : item.m_pengadaan_detail.kendaraanUnit === null ? "-" : item.m_pengadaan_detail.kendaraanUnit.vendor,
                        "###PickUpMitra": "------------------------------------------",
                        kendaraanPickup: item.pickup_kendaraan == null || item.pickup_kendaraan == 0 ? "-" : item.pickup_kendaraan,
                        mitraPickup: item.mitraPickup == null ? "-" : item.mitraPickup.nama_mitra,
                        codeKendaraan1: getKendaraanNumber1?.code_kendaraan == null ? "-" : getKendaraanNumber1?.code_kendaraan,
                        driver1: item.pickup_supir == null ? "-" : item.pickup_supir,
                        unit1: item.pickup_nopol == null ? "-" : item.pickup_nopol,
                        gps_device_id: item.unit1 == null ? "-" : item.unit1.gps_device_id,
                        numberSupir1: getSupirNumber1?.no_telp,
                        namaSupir1: getSupirNumber1?.nama,
                        "###Mitra1": "------------------------------------------",
                        kendaraanMitra1: item.kendaraan == null || item.kendaraan == 0 ? "-" : item.kendaraan,
                        codeKendaraan2: getKendaraanNumber2?.code_kendaraan == null ? "-" : getKendaraanNumber2?.code_kendaraan,
                        mitra1: item.mitra1 == null ? "-" : item.mitra1.nama_mitra,
                        driver2: item.supir == null ? "-" : item.supir,
                        unit2: item.nopol == null ? "-" : item.nopol,
                        numberSupir2: getSupirNumber2?.no_telp,
                        namaSupir2: getSupirNumber2?.nama,

                        // kendaraan: item.kendaraan,
                        "###Mitra2": "------------------------------------------",
                        kendaraanMitra2: item.kendaraan_2 == null || item.kendaraan_2 == 0 ? "-" : item.kendaraan_2,
                        codeKendaraan3: getKendaraanNumber3?.code_kendaraan == null ? "-" : getKendaraanNumber3?.code_kendaraan,
                        mitra2: item.mitra2 == null ? "-" : item.mitra2.nama_mitra,
                        driver3: item.supir_2 == null ? "-" : item.supir_2,
                        unit3: item.nopol_2 == null ? "-" : item.nopol_2,
                        namaSupir3: getSupirNumber3?.nama,

                        numberSupir3: getSupirNumber3?.no_telp,
                        "########": "------------------------------------------",
                        bu: item.m_bu == null ? "-" : item.m_bu.name_bu,
                        bu_brench: item.m_bu_brench == null ? "-" : item.m_bu_brench.code_bu_brench,

                    }

                })
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: result




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

exports.getSmDetail = async (req, res) => {
    try {

        models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.alamat, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });
        models.m_pengadaan_detail.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_almuat' });




        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDetaildata = await models.m_sm.findAll(
                {
                    where: {

                        id_msm: req.query.id_msm
                    },
                    include: [
                        {
                            model: models.m_pengadaan_detail,
                            include: [
                                {


                                    model: models.alamat


                                },

                                {
                                    model: models.customer,

                                },
                                {
                                    model: models.m_pengadaan,
                                    include: [
                                        {
                                            model: models.customer
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            )
            if (getDetaildata) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: getDetaildata.map((i) => {
                        return {
                            noSp: i.m_pengadaan_detail.m_pengadaan.msp,
                            noSm: i.msm,
                            DO: "-",
                            service: i.m_pengadaan_detail.m_pengadaan.service,
                            customer: i.m_pengadaan_detail.m_pengadaan.customer.nama_perusahaan,
                            id_customer: i.m_pengadaan_detail.m_pengadaan.id_customer,
                            pickupDate: i.m_pengadaan_detail.m_pengadaan.tgl_pickup,
                            memo: i.m_pengadaan_detail.m_pengadaan.memo,
                            pickupAddress: i.m_pengadaan_detail.m_pengadaan.customer.alamat == null ? "Alamat Pickup tidak di Input" : i.m_pengadaan_detail.m_pengadaan.customer.alamat.alamat,
                            destinationAddress: i.m_pengadaan_detail.alamat?.alamat,
                            weight: i.m_pengadaan_detail.berat,
                            koli: i.m_pengadaan_detail.koli,
                            expPcs: i.m_pengadaan_detail.qty,
                            items: "-",


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
exports.getSmDetailBySP = async (req, res) => {
    try {

        models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.alamat, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });
        models.m_pengadaan_detail.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_almuat' });




        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDetaildata = await models.m_sm.findAll(
                {
                    // where: {

                    //     id_msm: req.query.id_msm
                    // },
                    include: [
                        {
                            model: models.m_pengadaan_detail,
                            include: [
                                {


                                    model: models.alamat


                                },

                                {
                                    model: models.customer,

                                },
                                {
                                    model: models.m_pengadaan,
                                    required: true,
                                    where: {

                                        id_mp: req.query.id_mp
                                    },
                                    include: [
                                        {
                                            model: models.customer
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            )
            if (getDetaildata) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: getDetaildata.map((i) => {
                        return {
                            noSp: i.m_pengadaan_detail.m_pengadaan.msp,
                            noSm: i.msm,
                            DO: "-",
                            service: i.m_pengadaan_detail.m_pengadaan.service,
                            customer: i.m_pengadaan_detail.m_pengadaan.customer.nama_perusahaan,
                            pickupDate: i.m_pengadaan_detail.m_pengadaan.tgl_pickup,
                            memo: i.m_pengadaan_detail.m_pengadaan.memo,
                            pickupAddress: i.m_pengadaan_detail.m_pengadaan.customer.alamat == null ? "Alamat Pickup tidak di Input" : i.m_pengadaan_detail.m_pengadaan.customer.alamat.alamat,
                            destinationAddress: i.m_pengadaan_detail.alamat?.alamat,
                            weight: i.m_pengadaan_detail.berat,
                            koli: i.m_pengadaan_detail.koli,
                            expPcs: i.m_pengadaan_detail.qty,
                            items: "-",


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

// exports.getSmDetailbySp = async (req, res) => {
//     try {

//         models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
//         models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });

//         const getUser = await models.users.findOne(
//             {
//                 where: {
//                     id: req.user.id
//                 }
//             }
//         )
//         if (getUser) {
//             const getDetaildata = await models.m_sm.findOne(
//                 {
//                     include: [
//                         {
//                             model: models.m_pengadaan_detail,
//                             required: true,
//                             include: {
//                                 model: models.m_pengadaan,

//                                 where: {
//                                     id_mp: req.query.id_mp
//                                 }
//                             }
//                         }
//                     ]
//                     // where: {

//                     //     id_msm: req.query.id_msm
//                     // }
//                 }
//             )
//             if (getDetaildata) {
//                 output = {
//                     status: {
//                         code: 200,
//                         message: 'Success get Data'
//                     },
//                     data: getDetaildata
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

exports.updateSm = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updateData = await models.m_sm.update(
                {

                    id_mitra_pickup: req.body.id_mitra_pickup,
                    id_mitra: req.body.id_mitra,
                    id_mitra_2: req.body.id_mitra_2,
                    berat: req.body.berat,
                    quality: req.body.quality,
                    koli: req.body.koli,
                    do: req.body.do,
                    pickup_kendaraan: req.body.pickup_kendaraan,
                    kendaraan: req.body.kendaraan,
                    kendaraan_2: req.body.kendaraan_2,
                    pickup_kontainer: req.body.pickup_kontainer,
                    kontainer: req.body.kontainer,
                    kontainer_2: req.body.kontainer_2,
                    pickup_nopol: req.body.pickup_nopol,
                    nopol: req.body.nopol,
                    nopol_2: req.body.nopol_2,
                    pickup_supir: req.body.pickup_supir,
                    supir: req.body.supir,
                    supir_2: req.body.supir_2,
                    id_unit: req.body.id_unit,
                    id_unit_2: req.body.id_unit_2,
                    id_unit_3: req.body.id_unit_3,
                    id_driver: req.body.id_driver,
                    id_driver_2: req.body.id_driver_2,
                    id_driver_3: req.body.id_driver_3,


                },
                {
                    where: {
                        id_msm: req.body.id_msm
                    }
                }
            )
            if (updateData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success update sm'
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

//------------------------MOBILE DRIVER------------------------------//
exports.getSmDriver = async (req, res) => {
    try {

        models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_sm.hasMany(models.kendaraanstatus, { targetKey: 'id_msm', foreignKey: 'id_msm' });
        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });

        // kota muat

        if (!models.alamat.associations.kotaMuat) {
            models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaMuat' });
        }
        if (!models.m_pengadaan_detail.associations.muat) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat', as: 'muat' });
        }
        //kota bongkar
        if (!models.m_pengadaan_detail.associations.bongkar) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'bongkar' });
        }
        if (!models.alamat.associations.kotaBongkar) {
            models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaBongkar' });
        }

        //mitra pickup
        if (!models.m_sm.associations.mitraPickup) {
            models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra_pickup', as: 'mitraPickup' });
        }
        // //mitra 1
        // if (!models.m_sm.associations.mitra1) {
        //     models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra', as: 'mitra1' });
        // }
        // //mitra 2
        // if (!models.m_sm.associations.mitra2) {
        //     models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra_2', as: 'mitra2' });
        // }

        //driver mitra pickup
        // if (!models.m_sm.associations.driverMitraPickUp) {
        //     models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver', as: 'driverMitraPickUp' });
        // }
        //driver 1
        if (!models.m_sm.associations.driver1) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver', as: 'driver1' });
        }
        // //driver mitra 2
        // if (!models.m_sm.associations.driver2) {
        //     models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver_2', as: 'driver2' });
        // }
        // //driver mitra 3
        // if (!models.m_sm.associations.driver3) {
        //     models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver_3', as: 'driver3' });
        // }

        //unit mitra 1
        if (!models.m_sm.associations.unit1) {
            models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit', as: 'unit1' });
        }
        //unit mitra 2
        // if (!models.m_sm.associations.unit2) {
        //     models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit_2', as: 'unit2' });
        // }
        // //unit mitra 3
        // if (!models.m_sm.associations.unit3) {
        //     models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit_3', as: 'unit3' });
        // }




        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_sm.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });
        models.m_sm.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench' });
        models.m_sm.belongsTo(models.erl_brench_rep, { targetKey: 'id', foreignKey: 'id_rep' });


        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const options = {
            pagination: {
                limit: limit,
                offset: offset,
            },
            result: {
                group: ['id_msm'],
                order: [['id_msm', 'desc']],
                where: {
                    // id_bu: 11,
                    msm: {
                        [Op.like]: `%${'11-SJ'}%`
                    },
                    is_deleted: 0,
                    ...req.query.id_supir ? {
                        id_driver: req.query.id_supir
                    } : {},
                    ...req.query.rep ? {
                        keterangan_ap: req.query.rep
                    } : {},
                    ...req.query.keyword ? {
                        [Op.or]: [
                            {
                                msm: {
                                    [Op.like]: `%${req.query.keyword}%`
                                },

                            },


                        ]
                    } : {}
                },
                // limit: limit,
                // offset: offset,
                include: [
                    {
                        model: models.kendaraanstatus,
                        // required:true

                    },
                    {
                        model: models.m_bu
                    },
                    {
                        model: models.m_bu_brench
                    },
                    {
                        model: models.mitra,
                        as: 'mitraPickup'
                    },
                    // {
                    //     model: models.mitra,
                    //     as: 'mitra1'
                    // },
                    // {
                    //     model: models.mitra,
                    //     as: 'mitra2'
                    // },
                    {
                        model: models.m_driver,
                        as: 'driver1'
                    },
                    // {
                    //     model: models.m_driver,
                    //     as: 'driver2'
                    // },
                    // {
                    //     model: models.m_driver,
                    //     as: 'driver3'
                    // },
                    {
                        model: models.kendaraan,
                        as: 'unit1'
                    },
                    // {
                    //     model: models.kendaraan,
                    //     as: 'unit2'
                    // },
                    // {
                    //     model: models.kendaraan,
                    //     as: 'unit3'
                    // },
                    {
                        model: models.erl_brench_rep
                    },
                    {

                        model: models.m_pengadaan_detail,
                        required: false,
                        include: [
                            {
                                model: models.m_pengadaan,
                                where: {
                                    status: [1, 2]
                                },
                                include: [
                                    {
                                        model: models.customer
                                    }
                                ]

                            },
                            {
                                model: models.alamat,
                                as: 'muat',
                                required: false,
                                include: [
                                    {
                                        model: models.m_wil_kota,
                                        as: 'kotaMuat'
                                    }
                                ]
                            },
                            {
                                model: models.alamat,
                                as: 'bongkar',
                                required: true,
                                include: [
                                    {
                                        model: models.m_wil_kota,
                                        as: 'kotaBongkar'
                                    }
                                ]
                            },
                            // {
                            //     model: models.kendaraan,
                            //     as: 'kendaraanUnit'
                            // },
                            // {
                            //     model: models.m_driver
                            // }
                        ]
                    }
                ]


            }

        }
        const [total, getData] = await Promise.all([
            models.m_sm.findAll({ ...options.result }),
            models.m_sm.findAll({ ...options.pagination, ...options.result })
        ])


        // const getData = await models.m_sm.findAll(
        //     {
        //         group: ['id_msm'],
        //         order: [['id_msm', 'desc']],
        //         where: {
        //             is_deleted: 0,
        //             ...req.query.id_supir ? {
        //                 id_driver: req.query.id_supir
        //             } : {},

        //             ...req.query.keyword ? {
        //                 [Op.or]: [
        //                     {
        //                         msm: {
        //                             [Op.like]: `%${req.query.keyword}%`
        //                         },

        //                     },


        //                 ]
        //             } : {}
        //         },
        //         limit: limit,
        //         offset: offset,
        //         include: [
        //             {
        //                 model: models.kendaraanstatus,
        //                 // required:true

        //             },
        //             {
        //                 model: models.m_bu
        //             },
        //             {
        //                 model: models.m_bu_brench
        //             },
        //             {
        //                 model: models.mitra,
        //                 as: 'mitraPickup'
        //             },
        //             {
        //                 model: models.mitra,
        //                 as: 'mitra1'
        //             },
        //             {
        //                 model: models.mitra,
        //                 as: 'mitra2'
        //             },
        //             {
        //                 model: models.m_driver,
        //                 as: 'driver1'
        //             },
        //             {
        //                 model: models.m_driver,
        //                 as: 'driver2'
        //             },
        //             {
        //                 model: models.m_driver,
        //                 as: 'driver3'
        //             },
        //             {
        //                 model: models.kendaraan,
        //                 as: 'unit1'
        //             },
        //             {
        //                 model: models.kendaraan,
        //                 as: 'unit2'
        //             },
        //             {
        //                 model: models.kendaraan,
        //                 as: 'unit3'
        //             },
        //             {

        //                 model: models.m_pengadaan_detail,
        //                 required: false,
        //                 include: [
        //                     {
        //                         model: models.m_pengadaan,
        //                         include: [
        //                             {
        //                                 model: models.customer
        //                             }
        //                         ]

        //                     },
        //                     {
        //                         model: models.alamat,
        //                         as: 'muat',
        //                         required: false,
        //                         include: [
        //                             {
        //                                 model: models.m_wil_kota,
        //                                 as: 'kotaMuat'
        //                             }
        //                         ]
        //                     },
        //                     {
        //                         model: models.alamat,
        //                         as: 'bongkar',
        //                         required: true,
        //                         include: [
        //                             {
        //                                 model: models.m_wil_kota,
        //                                 as: 'kotaBongkar'
        //                             }
        //                         ]
        //                     },
        //                     // {
        //                     //     model: models.kendaraan,
        //                     //     as: 'kendaraanUnit'
        //                     // },
        //                     // {
        //                     //     model: models.m_driver
        //                     // }
        //                 ]
        //             }
        //         ]
        //     }
        // )
        // const getKendaraanStatus = await models.kendaraanstatus.findAll(
        //     {
        //         where:{
        //             id_pengemudi:req.query.id_supir
        //         }
        //     }
        // )
        // const getlatRep = await getData.map((i) => {
        //     return {
        //         lat: i.erl_brench_rep
        //     }
        // })

        if (getData) {

            const getKendaraanBBm = getData.length > 0 && getData[0].unit1 && getData[0].unit1.id_kendaraan_jenis !== undefined
                ? await models.kendaraan_jenis_race.findOne(
                    {
                        where: {
                            // Safely map through getData while checking for null or undefined unit1
                            id_kendaraan_jenis: getData
                                .filter((i) => i.unit1 && i.unit1.id_kendaraan_jenis !== undefined)
                                .map((i) => i.unit1.id_kendaraan_jenis)[0]
                        }
                    }
                )
                : {};
            const getRepFaktur = await models.erl_brench_rep.findAll(
                {
                    where: {
                        id: getData.map((i) => i.id_rep)
                    }
                }
            )


            const currentPage = Number(req.query.page) || 1; // Halaman saat ini
            const itemsPerPage = Number(req.query.limit) || 10; // Jumlah item per halaman
            const startIndex = (currentPage - 1) * itemsPerPage + 1;

            const getRep = await Promise.all(getData.filter(item => {

                const emptyLoadStatus = item.kendaraanstatuses.map(i => i.empty_load).reverse()[0];
                const FotoCheck = item.kendaraanstatuses.map(i => i.foto).reverse()[0]
                // console.log('FotoCheck:', FotoCheck);
                // return ((emptyLoadStatus === "Doc Complete" && FotoCheck === null) || emptyLoadStatus !== "Doc Complete") &&
                return emptyLoadStatus !== "Doc Complete" &&
                    emptyLoadStatus !== "Pending Pickup" &&
                    emptyLoadStatus !== "cancel" &&
                    emptyLoadStatus !== "Return to Pool" &&
                    emptyLoadStatus !== "Failed" &&
                    emptyLoadStatus !== "Doc Returned" &&
                    item.keterangan_ap.trim() !== "" || null;
                // FotoCheck !== null;

            })// Filter hanya data yang tidak "Success"
                .map(async (item, index) => {

                    return {
                        rep: item.keterangan_ap
                    }


                }).filter(item => item.rep !== null))
            const uniqueRep = getRep
                .filter((item, index, self) =>
                    index === self.findIndex(t => (
                        t.rep === item.rep
                    ))
                );

            // let no = (getData.length > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
            const result = await Promise.all(getData.filter(item => {

                const emptyLoadStatus = item.kendaraanstatuses.map(i => i.empty_load).reverse()[0];
                const FotoCheck = item.kendaraanstatuses.map(i => i.foto).reverse()[0]
                // console.log('FotoCheck:', FotoCheck);
                // return ((emptyLoadStatus === "Doc Complete" && FotoCheck === null) || emptyLoadStatus !== "Doc Complete") &&
                return emptyLoadStatus !== "Doc Complete" &&
                    emptyLoadStatus !== "Pending Pickup" &&
                    emptyLoadStatus !== "cancel" &&
                    emptyLoadStatus !== "Return to Pool" &&
                    emptyLoadStatus !== "Failed" &&
                    emptyLoadStatus !== "Doc Returned";
                // FotoCheck !== null;

            })// Filter hanya data yang tidak "Success"
                .map(async (item, index) => {
                    var kotaMuat;
                    switch (item?.m_sm?.m_pengadaan_detail?.m_pengadaan?.mp_ref ?? "") {
                        case "JKT":
                        case "DKID":
                        case "JKT2":
                        case "DKIR":
                        case "BKS":
                        case "JKT5":
                            kotaMuat = "Jakarta";
                            break;

                        case "SBY":
                        case "SBY1":
                        case "SBY2":
                            kotaMuat = "Surabaya";
                            break;

                        case "SMG":
                        case "SMG2":
                            kotaMuat = "Semarang";
                            break;

                        case "BDG":
                        case "BDG1":
                        case "BDG2":
                            kotaMuat = "Bandung";
                            break;

                        case "MDN":
                        case "MDN1":
                        case "MDN2":
                            kotaMuat = "Medan";
                            break;

                        case "NAD":
                            kotaMuat = "Aceh";
                            break;

                        case "SLW":
                            kotaMuat = "Makasar";
                            break;

                        case "PKB":
                            kotaMuat = "Pekanbaru";
                            break;

                        case "KLM":
                            kotaMuat = "Banjarmasin";
                            break;

                        case "YGY":
                            kotaMuat = "Yogyakarta";
                            break;

                        case "BLI":
                            kotaMuat = "Bali";
                            break;

                        case "PTK":
                            kotaMuat = "Pontianak";
                            break;

                        case "MDU":
                            kotaMuat = "Madiun";
                            break;
                        case "":
                            kotaMuat = "Jakarta";
                            break;

                        default:
                            kotaMuat = ""; // Set a default value or handle it according to your requirements
                    }
                    const getKendaraanStatus = await models.kendaraanstatus.findAll(
                        {
                            where: {
                                id_msm: item.id_msm
                            }
                        }
                    )




                    return {
                        no: startIndex + index,
                        type: item.m_pengadaan_detail.no_sj == "KPU" ? 1 : 0,
                        idMsm: item.id_msm,
                        idMpd: item.m_pengadaan_detail.id_mpd,
                        sm: item.msm,
                        sp: item.m_pengadaan_detail?.m_pengadaan?.msp,
                        qty: item.qty,
                        ikat: item.ikat,
                        koli: item.koli,
                        berat: item.berat,
                        customer: item.m_pengadaan_detail?.m_pengadaan?.customer == null ? "PT. Penerbit Erlangga" : item.m_pengadaan_detail?.m_pengadaan?.customer.nama_perusahaan,
                        kotamuat: kotaMuat,
                        idKendaraan: item.id_unit,
                        noPolisi: item.unit1 == null ? "-" : item.unit1.no_polisi,
                        idDriver: item.id_driver,
                        // muat: item.m_pengadaan_detail == null ? "-" : item.m_pengadaan_detail.m_pengadaan == null ? "-" : item.m_pengadaan_detail.m_pengadaan.alamat_invoice,
                        muat: (item.m_pengadaan_detail?.muat?.pic == null ? item.m_pengadaan_detail?.muat?.kota?.kotaMuat?.nama_kota : item.m_pengadaan_detail?.muat?.alamat),
                        kotabongkar: item.m_pengadaan_detail == null ? "-" : item.m_pengadaan_detail.bongkar.kota,
                        // lonRep: item.erl_brench_rep == null ? "-" : item.erl_brench_rep.longitude,
                        // latRep: item.erl_brench_rep == null ? "-" : item.erl_brench_rep.latitude,
                        lon: (item.m_pengadaan_detail?.bongkar?.pic == null ? item.m_pengadaan_detail?.bongkar?.kota?.kotaBongkar?.nama_kota : item.m_pengadaan_detail?.bongkar?.lon),
                        lat: (item.m_pengadaan_detail?.bongkar?.pic == null ? item.m_pengadaan_detail?.bongkar?.kota?.kotaBongkar?.nama_kota : item.m_pengadaan_detail?.bongkar?.lat),
                        latMuat: item.m_pengadaan_detail.muat.lat,
                        lonMuat: item.m_pengadaan_detail.muat.lon,
                        // muat: item.m_pengadaan_detail == null ? item.m_pengadaan_detail?.muat?.kota : (item.m_pengadaan_detail.muat?.kotaMuat?.nama_kota) == null ? "-" : item.m_pengadaan_detail === null ? item.m_pengadaan_detail?.muat?.kota : (item.m_pengadaan_detail.muat?.kotaMuat?.nama_kota),  ///// TESTING KOTA MUAT
                        penerima: (item.m_pengadaan_detail?.bongkar?.pic == null ? item.m_pengadaan_detail?.bongkar?.kota?.kotaBongkar?.nama_kota : item.m_pengadaan_detail?.bongkar?.pic),
                        idAlamat: (item.m_pengadaan_detail?.bongkar?.pic == null ? "-" : item.m_pengadaan_detail?.bongkar?.id),
                        tujuan: (item.m_pengadaan_detail?.bongkar?.pic == null ? item.m_pengadaan_detail?.bongkar?.kota?.kotaBongkar?.nama_kota : item.m_pengadaan_detail?.bongkar?.alamat),
                        tonase: item.m_pengadaan_detail?.m_pengadaan?.overtonase == null ? "0" : item.m_pengadaan_detail?.m_pengadaan?.overtonase,
                        tglPickup: core.moment(item.tgl_muat).format("YYYY-MM-DD HH:mm:ss") == null ? "-" : core.moment(item.tgl_muat).format("YYYY-MM-DD HH:mm:ss"),
                        idKendaraanStatus: item.kendaraanstatuses.map((i) => i.id).reverse()[0],
                        kendaraan: item.kendaraan == null || item.kendaraan == 0 ? "-" : item.kendaraan,
                        // noPolisi: item.no_polisi == null || item.no_polisi == 0 ? "-" : item.no_polisi,
                        status: item.kendaraanstatuses.map((i) => i.empty_load).reverse()[0],
                        keterangan: item.kendaraanstatuses.map((i) => i.keterangan).reverse()[0],
                        memo: item.memo == null && item.empty_load != "Success" ? "-" : item.memo,

                        onProcess: (() => {
                            const pickups = getKendaraanStatus
                                .filter((item) => item.empty_load === 'on Procees')
                                .map((item) => core.moment(item.tgl_create).format('YYYY-MM-DD HH:mm:ss'));

                            return pickups.length > 0 ? pickups[0] : "-";
                        })(),
                        onPickup: (() => {
                            const pickups = getKendaraanStatus
                                .filter((item) => item.empty_load === 'on Pickup')
                                .map((item) => core.moment(item.tgl_create).format('YYYY-MM-DD HH:mm:ss'));

                            return pickups.length > 0 ? pickups[0] : "-";

                        })(),

                        onDelivery: (() => {
                            const pickups = getKendaraanStatus
                                .filter((item) => item.empty_load === 'on Delivery')
                                .map((item) => core.moment(item.tgl_create).format('YYYY-MM-DD HH:mm:ss'));

                            return pickups.length > 0 ? pickups[0] : "-";
                        })(),
                        unloading: (() => {
                            const pickups = getKendaraanStatus
                                .filter((item) => item.empty_load === 'unloading')
                                .map((item) => core.moment(item.tgl_create).format('YYYY-MM-DD HH:mm:ss'));

                            return pickups.length > 0 ? pickups[0] : "-";
                        })(),
                        imageunloading: (() => {
                            const photoUnloading = getKendaraanStatus
                                .filter((item) => item.empty_load === 'unloading')
                                .map((item) => item.foto == null || item.foto == "" ? "-" : "https://apirace.eurekalogistics.co.id/assets/approvedOrder/" + item.foto);

                            return photoUnloading.length > 0 || item.foto == null || item.foto ? photoUnloading[0] : "-";

                        })(),
                        SuccesBongkar: (() => {
                            const pickups = getKendaraanStatus
                                .filter((item) => item.empty_load === 'Success')
                                .map((item) => core.moment(item.tgl_create).format('YYYY-MM-DD HH:mm:ss'));

                            return pickups.length > 0 ? pickups[0] : "-";
                        })(),
                        imageSuccesBongkar: (() => {
                            const photoBongkar = getKendaraanStatus
                                .filter((item) => item.empty_load === 'Success')
                                .map((item) => item.foto == null || item.foto == "" ? "-" : "https://apirace.eurekalogistics.co.id/assets/approvedOrder/" + item.foto);

                            return photoBongkar.length > 0 ? photoBongkar[0] : "-";

                        })(),
                        DocumentComplete: (() => {
                            const pickups = getKendaraanStatus
                                .filter((item) => item.empty_load === 'Doc Complete')
                                .map((item) => core.moment(item.tgl_create).format('YYYY-MM-DD HH:mm:ss'));

                            return pickups.length > 0 ? pickups[0] : "-";
                        })(),
                    }


                }))
            const id_mp = getData.map((i) => i.m_pengadaan_detail.id_mp)[0];

            let alamatMuat;

            // Check if `id_mp` is defined before querying
            if (id_mp !== undefined) {
                // If `id_mp` is defined, perform the query
                alamatMuat = await models.m_pengadaan.findOne({
                    where: {
                        id_mp: id_mp
                    }
                });
            } else {
                // If `id_mp` is undefined, set `alamatMuat` to an empty object
                alamatMuat = {};
            }



            // const alamatMuat = await models.m_pengadaan.findOne(
            //     {
            //         where: {
            //             id_mp: getData.map((i) => i.m_pengadaan_detail.id_mp)[0]
            //         }
            //     }
            // )


            const alamatInvoice = alamatMuat == null ? "Jl. H. Baping No.10, Susukan, Kec. Ciracas Ciracas JAKTIM, Kota DKI Jakarta INA 13750" : alamatMuat.alamat_invoice

            // let config1 = {
            //     method: 'get',
            //     maxBodyLength: Infinity,
            //     url: `https://stagingapi.eurekalogistics.co.id/monitoring/get-latlong?address=${alamatInvoice}`,
            //     headers: {}
            // };
            // const response = await axios.request(config1)
            // const makeJsonData = JSON.stringify(response.data)
            // const resutlData = JSON.parse(makeJsonData)
            // const muatDataAlamat = resutlData.results



            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                data: {
                    totalData: result.length,
                    totalPage: Math.ceil(result.length / req.query.limit),
                    limit: Number(req.query.limit),
                    currentPage: Number(req.query.page),
                    canLoadMore: Math.ceil(result.length / req.query.limit) <= Number(req.query.page) ? false : true,
                    id_mp: getData.map((i) => i.m_pengadaan_detail.id_mp)[0],
                    // latMuat: muatDataAlamat[0]?.geometry?.location?.lat ?? null,
                    // lonMuat: muatDataAlamat[0]?.geometry?.location?.lng ?? null,
                    latMuat: -6.344089,
                    longMuat: 106.871284,
                    // lonRep: getData.map((i) => i.erl_brench_rep)[0] == null ? "-" : getData.map((i) => i.erl_brench_rep.longitude)[0],
                    // latMuat: getData.map((i) => i.m_pengadaan_detail.muat.lat)[0],
                    // lonMuat: getData.map((i) => i.m_pengadaan_detail.muat.lon)[0],
                    driverRek: getData.map((i) => i.driver1.rekening_norek)[0],
                    jenisKendaraan: getData.some((i) => i.unit1 == null)
                        ? "-"
                        : getData.filter((i) => i.unit1 && i.unit1.jenis_kendaraan !== undefined)
                            .map((i) => i.unit1.jenis_kendaraan)[0] || "-",
                    bbm: getKendaraanBBm == null ? "-" : getKendaraanBBm.bbm,
                    kendaraanId: getData.map((i) => i.id_unit)[0],
                    rep: uniqueRep,
                    fakturReplat: getRepFaktur.map((i) => i.latitude)[0],
                    fakturReplon: getRepFaktur.map((i) => i.longitude)[0],
                    // alamatMuat: alamatMuat.alamat_invoice,
                    order: req.query.id_supir ? result : {}


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

// status driver mobile
exports.getHistoryKendaraanStatus = async (req, res) => {
    try {
        // kota muat

        if (!models.alamat.associations.kotaMuat) {
            models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaMuat' });
        }
        if (!models.m_pengadaan_detail.associations.muat) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat', as: 'muat' });
        }
        //kota bongkar
        if (!models.m_pengadaan_detail.associations.bongkar) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'bongkar' });
        }
        if (!models.alamat.associations.kotaBongkar) {
            models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaBongkar' });
        }

        models.kendaraanstatus.belongsTo(models.m_sm, { targetKey: 'id_msm', foreignKey: 'id_msm' });
        models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });

        // if (!models.m_pengadaan_detail.associations.kotaAsal) {
        //     models.m_pengadaan_detail.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_almuat', as: 'kotaAsal' });
        // }
        // if (!models.m_pengadaan_detail.associations.kotaBongkar) {
        //     models.m_pengadaan_detail.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_albongkar', as: 'kotaBongkar' });
        // }
        // const getUser = await models.users.findOne(
        //     {
        //         where: {
        //             id: req.user.id
        //         }
        //     }
        // )
        // if (getUser) {
        const getData = await models.kendaraanstatus.findAll(
            {
                order: [['tgl_create', 'desc']],
                where: {
                    id_msm: req.query.id_msm
                },
                include: [
                    {
                        model: models.m_sm,
                        include: [
                            {
                                model: models.m_pengadaan_detail,
                                include: [
                                    {
                                        model: models.m_pengadaan,
                                        include: [
                                            {
                                                model: models.customer
                                            },
                                            {
                                                model: models.alamat
                                            }
                                        ]
                                    },
                                    {
                                        model: models.alamat,
                                        as: 'muat',
                                        required: false,
                                        include: [
                                            {
                                                model: models.m_wil_kota,
                                                as: 'kotaMuat'
                                            }
                                        ]
                                    },
                                    {
                                        model: models.alamat,
                                        as: 'bongkar',
                                        required: true,
                                        include: [
                                            {
                                                model: models.m_wil_kota,
                                                as: 'kotaBongkar'
                                            }
                                        ]
                                    },
                                    // {
                                    //     model: models.m_wil_kota,
                                    //     as: 'kotaAsal'
                                    // },
                                    // {
                                    //     model: models.m_wil_kota,
                                    //     as: 'kotaBongkar'
                                    // },
                                ]
                            }
                        ]
                    }
                ]
            }
        )

        const getKendaraan = await models.kendaraan.findOne(
            {

                where: {
                    id: getData.map((i) => i.id_kendaraan)[0] == null ? {} : getData.map((i) => i.id_kendaraan)[0],

                }
            }
        )
        if (getData) {
            output = {
                status: {
                    code: 200,
                    message: "succes get data"
                },
                driver: getData.map((i) => i.nama_driver)[0],
                Nopol: getData.map((i) => i.no_polisi)[0],
                jenisKendaraan: getData.map((i) => i.m_sm.kendaraan)[0],
                kodeKendaraan: getKendaraan == null ? "-" : getKendaraan.kode_kendaraan,
                Customer: getData.map((i) => i.m_sm.m_pengadaan_detail.m_pengadaan.alamat.pic)[0],
                telpCustomer: getData.map((i) => i.m_sm.m_pengadaan_detail.m_pengadaan.alamat.hp)[0],
                picCustomer: getData.map((i) => i.m_sm.m_pengadaan_detail.m_pengadaan.alamat.jabatan)[0],
                data: getData.map((i) => {

                    var kotaMuat;
                    switch (i.m_sm.m_pengadaan_detail.m_pengadaan.mp_ref) {
                        case "JKT":
                        case "DKID":
                        case "JKT2":
                        case "DKIR":
                        case "BKS":
                        case "JKT5":
                            kotaMuat = "Jakarta";
                            break;

                        case "SBY":
                        case "SBY1":
                        case "SBY2":
                            kotaMuat = "Surabaya";
                            break;

                        case "SMG":
                        case "SMG2":
                            kotaMuat = "Semarang";
                            break;

                        case "BDG":
                        case "BDG1":
                        case "BDG2":
                            kotaMuat = "Bandung";
                            break;

                        case "MDN":
                        case "MDN1":
                        case "MDN2":
                            kotaMuat = "Medan";
                            break;

                        case "NAD":
                            kotaMuat = "Aceh";
                            break;

                        case "SLW":
                            kotaMuat = "Makasar";
                            break;

                        case "PKB":
                            kotaMuat = "Pekanbaru";
                            break;

                        case "KLM":
                            kotaMuat = "Banjarmasin";
                            break;

                        case "YGY":
                            kotaMuat = "Yogyakarta";
                            break;

                        case "BLI":
                            kotaMuat = "Bali";
                            break;

                        case "PTK":
                            kotaMuat = "Pontianak";
                            break;

                        case "MDU":
                            kotaMuat = "Madiun";
                            break;
                        case "":
                            kotaMuat = "Jakarta";
                            break;

                        default:
                            kotaMuat = "Jakarta"; // Set a default value or handle it according to your requirements
                    }
                    return {

                        SP: i.m_sm.m_pengadaan_detail.m_pengadaan.msp,
                        pickupDate: core.moment(i.m_sm.m_pengadaan_detail.m_pengadaan.tgl_pickup).format('YYYY-MM-DD HH:mm:ss'),
                        updateDate: core.moment(i.tgl_update).format('YYYY-MM-DD HH:mm:ss'),
                        alamatMuat: i.m_sm.m_pengadaan_detail.m_pengadaan.alamat_invoice,
                        kotaMuat: i.m_sm.m_pengadaan_detail.muat.kotaMuat == null ? "-" : i.m_sm.m_pengadaan_detail.muat.kotaMuat.nama_kota,
                        kotaBongkar: i.m_sm.m_pengadaan_detail == null ? "-" : i.m_sm.m_pengadaan_detail.bongkar.kota,
                        penerima: i.m_sm.m_pengadaan_detail.bongkar == null ? "-" : i.m_sm.m_pengadaan_detail.bongkar.pic,
                        alamat: i.m_sm.m_pengadaan_detail.bongkar == null ? "-" : i.m_sm.m_pengadaan_detail.bongkar.alamat,
                        lon: i.m_sm.m_pengadaan_detail.bongkar == null ? "-" : i.m_sm.m_pengadaan_detail.bongkar.lon,
                        lat: i.m_sm.m_pengadaan_detail.bongkar == null ? "-" : i.m_sm.m_pengadaan_detail.bongkar.lat,
                        sm: i.m_sm.msm,
                        customer: i.customer,
                        status: i.empty_load,
                        keterangan: i.keterangan,
                        date: core.moment(i.tgl_create).format('YYYY-MM-DD HH:mm:ss'),
                        foto: i.foto == null || i.foto == "" ? "https://api.eurekalogistics.co.id/images/no-pictures.png" : "https://apirace.eurekalogistics.co.id/assets/approvedOrder/" + i.foto,
                    }
                })
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

//status driver web
exports.getHistoryKendaraanStatusWeb = async (req, res) => {
    try {
        // kota muat

        // if (!models.alamat.associations.kotaMuat) {
        //     models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaMuat' });
        // }
        // if (!models.m_pengadaan_detail.associations.muat) {
        //     models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat', as: 'muat' });
        // }
        // //kota bongkar
        // if (!models.m_pengadaan_detail.associations.bongkar) {
        //     models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'bongkar' });
        // }
        // if (!models.alamat.associations.kotaBongkar) {
        //     models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaBongkar' });
        // }

        models.m_sm.hasMany(models.kendaraanstatus, { targetKey: 'id_msm', foreignKey: 'id_msm' });
        // models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        // models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        // models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });

        // if (!models.m_pengadaan_detail.associations.kotaAsal) {
        //     models.m_pengadaan_detail.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_almuat', as: 'kotaAsal' });
        // }
        // if (!models.m_pengadaan_detail.associations.kotaBongkar) {
        //     models.m_pengadaan_detail.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_albongkar', as: 'kotaBongkar' });
        // }
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_sm.findAll(
                {
                    // order: [['tgl_create', 'desc']],
                    where: {

                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    msm: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },

                            ]
                        } : {},

                    },

                    include: [
                        {
                            model: models.kendaraanstatus,
                            required: false,
                            // where: {
                            //     ...req.query.keyword ? {
                            //         [Op.or]: [
                            //             {
                            //                 msm: {
                            //                     [Op.like]: `%${req.query.keyword}%`
                            //                 },

                            //             },

                            //         ]
                            //     } : {},

                            // },

                            // include: [
                            //     {
                            //         model: models.m_pengadaan_detail,
                            //         include: [
                            //             {
                            //                 model: models.m_pengadaan,
                            //                 include: [
                            //                     {
                            //                         model: models.customer
                            //                     }
                            //                 ]
                            //             },
                            //             {
                            //                 model: models.alamat,
                            //                 as: 'muat',
                            //                 required: false,
                            //                 include: [
                            //                     {
                            //                         model: models.m_wil_kota,
                            //                         as: 'kotaMuat'
                            //                     }
                            //                 ]
                            //             },
                            //             {
                            //                 model: models.alamat,
                            //                 as: 'bongkar',
                            //                 required: true,
                            //                 include: [
                            //                     {
                            //                         model: models.m_wil_kota,
                            //                         as: 'kotaBongkar'
                            //                     }
                            //                 ]
                            //             },
                            //             // {
                            //             //     model: models.m_wil_kota,
                            //             //     as: 'kotaAsal'
                            //             // },
                            //             // {
                            //             //     model: models.m_wil_kota,
                            //             //     as: 'kotaBongkar'
                            //             // },
                            //         ]
                            //     }
                            // ]
                        }
                    ],


                }
            )

            // const getKendaraan = await models.kendaraan.findOne(
            //     {

            //         where: {
            //             id: getData.map((i) => i.id_kendaraan)[0]
            //         }
            //     }
            // )
            if (getData) {
                output = {
                    status: {
                        code: 200,
                        message: "succes get data"
                    },
                    data: getData
                    // driver: getData.map((i) => i.nama_driver)[0],
                    // Nopol: getData.map((i) => i.no_polisi)[0],
                    // kodeKendaraan: getKendaraan.kode_kendaraan,
                    // Customer: getData.map((i) => i.m_sm.m_pengadaan_detail.m_pengadaan.customer.nama_perusahaan)[0],
                    // telpCustomer: getData.map((i) => i.m_sm.m_pengadaan_detail.m_pengadaan.customer.telepon)[0],
                    // picCustomer: getData.map((i) => i.m_sm.m_pengadaan_detail.m_pengadaan.customer.pic_office)[0],
                    // data: getData.map((i) => {
                    //     return {
                    //         SP: i.m_sm.m_pengadaan_detail.m_pengadaan.msp,
                    //         pickupDate: core.moment(i.m_sm.m_pengadaan_detail.m_pengadaan.tgl_pickup).format('YYYY-MM-DD HH:mm:ss'),
                    //         kotaMuat: i.m_sm.m_pengadaan_detail.muat.kotaMuat == null ? "-" : i.m_sm.m_pengadaan_detail.muat.kotaMuat.nama_kota,
                    //         kotaBongkar: i.m_sm.m_pengadaan_detail.bongkar.kotaBongkar == null ? "-" : i.m_sm.m_pengadaan_detail.bongkar.kotaBongkar.nama_kota,
                    //         sm: i.m_sm.msm,
                    //         customer: i.customer,
                    //         status: i.empty_load,
                    //         keterangan: i.keterangan,
                    //         date: core.moment(i.tgl_create).format('YYYY-MM-DD HH:mm:ss'),
                    //         foto: i.foto == null || i.foto == "" ? "https://sandbox.eurekalogistics.co.id/jsonx/public/assets/no-pictures.png" : "https://sandbox.eurekalogistics.co.id/jsonx/public/assets/approvedOrder/" + i.foto,
                    //     }
                    // })
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

exports.getSmBerhasil = async (req, res) => {

    try {

        models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_sm.hasMany(models.kendaraanstatus, { targetKey: 'id_msm', foreignKey: 'id_msm' });
        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });

        // kota muat

        if (!models.alamat.associations.kotaMuat) {
            models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaMuat' });
        }
        if (!models.m_pengadaan_detail.associations.muat) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat', as: 'muat' });
        }
        //kota bongkar
        if (!models.m_pengadaan_detail.associations.bongkar) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'bongkar' });
        }
        if (!models.alamat.associations.kotaBongkar) {
            models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaBongkar' });
        }

        //mitra pickup
        if (!models.m_sm.associations.mitraPickup) {
            models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra_pickup', as: 'mitraPickup' });
        }
        //mitra 1
        if (!models.m_sm.associations.mitra1) {
            models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra', as: 'mitra1' });
        }
        //mitra 2
        if (!models.m_sm.associations.mitra2) {
            models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra_2', as: 'mitra2' });
        }

        //driver mitra pickup
        if (!models.m_sm.associations.driverMitraPickUp) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver', as: 'driverMitraPickUp' });
        }
        //driver 1
        if (!models.m_sm.associations.driver1) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver', as: 'driver1' });
        }
        //driver mitra 2
        if (!models.m_sm.associations.driver2) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver_2', as: 'driver2' });
        }
        //driver mitra 3
        if (!models.m_sm.associations.driver3) {
            models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver_3', as: 'driver3' });
        }

        //unit mitra 1
        if (!models.m_sm.associations.unit1) {
            models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit', as: 'unit1' });
        }
        //unit mitra 2
        if (!models.m_sm.associations.unit2) {
            models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit_2', as: 'unit2' });
        }
        //unit mitra 3
        if (!models.m_sm.associations.unit3) {
            models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit_3', as: 'unit3' });
        }




        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_sm.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });
        models.m_sm.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench' });


        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.m_driver.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            // const countData = await models.m_sm.findAndCountAll(
            //     {

            //     }
            // )
            const getData = await models.m_sm.findAll(
                {
                    group: ['id_msm'],
                    order: [['id_msm', 'desc']],
                    where: {
                        is_deleted: 0,



                        ...req.query.id_supir ? {
                            id_driver: req.query.id_supir
                        } : {},

                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    msm: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },


                            ]
                        } : {},

                    },

                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.kendaraanstatus,
                            where: {
                                empty_load: 'Success'
                            },
                            required: true
                        },
                        {
                            model: models.m_bu
                        },
                        {
                            model: models.m_bu_brench
                        },
                        {
                            model: models.mitra,
                            as: 'mitraPickup'
                        },
                        {
                            model: models.mitra,
                            as: 'mitra1'
                        },
                        {
                            model: models.mitra,
                            as: 'mitra2'
                        },
                        {
                            model: models.m_driver,
                            as: 'driver1'
                        },
                        {
                            model: models.m_driver,
                            as: 'driver2'
                        },
                        {
                            model: models.m_driver,
                            as: 'driver3'
                        },
                        {
                            model: models.kendaraan,
                            as: 'unit1'
                        },
                        {
                            model: models.kendaraan,
                            as: 'unit2'
                        },
                        {
                            model: models.kendaraan,
                            as: 'unit3'
                        },
                        {

                            model: models.m_pengadaan_detail,
                            required: false,
                            include: [
                                {
                                    model: models.m_pengadaan,
                                    include: [
                                        {
                                            model: models.customer
                                        }
                                    ]

                                },
                                {
                                    model: models.alamat,
                                    as: 'muat',
                                    required: false,
                                    include: [
                                        {
                                            model: models.m_wil_kota,
                                            as: 'kotaMuat'
                                        }
                                    ]
                                },
                                {
                                    model: models.alamat,
                                    as: 'bongkar',
                                    required: true,
                                    include: [
                                        {
                                            model: models.m_wil_kota,
                                            as: 'kotaBongkar'
                                        }
                                    ]
                                },
                                // {
                                //     model: models.kendaraan,
                                //     as: 'kendaraanUnit'
                                // },
                                // {
                                //     model: models.m_driver
                                // }
                            ]
                        }
                    ]
                }
            )
            // const getKendaraanStatus = await models.kendaraanstatus.findAll(
            //     {
            //         where:{
            //             id_pengemudi:req.query.id_supir
            //         }
            //     }
            // )

            if (getData) {


                let no = (getData.length > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.map(item => {
                    return {
                        no: no++,
                        id: item.id_msm,
                        sm: item.msm,
                        sp: item.m_pengadaan_detail?.m_pengadaan?.msp,
                        customer: item.m_pengadaan_detail?.m_pengadaan?.customer.nama_perusahaan,
                        muat: item.m_pengadaan_detail == null ? item.m_pengadaan_detail?.muat?.kota : (item.m_pengadaan_detail.muat?.kotaMuat?.nama_kota) == null ? "-" : item.m_pengadaan_detail === null ? item.m_pengadaan_detail?.muat?.kota : (item.m_pengadaan_detail.muat?.kotaMuat?.nama_kota),  ///// TESTING KOTA MUAT
                        tujuan: (item.m_pengadaan_detail?.bongkar?.kota == null ? item.m_pengadaan_detail?.bongkar?.kota?.kotaBongkar?.nama_kota : item.m_pengadaan_detail?.bongkar?.kota),
                        tonase: item.m_pengadaan_detail?.m_pengadaan?.overtonase == null ? "0" : item.m_pengadaan_detail?.m_pengadaan?.overtonase,
                        tglPickup: core.moment(item.tgl_muat).format("YYYY-MM-DD HH:mm:ss") == null ? "-" : core.moment(item.tgl_muat).format("YYYY-MM-DD HH:mm:ss"),
                        // kapal: item.nama_kapal,
                        // destinoation2: item.m_pengadaan_detail?.bongkar?.kota == null ? item.m_pengadaan_detail?.bongkar?.kota?.kotaBongkar?.nama_kota : item.m_pengadaan_detail?.bongkar?.kota,
                        // muat: item.m_pengadaan_detail == null ? item.m_pengadaan_detail?.muat?.kota : (item.m_pengadaan_detail.muat?.kotaMuat?.nama_kota) == null ? "-" : item.m_pengadaan_detail === null ? item.m_pengadaan_detail?.muat?.kota : (item.m_pengadaan_detail.muat?.kotaMuat?.nama_kota),  ///// TESTING KOTA MUAT
                        // bongkar: item.m_pengadaan_detail === null ? item.m_pengadaan_detail?.bongkar?.kota : (item.m_pengadaan_detail?.bongkar?.kotaBongkar?.nama_kota) == null ? "-" : item.m_pengadaan_detail === null ? item.m_pengadaan_detail?.bongkar?.kota : (item.m_pengadaan_detail?.bongkar?.kotaBongkar?.nama_kota),  ////TESTING KOTA BONGKAR
                        // vendor: item.m_pengadaan_detail === null ? "-" : item.m_pengadaan_detail.kendaraanUnit === null ? "-" : item.m_pengadaan_detail.kendaraanUnit.vendor,
                        // "###PickUpMitra": "------------------------------------------",
                        idKendaraanStatus: item.kendaraanstatuses.map((i) => i.id).reverse()[0],
                        kendaraan: item.pickup_kendaraan == null || item.pickup_kendaraan == 0 ? "-" : item.pickup_kendaraan,
                        status: item.kendaraanstatuses.map((i) => i.empty_load).reverse()[0],
                        keterangan: item.kendaraanstatuses.map((i) => i.keterangan).reverse()[0],
                        memo: item.memo == null && item.empty_load != "Success" ? "-" : item.memo


                    }


                })

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {

                        totalData: getData.length,
                        totalPage: Math.ceil(getData.length / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        order: req.query.id_supir ? result : {}


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




// purchase order
exports.getSelectPo = async (req, res) => {
    try {
        models.m_pengadaan.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            // const getMitra = await models.mitra.findAll(
            //     {
            //         where: {
            //             status: 1,
            //             // ...req.query.mitra ? {
            //             // nama_mitra: {
            //             //     [Op.like]: `%${req.query.mitra}%`
            //             // },
            //             // } : {},

            //         }
            //     }
            // )
            const getSp = await models.m_pengadaan.findAll(
                {
                    order: [['id_mp', 'desc']],
                    where: {
                        // mspk: ""
                        ...req.query.sp ? {
                            msp: {
                                [Op.like]: `%${req.query.sp}%`
                            },
                        } : {},
                    },
                    includes: [
                        { model: models.m_pengadaan_detail }
                    ]
                }
            )
            // const getDetaiilSp = await models.m_pengadaan_detail.findAll(
            //     {
            //         ...req.query.id_mp ? {
            //             where: {
            //                 id_mp: req.query.id_mp
            //             }
            //         } : {}
            //     }
            // )
            const getSm = await models.m_sm.findAll(
                {
                    ...req.query.idMpd ? {
                        where: {
                            id_mpd: req.query.idMpd
                        }
                    } : {}
                }
            )
            // const getSpDetail = await models.m_pengadaan_detail.findAll(
            //     {
            //         where: {
            //             ...req.query.idmp ? {
            //                 id_mp: req.query.idmp
            //             } : {},
            //         }
            //     }
            // )
            // const getSm = await models.m_sm.findOne(
            //     {
            //         where: {
            //             ...req.query.id_mpd ? {
            //                 id_mpd: req.query.id_mpd
            //             } : {},
            //         }
            //     }
            // )

            if (getSp) {
                output = {
                    status: {
                        code: 200,
                        message: "succes get data"
                    },
                    // mitra: getMitra,
                    sp: req.query.sp ? getSp.map((i) => {
                        return {
                            id_mp: i.id_mp,
                            sp: i.msp,
                            detail: i.m_pengadaan_detail.map((i) => {
                                return {
                                    id_mpd: i.id_mpd
                                }
                            })

                        }
                    }).filter(i => i.sp != "") : {},

                    // SpDetail: req.query.id_mp ? getDetaiilSp : {},
                    SM: req.query.idMpd ? getSm.map((i) => {
                        return {
                            idsm: i.id_sm,
                            sm: i.msm
                        }
                    }) : {},
                    // sm: req.query.id_mpd ? getSm : {},
                    // sm: getSm
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
exports.createPO = async (req, res) => {
    try {

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getCode = await models.m_po.findAll(
                {
                    order: [['id_mpo', 'desc']],
                    limit: 1
                }
            )
            const getcodePo = Number(getCode[0].mpo.substring(13, 17))
            const poCode = getcodePo + 1

            const getcharacterNumber = poCode.toString()

            const getDate = core.moment(Date.now()).format('YY/MM')

            // res.send('EL-PUC/' + getDate + "-" + getcharacterNumber)
            if (getCode) {
                // const g
                const createData = await models.m_po.create(
                    {
                        mpo: 'EL-PUC/' + getDate + "-" + getcharacterNumber,
                        note: "",
                        id_mitra: req.body.id_mitra,
                        service: req.body.service,
                        top: req.body.top,
                        overtonase: req.body.overtonase,
                        biaya_kg: req.body.biaya_kg,
                        biaya_overtonase: req.body.biaya_overtonase,
                        biaya_multidrop: req.body.biaya_multidrop,
                        biaya_muat: req.body.biaya_muat,
                        biaya_bongkar_muat: req.body.biaya_bongkar_muat,
                        biaya_inap: req.body.biaya_inap,
                        biaya_lain: req.body.biaya_lain,
                        total_keseluruhan: req.body.total_keseluruhan,
                        tgl_kirim: req.body.tgl_kirim,
                        via: req.body.via,
                        kendaraan: req.body.kendaraan,
                        kontainer: "",
                        seal: "",
                        nopol: "",
                        supir: "",
                        telp: "",
                        memo: "",
                        tgl_po: req.body.tgl_po,
                        status: "N",
                        approved: 0,
                        app_user: req.user.id,
                        app_date: req.body.app_date,
                        app_act: req.body.app_act,
                        app_user_act: req.body.app_user_act,
                        app_date_act: 0,
                        tgl_update: Date.now(),
                        status_sendmail: 0,
                        date_sendmail: 0,

                    }
                )
                if (createData) {
                    const createPoDetail = await models.m_po_detail.create(
                        {
                            id_mpo: createData.id_mpo,
                            id_msm: req.body.id_msm,
                            no_sm: req.body.no_sm,
                            al_bongkar: req.body.al_bongkar,
                            po_berdasarkan: req.body.po_berdasarkan,
                            hitung_berdasarkan: req.body.hitung_berdasarkan,
                            berat_berdasarkan: req.body.berat_berdasarkan,
                            berat: req.body.berat,
                            volume: req.body.volume,
                            qty: req.body.qty,
                            exp: 0,
                            harga: req.body.harga,
                            harga_muat: req.body.harga_muat,
                            harga_bongkar_muat: req.body.harga_bongkar_muat,
                            harga_inap: req.body.harga_inap,
                            harga_jumlah: req.body.harga_jumlah,
                            kendaraan: req.body.kendaraan,
                            kontainer: "",
                            seal: req.body.seal,
                            nopol: req.body.nopol,
                            supir: req.body.supir,
                            telp: req.body.telp,
                            tgl_update: Date.now(),
                        }
                    )
                    if (createPoDetail) {
                        output = {
                            status: {
                                code: 200,
                                message: "Succes creata data"
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

exports.getListPo = async (req, res) => {
    try {
        models.m_po.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
        models.m_po.belongsTo(models.m_po_detail, { targetKey: 'id_mpo', foreignKey: 'id_mpo' });
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_po.findAndCountAll(
                {
                    order: [['id_mpo', 'desc']],
                    where: {

                    },
                    include: [
                        {
                            model: models.mitra
                        },
                        {
                            model: models.m_po_detail
                        },
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
                        idMpo: item.id_mpo,
                        idMpod: item.m_po_detail.id_mpod,
                        mpo: item.mpo,
                        note: item.note,
                        mitraId: item.id_mitra,
                        mitra: item.mitra.nama_mitra,
                        service: item.service,
                        top: item.top,
                        overtonase: item.top,
                        biaya_kg: item.biaya_kg,
                        biaya_overtonase: item.biaya_overtonase,
                        biaya_multidrop: item.biaya_multidrop,
                        biaya_muat: item.biaya_muat,
                        biaya_bongkar_muat: item.biaya_bongkar_muat,
                        biaya_inap: item.biaya_inap,
                        biaya_lain: item.biaya_lain,
                        total_keseluruhan: item.total_keseluruhan,
                        tgl_kirim: item.tgl_kirim,
                        via: item.via,
                        kendaraan: item.kendaraan,
                        kontainer: item.kontainer,
                        seal: item.seal,
                        nopol: item.nopol,
                        supir: item.supir,
                        telp: item.telp,
                        memo: item.memo,
                        tgl_po: item.tgl_po,
                        status: item.status,
                        approved: item.approved,
                        app_user: item.app_user,
                        app_date: item.app_date,
                        app_act: item.app_act,
                        app_user_act: item.app_user_act,
                        app_date_act: item.app_date_act,
                        tgl_update: item.tgl_update,
                        status_sendmail: item.status_sendmail,
                        date_sendmail: item.date_sendmail,

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
exports.getListPobyId = async (req, res) => {
    try {
        models.m_po.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
        // const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_po.findOne(
                {
                    order: [['id_mpo', 'desc']],
                    where: {
                        id_mpo: req.query.id_mpo

                    },
                    include: [
                        {
                            model: models.mitra
                        }
                    ],

                }

            )
            if (getData) {
                // let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                // const result = getData.map((item) => {

                //     return {
                //         // no: no++,
                //         idMpo: item.id_mpo,
                //         mpo: item.mpo,
                //         note: item.note,
                //         mitraId: item.id_mitra,
                //         mitra: item.mitra.nama_mitra,
                //         service: item.service,
                //         top: item.top,
                //         overtonase: item.top,
                //         biaya_kg: item.biaya_kg,
                //         biaya_overtonase: item.biaya_overtonase,
                //         biaya_multidrop: item.biaya_multidrop,
                //         biaya_muat: item.biaya_muat,
                //         biaya_bongkar_muat: item.biaya_bongkar_muat,
                //         biaya_inap: item.biaya_inap,
                //         biaya_lain: item.biaya_lain,
                //         total_keseluruhan: item.total_keseluruhan,
                //         tgl_kirim: item.tgl_kirim,
                //         via: item.via,
                //         kendaraan: item.kendaraan,
                //         kontainer: item.kontainer,
                //         seal: item.seal,
                //         nopol: item.nopol,
                //         supir: item.supir,
                //         telp: item.telp,
                //         memo: item.memo,
                //         tgl_po: item.tgl_po,
                //         status: item.status,
                //         approved: item.approved,
                //         app_user: item.app_user,
                //         app_date: item.app_date,
                //         app_act: item.app_act,
                //         app_user_act: item.app_user_act,
                //         app_date_act: item.app_date_act,
                //         tgl_update: item.tgl_update,
                //         status_sendmail: item.status_sendmail,
                //         date_sendmail: item.date_sendmail,

                //     }

                // })
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
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

exports.getPoDetail = async (req, res) => {
    try {
        models.m_po_detail.belongsTo(models.m_po, { targetKey: 'id_mpo', foreignKey: 'id_mpo' });
        models.m_po_detail.belongsTo(models.m_sm, { targetKey: 'id_msm', foreignKey: 'id_msm' });
        // const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_po_detail.findOne(
                {
                    order: [['id_mpo', 'desc']],
                    where: {
                        id_mpod: req.query.id_mpod
                    },
                    include: [
                        {
                            model: models.m_po
                        },
                        {
                            model: models.m_sm
                        }
                    ],

                }

            )
            if (getData) {
                // let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                // const result = getData.map((item) => {

                // return {
                //     no: no++,
                //     item: item

                // }

                // })
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
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

exports.editPo = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updData = await models.m_po.update(
                {
                    id_mitra: req.body.id_mitra,
                    service: req.body.service,
                    top: req.body.top,
                    overtonase: req.body.overtonase,
                    biaya_kg: req.body.biaya_kg,
                    biaya_overtonase: req.body.biaya_overtonase,
                    biaya_multidrop: req.body.biaya_multidrop,
                    biaya_muat: req.body.biaya_muat,
                    biaya_bongkar_muat: req.body.biaya_bongkar_muat,
                    biaya_inap: req.body.biaya_inap,
                    biaya_lain: req.body.biaya_lain,
                    total_keseluruhan: req.body.total_keseluruhan,
                    tgl_kirim: req.body.tgl_kirim,
                    via: req.body.via,
                    kendaraan: req.body.kendaraan,
                    kontainer: "",
                    seal: "",
                    nopol: "",
                    supir: "",
                    telp: "",
                    memo: "",
                    tgl_po: req.body.tgl_po,
                    status: "N",
                    approved: 0,
                    app_user: req.user.id,
                    app_date: req.body.app_date,
                    app_act: req.body.app_act,
                    app_user_act: req.body.app_user_act,
                    app_date_act: 0,
                    tgl_update: Date.now(),
                    status_sendmail: 0,
                    date_sendmail: 0,
                },
                {
                    where: {
                        id_mpo: req.body.id_mpo
                    }
                }
            )
            if (updData) {
                output = {
                    status: {
                        code: 200,
                        message: "succes update data"
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


//purhasing
exports.getStatusApprovePurch = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getSm = await models.m_sm.findOne(
                {
                    where: {
                        id_mpd: req.query.id_mpd
                    }
                }
            )
            if (getSm) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    idUnit1: getSm.id_unit == null || getSm.id_unit == 0 ? "-" : getSm.id_unit,


                    idUnit2: getSm.id_unit_2 == null || getSm.id_unit == 0 ? "-" : getSm.id_unit_2




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

// exports.getListMsmOneMonthAgo = async (req, res) => {
//   try {
//     const models = core.models();
//     const { Op } = require('sequelize');

//     // Setup association untuk kendaraanstatus
//     models.m_sm.hasMany(models.kendaraanstatus, { targetKey: 'id_msm', foreignKey: 'id_msm' });

//     // Gunakan Date.now() untuk performa yang lebih baik
//     const oneMonthAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));

//     // Optimasi query dengan:
//     // 1. Gunakan indeks yang tersedia (tgl_muat, status_pembatalan, is_deleted)
//     // 2. Filter MSM yang bukan RC (race) di awal
//     // 3. Filter MSM yang belum completed (tidak ada action = 19)
//     // 4. Gunakan limit untuk membatasi jumlah data yang diambil
//     const data = await models.m_sm.findAll({
//       attributes: ['id_msm', 'msm'],
//       include: [
//         {
//           model: models.kendaraanstatus,
//           attributes: ['action'],
//           required: false,
//           where: {
//             action: {
//               [Op.ne]: 19 // Filter yang tidak memiliki action = 19 (completed)
//             }
//           }
//         }
//       ],
//       where: {
//         tgl_muat: {
//           [Op.gte]: oneMonthAgo
//         },
//         msm: {
//           [Op.and]: [
//             { [Op.ne]: '' },
//             { [Op.notLike]: 'RC%' } // Filter MSM yang bukan RC (race)
//           ]
//         },
//         status_pembatalan: {
//           [Op.ne]: 1
//         },
//         is_deleted: false
//       },
//       order: [['tgl_muat', 'DESC']]
//     });

//     // Filter tambahan untuk memastikan tidak ada yang completed
//     const filteredData = data.filter(item => {
//       // Jika tidak ada kendaraanstatus atau tidak ada yang action = 19 (completed)
//       return !item.kendaraanstatuses || 
//              !item.kendaraanstatuses.some(status => status.action === 19);
//     });

//     res.status(200).json({
//       status: true,
//       message: 'Berhasil mengambil daftar MSM 1 bulan terakhir yang belum completed (non-RC)',
//       total: filteredData.length,
//       data: filteredData.map(item => ({
//         id_msm: item.id_msm,
//         msm: item.msm
//       })),
//     });
//   } catch (error) {
//     console.error('Error getListMsmOneMonthAgo:', error);
//     res.status(500).json({
//       status: false,
//       message: 'Gagal mengambil daftar MSM',
//       error: error.message,
//     });
//   }
// };

// exports.getListMsmOneMonthAgo = async (req, res) => {
//     try {
//         const models = core.models();
//         const { Op } = require('sequelize');

//         // Setup association untuk kendaraanstatus
//         models.m_sm.hasMany(models.kendaraanstatus, { targetKey: 'id_msm', foreignKey: 'id_msm' });

//         // Gunakan Date.now() untuk performa yang lebih baik
//         const threeMonthsAgo = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000));

//         // Optimasi query dengan:
//         // 1. Gunakan indeks yang tersedia (tgl_muat, status_pembatalan, is_deleted)
//         // 2. Filter MSM yang bukan RC (race) di awal
//         // 3. Filter MSM yang belum completed (tidak ada action = 19)
//         // 4. Gunakan limit untuk membatasi jumlah data yang diambil
//         const data = await models.m_sm.findAll({
//             attributes: ['id_msm', 'msm'],
//             include: [
//                 {
//                     model: models.kendaraanstatus,
//                     attributes: ['action'],
//                     required: false,
//                     where: {
//                         action: {
//                             [Op.ne]: 19 // Filter yang tidak memiliki action = 19 (completed)
//                         }
//                     }
//                 }
//             ],
//             where: {
//                 tgl_muat: {
//                     [Op.gte]: threeMonthsAgo
//                 },
//                 msm: {
//                     [Op.and]: [
//                         { [Op.ne]: '' },
//                         { [Op.notLike]: 'RC%' } // Filter MSM yang bukan RC (race)
//                     ]
//                 },
//                 status_pembatalan: {
//                     [Op.ne]: 1
//                 },
//                 is_deleted: false
//             },
//             order: [['tgl_muat', 'DESC']]
//         });

//         // Filter tambahan untuk memastikan tidak ada yang completed
//         const filteredData = data.filter(item => {
//             // Jika tidak ada kendaraanstatus atau tidak ada yang action = 19 (completed)
//             return !item.kendaraanstatuses ||
//                 !item.kendaraanstatuses.some(status => status.action === 19);
//         });

//         res.status(200).json({
//             status: true,
//             message: 'Berhasil mengambil daftar MSM 3 bulan terakhir yang belum completed (non-RC)',
//             total: filteredData.length,
//             data: filteredData.map(item => ({
//                 id_msm: item.id_msm,
//                 msm: item.msm
//             })),
//         });
//     } catch (error) {
//         console.error('Error getListMsmOneMonthAgo:', error);
//         res.status(500).json({
//             status: false,
//             message: 'Gagal mengambil daftar MSM',
//             error: error.message,
//         });
//     }
// };

exports.getListMsmOneMonthAgo = async (req, res) => {
    try {
        const models = core.models();
        const { Op } = require('sequelize');

        // Setup association untuk kendaraanstatus
        models.m_sm.hasMany(models.kendaraanstatus, { targetKey: 'id_msm', foreignKey: 'id_msm' });

        // Gunakan Date.now() untuk performa yang lebih baik
        const threeMonthsAgo = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000));

        // Optimasi query dengan:
        // 1. Gunakan indeks yang tersedia (tgl_muat, status_pembatalan, is_deleted)
        // 2. Filter MSM yang bukan RC (race) di awal
        // 3. Filter MSM yang belum completed (tidak ada action = 19)
        // 4. Gunakan limit untuk membatasi jumlah data yang diambil
        const data = await models.m_sm.findAll({
            attributes: ['id_msm', 'msm'],
            include: [
                {
                    model: models.kendaraanstatus,
                    attributes: ['action'],
                    required: false,
                    where: {
                        action: {
                            [Op.ne]: 19 // Filter yang tidak memiliki action = 19 (completed)
                        }
                    }
                }
            ],
            where: {
                tgl_muat: {
                    [Op.gte]: threeMonthsAgo
                },
                msm: {
                    [Op.and]: [
                        { [Op.ne]: '' },
                        { [Op.notLike]: 'RC%' } // Filter MSM yang bukan RC (race)
                    ]
                },
                status_pembatalan: {
                    [Op.ne]: 1
                },
                is_deleted: false
            },
            order: [['tgl_muat', 'DESC']]
        });

        // Filter tambahan untuk memastikan tidak ada yang completed
        const filteredData = data.filter(item => {
            // Jika tidak ada kendaraanstatus atau tidak ada yang action = 19 (completed)
            return !item.kendaraanstatuses ||
                !item.kendaraanstatuses.some(status => status.action === 19);
        });

        res.status(200).json({
            status: true,
            message: 'Berhasil mengambil daftar MSM 3 bulan terakhir yang belum completed (non-RC)',
            total: filteredData.length,
            data: filteredData.map(item => ({
                id_msm: item.id_msm,
                msm: item.msm
            })),
        });
    } catch (error) {
        console.error('Error getListMsmOneMonthAgo:', error);
        res.status(500).json({
            status: false,
            message: 'Gagal mengambil daftar MSM',
            error: error.message,
        });
    }
};

// Get list BU dari table m_bu
exports.getListBU = async (req, res) => {
    try {
        const getBu = await models.m_bu.findAll({
            where: {
                status: 1
            },
            order: [['id_bu', 'ASC']]
        });

        output = {
            status: {
                code: 200,
                message: 'Success get Data BU'
            },
            data: getBu.map((i) => {
                return {
                    id: i.id,
                    id_bu: i.id_bu,
                    name_bu: i.name_bu,
                    code_bu: i.code_bu,
                    cbu: i.cbu,
                    status: i.status
                }
            })
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

// Get list BU branch dengan filter id_bu dari table m_bu_brench
exports.getListBuBranch = async (req, res) => {
    try {
        const whereCondition = {
            status: 1
        };

        // Filter by id_bu jika ada di query parameter
        if (req.query.id_bu) {
            whereCondition.id_bu = req.query.id_bu;
        }

        const getBuBrench = await models.m_bu_brench.findAll({
            where: whereCondition,
            order: [['id_bu_brench', 'ASC']]
        });

        output = {
            status: {
                code: 200,
                message: 'Success get Data BU Branch'
            },
            data: getBuBrench.map((i) => {
                return {
                    id: i.id,
                    id_bu_brench: i.id_bu_brench,
                    code_bu_brench: i.code_bu_brench,
                    name_bu_brench: i.name_bu_brench,
                    wilayah: i.wilayah,
                    id_bu: i.id_bu,
                    alamat: i.alamat,
                    no_telp: i.no_telp,
                    status: i.status
                }
            })
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

// Get list sales dengan filter id_bu dan id_bu_brench dari table m_sales
exports.getListSales = async (req, res) => {
    try {
        const whereCondition = {};

        // Filter by id_bu jika ada di query parameter
        if (req.query.id_bu) {
            whereCondition.id_bu = req.query.id_bu;
        }

        // Filter by id_bu_brench jika ada di query parameter
        if (req.query.id_bu_brench) {
            whereCondition.id_bu_brench = req.query.id_bu_brench;
        }

        // Filter by active status jika ada di query parameter
        if (req.query.active) {
            whereCondition.active = req.query.active;
        } else {
            // Default hanya ambil yang active jika tidak ada filter
            whereCondition.active = 'active';
        }

        const getSales = await models.m_sales.findAll({
            where: whereCondition,
            order: [['id_sales', 'ASC']]
        });

        output = {
            status: {
                code: 200,
                message: 'Success get Data Sales'
            },
            data: getSales.map((i) => {
                return {
                    id_sales: i.id_sales,
                    tahun: i.tahun,
                    id_bu: i.id_bu,
                    nama_bu: i.nama_bu,
                    id_bu_brench: i.id_bu_brench,
                    nik_sales: i.nik_sales,
                    nama_sales: i.nama_sales,
                    wilayah_sales: i.wilayah_sales,
                    kode_gl: i.kode_gl,
                    nama_gl: i.nama_gl,
                    wilayah_gl: i.wilayah_gl,
                    kode_asm: i.kode_asm,
                    nama_asm: i.nama_asm,
                    wilayah_asm: i.wilayah_asm,
                    kode_manager: i.kode_manager,
                    nama_manager: i.nama_manager,
                    wilayah_manager: i.wilayah_manager,
                    kode_cabang: i.kode_cabang,
                    nama_cabang: i.nama_cabang,
                    wilayah_cabang: i.wilayah_cabang,
                    active: i.active,
                    created_at: i.created_at
                }
            })
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

// Get list customer dengan filter id_bu dari table customer
exports.getListCustomer = async (req, res) => {
    try {
        const whereCondition = {
            is_deleted: 0
        };

        // Filter by id_bu jika ada di query parameter
        if (req.query.id_bu) {
            whereCondition.id_bu = req.query.id_bu;
        }

        // Filter by status jika ada di query parameter
        if (req.query.status !== undefined && req.query.status !== '') {
            whereCondition.status = req.query.status;
        }

        const getCustomer = await models.customer.findAll({
            where: whereCondition,
            order: [['id_customer', 'ASC']]
        });

        output = {
            status: {
                code: 200,
                message: 'Success get Data Customer'
            },
            data: getCustomer.map((i) => {
                return {
                    id_customer: i.id_customer,
                    parent_id: i.parent_id,
                    id_sales: i.id_sales,
                    akun: i.akun,
                    kode_customer: i.kode_customer,
                    nama_perusahaan: i.nama_perusahaan,
                    perusahaan: i.perusahaan,
                    jenis_usaha: i.jenis_usaha,
                    jenis_barang: i.jenis_barang,
                    jenis_transaksi: i.jenis_transaksi,
                    jenis_layanan: i.jenis_layanan,
                    jenis_entitas: i.jenis_entitas,
                    tgl_bediri: i.tgl_bediri,
                    tahun_berdiri: i.tahun_berdiri,
                    npwp: i.npwp,
                    alamat_npwp: i.alamat_npwp,
                    ktp: i.ktp,
                    tdp: i.tdp,
                    siup: i.siup,
                    pkp: i.pkp,
                    tax_pic: i.tax_pic,
                    tax_position: i.tax_position,
                    tax_phone_office: i.tax_phone_office,
                    tax_mobile: i.tax_mobile,
                    tax_email: i.tax_email,
                    invoice_pic: i.invoice_pic,
                    invoice_address: i.invoice_address,
                    invoice_position: i.invoice_position,
                    invoice_phone_office: i.invoice_phone_office,
                    invoice_mobile: i.invoice_mobile,
                    invoice_email: i.invoice_email,
                    pic_office: i.pic_office,
                    pic_position: i.pic_position,
                    pic_phone: i.pic_phone,
                    pic_number: i.pic_number,
                    pic_fax: i.pic_fax,
                    pic_email: i.pic_email,
                    pic_birth: i.pic_birth,
                    alamat_kantor: i.alamat_kantor,
                    telepon: i.telepon,
                    hp: i.hp,
                    fax: i.fax,
                    email: i.email,
                    bank_pic: i.bank_pic,
                    bank_position: i.bank_position,
                    bank_phone_office: i.bank_phone_office,
                    bank_mobile: i.bank_mobile,
                    bank_email: i.bank_email,
                    nama_bank: i.nama_bank,
                    nama_akun: i.nama_akun,
                    no_rek: i.no_rek,
                    mata_uang: i.mata_uang,
                    top: i.top,
                    jenis_pembayaran: i.jenis_pembayaran,
                    jenis_angkutan: i.jenis_angkutan,
                    kemasan: i.kemasan,
                    unique_cus: i.unique_cus,
                    foto_kantor: i.foto_kantor,
                    foto_pic: i.foto_pic,
                    foto_ktp: i.foto_ktp,
                    foto_npwp: i.foto_npwp,
                    manager: i.manager,
                    manager_memo: i.manager_memo,
                    manager_date: i.manager_date,
                    akunting: i.akunting,
                    akunting_memo: i.akunting_memo,
                    akunting_date: i.akunting_date,
                    direktur: i.direktur,
                    direktur_memo: i.direktur_memo,
                    direktur_date: i.direktur_date,
                    mou_file: i.mou_file,
                    mou_number: i.mou_number,
                    mou_expired: i.mou_expired,
                    surat_pelayanan: i.surat_pelayanan,
                    surat_pelayanan_number: i.surat_pelayanan_number,
                    surat_pelayanan_expired: i.surat_pelayanan_expired,
                    tgl_bergabung: i.tgl_bergabung,
                    status: i.status,
                    status_bp: i.status_bp,
                    new: i.new,
                    lat: i.lat,
                    lon: i.lon,
                    is_deleted: i.is_deleted,
                    id_odoo: i.id_odoo,
                    id_bu: i.id_bu
                }
            })
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