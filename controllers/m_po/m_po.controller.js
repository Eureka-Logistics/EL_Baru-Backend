const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Helper function to generate mpo automatically
// Format: {id_bu}-PO-{YY}-{000001}
// Contoh: id_bu = 11 => 11-PO-26-000001
// - YY = 2 digit tahun berjalan
// - 000001 = running number 6 digit per BU yang reset setiap tahun berganti
async function generateMpoCode(id_bu) {
    try {
        if (!id_bu) {
            throw new Error('id_bu tidak ditemukan');
        }

        const now = new Date();
        const currentYear = now.getFullYear().toString().slice(-2); // 2 digit tahun berjalan, contoh: 2026 -> "26"

        // Cari mpo terakhir untuk BU ini
        let latestMpo = null;
        try {
            const result = await models.m_po.findOne({
                where: {
                    mpo: {
                        [Op.like]: `${id_bu}-PO-%`
                    }
                },
                order: [['id_mpo', 'DESC']]
            });

            if (result && result.mpo) {
                latestMpo = result.mpo;
            }
        } catch (queryError) {
            console.error('Error querying latest mpo:', queryError);
        }

        let nextSequence = 1;

        if (latestMpo) {
            // Bentuk nomor yang diharapkan: {id_bu}-PO-{YY}-{000001}
            // Contoh: "11-PO-26-000001" atau "21-PO-26-000001"
            // Parse dengan split untuk handle id_bu dengan panjang berbeda
            const parts = latestMpo.split('-');
            
            if (parts.length >= 4 && parts[1] === 'PO') {
                const lastYear = parts[2]; // YY
                const sequencePart = parts[3]; // 000001

                if (lastYear === currentYear) {
                    const currentSequence = parseInt(sequencePart, 10);

                    if (!isNaN(currentSequence) && currentSequence >= 0) {
                        nextSequence = currentSequence + 1;
                    }
                } else {
                    // Tahun berbeda, reset ke 1
                    nextSequence = 1;
                }
            }
        }

        // Batas maksimum 6 digit: 999999
        if (nextSequence > 999999) {
            throw new Error('Nomor urut mpo sudah mencapai batas maksimum (999999) untuk format 6 digit');
        }

        // Format sequence menjadi 6 digit dengan leading zero
        const formattedSequence = nextSequence.toString().padStart(6, '0');
        const finalMpoCode = `${id_bu}-PO-${currentYear}-${formattedSequence}`;

        return finalMpoCode;

    } catch (error) {
        console.error('Error generating mpo:', error);
        throw error;
    }
}

