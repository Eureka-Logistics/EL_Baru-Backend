const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Create GL
exports.createGl = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { tahun, id_bu, nama_bu, kode_gl, nama_gl, wilayah_gl } = req.body;

            // Validasi field wajib
            if (!tahun || !id_bu || !nama_bu) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field tahun, id_bu, dan nama_bu wajib diisi'
                    }
                };
            } else {
                    const createData = await models.m_gl.create({
                        tahun: tahun,
                        id_bu: id_bu,
                        nama_bu: nama_bu,
                        kode_gl: kode_gl || null,
                        nama_gl: nama_gl || null,
                        wilayah_gl: wilayah_gl || null,
                        active: 'active'
                    });

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success create GL'
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

// Edit GL
exports.editGl = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_gl, tahun, id_bu, nama_bu, kode_gl, nama_gl, wilayah_gl } = req.body;

            if (!id_gl) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_gl wajib diisi'
                    }
                };
            } else {
                const getGl = await models.m_gl.findOne({
                    where: {
                        id_gl: id_gl
                    }
                });

                if (!getGl) {
                    output = {
                        status: {
                            code: 404,
                            message: 'GL tidak ditemukan'
                        }
                    };
                } else {
                    const updateData = {};
                    if (tahun !== undefined) updateData.tahun = tahun;
                    if (id_bu !== undefined) updateData.id_bu = id_bu;
                    if (nama_bu !== undefined) updateData.nama_bu = nama_bu;
                    if (kode_gl !== undefined) updateData.kode_gl = kode_gl;
                    if (nama_gl !== undefined) updateData.nama_gl = nama_gl;
                    if (wilayah_gl !== undefined) updateData.wilayah_gl = wilayah_gl;

                    const updatedGl = await models.m_gl.update(updateData, {
                        where: {
                            id_gl: id_gl
                        }
                    });

                    if (updatedGl) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success update GL'
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

// Disable GL (set active to inactive)
exports.disableGl = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_gl } = req.body;

            if (!id_gl) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_gl wajib diisi'
                    }
                };
            } else {
                const updateData = await models.m_gl.update(
                    {
                        active: 'inactive'
                    },
                    {
                        where: {
                            id_gl: id_gl
                        }
                    }
                );

                if (updateData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'GL berhasil dinonaktifkan'
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

// Get GL by id_bu
exports.getGlByBu = async (req, res) => {
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

                const getData = await models.m_gl.findAndCountAll({
                    where: whereCondition,
                    order: [['id_gl', 'DESC']],
                    limit: limit,
                    offset: offset
                });

                if (getData.rows) {
                    let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                    const result = getData.rows.map((item) => {
                        return {
                            no: no++,
                            id_gl: item.id_gl,
                            tahun: item.tahun,
                            id_bu: item.id_bu,
                            nama_bu: item.nama_bu,
                            kode_gl: item.kode_gl,
                            nama_gl: item.nama_gl,
                            wilayah_gl: item.wilayah_gl,
                            active: item.active,
                            created_at: item.created_at
                        };
                    });

                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data GL'
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

// Get GL by id (detail)
exports.getGlById = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_gl } = req.query;

            if (!id_gl) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id_gl wajib diisi'
                    }
                };
            } else {
                const getData = await models.m_gl.findOne({
                    where: {
                        id_gl: id_gl
                    }
                });

                if (!getData) {
                    output = {
                        status: {
                            code: 404,
                            message: 'GL tidak ditemukan'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data GL'
                        },
                        data: {
                            id_gl: getData.id_gl,
                            tahun: getData.tahun,
                            id_bu: getData.id_bu,
                            nama_bu: getData.nama_bu,
                            kode_gl: getData.kode_gl,
                            nama_gl: getData.nama_gl,
                            wilayah_gl: getData.wilayah_gl,
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

// Get All GL
exports.getAllGl = async (req, res) => {
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

            const getData = await models.m_gl.findAndCountAll({
                where: whereCondition,
                order: [['id_gl', 'DESC']],
                limit: limit,
                offset: offset
            });

            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id_gl: item.id_gl,
                        tahun: item.tahun,
                        id_bu: item.id_bu,
                        nama_bu: item.nama_bu,
                        nik_gl: item.nik_gl,
                        kode_gl: item.kode_gl,
                        nama_gl: item.nama_gl,
                        wilayah_gl: item.wilayah_gl,
                        active: item.active,
                        created_at: item.created_at
                    };
                });

                output = {
                    status: {
                        code: 200,
                        message: 'Success get All Data GL'
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

