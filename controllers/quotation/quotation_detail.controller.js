const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Create Quotation Detail
exports.createQuotationDetail = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const {
                id_quotation,
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
                id_tarif_eureka,
                is_custom,
                note
            } = req.body;

            // Fallback null ke 0 untuk field tertentu
            const finalIdKotaMuat = id_kota_muat === null || id_kota_muat === undefined ? 0 : id_kota_muat;
            const finalIdKecMuat = id_kec_muat === null || id_kec_muat === undefined ? 0 : id_kec_muat;
            const finalIdKecTujuan = id_kec_tujuan === null || id_kec_tujuan === undefined ? 0 : id_kec_tujuan;

            // Validasi field wajib (0 dianggap valid)
            if (!id_quotation || finalIdKotaMuat === undefined || finalIdKecMuat === undefined || !id_kota_tujuan || finalIdKecTujuan === undefined || 
                !id_kendaraan_jenis || !min_tonase || !price || !leadtime || !id_tarif_eureka || 
                is_custom === undefined || !note) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_quotation, id_kota_muat, id_kec_muat, id_kota_tujuan, id_kec_tujuan, id_kendaraan_jenis, min_tonase, price, leadtime, id_tarif_eureka, is_custom, dan note wajib diisi'
                    }
                };
            } else {
                // Check if quotation exists
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
                    const createData = await models.quotation_detail.create({
                        id_quotation: id_quotation,
                        id_kota_muat: finalIdKotaMuat,
                        id_kec_muat: finalIdKecMuat,
                        alamat_muat: alamat_muat || null,
                        id_kota_tujuan: id_kota_tujuan,
                        id_kec_tujuan: finalIdKecTujuan,
                        alamat_tujuan: alamat_tujuan || null,
                        id_kendaraan_jenis: id_kendaraan_jenis,
                        service: service || 'charter',
                        min_tonase: min_tonase,
                        price: price,
                        leadtime: leadtime,
                        id_tarif_eureka: id_tarif_eureka,
                        is_custom: is_custom,
                        note: note
                    });

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success create Quotation Detail'
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

// Edit Quotation Detail
exports.editQuotationDetail = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const {
                id_quotation_detail,
                id_quotation,
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
                id_tarif_eureka,
                is_custom,
                note
            } = req.body;

            if (!id_quotation_detail) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_quotation_detail wajib diisi'
                    }
                };
            } else {
                const getQuotationDetail = await models.quotation_detail.findOne({
                    where: {
                        id_quotation_detail: id_quotation_detail
                    }
                });

                if (!getQuotationDetail) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Quotation Detail tidak ditemukan'
                        }
                    };
                } else {
                    const updateData = {};
                    if (id_quotation !== undefined) updateData.id_quotation = id_quotation;
                    if (id_kota_muat !== undefined) updateData.id_kota_muat = id_kota_muat === null ? 0 : id_kota_muat;
                    if (id_kec_muat !== undefined) updateData.id_kec_muat = id_kec_muat === null ? 0 : id_kec_muat;
                    if (alamat_muat !== undefined) updateData.alamat_muat = alamat_muat;
                    if (id_kota_tujuan !== undefined) updateData.id_kota_tujuan = id_kota_tujuan;
                    if (id_kec_tujuan !== undefined) updateData.id_kec_tujuan = id_kec_tujuan === null ? 0 : id_kec_tujuan;
                    if (alamat_tujuan !== undefined) updateData.alamat_tujuan = alamat_tujuan;
                    if (id_kendaraan_jenis !== undefined) updateData.id_kendaraan_jenis = id_kendaraan_jenis;
                    if (service !== undefined) updateData.service = service;
                    if (min_tonase !== undefined) updateData.min_tonase = min_tonase;
                    if (price !== undefined) updateData.price = price;
                    if (leadtime !== undefined) updateData.leadtime = leadtime;
                    if (id_tarif_eureka !== undefined) updateData.id_tarif_eureka = id_tarif_eureka;
                    if (is_custom !== undefined) updateData.is_custom = is_custom;
                    if (note !== undefined) updateData.note = note;

                    const updatedQuotationDetail = await models.quotation_detail.update(updateData, {
                        where: {
                            id_quotation_detail: id_quotation_detail
                        }
                    });

                    if (updatedQuotationDetail) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success update Quotation Detail'
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

// Delete Quotation Detail
exports.deleteQuotationDetail = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_quotation_detail } = req.body;

            if (!id_quotation_detail) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_quotation_detail wajib diisi'
                    }
                };
            } else {
                const deleteData = await models.quotation_detail.destroy({
                    where: {
                        id_quotation_detail: id_quotation_detail
                    }
                });

                if (deleteData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Quotation Detail berhasil dihapus'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 404,
                            message: 'Quotation Detail tidak ditemukan'
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

// Get List Quotation Detail
exports.getQuotationDetailList = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
            const { id_quotation, id_kota_muat, id_kota_tujuan, service } = req.query;

            const whereCondition = {};

            if (id_quotation) {
                whereCondition.id_quotation = id_quotation;
            }

            if (id_kota_muat) {
                whereCondition.id_kota_muat = id_kota_muat;
            }

            if (id_kota_tujuan) {
                whereCondition.id_kota_tujuan = id_kota_tujuan;
            }

            if (service) {
                whereCondition.service = service;
            }

            const getData = await models.quotation_detail.findAndCountAll({
                where: whereCondition,
                order: [['id_quotation_detail', 'DESC']],
                limit: limit,
                offset: offset
            });

            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id_quotation_detail: item.id_quotation_detail,
                        id_quotation: item.id_quotation,
                        id_kota_muat: item.id_kota_muat,
                        id_kec_muat: item.id_kec_muat,
                        alamat_muat: item.alamat_muat,
                        id_kota_tujuan: item.id_kota_tujuan,
                        id_kec_tujuan: item.id_kec_tujuan,
                        alamat_tujuan: item.alamat_tujuan,
                        id_kendaraan_jenis: item.id_kendaraan_jenis,
                        service: item.service,
                        min_tonase: item.min_tonase,
                        price: item.price,
                        leadtime: item.leadtime,
                        id_tarif_eureka: item.id_tarif_eureka,
                        is_custom: item.is_custom,
                        note: item.note
                    };
                });

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data Quotation Detail'
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

// Get Detail Quotation Detail
exports.getQuotationDetailById = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_quotation_detail } = req.query;

            if (!id_quotation_detail) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id_quotation_detail wajib diisi'
                    }
                };
            } else {
                const getData = await models.quotation_detail.findOne({
                    where: {
                        id_quotation_detail: id_quotation_detail
                    }
                });

                if (!getData) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Quotation Detail tidak ditemukan'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data Quotation Detail'
                        },
                        data: {
                            id_quotation_detail: getData.id_quotation_detail,
                            id_quotation: getData.id_quotation,
                            id_kota_muat: getData.id_kota_muat,
                            id_kec_muat: getData.id_kec_muat,
                            alamat_muat: getData.alamat_muat,
                            id_kota_tujuan: getData.id_kota_tujuan,
                            id_kec_tujuan: getData.id_kec_tujuan,
                            alamat_tujuan: getData.alamat_tujuan,
                            id_kendaraan_jenis: getData.id_kendaraan_jenis,
                            service: getData.service,
                            min_tonase: getData.min_tonase,
                            price: getData.price,
                            leadtime: getData.leadtime,
                            id_tarif_eureka: getData.id_tarif_eureka,
                            is_custom: getData.is_custom,
                            note: getData.note
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
