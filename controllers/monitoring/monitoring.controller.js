const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where, DATE } = require('sequelize');
const CryptoJS = core.CryptoJS
const axios = require('axios')

exports.kendaraanStatus = async (req, res) => {
    try {
        // models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });

        const getSm = await models.m_sm.findOne(
            {
                where: {
                    id_msm: req.body.idmsm
                }
            }
        )
        if (getSm) {

            const getKendaraan = await models.kendaraan.findOne(
                {
                    where: {
                        no_polisi: getSm.nopol
                    }
                }
            )
            const getSupir = await models.m_driver.findOne(
                {
                    where: {
                        nama: getSm.supir
                    }
                }
            )
            const updateStatusKend = await models.kendaraanstatus.create(
                {
                    'id_kendaraan': getKendaraan.id,
                    'id_penegemudi': getSupir.id,
                    'id_msm': req.body.idmsm,
                    'kondisi_kendaraan': req.body.kondisi_kendaraan,
                    'empty_load': req.body.empty_load,
                    'action': req.body.action,
                    'keterangan': req.body.keterangan,
                    'muatan': req.body.muatan,
                    'posisi': req.body.posisi,
                    'tujuan': req.body.tujuan,
                    'id_user': req.body.id_user,
                    'tgl_update': core.moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                }
            )
            if (updateStatusKend) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success update Status Kendaraan'
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

exports.getSmList = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getCust = await models.m_sm.findAndCountAll(
                {
                    where: {
                        is_deleted: 0
                    }
                }
            )
            if (getData.rows) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success update Status Kendaraan'
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

exports.getPesananCustomer = async (req, res) => {
    try {

        // models.customer.hasMany(models.m_pengadaan, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        // if (!models.customer.associations.limitPesanan) {
        //     models.customer.hasMany(models.m_pengadaan, { targetKey: 'id_customer', foreignKey: 'id_customer', as: 'limitPesanan' });
        // }
        // if (!models.customer.associations.banyakPesanan) {
        //     models.customer.hasMany(models.m_pengadaan, { targetKey: 'id_customer', foreignKey: 'id_customer', as: 'banyakPesanan' });
        //     models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        // }

        // models.customer.hasMany(models.m_status_order, { targetKey: 'id_customer', foreignKey: 'customer' });



        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getCust = await models.customer.findAndCountAll(
                {
                    where: {
                        status: "1",
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    nama_perusahaan: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },


                            ]
                        } : {}
                    },
                    limit: limit,
                    offset: offset,
                    include: [
                        // {
                        //     model: models.m_status_order,
                        //     required: false,
                        //     where: {
                        //         [Op.and]: [
                        //             {
                        //                 act_akunting: "Y"
                        //             },
                        //             {
                        //                 [Op.or]: [
                        //                     {
                        //                         kendaraan_operasional: "Y"
                        //                     },
                        //                     {
                        //                         kendaraan_purchasing: "Y"
                        //                     }
                        //                 ]
                        //             }

                        //         ]
                        //     }
                        // },
                        // {
                        //     model: models.m_pengadaan,
                        //     as: 'banyakPesanan',
                        //     // required: true,

                        // },
                        // {
                        //     model: models.m_pengadaan,
                        //     as: 'limitPesanan',
                        //     limit: 10,
                        //     order: [['id_mp', 'desc']],
                        //     include: [
                        //         { model: models.users }
                        //     ]
                        //     // required: true,

                        // }
                    ],
                    order: [['id_customer', 'desc']]
                }
            )

            if (getCust.rows) {
                let page = req.query.page ? Number(req.query.page) : 1;
                let limit = req.query.limit ? Number(req.query.limit) : 10;
                let no = (getCust.count > 0) ? (page - 1) * limit + 1 : 0

                const result = await Promise.all(getCust.rows.map(async (item) => {
                    models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });

                    const getBanyakPesanan = await models.m_pengadaan.findAll(
                        {
                            where: {
                                id_customer: item.id_customer
                            }
                        }
                    )

                    const getLimitPesanan = await models.m_pengadaan.findAll(
                        {
                            where: {
                                id_customer: item.id_customer
                            },
                            limit: 10,
                            include: [
                                {
                                    model: models.users
                                }
                            ]
                        }
                    )
                    const getStatusOrder = await models.m_status_order.findAll(
                        {
                            where: {
                                customer: item.id_customer,
                                [Op.and]: [
                                    {
                                        act_akunting: "Y"
                                    },
                                    {
                                        [Op.or]: [
                                            {
                                                kendaraan_operasional: "Y"
                                            },
                                            {
                                                kendaraan_purchasing: "Y"
                                            }
                                        ]
                                    }

                                ]
                            }
                        }
                    )
                    return {
                        no: no++,
                        idCust: item.id_customer,
                        customer: item.nama_perusahaan,
                        totalPesanan: getBanyakPesanan.length,
                        totalTerlayani: getStatusOrder.length,
                        last_ten_order: getLimitPesanan.map((i) => {
                            return {
                                noSp: i.msp,
                                sales: i.user.nama_lengkap,
                                service: i.service,
                                jenisBarang: i.jenis_barang
                            }
                        }),

                    }
                }))

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {

                        totalData: getCust.count || 0,
                        totalPage: Math.ceil((getCust.count || 0) / limit),
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

exports.getKendaraanstatus = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getdataKendaraanOnCall = await models.kendaraan.findAll(
                {
                    where: {
                        jenis_kepemilikan: "eur_sewa",
                        status: 1
                    }
                }
            )
            if (getdataKendaraanOnCall) {
                const dataNopol = getdataKendaraanOnCall.map((i) => i.no_polisi)
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: dataNopol
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


exports.getLocation = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const noPolisiList = req.body.no_polisi; // Ini adalah array nomor polisi dari req.body
            const latestLocationData = [];

            for (const noPolisi of noPolisiList) {
                const getStatusKendaraan = await models.kendaraanstatus.findOne(
                    {
                        order: [['tgl_create', 'desc']],
                        where: {
                            no_polisi: noPolisi
                        }
                    }
                );

                if (getStatusKendaraan) {

                    const SM = await models.m_sm.findOne(
                        {
                            where: {
                                id_msm: getStatusKendaraan.id_msm
                            }
                        }
                    )
                    latestLocationData.push({
                        msm: SM.msm,
                        nopol: getStatusKendaraan.no_polisi,
                        driver: getStatusKendaraan.nama_driver,
                        status: getStatusKendaraan.empty_load,
                        keterangan: getStatusKendaraan.keterangan,
                        customer: getStatusKendaraan.customer,
                        long: getStatusKendaraan.longitude,
                        lat: getStatusKendaraan.latitude,
                        date: core.moment(getStatusKendaraan.tgl_create).format('YYYY-MM-DD HH:mm:ss'),
                    });
                }
            }

            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                data: latestLocationData
            };
        }
    } catch (error) {
        output = {
            status: {
                code: 500,
                message: error.message
            }
        };
    }

    const errorsFromMiddleware = await customErrorMiddleware(req);

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
}

exports.JadikanLatLong = async (req, res) => {
  const UrlGeoCode = "https://maps.googleapis.com/maps/api/geocode/json?address="
    const ApiKeyGoogle = "AIzaSyCMl-ppZQiP5YTKGQanpSub0oghNck7w_M"
    try {
        const jalan = req.query.address
        const data = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(jalan)}}&key=${ApiKeyGoogle}`)
       
        const geocode = await data.json()
        console.log(`ini data`, geocode);
        res.send(geocode)
        console.log(data);
    } catch (error) {
  
    res.send(`error cuy`)

    }
}
