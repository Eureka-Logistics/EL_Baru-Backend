const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Get All MSM (id_msm and msm only)
exports.getAllMsm = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            // Hitung tanggal 3 bulan terakhir dari sekarang
            const threeMonthsAgo = core.moment().subtract(3, 'months').startOf('day').toDate();

            const getData = await models.m_sm.findAll({
                attributes: ['id_msm', 'msm'],
                where: {
                    tgl_update: {
                        [Op.gte]: threeMonthsAgo
                    }
                },
                order: [['id_msm', 'ASC']]
            });

            if (getData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get all MSM'
                    },
                    data: getData
                };
            } else {
                output = {
                    status: {
                        code: 404,
                        message: 'Data tidak ditemukan'
                    }
                };
            }
        } else {
            output = {
                status: {
                    code: 401,
                    message: 'Unauthorized'
                }
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
};

// Get Detail MSM
exports.getMsmDetail = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_msm } = req.query;

            if (!id_msm) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id_msm wajib diisi'
                    }
                };
            } else {
                // Define associations
                models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
                models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });

                // Kota muat
                if (!models.alamat.associations.kotaMuat) {
                    models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaMuat' });
                }
                if (!models.m_pengadaan_detail.associations.muat) {
                    models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat', as: 'muat' });
                }
                // Kota bongkar
                if (!models.m_pengadaan_detail.associations.bongkar) {
                    models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'bongkar' });
                }
                if (!models.alamat.associations.kotaBongkar) {
                    models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota', as: 'kotaBongkar' });
                }

                // Mitra pickup
                if (!models.m_sm.associations.mitraPickup) {
                    models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra_pickup', as: 'mitraPickup' });
                }
                // Mitra 1
                if (!models.m_sm.associations.mitra1) {
                    models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra', as: 'mitra1' });
                }
                // Mitra 2
                if (!models.m_sm.associations.mitra2) {
                    models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra_2', as: 'mitra2' });
                }

                // Driver mitra pickup
                if (!models.m_sm.associations.driverMitraPickUp) {
                    models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver', as: 'driverMitraPickUp' });
                }
                // Driver 1
                if (!models.m_sm.associations.driver1) {
                    models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver', as: 'driver1' });
                }
                // Driver 2
                if (!models.m_sm.associations.driver2) {
                    models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver_2', as: 'driver2' });
                }
                // Driver 3
                if (!models.m_sm.associations.driver3) {
                    models.m_sm.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver_3', as: 'driver3' });
                }

                // Unit 1
                if (!models.m_sm.associations.unit1) {
                    models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit', as: 'unit1' });
                }
                // Unit 2
                if (!models.m_sm.associations.unit2) {
                    models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit_2', as: 'unit2' });
                }
                // Unit 3
                if (!models.m_sm.associations.unit3) {
                    models.m_sm.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit_3', as: 'unit3' });
                }

                models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
                models.m_sm.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });
                models.m_sm.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench' });

                const getData = await models.m_sm.findOne({
                    where: {
                        id_msm: id_msm
                    },
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
                            as: 'driverMitraPickUp'
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
                                    required: false,
                                    include: [
                                        {
                                            model: models.m_wil_kota,
                                            as: 'kotaBongkar'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                });

                if (!getData) {
                    output = {
                        status: {
                            code: 404,
                            message: 'MSM tidak ditemukan'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data MSM'
                        },
                        data: getData
                    };
                }
            }
        } else {
            output = {
                status: {
                    code: 401,
                    message: 'Unauthorized'
                }
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
};
