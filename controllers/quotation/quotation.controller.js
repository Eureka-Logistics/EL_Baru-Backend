const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Create Quotation
exports.createQuotation = async (req, res) => {
    let output = {};
    const sequelize = core.dbConnect();
    let transaction;
    
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const {
                quotation_code,
                pic_name,
                id_customer,
                note,
                tax_included,
                tax_value,
                insurance_included,
                insurance_value,
                multidrop_included,
                multidrop_value,
                tkbm_included,
                tkbm_value,
                id_bu,
                id_bu_brench,
                id_sales,
                akunting,
                tgl_direktur,
                status,
                quotation_details // Array of quotation details
            } = req.body;

            // Validasi field wajib
            if (!id_customer || !id_bu || !id_bu_brench || !id_sales || !status) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_customer, id_bu, id_bu_brench, id_sales, dan status wajib diisi'
                    }
                };
            } else {
                // Start transaction
                transaction = await sequelize.transaction();

                // Create quotation
                const createData = await models.quotation.create({
                    quotation_code: quotation_code || null,
                    pic_name: pic_name || null,
                    id_customer: id_customer,
                    note: note || null,
                    tax_included: tax_included || 0,
                    tax_value: tax_value || 0,
                    insurance_included: insurance_included || 0,
                    insurance_value: insurance_value || 0,
                    multidrop_included: multidrop_included || 0,
                    multidrop_value: multidrop_value || 0,
                    tkbm_included: tkbm_included || 0,
                    tkbm_value: tkbm_value || 0,
                    id_bu: id_bu,
                    id_bu_brench: id_bu_brench,
                    id_sales: id_sales,
                    akunting: akunting || 'N',
                    tgl_direktur: tgl_direktur || null,
                    status: status,
                    is_deleted: 0,
                    date_created: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                }, { transaction });

                const id_quotation = createData.id_quotation;

                // Create quotation details if array is provided
                const createdDetails = [];
                if (quotation_details && Array.isArray(quotation_details) && quotation_details.length > 0) {
                    for (const detail of quotation_details) {
                        const {
                            id_kota_muat,
                            id_kec_muat,
                            alamat_muat,
                            id_kota_tujuan,
                            id_kec_tujuan,
                            alamat_tujuan,
                            id_kendaraan_jenis,
                            service,
                            min_tonase,
                            price,
                            leadtime,
                            id_tarif_race,
                            is_custom,
                            note: detail_note
                        } = detail;

                        // Validasi field wajib untuk quotation detail
                        if (!id_kota_muat || !id_kec_muat || !id_kota_tujuan || !id_kec_tujuan || 
                            id_kendaraan_jenis === undefined || !min_tonase || !price || !leadtime || 
                            !id_tarif_race || is_custom === undefined || !detail_note) {
                            await transaction.rollback();
                            output = {
                                status: {
                                    code: 400,
                                    message: 'Field id_kota_muat, id_kec_muat, id_kota_tujuan, id_kec_tujuan, id_kendaraan_jenis, min_tonase, price, leadtime, id_tarif_race, is_custom, dan note wajib diisi untuk setiap quotation detail'
                                }
                            };
                            const errorsFromMiddleware = await customErrorMiddleware(req);
                            if (!errorsFromMiddleware) {
                                return res.status(output.status.code).send(output);
                            } else {
                                return res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
                            }
                        }

                        const detailData = await models.quotation_detail.create({
                            id_quotation: id_quotation,
                            id_kota_muat: id_kota_muat,
                            id_kec_muat: id_kec_muat,
                            alamat_muat: alamat_muat || null,
                            id_kota_tujuan: id_kota_tujuan,
                            id_kec_tujuan: id_kec_tujuan,
                            alamat_tujuan: alamat_tujuan || null,
                            id_kendaraan_jenis: id_kendaraan_jenis,
                            service: service || 'charter',
                            min_tonase: min_tonase,
                            price: price,
                            leadtime: leadtime,
                            id_tarif_race: id_tarif_race,
                            is_custom: is_custom,
                            note: detail_note
                        }, { transaction });

                        createdDetails.push(detailData);
                    }
                }

                // Commit transaction
                await transaction.commit();

                output = {
                    status: {
                        code: 200,
                        message: 'Success create Quotation'
                    },
                    data: {
                        quotation: createData,
                        quotation_details: createdDetails
                    }
                };
            }
        }
    } catch (error) {
        // Rollback transaction on error
        if (transaction) {
            await transaction.rollback();
        }
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

// Edit Quotation
exports.editQuotation = async (req, res) => {
    let output = {};
    const sequelize = core.dbConnect();
    let transaction;
    
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const {
                id_quotation,
                quotation_code,
                pic_name,
                id_customer,
                note,
                tax_included,
                tax_value,
                insurance_included,
                insurance_value,
                multidrop_included,
                multidrop_value,
                tkbm_included,
                tkbm_value,
                id_bu,
                id_bu_brench,
                id_sales,
                akunting,
                tgl_direktur,
                status,
                quotation_details // Array of quotation details
            } = req.body;

            if (!id_quotation) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_quotation wajib diisi'
                    }
                };
            } else {
                const getQuotation = await models.quotation.findOne({
                    where: {
                        id_quotation: id_quotation,
                        is_deleted: 0
                    }
                });

                if (!getQuotation) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Quotation tidak ditemukan'
                        }
                    };
                } else {
                    // Start transaction
                    transaction = await sequelize.transaction();

                    // Update quotation
                    const updateData = {};
                    if (quotation_code !== undefined) updateData.quotation_code = quotation_code;
                    if (pic_name !== undefined) updateData.pic_name = pic_name;
                    if (id_customer !== undefined) updateData.id_customer = id_customer;
                    if (note !== undefined) updateData.note = note;
                    if (tax_included !== undefined) updateData.tax_included = tax_included;
                    if (tax_value !== undefined) updateData.tax_value = tax_value;
                    if (insurance_included !== undefined) updateData.insurance_included = insurance_included;
                    if (insurance_value !== undefined) updateData.insurance_value = insurance_value;
                    if (multidrop_included !== undefined) updateData.multidrop_included = multidrop_included;
                    if (multidrop_value !== undefined) updateData.multidrop_value = multidrop_value;
                    if (tkbm_included !== undefined) updateData.tkbm_included = tkbm_included;
                    if (tkbm_value !== undefined) updateData.tkbm_value = tkbm_value;
                    if (id_bu !== undefined) updateData.id_bu = id_bu;
                    if (id_bu_brench !== undefined) updateData.id_bu_brench = id_bu_brench;
                    if (id_sales !== undefined) updateData.id_sales = id_sales;
                    if (akunting !== undefined) updateData.akunting = akunting;
                    if (tgl_direktur !== undefined) updateData.tgl_direktur = tgl_direktur;
                    if (status !== undefined) updateData.status = status;

                    await models.quotation.update(updateData, {
                        where: {
                            id_quotation: id_quotation
                        },
                        transaction
                    });

                    // Handle quotation_details if provided
                    const updatedDetails = [];
                    if (quotation_details && Array.isArray(quotation_details)) {
                        // Get existing details
                        const existingDetails = await models.quotation_detail.findAll({
                            where: {
                                id_quotation: id_quotation
                            },
                            transaction
                        });

                        const existingIds = existingDetails.map(d => d.id_quotation_detail);
                        const providedIds = quotation_details
                            .filter(d => d.id_quotation_detail)
                            .map(d => d.id_quotation_detail);

                        // Delete details that are not in the provided array
                        const idsToDelete = existingIds.filter(id => !providedIds.includes(id));
                        if (idsToDelete.length > 0) {
                            await models.quotation_detail.destroy({
                                where: {
                                    id_quotation_detail: {
                                        [Op.in]: idsToDelete
                                    }
                                },
                                transaction
                            });
                        }

                        // Process each detail in the array
                        for (const detail of quotation_details) {
                            const {
                                id_quotation_detail,
                                id_kota_muat,
                                id_kec_muat,
                                alamat_muat,
                                id_kota_tujuan,
                                id_kec_tujuan,
                                alamat_tujuan,
                                id_kendaraan_jenis,
                                service,
                                min_tonase,
                                price,
                                leadtime,
                                id_tarif_race,
                                is_custom,
                                note: detail_note
                            } = detail;

                            // Validasi field wajib untuk quotation detail
                            if (!id_kota_muat || !id_kec_muat || !id_kota_tujuan || !id_kec_tujuan || 
                                id_kendaraan_jenis === undefined || !min_tonase || !price || !leadtime || 
                                !id_tarif_race || is_custom === undefined || !detail_note) {
                                await transaction.rollback();
                                output = {
                                    status: {
                                        code: 400,
                                        message: 'Field id_kota_muat, id_kec_muat, id_kota_tujuan, id_kec_tujuan, id_kendaraan_jenis, min_tonase, price, leadtime, id_tarif_race, is_custom, dan note wajib diisi untuk setiap quotation detail'
                                    }
                                };
                                const errorsFromMiddleware = await customErrorMiddleware(req);
                                if (!errorsFromMiddleware) {
                                    return res.status(output.status.code).send(output);
                                } else {
                                    return res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
                                }
                            }

                            if (id_quotation_detail) {
                                // Update existing detail
                                const detailUpdateData = {
                                    id_kota_muat: id_kota_muat,
                                    id_kec_muat: id_kec_muat,
                                    alamat_muat: alamat_muat || null,
                                    id_kota_tujuan: id_kota_tujuan,
                                    id_kec_tujuan: id_kec_tujuan,
                                    alamat_tujuan: alamat_tujuan || null,
                                    id_kendaraan_jenis: id_kendaraan_jenis,
                                    service: service || 'charter',
                                    min_tonase: min_tonase,
                                    price: price,
                                    leadtime: leadtime,
                                    id_tarif_race: id_tarif_race,
                                    is_custom: is_custom,
                                    note: detail_note
                                };

                                await models.quotation_detail.update(detailUpdateData, {
                                    where: {
                                        id_quotation_detail: id_quotation_detail
                                    },
                                    transaction
                                });

                                const updatedDetail = await models.quotation_detail.findOne({
                                    where: {
                                        id_quotation_detail: id_quotation_detail
                                    },
                                    transaction
                                });

                                updatedDetails.push(updatedDetail);
                            } else {
                                // Create new detail
                                const newDetail = await models.quotation_detail.create({
                                    id_quotation: id_quotation,
                                    id_kota_muat: id_kota_muat,
                                    id_kec_muat: id_kec_muat,
                                    alamat_muat: alamat_muat || null,
                                    id_kota_tujuan: id_kota_tujuan,
                                    id_kec_tujuan: id_kec_tujuan,
                                    alamat_tujuan: alamat_tujuan || null,
                                    id_kendaraan_jenis: id_kendaraan_jenis,
                                    service: service || 'charter',
                                    min_tonase: min_tonase,
                                    price: price,
                                    leadtime: leadtime,
                                    id_tarif_race: id_tarif_race,
                                    is_custom: is_custom,
                                    note: detail_note
                                }, { transaction });

                                updatedDetails.push(newDetail);
                            }
                        }
                    }

                    // Commit transaction
                    await transaction.commit();

                    output = {
                        status: {
                            code: 200,
                            message: 'Success update Quotation'
                        },
                        data: {
                            quotation: {
                                id_quotation: id_quotation,
                                ...updateData
                            },
                            quotation_details: updatedDetails
                        }
                    };
                }
            }
        }
    } catch (error) {
        // Rollback transaction on error
        if (transaction) {
            await transaction.rollback();
        }
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

// Delete Quotation (soft delete)
exports.deleteQuotation = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_quotation } = req.body;

            if (!id_quotation) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_quotation wajib diisi'
                    }
                };
            } else {
                const updateData = await models.quotation.update(
                    {
                        is_deleted: 1
                    },
                    {
                        where: {
                            id_quotation: id_quotation
                        }
                    }
                );

                if (updateData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Quotation berhasil dihapus'
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

// Get List Quotation
exports.getQuotationList = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
            const { id_customer, status, id_bu, keyword } = req.query;

            const whereCondition = {
                is_deleted: 0
            };

            if (id_customer) {
                whereCondition.id_customer = id_customer;
            }

            if (status) {
                whereCondition.status = status;
            }

            if (id_bu) {
                whereCondition.id_bu = id_bu;
            }

            if (keyword) {
                whereCondition[Op.or] = [
                    {
                        quotation_code: {
                            [Op.like]: `%${keyword}%`
                        }
                    },
                    {
                        pic_name: {
                            [Op.like]: `%${keyword}%`
                        }
                    }
                ];
            }

            const getData = await models.quotation.findAndCountAll({
                where: whereCondition,
                order: [['id_quotation', 'DESC']],
                limit: limit,
                offset: offset
            });

            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id_quotation: item.id_quotation,
                        quotation_code: item.quotation_code,
                        pic_name: item.pic_name,
                        id_customer: item.id_customer,
                        note: item.note,
                        tax_included: item.tax_included,
                        tax_value: item.tax_value,
                        insurance_included: item.insurance_included,
                        insurance_value: item.insurance_value,
                        multidrop_included: item.multidrop_included,
                        multidrop_value: item.multidrop_value,
                        tkbm_included: item.tkbm_included,
                        tkbm_value: item.tkbm_value,
                        id_bu: item.id_bu,
                        id_bu_brench: item.id_bu_brench,
                        id_sales: item.id_sales,
                        akunting: item.akunting,
                        tgl_direktur: item.tgl_direktur,
                        status: item.status,
                        date_created: item.date_created
                    };
                });

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data Quotation'
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

