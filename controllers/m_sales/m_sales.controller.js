const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Create Sales
exports.createSales = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { 
                tahun, 
                id_bu, 
                nama_bu, 
                id_bu_brench, 
                nik_sales, 
                nama_sales, 
                wilayah_sales,
                kode_gl,
                nama_gl,
                wilayah_gl,
                kode_asm,
                nama_asm,
                wilayah_asm,
                kode_manager,
                nama_manager,
                wilayah_manager,
                kode_cabang,
                nama_cabang,
                wilayah_cabang
            } = req.body;

            // Validasi field wajib
            if (!tahun || !id_bu || !nama_bu || !id_bu_brench || !nik_sales || !nama_sales) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field tahun, id_bu, nama_bu, id_bu_brench, nik_sales, dan nama_sales wajib diisi'
                    }
                };
            } else {
                // Cek apakah sudah ada dengan nik_sales yang sama
                const existingSales = await models.m_sales.findOne({
                    where: {
                        nik_sales: nik_sales,
                        active: 'active'
                    }
                });

                if (existingSales) {
                    output = {
                        status: {
                            code: 402,
                            message: 'Sales dengan NIK tersebut sudah ada'
                        }
                    };
                } else {
                    const createData = await models.m_sales.create({
                        tahun: tahun,
                        id_bu: id_bu,
                        nama_bu: nama_bu,
                        id_bu_brench: id_bu_brench,
                        nik_sales: nik_sales,
                        nama_sales: nama_sales,
                        wilayah_sales: wilayah_sales || null,
                        kode_gl: kode_gl || null,
                        nama_gl: nama_gl || null,
                        wilayah_gl: wilayah_gl || null,
                        kode_asm: kode_asm || null,
                        nama_asm: nama_asm || null,
                        wilayah_asm: wilayah_asm || null,
                        kode_manager: kode_manager || null,
                        nama_manager: nama_manager || null,
                        wilayah_manager: wilayah_manager || null,
                        kode_cabang: kode_cabang || null,
                        nama_cabang: nama_cabang || null,
                        wilayah_cabang: wilayah_cabang || null,
                        active: 'active'
                    });

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success create Sales'
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

// Edit Sales
exports.editSales = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { 
                id_sales,
                tahun, 
                id_bu, 
                nama_bu, 
                id_bu_brench, 
                nik_sales, 
                nama_sales, 
                wilayah_sales,
                kode_gl,
                nama_gl,
                wilayah_gl,
                kode_asm,
                nama_asm,
                wilayah_asm,
                kode_manager,
                nama_manager,
                wilayah_manager,
                kode_cabang,
                nama_cabang,
                wilayah_cabang
            } = req.body;

            if (!id_sales) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_sales wajib diisi'
                    }
                };
            } else {
                const getSales = await models.m_sales.findOne({
                    where: {
                        id_sales: id_sales
                    }
                });

                if (!getSales) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Sales tidak ditemukan'
                        }
                    };
                } else {
                    const updateData = {};
                    if (tahun !== undefined) updateData.tahun = tahun;
                    if (id_bu !== undefined) updateData.id_bu = id_bu;
                    if (nama_bu !== undefined) updateData.nama_bu = nama_bu;
                    if (id_bu_brench !== undefined) updateData.id_bu_brench = id_bu_brench;
                    if (nik_sales !== undefined) updateData.nik_sales = nik_sales;
                    if (nama_sales !== undefined) updateData.nama_sales = nama_sales;
                    if (wilayah_sales !== undefined) updateData.wilayah_sales = wilayah_sales;
                    if (kode_gl !== undefined) updateData.kode_gl = kode_gl;
                    if (nama_gl !== undefined) updateData.nama_gl = nama_gl;
                    if (wilayah_gl !== undefined) updateData.wilayah_gl = wilayah_gl;
                    if (kode_asm !== undefined) updateData.kode_asm = kode_asm;
                    if (nama_asm !== undefined) updateData.nama_asm = nama_asm;
                    if (wilayah_asm !== undefined) updateData.wilayah_asm = wilayah_asm;
                    if (kode_manager !== undefined) updateData.kode_manager = kode_manager;
                    if (nama_manager !== undefined) updateData.nama_manager = nama_manager;
                    if (wilayah_manager !== undefined) updateData.wilayah_manager = wilayah_manager;
                    if (kode_cabang !== undefined) updateData.kode_cabang = kode_cabang;
                    if (nama_cabang !== undefined) updateData.nama_cabang = nama_cabang;
                    if (wilayah_cabang !== undefined) updateData.wilayah_cabang = wilayah_cabang;

                    const updatedSales = await models.m_sales.update(updateData, {
                        where: {
                            id_sales: id_sales
                        }
                    });

                    if (updatedSales) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success update Sales'
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

// Disable Sales (set active to inactive)
exports.disableSales = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_sales } = req.body;

            if (!id_sales) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_sales wajib diisi'
                    }
                };
            } else {
                const updateData = await models.m_sales.update(
                    {
                        active: 'inactive'
                    },
                    {
                        where: {
                            id_sales: id_sales
                        }
                    }
                );

                if (updateData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Sales berhasil dinonaktifkan'
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

// Get All Sales
exports.getAllSales = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
            const { tahun, active, id_bu, id_bu_brench, keyword } = req.query;

            const whereCondition = {};

            if (tahun) {
                whereCondition.tahun = tahun;
            }

            if (id_bu) {
                whereCondition.id_bu = id_bu;
            }

            if (id_bu_brench) {
                whereCondition.id_bu_brench = id_bu_brench;
            }

            if (active) {
                whereCondition.active = active;
            } else {
                whereCondition.active = 'active'; // Default hanya yang active
            }

            // Keyword search - mencari di multiple fields
            if (keyword) {
                whereCondition[Op.or] = [
                    { nik_sales: { [Op.like]: `%${keyword}%` } },
                    { nama_sales: { [Op.like]: `%${keyword}%` } },
                    { nama_bu: { [Op.like]: `%${keyword}%` } },
                    { wilayah_sales: { [Op.like]: `%${keyword}%` } },
                    { nama_gl: { [Op.like]: `%${keyword}%` } },
                    { nama_asm: { [Op.like]: `%${keyword}%` } },
                    { nama_manager: { [Op.like]: `%${keyword}%` } },
                    { nama_cabang: { [Op.like]: `%${keyword}%` } },
                    { kode_gl: { [Op.like]: `%${keyword}%` } },
                    { kode_asm: { [Op.like]: `%${keyword}%` } },
                    { kode_manager: { [Op.like]: `%${keyword}%` } },
                    { kode_cabang: { [Op.like]: `%${keyword}%` } }
                ];
            }

            const getData = await models.m_sales.findAndCountAll({
                where: whereCondition,
                order: [['id_sales', 'DESC']],
                limit: limit,
                offset: offset
            });

            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id_sales: item.id_sales,
                        tahun: item.tahun,
                        id_bu: item.id_bu,
                        nama_bu: item.nama_bu,
                        id_bu_brench: item.id_bu_brench,
                        nik_sales: item.nik_sales,
                        nama_sales: item.nama_sales,
                        wilayah_sales: item.wilayah_sales,
                        kode_gl: item.kode_gl,
                        nama_gl: item.nama_gl,
                        wilayah_gl: item.wilayah_gl,
                        kode_asm: item.kode_asm,
                        nama_asm: item.nama_asm,
                        wilayah_asm: item.wilayah_asm,
                        kode_manager: item.kode_manager,
                        nama_manager: item.nama_manager,
                        wilayah_manager: item.wilayah_manager,
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
                        message: 'Success get All Data Sales'
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

// Get Sales by id (detail)
exports.getSalesById = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_sales } = req.query;

            if (!id_sales) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id_sales wajib diisi'
                    }
                };
            } else {
                const getData = await models.m_sales.findOne({
                    where: {
                        id_sales: id_sales
                    }
                });

                if (!getData) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Sales tidak ditemukan'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data Sales'
                        },
                        data: {
                            id_sales: getData.id_sales,
                            tahun: getData.tahun,
                            id_bu: getData.id_bu,
                            nama_bu: getData.nama_bu,
                            id_bu_brench: getData.id_bu_brench,
                            nik_sales: getData.nik_sales,
                            nama_sales: getData.nama_sales,
                            wilayah_sales: getData.wilayah_sales,
                            kode_gl: getData.kode_gl,
                            nama_gl: getData.nama_gl,
                            wilayah_gl: getData.wilayah_gl,
                            kode_asm: getData.kode_asm,
                            nama_asm: getData.nama_asm,
                            wilayah_asm: getData.wilayah_asm,
                            kode_manager: getData.kode_manager,
                            nama_manager: getData.nama_manager,
                            wilayah_manager: getData.wilayah_manager,
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

