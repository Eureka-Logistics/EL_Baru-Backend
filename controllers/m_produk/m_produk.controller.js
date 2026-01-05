const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Create Produk
exports.createProduk = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { 
                message_main_attachment_id,
                product_tmpl_id,
                default_code,
                barcode,
                combination_indices,
                volume,
                weight,
                active,
                can_image_variant_1024_be_zoomed
            } = req.body;

            // Helper function to convert boolean to t/f format
            const convertToTf = (value) => {
                if (value === undefined || value === null || value === '') return null;
                if (value === true || value === 'true' || value === 't' || value === 'T' || value === 'Y' || value === 'y') return 't';
                if (value === false || value === 'false' || value === 'f' || value === 'F' || value === 'N' || value === 'n') return 'f';
                return value;
            };

            const createData = await models.m_produk.create({
                message_main_attachment_id: message_main_attachment_id || null,
                product_tmpl_id: product_tmpl_id || null,
                create_uid: req.user.id || null,
                write_uid: req.user.id || null,
                default_code: default_code || null,
                barcode: barcode || null,
                combination_indices: combination_indices || null,
                volume: volume || null,
                weight: weight || null,
                active: convertToTf(active),
                can_image_variant_1024_be_zoomed: convertToTf(can_image_variant_1024_be_zoomed),
                create_date: core.moment(Date.now()).format('DD/M/YYYY HH:mm:ss') + '.-1f',
                write_date: core.moment(Date.now()).format('DD/M/YYYY HH:mm:ss') + '.-1f'
            });

            if (createData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success create Produk'
                    },
                    data: createData
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

// Edit Produk
exports.editProduk = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { 
                id,
                message_main_attachment_id,
                product_tmpl_id,
                default_code,
                barcode,
                combination_indices,
                volume,
                weight,
                active,
                can_image_variant_1024_be_zoomed
            } = req.body;

            if (!id) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id wajib diisi'
                    }
                };
            } else {
                const getProduk = await models.m_produk.findOne({
                    where: {
                        id: id
                    }
                });

                if (!getProduk) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Produk tidak ditemukan'
                        }
                    };
                } else {
                    // Helper function to convert boolean to t/f format
                    const convertToTf = (value) => {
                        if (value === undefined || value === null || value === '') return null;
                        if (value === true || value === 'true' || value === 't' || value === 'T' || value === 'Y' || value === 'y') return 't';
                        if (value === false || value === 'false' || value === 'f' || value === 'F' || value === 'N' || value === 'n') return 'f';
                        return value;
                    };

                    const updateData = {};
                    if (message_main_attachment_id !== undefined) updateData.message_main_attachment_id = message_main_attachment_id;
                    if (product_tmpl_id !== undefined) updateData.product_tmpl_id = product_tmpl_id;
                    if (default_code !== undefined) updateData.default_code = default_code;
                    if (barcode !== undefined) updateData.barcode = barcode;
                    if (combination_indices !== undefined) updateData.combination_indices = combination_indices;
                    if (volume !== undefined) updateData.volume = volume;
                    if (weight !== undefined) updateData.weight = weight;
                    if (active !== undefined) updateData.active = convertToTf(active);
                    if (can_image_variant_1024_be_zoomed !== undefined) updateData.can_image_variant_1024_be_zoomed = convertToTf(can_image_variant_1024_be_zoomed);
                    updateData.write_uid = req.user.id || null;
                    updateData.write_date = core.moment(Date.now()).format('DD/M/YYYY HH:mm:ss') + '.-1f';

                    const updatedProduk = await models.m_produk.update(updateData, {
                        where: {
                            id: id
                        }
                    });

                    if (updatedProduk) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success update Produk'
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

// Get All Produk
exports.getAllProduk = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { 
                keyword,
                page = 1,
                limit = 10,
                active
            } = req.query;

            const offset = (parseInt(page) - 1) * parseInt(limit);
            const whereCondition = {};

            // Filter by keyword
            if (keyword) {
                whereCondition[Op.or] = [
                    { default_code: { [Op.like]: `%${keyword}%` } },
                    { barcode: { [Op.like]: `%${keyword}%` } }
                ];
            }

            // Filter by active
            if (active !== undefined) {
                whereCondition.active = active;
            }

            const { count, rows } = await models.m_produk.findAndCountAll({
                where: whereCondition,
                order: [['id', 'DESC']],
                limit: parseInt(limit),
                offset: offset
            });

            output = {
                status: {
                    code: 200,
                    message: 'Success get all Produk'
                },
                data: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / parseInt(limit))
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

// Get Detail Produk
exports.getDetailProduk = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id } = req.params;

            if (!id) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id wajib diisi'
                    }
                };
            } else {
                const getProduk = await models.m_produk.findOne({
                    where: {
                        id: id
                    }
                });

                if (!getProduk) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Produk tidak ditemukan'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get detail Produk'
                        },
                        data: getProduk
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