// Create PO
exports.createPo = async (req, res) => {
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
                mpo,
                note,
                id_mitra,
                service,
                top,
                overtonase,
                biaya_kg,
                biaya_overtonase,
                biaya_multidrop,
                biaya_muat,
                biaya_bongkar_muat,
                biaya_inap,
                biaya_lain,
                total_keseluruhan,
                tgl_kirim,
                via,
                kendaraan,
                kontainer,
                seal,
                nopol,
                supir,
                telp,
                memo,
                tgl_po,
                status,
                id_bu,
                po_details // Array of po details
            } = req.body;

            // Validasi field wajib
            if (!note || !id_mitra || !total_keseluruhan || !tgl_kirim || !kendaraan || 
                !kontainer || !seal || !nopol || !supir || !telp || !memo || !tgl_po || !id_bu) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field note, id_mitra, total_keseluruhan, tgl_kirim, kendaraan, kontainer, seal, nopol, supir, telp, memo, tgl_po, dan id_bu wajib diisi'
                    }
                };
            } else {
                // Start transaction
                transaction = await sequelize.transaction();

                // Generate mpo jika tidak dikirim
                let finalMpoCode = mpo;
                if (!finalMpoCode) {
                    finalMpoCode = await generateMpoCode(id_bu);
                }

                // Create PO
                const createData = await models.m_po.create({
                    mpo: finalMpoCode,
                    note: note,
                    id_mitra: id_mitra,
                    service: service || null,
                    top: top || '30',
                    overtonase: overtonase || 0,
                    biaya_kg: biaya_kg || 0,
                    biaya_overtonase: biaya_overtonase || 0,
                    biaya_multidrop: biaya_multidrop || 0,
                    biaya_muat: biaya_muat || 0,
                    biaya_bongkar_muat: biaya_bongkar_muat || 0,
                    biaya_inap: biaya_inap || 0,
                    biaya_lain: biaya_lain || 0,
                    total_keseluruhan: total_keseluruhan,
                    tgl_kirim: tgl_kirim,
                    via: via || '',
                    kendaraan: kendaraan,
                    kontainer: kontainer,
                    seal: seal,
                    nopol: nopol,
                    supir: supir,
                    telp: telp,
                    memo: memo,
                    tgl_po: tgl_po,
                    status: status || 'Y',
                    approved: 0,
                    app_user: 0,
                    app_date: '1970-01-01 00:00:00',
                    app_act: 0,
                    app_user_act: 0,
                    app_date_act: '1970-01-01 00:00:00',
                    tgl_update: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                    status_sendmail: 0,
                    date_sendmail: '1970-01-01 00:00:00'
                }, { transaction });

                const id_mpo = createData.id_mpo;

                // Create PO details if array is provided
                const createdDetails = [];
                if (po_details && Array.isArray(po_details) && po_details.length > 0) {
                    for (const detail of po_details) {
                        const {
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
                            kendaraan: detail_kendaraan,
                            kontainer: detail_kontainer,
                            seal: detail_seal,
                            nopol: detail_nopol,
                            supir: detail_supir,
                            telp: detail_telp
                        } = detail;

                        // Validasi field wajib untuk po detail
                        if (harga === undefined || harga_jumlah === undefined || 
                            !detail_kendaraan || !detail_kontainer || !detail_seal || 
                            !detail_nopol || !detail_supir || !detail_telp) {
                            await transaction.rollback();
                            output = {
                                status: {
                                    code: 400,
                                    message: 'Field harga, harga_jumlah, kendaraan, kontainer, seal, nopol, supir, dan telp wajib diisi untuk setiap po detail'
                                }
                            };
                            const errorsFromMiddleware = await customErrorMiddleware(req);
                            if (!errorsFromMiddleware) {
                                return res.status(output.status.code).send(output);
                            } else {
                                return res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
                            }
                        }

                        const detailData = await models.m_po_detail.create({
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
                            kendaraan: detail_kendaraan,
                            kontainer: detail_kontainer,
                            seal: detail_seal,
                            nopol: detail_nopol,
                            supir: detail_supir,
                            telp: detail_telp,
                            tgl_update: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                        }, { transaction });

                        createdDetails.push(detailData);
                    }
                }

                // Commit transaction
                await transaction.commit();

                output = {
                    status: {
                        code: 200,
                        message: 'Success create PO'
                    },
                    data: {
                        po: createData,
                        po_details: createdDetails
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

// Edit PO
exports.editPo = async (req, res) => {
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
                id_mpo,
                mpo,
                note,
                id_mitra,
                service,
                top,
                overtonase,
                biaya_kg,
                biaya_overtonase,
                biaya_multidrop,
                biaya_muat,
                biaya_bongkar_muat,
                biaya_inap,
                biaya_lain,
                total_keseluruhan,
                tgl_kirim,
                via,
                kendaraan,
                kontainer,
                seal,
                nopol,
                supir,
                telp,
                memo,
                tgl_po,
                status,
                po_details // Array of po details
            } = req.body;

            if (!id_mpo) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_mpo wajib diisi'
                    }
                };
            } else {
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
                    // Start transaction
                    transaction = await sequelize.transaction();

                    // Update PO
                    const updateData = {};
                    if (mpo !== undefined) updateData.mpo = mpo;
                    if (note !== undefined) updateData.note = note;
                    if (id_mitra !== undefined) updateData.id_mitra = id_mitra;
                    if (service !== undefined) updateData.service = service;
                    if (top !== undefined) updateData.top = top;
                    if (overtonase !== undefined) updateData.overtonase = overtonase;
                    if (biaya_kg !== undefined) updateData.biaya_kg = biaya_kg;
                    if (biaya_overtonase !== undefined) updateData.biaya_overtonase = biaya_overtonase;
                    if (biaya_multidrop !== undefined) updateData.biaya_multidrop = biaya_multidrop;
                    if (biaya_muat !== undefined) updateData.biaya_muat = biaya_muat;
                    if (biaya_bongkar_muat !== undefined) updateData.biaya_bongkar_muat = biaya_bongkar_muat;
                    if (biaya_inap !== undefined) updateData.biaya_inap = biaya_inap;
                    if (biaya_lain !== undefined) updateData.biaya_lain = biaya_lain;
                    if (total_keseluruhan !== undefined) updateData.total_keseluruhan = total_keseluruhan;
                    if (tgl_kirim !== undefined) updateData.tgl_kirim = tgl_kirim;
                    if (via !== undefined) updateData.via = via;
                    if (kendaraan !== undefined) updateData.kendaraan = kendaraan;
                    if (kontainer !== undefined) updateData.kontainer = kontainer;
                    if (seal !== undefined) updateData.seal = seal;
                    if (nopol !== undefined) updateData.nopol = nopol;
                    if (supir !== undefined) updateData.supir = supir;
                    if (telp !== undefined) updateData.telp = telp;
                    if (memo !== undefined) updateData.memo = memo;
                    if (tgl_po !== undefined) updateData.tgl_po = tgl_po;
                    if (status !== undefined) updateData.status = status;
                    updateData.tgl_update = core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

                    await models.m_po.update(updateData, {
                        where: {
                            id_mpo: id_mpo
                        },
                        transaction
                    });

                    // Handle po_details if provided (sama seperti create, bisa langsung kirim array)
                    const updatedDetails = [];
                    if (po_details && Array.isArray(po_details) && po_details.length > 0) {
                        // Get existing details untuk tracking
                        const existingDetails = await models.m_po_detail.findAll({
                            where: {
                                id_mpo: id_mpo
                            },
                            transaction
                        });

                        const existingIds = existingDetails.map(d => d.id_mpod);
                        const providedIds = po_details
                            .filter(d => d.id_mpod)
                            .map(d => d.id_mpod);

                        // Delete details that are not in the provided array
                        const idsToDelete = existingIds.filter(id => !providedIds.includes(id));
                        if (idsToDelete.length > 0) {
                            await models.m_po_detail.destroy({
                                where: {
                                    id_mpod: {
                                        [Op.in]: idsToDelete
                                    }
                                },
                                transaction
                            });
                        }

                        // Process each detail in the array (sama seperti create)
                        for (const detail of po_details) {
                            const {
                                id_mpod,
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
                                kendaraan: detail_kendaraan,
                                kontainer: detail_kontainer,
                                seal: detail_seal,
                                nopol: detail_nopol,
                                supir: detail_supir,
                                telp: detail_telp
                            } = detail;

                            // Validasi field wajib untuk po detail
                            if (harga === undefined || harga_jumlah === undefined || 
                                !detail_kendaraan || !detail_kontainer || !detail_seal || 
                                !detail_nopol || !detail_supir || !detail_telp) {
                                await transaction.rollback();
                                output = {
                                    status: {
                                        code: 400,
                                        message: 'Field harga, harga_jumlah, kendaraan, kontainer, seal, nopol, supir, dan telp wajib diisi untuk setiap po detail'
                                    }
                                };
                                const errorsFromMiddleware = await customErrorMiddleware(req);
                                if (!errorsFromMiddleware) {
                                    return res.status(output.status.code).send(output);
                                } else {
                                    return res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
                                }
                            }

                            if (id_mpod) {
                                // Update existing detail
                                const detailUpdateData = {
                                    id_msm: id_msm !== undefined ? id_msm : 0,
                                    no_sm: no_sm !== undefined ? no_sm : null,
                                    al_bongkar: al_bongkar !== undefined ? al_bongkar : 0,
                                    po_berdasarkan: po_berdasarkan || 'koli',
                                    hitung_berdasarkan: hitung_berdasarkan || 'koli',
                                    berat: berat !== undefined ? berat : 0,
                                    volume: volume !== undefined ? volume : 0.000,
                                    qty: qty !== undefined ? qty : 0,
                                    exp: exp !== undefined ? exp : 0,
                                    harga: harga,
                                    harga_muat: harga_muat !== undefined ? harga_muat : 0,
                                    harga_bongkar_muat: harga_bongkar_muat !== undefined ? harga_bongkar_muat : 0,
                                    harga_inap: harga_inap !== undefined ? harga_inap : 0,
                                    harga_jumlah: harga_jumlah,
                                    kendaraan: detail_kendaraan,
                                    kontainer: detail_kontainer,
                                    seal: detail_seal,
                                    nopol: detail_nopol,
                                    supir: detail_supir,
                                    telp: detail_telp,
                                    tgl_update: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                                };

                                await models.m_po_detail.update(detailUpdateData, {
                                    where: {
                                        id_mpod: id_mpod
                                    },
                                    transaction
                                });

                                const updatedDetail = await models.m_po_detail.findOne({
                                    where: {
                                        id_mpod: id_mpod
                                    },
                                    transaction
                                });

                                updatedDetails.push(updatedDetail);
                            } else {
                                // Create new detail (sama seperti create)
                                const newDetail = await models.m_po_detail.create({
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
                                    kendaraan: detail_kendaraan,
                                    kontainer: detail_kontainer,
                                    seal: detail_seal,
                                    nopol: detail_nopol,
                                    supir: detail_supir,
                                    telp: detail_telp,
                                    tgl_update: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                                }, { transaction });

                                updatedDetails.push(newDetail);
                            }
                        }
                    }

                    // Commit transaction
                    await transaction.commit();

                    // Get updated PO with details
                    if (!models.m_po.associations.po_details) {
                        models.m_po.hasMany(models.m_po_detail, { 
                            foreignKey: 'id_mpo', 
                            sourceKey: 'id_mpo',
                            as: 'po_details'
                        });
                    }

                    const updatedPo = await models.m_po.findOne({
                        where: {
                            id_mpo: id_mpo
                        },
                        include: [
                            {
                                model: models.m_po_detail,
                                as: 'po_details',
                                required: false
                            }
                        ]
                    });

                    output = {
                        status: {
                            code: 200,
                            message: 'Success update PO'
                        },
                        data: updatedPo
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

// Delete PO
exports.deletePo = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_mpo } = req.body;

            if (!id_mpo) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_mpo wajib diisi'
                    }
                };
            } else {
                const deleteData = await models.m_po.destroy({
                    where: {
                        id_mpo: id_mpo
                    }
                });

                if (deleteData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'PO berhasil dihapus'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 404,
                            message: 'PO tidak ditemukan'
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

// Get List PO
exports.getPoList = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
            const { id_mitra, status, keyword } = req.query;

            const whereCondition = {};

            if (id_mitra) {
                whereCondition.id_mitra = id_mitra;
            }

            if (status) {
                whereCondition.status = status;
            }

            if (keyword) {
                whereCondition[Op.or] = [
                    {
                        mpo: {
                            [Op.like]: `%${keyword}%`
                        }
                    },
                    {
                        note: {
                            [Op.like]: `%${keyword}%`
                        }
                    }
                ];
            }

            const getData = await models.m_po.findAndCountAll({
                where: whereCondition,
                order: [['id_mpo', 'DESC']],
                limit: limit,
                offset: offset
            });

            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id_mpo: item.id_mpo,
                        mpo: item.mpo,
                        note: item.note,
                        id_mitra: item.id_mitra,
                        service: item.service,
                        top: item.top,
                        overtonase: item.overtonase,
                        biaya_kg: item.biaya_kg,
                        biaya_overtonase: item.biaya_overtonase,
                        biaya_multidrop: item.biaya_multidrop,
                        biaya_muat: item.biaya_muat,
                        biaya_bongkar_muat: item.biaya_bongkar_muat,
                        biaya_inap: item.biaya_inap,
                        biaya_lain: item.biaya_lain,
                        total_keseluruhan: item.total_keseluruhan,
                        tgl_kirim: item.tgl_kirim,
                        via: item.via,
                        kendaraan: item.kendaraan,
                        kontainer: item.kontainer,
                        seal: item.seal,
                        nopol: item.nopol,
                        supir: item.supir,
                        telp: item.telp,
                        memo: item.memo,
                        tgl_po: item.tgl_po,
                        status: item.status,
                        approved: item.approved,
                        app_user: item.app_user,
                        app_date: item.app_date,
                        app_act: item.app_act,
                        app_user_act: item.app_user_act,
                        app_date_act: item.app_date_act,
                        tgl_update: item.tgl_update,
                        status_sendmail: item.status_sendmail,
                        date_sendmail: item.date_sendmail
                    };
                });

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data PO'
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

// Get Detail PO
exports.getPoDetail = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_mpo } = req.query;

            if (!id_mpo) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id_mpo wajib diisi'
                    }
                };
            } else {
                if (!models.m_po.associations.po_details) {
                    models.m_po.hasMany(models.m_po_detail, { 
                        foreignKey: 'id_mpo', 
                        sourceKey: 'id_mpo',
                        as: 'po_details'
                    });
                }

                const getData = await models.m_po.findOne({
                    where: {
                        id_mpo: id_mpo
                    },
                    include: [
                        {
                            model: models.m_po_detail,
                            as: 'po_details',
                            required: false
                        }
                    ]
                });

                if (!getData) {
                    output = {
                        status: {
                            code: 404,
                            message: 'PO tidak ditemukan'
                        }
                    };
                } else {
                    // Return semua data PO beserta detail-nya langsung
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data PO'
                        },
                        data: getData
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
