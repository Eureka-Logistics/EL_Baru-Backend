const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Create MGR
exports.createMgr = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { tahun, id_bu, nama_bu, nik_manager, kode_manager, nama_manager, wilayah_manager } = req.body;

            // Validasi field wajib
            if (!tahun || !id_bu || !nama_bu || !nik_manager) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field tahun, id_bu, nama_bu, dan nik_manager wajib diisi'
                    }
                };
            } else {
                // Cek apakah sudah ada dengan nik_manager yang sama
                const existingMgr = await models.m_mgr.findOne({
                    where: {
                        nik_manager: nik_manager,
                        active: 'active'
                    }
                });

                if (existingMgr) {
                    output = {
                        status: {
                            code: 402,
                            message: 'Manager dengan NIK tersebut sudah ada'
                        }
                    };
                } else {
                    const createData = await models.m_mgr.create({
                        tahun: tahun,
                        id_bu: id_bu,
                        nama_bu: nama_bu,
                        nik_manager: nik_manager,
                        kode_manager: kode_manager || null,
                        nama_manager: nama_manager || null,
                        wilayah_manager: wilayah_manager || null,
                        active: 'active'
                    });

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success create Manager'
                            },
                            data: createData
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

// Edit MGR
exports.editMgr = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_mgr, tahun, id_bu, nama_bu, nik_manager, kode_manager, nama_manager, wilayah_manager } = req.body;

            if (!id_mgr) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_mgr wajib diisi'
                    }
                };
            } else {
                const getMgr = await models.m_mgr.findOne({
                    where: {
                        id_mgr: id_mgr
                    }
                });

                if (!getMgr) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Manager tidak ditemukan'
                        }
                    };
                } else {
                    const updateData = {};
                    if (tahun !== undefined) updateData.tahun = tahun;
                    if (id_bu !== undefined) updateData.id_bu = id_bu;
                    if (nama_bu !== undefined) updateData.nama_bu = nama_bu;
                    if (nik_manager !== undefined) updateData.nik_manager = nik_manager;
                    if (kode_manager !== undefined) updateData.kode_manager = kode_manager;
                    if (nama_manager !== undefined) updateData.nama_manager = nama_manager;
                    if (wilayah_manager !== undefined) updateData.wilayah_manager = wilayah_manager;

                    const updatedMgr = await models.m_mgr.update(updateData, {
                        where: {
                            id_mgr: id_mgr
                        }
                    });

                    if (updatedMgr) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success update Manager'
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

// Disable MGR (set active to inactive)
exports.disableMgr = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_mgr } = req.body;

            if (!id_mgr) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_mgr wajib diisi'
                    }
                };
            } else {
                const updateData = await models.m_mgr.update(
                    {
                        active: 'inactive'
                    },
                    {
                        where: {
                            id_mgr: id_mgr
                        }
                    }
                );

                if (updateData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Manager berhasil dinonaktifkan'
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

// Get MGR by id_bu
exports.getMgrByBu = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
            const { id_bu, tahun, active } = req.query;

            if (!id_bu) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id_bu wajib diisi'
                    }
                };
            } else {
                const whereCondition = {
                    id_bu: id_bu
                };

                if (tahun) {
                    whereCondition.tahun = tahun;
                }

                if (active) {
                    whereCondition.active = active;
                } else {
                    whereCondition.active = 'active'; // Default hanya yang active
                }

                const getData = await models.m_mgr.findAndCountAll({
                    where: whereCondition,
                    order: [['id_mgr', 'DESC']],
                    limit: limit,
                    offset: offset
                });

                if (getData.rows) {
                    let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                    const result = getData.rows.map((item) => {
                        return {
                            no: no++,
                            id_mgr: item.id_mgr,
                            tahun: item.tahun,
                            id_bu: item.id_bu,
                            nama_bu: item.nama_bu,
                            nik_manager: item.nik_manager,
                            kode_manager: item.kode_manager,
                            nama_manager: item.nama_manager,
                            wilayah_manager: item.wilayah_manager,
                            active: item.active,
                            created_at: item.created_at
                        };
                    });

                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data Manager'
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

// Get MGR by id (detail)
exports.getMgrById = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_mgr } = req.query;

            if (!id_mgr) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id_mgr wajib diisi'
                    }
                };
            } else {
                const getData = await models.m_mgr.findOne({
                    where: {
                        id_mgr: id_mgr
                    }
                });

                if (!getData) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Manager tidak ditemukan'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data Manager'
                        },
                        data: {
                            id_mgr: getData.id_mgr,
                            tahun: getData.tahun,
                            id_bu: getData.id_bu,
                            nama_bu: getData.nama_bu,
                            nik_manager: getData.nik_manager,
                            kode_manager: getData.kode_manager,
                            nama_manager: getData.nama_manager,
                            wilayah_manager: getData.wilayah_manager,
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

// Get All MGR
exports.getAllMgr = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
            const { tahun, active, id_bu } = req.query;

            const whereCondition = {};

            if (tahun) {
                whereCondition.tahun = tahun;
            }

            if (id_bu) {
                whereCondition.id_bu = id_bu;
            }

            if (active) {
                whereCondition.active = active;
            } else {
                whereCondition.active = 'active'; // Default hanya yang active
            }

            const getData = await models.m_mgr.findAndCountAll({
                where: whereCondition,
                order: [['id_mgr', 'DESC']],
                limit: limit,
                offset: offset
            });

            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id_mgr: item.id_mgr,
                        tahun: item.tahun,
                        id_bu: item.id_bu,
                        nama_bu: item.nama_bu,
                        nik_manager: item.nik_manager,
                        kode_manager: item.kode_manager,
                        nama_manager: item.nama_manager,
                        wilayah_manager: item.wilayah_manager,
                        active: item.active,
                        created_at: item.created_at
                    };
                });

                output = {
                    status: {
                        code: 200,
                        message: 'Success get All Data Manager'
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

