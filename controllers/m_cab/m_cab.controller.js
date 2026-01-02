const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Create CAB
exports.createCab = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { tahun, kode_cabang, nama_cabang, wilayah_cabang } = req.body;

            // Validasi field wajib
            if (!tahun) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field tahun wajib diisi'
                    }
                };
            } else {
                    const createData = await models.m_cab.create({
                        tahun: tahun,
                        kode_cabang: kode_cabang || null,
                        nama_cabang: nama_cabang || null,
                        wilayah_cabang: wilayah_cabang || null,
                        active: 'active'
                    });

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success create Cabang'
                            },
                            data: createData
                        };
                    }
            }
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

// Edit CAB
exports.editCab = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_cab, tahun, kode_cabang, nama_cabang, wilayah_cabang } = req.body;

            if (!id_cab) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_cab wajib diisi'
                    }
                };
            } else {
                const getCab = await models.m_cab.findOne({
                    where: {
                        id_cab: id_cab
                    }
                });

                if (!getCab) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Cabang tidak ditemukan'
                        }
                    };
                } else {
                    const updateData = {};
                    if (tahun !== undefined) updateData.tahun = tahun;
                    if (kode_cabang !== undefined) updateData.kode_cabang = kode_cabang;
                    if (nama_cabang !== undefined) updateData.nama_cabang = nama_cabang;
                    if (wilayah_cabang !== undefined) updateData.wilayah_cabang = wilayah_cabang;

                    const updatedCab = await models.m_cab.update(updateData, {
                        where: {
                            id_cab: id_cab
                        }
                    });

                    if (updatedCab) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success update Cabang'
                            }
                        };
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
        };
    }

    const errorsFromMiddleware = await customErrorMiddleware(req);

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
};

// Disable CAB (set active to inactive)
exports.disableCab = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_cab } = req.body;

            if (!id_cab) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_cab wajib diisi'
                    }
                };
            } else {
                const updateData = await models.m_cab.update(
                    {
                        active: 'inactive'
                    },
                    {
                        where: {
                            id_cab: id_cab
                        }
                    }
                );

                if (updateData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Cabang berhasil dinonaktifkan'
                        }
                    };
                }
            }
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

// Get CAB (by tahun, karena tidak ada id_bu)
exports.getCab = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
            const { tahun, active } = req.query;

            const whereCondition = {};

            if (tahun) {
                whereCondition.tahun = tahun;
            }

            if (active) {
                whereCondition.active = active;
            } else {
                whereCondition.active = 'active'; // Default hanya yang active
            }

            const getData = await models.m_cab.findAndCountAll({
                where: whereCondition,
                order: [['id_cab', 'DESC']],
                limit: limit,
                offset: offset
            });

            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id_cab: item.id_cab,
                        tahun: item.tahun,
                        kode_cabang: item.kode_cabang,
                        nama_cabang: item.nama_cabang,
                        wilayah_cabang: item.wilayah_cabang,
                        active: item.active,
                        created_at: item.created_at
                    };
                });

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data Cabang'
                    },
                    data: {
                        totalData: getData.count,
                        totalPage: Math.ceil(getData.count / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        list: result
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
        };
    }

    const errorsFromMiddleware = await customErrorMiddleware(req);

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
};

// Get CAB by id (detail)
exports.getCabById = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_cab } = req.query;

            if (!id_cab) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id_cab wajib diisi'
                    }
                };
            } else {
                const getData = await models.m_cab.findOne({
                    where: {
                        id_cab: id_cab
                    }
                });

                if (!getData) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Cabang tidak ditemukan'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data Cabang'
                        },
                        data: {
                            id_cab: getData.id_cab,
                            tahun: getData.tahun,
                            kode_cabang: getData.kode_cabang,
                            nama_cabang: getData.nama_cabang,
                            wilayah_cabang: getData.wilayah_cabang,
                            active: getData.active,
                            created_at: getData.created_at
                        }
                    };
                }
            }
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

// Get All CAB (alias untuk getCab, sudah ada)
// getCab sudah berfungsi sebagai get all dengan filter opsional

