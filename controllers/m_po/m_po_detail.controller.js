const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Create PO Detail
exports.createPoDetail = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const {
                id_mpo,
                id_msm,
                no_sm,
                al_bongkar,
                po_berdasarkan,
                hitung_berdasarkan,
                berat,
                volume,
                qty,
                exp,
                harga,
                harga_muat,
                harga_bongkar_muat,
                harga_inap,
                harga_jumlah,
                kendaraan,
                kontainer,
                seal,
                nopol,
                supir,
                telp
            } = req.body;

            // Validasi field wajib
            if (!id_mpo || harga === undefined || harga_jumlah === undefined || 
                !kendaraan || !kontainer || !seal || !nopol || !supir || !telp) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_mpo, harga, harga_jumlah, kendaraan, kontainer, seal, nopol, supir, dan telp wajib diisi'
                    }
                };
            } else {
                // Check if PO exists
                const getPo = await models.m_po.findOne({
                    where: {
                        id_mpo: id_mpo
                    }
                });

                if (!getPo) {
                    output = {
                        status: {
                            code: 404,
                            message: 'PO tidak ditemukan'
                        }
                    };
                } else {
                    const createData = await models.m_po_detail.create({
                        id_mpo: id_mpo,
                        id_msm: id_msm || 0,
                        no_sm: no_sm || null,
                        al_bongkar: al_bongkar || 0,
                        po_berdasarkan: po_berdasarkan || 'koli',
                        hitung_berdasarkan: hitung_berdasarkan || 'koli',
                        berat: berat || 0,
                        volume: volume || 0.000,
                        qty: qty || 0,
                        exp: exp || 0,
                        harga: harga,
                        harga_muat: harga_muat || 0,
                        harga_bongkar_muat: harga_bongkar_muat || 0,
                        harga_inap: harga_inap || 0,
                        harga_jumlah: harga_jumlah,
                        kendaraan: kendaraan,
                        kontainer: kontainer,
                        seal: seal,
                        nopol: nopol,
                        supir: supir,
                        telp: telp,
                        tgl_update: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                    });

                    if (createData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success create PO Detail'
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

// Edit PO Detail
exports.editPoDetail = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const {
                id_mpod,
                id_mpo,
                id_msm,
                no_sm,
                al_bongkar,
                po_berdasarkan,
                hitung_berdasarkan,
                berat,
                volume,
                qty,
                exp,
                harga,
                harga_muat,
                harga_bongkar_muat,
                harga_inap,
                harga_jumlah,
                kendaraan,
                kontainer,
                seal,
                nopol,
                supir,
                telp
            } = req.body;

            if (!id_mpod) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_mpod wajib diisi'
                    }
                };
            } else {
                const getPoDetail = await models.m_po_detail.findOne({
                    where: {
                        id_mpod: id_mpod
                    }
                });

                if (!getPoDetail) {
                    output = {
                        status: {
                            code: 404,
                            message: 'PO Detail tidak ditemukan'
                        }
                    };
                } else {
                    const updateData = {};
                    if (id_mpo !== undefined) updateData.id_mpo = id_mpo;
                    if (id_msm !== undefined) updateData.id_msm = id_msm;
                    if (no_sm !== undefined) updateData.no_sm = no_sm;
                    if (al_bongkar !== undefined) updateData.al_bongkar = al_bongkar;
                    if (po_berdasarkan !== undefined) updateData.po_berdasarkan = po_berdasarkan;
                    if (hitung_berdasarkan !== undefined) updateData.hitung_berdasarkan = hitung_berdasarkan;
                    if (berat !== undefined) updateData.berat = berat;
                    if (volume !== undefined) updateData.volume = volume;
                    if (qty !== undefined) updateData.qty = qty;
                    if (exp !== undefined) updateData.exp = exp;
                    if (harga !== undefined) updateData.harga = harga;
                    if (harga_muat !== undefined) updateData.harga_muat = harga_muat;
                    if (harga_bongkar_muat !== undefined) updateData.harga_bongkar_muat = harga_bongkar_muat;
                    if (harga_inap !== undefined) updateData.harga_inap = harga_inap;
                    if (harga_jumlah !== undefined) updateData.harga_jumlah = harga_jumlah;
                    if (kendaraan !== undefined) updateData.kendaraan = kendaraan;
                    if (kontainer !== undefined) updateData.kontainer = kontainer;
                    if (seal !== undefined) updateData.seal = seal;
                    if (nopol !== undefined) updateData.nopol = nopol;
                    if (supir !== undefined) updateData.supir = supir;
                    if (telp !== undefined) updateData.telp = telp;
                    updateData.tgl_update = core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

                    const updatedPoDetail = await models.m_po_detail.update(updateData, {
                        where: {
                            id_mpod: id_mpod
                        }
                    });

                    if (updatedPoDetail) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success update PO Detail'
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

// Delete PO Detail
exports.deletePoDetail = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_mpod } = req.body;

            if (!id_mpod) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_mpod wajib diisi'
                    }
                };
            } else {
                const deleteData = await models.m_po_detail.destroy({
                    where: {
                        id_mpod: id_mpod
                    }
                });

                if (deleteData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'PO Detail berhasil dihapus'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 404,
                            message: 'PO Detail tidak ditemukan'
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

// Get List PO Detail
exports.getPoDetailList = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
            const { id_mpo, id_msm, no_sm } = req.query;

            const whereCondition = {};

            if (id_mpo) {
                whereCondition.id_mpo = id_mpo;
            }

            if (id_msm) {
                whereCondition.id_msm = id_msm;
            }

            if (no_sm) {
                whereCondition.no_sm = {
                    [Op.like]: `%${no_sm}%`
                };
            }

            const getData = await models.m_po_detail.findAndCountAll({
                where: whereCondition,
                order: [['id_mpod', 'DESC']],
                limit: limit,
                offset: offset
            });

            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id_mpod: item.id_mpod,
                        id_mpo: item.id_mpo,
                        id_msm: item.id_msm,
                        no_sm: item.no_sm,
                        al_bongkar: item.al_bongkar,
                        po_berdasarkan: item.po_berdasarkan,
                        hitung_berdasarkan: item.hitung_berdasarkan,
                        berat: item.berat,
                        volume: item.volume,
                        qty: item.qty,
                        exp: item.exp,
                        harga: item.harga,
                        harga_muat: item.harga_muat,
                        harga_bongkar_muat: item.harga_bongkar_muat,
                        harga_inap: item.harga_inap,
                        harga_jumlah: item.harga_jumlah,
                        kendaraan: item.kendaraan,
                        kontainer: item.kontainer,
                        seal: item.seal,
                        nopol: item.nopol,
                        supir: item.supir,
                        telp: item.telp,
                        tgl_update: item.tgl_update
                    };
                });

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data PO Detail'
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

