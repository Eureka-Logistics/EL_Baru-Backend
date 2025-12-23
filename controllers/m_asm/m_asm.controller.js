const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Create ASM
exports.createAsm = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { tahun, id_bu, nama_bu, nik_asm, kode_asm, nama_asm, wilayah_asm } = req.body;

            // Validasi field wajib
            if (!tahun || !id_bu || !nama_bu || !nik_asm) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field tahun, id_bu, nama_bu, dan nik_asm wajib diisi'
                    }
                };
            } else {
                // Cek apakah sudah ada dengan nik_asm yang sama
                const existingAsm = await models.m_asm.findOne({
                    where: {
                        nik_asm: nik_asm,
                        active: 'active'
                    }
                });

                if (existingAsm) {
                    output = {
                        status: {
                            code: 402,
                            message: 'ASM dengan NIK tersebut sudah ada'
                        }
                    };
                } else {
                    const createData = await models.m_asm.create({
                        tahun: tahun,
                        id_bu: id_bu,
                        nama_bu: nama_bu,
                        nik_asm: nik_asm,
                        kode_asm: kode_asm || null,
                        nama_asm: nama_asm || null,
                        wilayah_asm: wilayah_asm || null,
                        active: 'active'
                    });

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success create ASM'
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

// Edit ASM
exports.editAsm = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_asm, tahun, id_bu, nama_bu, nik_asm, kode_asm, nama_asm, wilayah_asm } = req.body;

            if (!id_asm) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_asm wajib diisi'
                    }
                };
            } else {
                const getAsm = await models.m_asm.findOne({
                    where: {
                        id_asm: id_asm
                    }
                });

                if (!getAsm) {
                    output = {
                        status: {
                            code: 404,
                            message: 'ASM tidak ditemukan'
                        }
                    };
                } else {
                    const updateData = {};
                    if (tahun !== undefined) updateData.tahun = tahun;
                    if (id_bu !== undefined) updateData.id_bu = id_bu;
                    if (nama_bu !== undefined) updateData.nama_bu = nama_bu;
                    if (nik_asm !== undefined) updateData.nik_asm = nik_asm;
                    if (kode_asm !== undefined) updateData.kode_asm = kode_asm;
                    if (nama_asm !== undefined) updateData.nama_asm = nama_asm;
                    if (wilayah_asm !== undefined) updateData.wilayah_asm = wilayah_asm;

                    const updatedAsm = await models.m_asm.update(updateData, {
                        where: {
                            id_asm: id_asm
                        }
                    });

                    if (updatedAsm) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success update ASM'
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

// Disable ASM (set active to inactive)
exports.disableAsm = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_asm } = req.body;

            if (!id_asm) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_asm wajib diisi'
                    }
                };
            } else {
                const updateData = await models.m_asm.update(
                    {
                        active: 'inactive'
                    },
                    {
                        where: {
                            id_asm: id_asm
                        }
                    }
                );

                if (updateData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'ASM berhasil dinonaktifkan'
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

// Get ASM by id_bu
exports.getAsmByBu = async (req, res) => {
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

                const getData = await models.m_asm.findAndCountAll({
                    where: whereCondition,
                    order: [['id_asm', 'DESC']],
                    limit: limit,
                    offset: offset
                });

                if (getData.rows) {
                    let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                    const result = getData.rows.map((item) => {
                        return {
                            no: no++,
                            id_asm: item.id_asm,
                            tahun: item.tahun,
                            id_bu: item.id_bu,
                            nama_bu: item.nama_bu,
                            nik_asm: item.nik_asm,
                            kode_asm: item.kode_asm,
                            nama_asm: item.nama_asm,
                            wilayah_asm: item.wilayah_asm,
                            active: item.active,
                            created_at: item.created_at
                        };
                    });

                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data ASM'
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

// Get ASM by id (detail)
exports.getAsmById = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_asm } = req.query;

            if (!id_asm) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id_asm wajib diisi'
                    }
                };
            } else {
                const getData = await models.m_asm.findOne({
                    where: {
                        id_asm: id_asm
                    }
                });

                if (!getData) {
                    output = {
                        status: {
                            code: 404,
                            message: 'ASM tidak ditemukan'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data ASM'
                        },
                        data: {
                            id_asm: getData.id_asm,
                            tahun: getData.tahun,
                            id_bu: getData.id_bu,
                            nama_bu: getData.nama_bu,
                            nik_asm: getData.nik_asm,
                            kode_asm: getData.kode_asm,
                            nama_asm: getData.nama_asm,
                            wilayah_asm: getData.wilayah_asm,
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

// Get All ASM
exports.getAllAsm = async (req, res) => {
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

            const getData = await models.m_asm.findAndCountAll({
                where: whereCondition,
                order: [['id_asm', 'DESC']],
                limit: limit,
                offset: offset
            });

            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id_asm: item.id_asm,
                        tahun: item.tahun,
                        id_bu: item.id_bu,
                        nama_bu: item.nama_bu,
                        nik_asm: item.nik_asm,
                        kode_asm: item.kode_asm,
                        nama_asm: item.nama_asm,
                        wilayah_asm: item.wilayah_asm,
                        active: item.active,
                        created_at: item.created_at
                    };
                });

                output = {
                    status: {
                        code: 200,
                        message: 'Success get All Data ASM'
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