// Get Detail Quotation
exports.getQuotationDetail = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_quotation } = req.query;

            if (!id_quotation) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id_quotation wajib diisi'
                    }
                };
            } else {
                models.quotation.hasMany(models.quotation_detail, { 
                    foreignKey: 'id_quotation', 
                    sourceKey: 'id_quotation',
                    as: 'quotation_details'
                });

                const getData = await models.quotation.findOne({
                    where: {
                        id_quotation: id_quotation,
                        is_deleted: 0
                    },
                    include: [
                        {
                            model: models.quotation_detail,
                            as: 'quotation_details',
                            required: false
                        }
                    ]
                });

                if (!getData) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Quotation tidak ditemukan'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data Quotation'
                        },
                        data: {
                            id_quotation: getData.id_quotation,
                            quotation_code: getData.quotation_code,
                            pic_name: getData.pic_name,
                            id_customer: getData.id_customer,
                            note: getData.note,
                            tax_included: getData.tax_included,
                            tax_value: getData.tax_value,
                            insurance_included: getData.insurance_included,
                            insurance_value: getData.insurance_value,
                            multidrop_included: getData.multidrop_included,
                            multidrop_value: getData.multidrop_value,
                            tkbm_included: getData.tkbm_included,
                            tkbm_value: getData.tkbm_value,
                            id_bu: getData.id_bu,
                            id_bu_brench: getData.id_bu_brench,
                            id_sales: getData.id_sales,
                            akunting: getData.akunting,
                            tgl_direktur: getData.tgl_direktur,
                            status: getData.status,
                            date_created: getData.date_created,
                            quotation_details: getData.quotation_details || []
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