// Get Detail PO Detail
exports.getPoDetailById = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_mpod } = req.query;

            if (!id_mpod) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id_mpod wajib diisi'
                    }
                };
            } else {
                const getData = await models.m_po_detail.findOne({
                    where: {
                        id_mpod: id_mpod
                    }
                });

                if (!getData) {
                    output = {
                        status: {
                            code: 404,
                            message: 'PO Detail tidak ditemukan'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data PO Detail'
                        },
                        data: {
                            id_mpod: getData.id_mpod,
                            id_mpo: getData.id_mpo,
                            id_msm: getData.id_msm,
                            no_sm: getData.no_sm,
                            al_bongkar: getData.al_bongkar,
                            po_berdasarkan: getData.po_berdasarkan,
                            hitung_berdasarkan: getData.hitung_berdasarkan,
                            berat: getData.berat,
                            volume: getData.volume,
                            qty: getData.qty,
                            exp: getData.exp,
                            harga: getData.harga,
                            harga_muat: getData.harga_muat,
                            harga_bongkar_muat: getData.harga_bongkar_muat,
                            harga_inap: getData.harga_inap,
                            harga_jumlah: getData.harga_jumlah,
                            kendaraan: getData.kendaraan,
                            kontainer: getData.kontainer,
                            seal: getData.seal,
                            nopol: getData.nopol,
                            supir: getData.supir,
                            telp: getData.telp,
                            tgl_update: getData.tgl_update
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
