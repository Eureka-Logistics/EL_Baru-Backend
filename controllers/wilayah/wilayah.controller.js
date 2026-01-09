const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where } = require('sequelize');

exports.getWilayahProvinsi = async (req, res) => {
    try {


        // models.m_wil_provinsi.belongsTo(models.m_wil_kota, { targetKey: 'id_provinsi', foreignKey: 'id_provinsi' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_wil_provinsi.findAndCountAll(
                {

                    where: {
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    nama_provinsi: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },


                            ]
                        } : {}
                    },
                    limit: limit,
                    offset: offset,
                    order: [['id_provinsi', 'desc']],

                }
            )
            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        idProv: item.id_provinsi,
                        provinsi: item.nama_provinsi


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

exports.getWilayahKota = async (req, res) => {

    try {


        models.m_wil_kota.belongsTo(models.m_wil_provinsi, { targetKey: 'id_provinsi', foreignKey: 'id_provinsi' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_wil_kota.findAndCountAll(
                {

                    // ...req.query.provinsi ? {
                    where: {
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    nama_kota: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },


                            ]
                        } : {}

                    },
                    // } : {},
                    include: [
                        {
                            model: models.m_wil_provinsi,
                            ...req.query.idprovinsi ? {
                                where: {
                                    id_provinsi: req.query.idprovinsi
                                }
                            } : {}
                        }


                    ],

                    limit: limit,
                    offset: offset,
                    order: [['id_kota', 'desc']],

                }
            )
            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        idProv: item.m_wil_provinsi.id_provinsi,
                        idKota: item.id_kota,
                        provName: item.m_wil_provinsi.nama_provinsi,
                        kotaName: item.nama_kota



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
exports.getWilayahKecamatan = async (req, res) => {

    try {

        models.m_wil_kecamatan.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota' });
        models.m_wil_kota.belongsTo(models.m_wil_provinsi, { targetKey: 'id_provinsi', foreignKey: 'id_provinsi' });


        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            // Normalisasi nama parameter dari FE (idProv, idKota) ke yang dipakai di query Sequelize
            const idKotaParam = req.query.idkota || req.query.idKota;
            const idProvParam = req.query.id_provinsi || req.query.idProv;

            const getData = await models.m_wil_kecamatan.findAndCountAll(
                {

                    // ...req.query.provinsi ? {
                    where: {
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    nama_kecamatan: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },


                            ]
                        } : {}

                    },
                    // } : {},
                    include: [
                        {
                            model: models.m_wil_kota,

                            where: {
                                ...idKotaParam ? {
                                    id_kota: idKotaParam
                                } : {}

                            },

                            include: [
                                {
                                    model: models.m_wil_provinsi,
                                    where: {
                                        ...idProvParam ? {
                                            id_provinsi: idProvParam
                                        } : {}

                                    }

                                }
                            ]

                        }


                    ],

                    limit: limit,
                    offset: offset,
                    order: [['id_kecamatan', 'desc']],

                }
            )
            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        idProv: item.m_wil_kotum.m_wil_provinsi.id_provinsi,
                        idKota: item.m_wil_kotum.id_kota,
                        idKecamatan: item.id_kecamatan,
                        provName: item.m_wil_kotum.m_wil_provinsi.nama_provinsi,
                        kotaName: item.m_wil_kotum.nama_kota,
                        kecamatanName: item.nama_kecamatan



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