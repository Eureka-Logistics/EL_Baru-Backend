const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Helper function to generate kode_uang_jalan automatically
// Format: {id_bu}-UJ-{YY}-{000001}
// Contoh: id_bu = 21 => 21-UJ-26-000001
//         id_bu = 11 => 11-UJ-26-000001
// - YY = 2 digit tahun berjalan
// - 000001 = running number 6 digit per BU yang reset setiap tahun berganti
async function generateKodeUangJalan(id_bu) {
    try {
        if (!id_bu) {
            throw new Error('id_bu tidak ditemukan');
        }

        const now = new Date();
        const currentYear = now.getFullYear().toString().slice(-2); // 2 digit tahun berjalan, contoh: 2026 -> "26"

        // Cari kode_uang_jalan terakhir untuk BU ini dengan tahun yang sama
        // Format yang dicari: {id_bu}-UJ-{currentYear}-%
        let latestUangJalan = null;
        try {
            const result = await models.uang_jalan_new.findOne({
                where: {
                    kode_uang_jalan: {
                        [Op.like]: `${id_bu}-UJ-${currentYear}-%`
                    },
                    is_deleted: 0
                },
                order: [['id_uang_jalan_race', 'DESC']]
            });

            if (result && result.kode_uang_jalan) {
                latestUangJalan = result.kode_uang_jalan;
            }
        } catch (queryError) {
            console.error('Error querying latest uang_jalan_new:', queryError);
        }

        let nextSequence = 1;

        if (latestUangJalan) {
            // Bentuk nomor yang diharapkan: {id_bu}-UJ-{YY}-{000001}
            // Contoh: "21-UJ-26-000001" atau "11-UJ-26-000001"
            // Split berdasarkan pattern untuk mendapatkan bagian-bagiannya
            const parts = latestUangJalan.split('-');
            
            // Format: [id_bu, 'UJ', YY, sequence]
            // Contoh: ["21", "UJ", "26", "000001"]
            if (parts.length >= 4 && parts[1] === 'UJ') {
                const lastIdBu = parts[0];
                const lastYear = parts[2];
                const sequencePart = parts[3];

                // Pastikan id_bu sama dengan yang diminta dan tahun sama
                if (lastIdBu === id_bu.toString() && lastYear === currentYear) {
                    const currentSequence = parseInt(sequencePart, 10);

                    if (!isNaN(currentSequence) && currentSequence >= 0) {
                        nextSequence = currentSequence + 1;
                    }
                } else {
                    // id_bu berbeda atau tahun berbeda, mulai dari 1
                    nextSequence = 1;
                }
            }
        }

        // Batas maksimum 6 digit: 999999
        if (nextSequence > 999999) {
            throw new Error('Nomor urut uang jalan sudah mencapai batas maksimum (999999) untuk format 6 digit');
        }

        // Format sequence menjadi 6 digit dengan leading zero
        const formattedSequence = nextSequence.toString().padStart(6, '0');
        const finalKodeUangJalan = `${id_bu}-UJ-${currentYear}-${formattedSequence}`;

        return finalKodeUangJalan;

    } catch (error) {
        console.error('Error generating kode_uang_jalan:', error);
        throw error;
    }
}

// Get List Uang Jalan New
exports.getUangJalanNewList = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
            const { id_bu, id_customer, id_msm, keyword } = req.query;

            const whereCondition = {
                is_deleted: 0
            };

            if (id_bu) {
                whereCondition.id_bu = id_bu;
            }

            if (id_customer) {
                whereCondition.id_customer = id_customer;
            }

            if (id_msm) {
                whereCondition.id_msm = id_msm;
            }

            if (keyword) {
                whereCondition[Op.or] = [
                    {
                        kode_uang_jalan: {
                            [Op.like]: `%${keyword}%`
                        }
                    },
                    {
                        driver_name: {
                            [Op.like]: `%${keyword}%`
                        }
                    },
                    {
                        nopol_unit: {
                            [Op.like]: `%${keyword}%`
                        }
                    },
                    {
                        nama_perusahaan: {
                            [Op.like]: `%${keyword}%`
                        }
                    }
                ];
            }

            const getData = await models.uang_jalan_new.findAndCountAll({
                where: whereCondition,
                order: [['id_uang_jalan_race', 'DESC']],
                limit: limit,
                offset: offset
            });

            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0;
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id_uang_jalan_race: item.id_uang_jalan_race,
                        kode_uang_jalan: item.kode_uang_jalan,
                        id_driver: item.id_driver,
                        driver_name: item.driver_name,
                        id_unit: item.id_unit,
                        nopol_unit: item.nopol_unit,
                        jenis_kendaraan: item.jenis_kendaraan,
                        id_helper: item.id_helper,
                        helper_name: item.helper_name,
                        bank_rek: item.bank_rek,
                        rek_driver: item.rek_driver,
                        bbm: item.bbm,
                        makan: item.makan,
                        parkir: item.parkir,
                        tol: item.tol,
                        tkbm: item.tkbm,
                        penyeberangan: item.penyeberangan,
                        overtonase: item.overtonase,
                        timbangan: item.timbangan,
                        pass_bandara: item.pass_bandara,
                        karantina: item.karantina,
                        kawalan: item.kawalan,
                        jenis_bbm: item.jenis_bbm,
                        bbm_liter: item.bbm_liter,
                        kota_muat: item.kota_muat,
                        kota_bongkar: item.kota_bongkar,
                        distance: item.distance,
                        jenis_uj: item.jenis_uj,
                        amount: item.amount,
                        total_semua: item.total_semua,
                        id_customer: item.id_customer,
                        nama_perusahaan: item.nama_perusahaan,
                        id_msm: item.id_msm,
                        msm: item.msm,
                        tgl_muat: item.tgl_muat,
                        id_bu: item.id_bu,
                        id_bu_brench: item.id_bu_brench,
                        id_admin: item.id_admin,
                        is_sending: item.is_sending,
                        notes: item.notes,
                        remark: item.remark,
                        created_at: item.created_at,
                        transfer_at: item.transfer_at,
                        updated_at: item.updated_at
                    };
                });

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data Uang Jalan New'
                    },
                    data: {
                        totalData: getData.count,
                        totalPage: Math.ceil(getData.count / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        list: result
                    }
                };
            } else {
                output = {
                    status: {
                        code: 404,
                        message: 'Data tidak ditemukan'
                    }
                };
            }
        } else {
            output = {
                status: {
                    code: 401,
                    message: 'Unauthorized'
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

// Get Detail Uang Jalan New
exports.getUangJalanNewDetail = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const { id_uang_jalan_race } = req.query;

            if (!id_uang_jalan_race) {
                output = {
                    status: {
                        code: 400,
                        message: 'Parameter id_uang_jalan_race wajib diisi'
                    }
                };
            } else {
                const getData = await models.uang_jalan_new.findOne({
                    where: {
                        id_uang_jalan_race: id_uang_jalan_race,
                        is_deleted: 0
                    }
                });

                if (!getData) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Data Uang Jalan New tidak ditemukan'
                        }
                    };
                } else {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get Data Uang Jalan New Detail'
                        },
                        data: {
                            id_uang_jalan_race: getData.id_uang_jalan_race,
                            kode_uang_jalan: getData.kode_uang_jalan,
                            id_driver: getData.id_driver,
                            driver_name: getData.driver_name,
                            id_unit: getData.id_unit,
                            nopol_unit: getData.nopol_unit,
                            jenis_kendaraan: getData.jenis_kendaraan,
                            id_helper: getData.id_helper,
                            helper_name: getData.helper_name,
                            bank_rek: getData.bank_rek,
                            rek_driver: getData.rek_driver,
                            bbm: getData.bbm,
                            makan: getData.makan,
                            parkir: getData.parkir,
                            tol: getData.tol,
                            tkbm: getData.tkbm,
                            penyeberangan: getData.penyeberangan,
                            overtonase: getData.overtonase,
                            timbangan: getData.timbangan,
                            pass_bandara: getData.pass_bandara,
                            karantina: getData.karantina,
                            kawalan: getData.kawalan,
                            jenis_bbm: getData.jenis_bbm,
                            bbm_liter: getData.bbm_liter,
                            kota_muat: getData.kota_muat,
                            kota_bongkar: getData.kota_bongkar,
                            distance: getData.distance,
                            jenis_uj: getData.jenis_uj,
                            amount: getData.amount,
                            total_semua: getData.total_semua,
                            id_customer: getData.id_customer,
                            nama_perusahaan: getData.nama_perusahaan,
                            id_msm: getData.id_msm,
                            msm: getData.msm,
                            tgl_muat: getData.tgl_muat,
                            id_bu: getData.id_bu,
                            id_bu_brench: getData.id_bu_brench,
                            id_admin: getData.id_admin,
                            is_sending: getData.is_sending,
                            notes: getData.notes,
                            remark: getData.remark,
                            created_at: getData.created_at,
                            transfer_at: getData.transfer_at,
                            updated_at: getData.updated_at
                        }
                    };
                }
            }
        } else {
            output = {
                status: {
                    code: 401,
                    message: 'Unauthorized'
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

// Create Uang Jalan New
exports.createUangJalanNew = async (req, res) => {
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
                kode_uang_jalan,
                id_driver,
                driver_name,
                id_unit,
                nopol_unit,
                jenis_kendaraan,
                id_helper,
                helper_name,
                bank_rek,
                rek_driver,
                bbm,
                makan,
                parkir,
                tol,
                tkbm,
                penyeberangan,
                overtonase,
                timbangan,
                pass_bandara,
                karantina,
                kawalan,
                jenis_bbm,
                bbm_liter,
                kota_muat,
                kota_bongkar,
                distance,
                jenis_uj,
                amount,
                total_semua,
                id_customer,
                nama_perusahaan,
                id_msm,
                msm,
                tgl_muat,
                id_bu,
                id_bu_brench,
                id_admin,
                is_sending,
                notes,
                remark
            } = req.body;

            // Validasi field wajib
            if (!bbm || !makan || !parkir || !tol || tkbm === undefined || penyeberangan === undefined || 
                overtonase === undefined || timbangan === undefined || pass_bandara === undefined || 
                karantina === undefined || kawalan === undefined || !amount || 
                !id_customer || !id_msm || !id_bu_brench || !id_admin) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field bbm, makan, parkir, tol, tkbm, penyeberangan, overtonase, timbangan, pass_bandara, karantina, kawalan, amount, id_customer, id_msm, id_bu_brench, dan id_admin wajib diisi'
                    }
                };
            } else {
                // Start transaction
                transaction = await sequelize.transaction();

                // Generate kode_uang_jalan OTOMATIS jika tidak dikirim
                // Format: {id_bu}-UJ-{YY}-{000001}
                // Contoh: id_bu=21 => 21-UJ-26-000001, id_bu=11 => 11-UJ-26-000001
                let finalKodeUangJalan = kode_uang_jalan;
                if (!finalKodeUangJalan) {
                    // Pastikan id_bu ada untuk generate kode
                    const finalIdBu = id_bu || 11;
                    console.log(`[CREATE UANG JALAN] Auto-generating kode_uang_jalan for id_bu: ${finalIdBu}`);
                    finalKodeUangJalan = await generateKodeUangJalan(finalIdBu);
                    console.log(`[CREATE UANG JALAN] Generated kode: ${finalKodeUangJalan}`);
                }

                // Create uang_jalan_new
                const createData = await models.uang_jalan_new.create({
                    kode_uang_jalan: finalKodeUangJalan,
                    id_driver: id_driver || null,
                    driver_name: driver_name || null,
                    id_unit: id_unit || null,
                    nopol_unit: nopol_unit || null,
                    jenis_kendaraan: jenis_kendaraan || null,
                    id_helper: id_helper || null,
                    helper_name: helper_name || null,
                    bank_rek: bank_rek || null,
                    rek_driver: rek_driver || null,
                    bbm: bbm,
                    makan: makan,
                    parkir: parkir,
                    tol: tol,
                    tkbm: tkbm || 0,
                    penyeberangan: penyeberangan || 0,
                    overtonase: overtonase || 0,
                    timbangan: timbangan || 0,
                    pass_bandara: pass_bandara || 0,
                    karantina: karantina || 0,
                    kawalan: kawalan || 0,
                    jenis_bbm: jenis_bbm || null,
                    bbm_liter: bbm_liter || null,
                    kota_muat: kota_muat || null,
                    kota_bongkar: kota_bongkar || null,
                    distance: distance || null,
                    jenis_uj: jenis_uj || 'Uang jalan Pokok',
                    amount: amount,
                    total_semua: total_semua || 0,
                    id_customer: id_customer,
                    nama_perusahaan: nama_perusahaan || null,
                    id_msm: id_msm,
                    msm: msm || null,
                    tgl_muat: tgl_muat || null,
                    id_bu: id_bu || 11,
                    id_bu_brench: id_bu_brench,
                    id_admin: id_admin,
                    is_sending: is_sending !== undefined ? is_sending : 0,
                    notes: notes || null,
                    remark: remark || null,
                    is_deleted: 0
                }, { transaction });

                // Commit transaction
                await transaction.commit();

                output = {
                    status: {
                        code: 200,
                        message: 'Success create Uang Jalan New'
                    },
                    data: createData
                };
            }
        } else {
            output = {
                status: {
                    code: 401,
                    message: 'Unauthorized'
                }
            };
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

// Edit/Update Uang Jalan New
exports.editUangJalanNew = async (req, res) => {
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
                id_uang_jalan_race,
                kode_uang_jalan,
                id_driver,
                driver_name,
                id_unit,
                nopol_unit,
                jenis_kendaraan,
                id_helper,
                helper_name,
                bank_rek,
                rek_driver,
                bbm,
                makan,
                parkir,
                tol,
                tkbm,
                penyeberangan,
                overtonase,
                timbangan,
                pass_bandara,
                karantina,
                kawalan,
                jenis_bbm,
                bbm_liter,
                kota_muat,
                kota_bongkar,
                distance,
                jenis_uj,
                amount,
                total_semua,
                id_customer,
                nama_perusahaan,
                id_msm,
                msm,
                tgl_muat,
                id_bu,
                id_bu_brench,
                id_admin,
                is_sending,
                notes,
                remark,
                transfer_at
            } = req.body;

            if (!id_uang_jalan_race) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_uang_jalan_race wajib diisi'
                    }
                };
            } else {
                const getData = await models.uang_jalan_new.findOne({
                    where: {
                        id_uang_jalan_race: id_uang_jalan_race,
                        is_deleted: 0
                    }
                });

                if (!getData) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Data Uang Jalan New tidak ditemukan'
                        }
                    };
                } else {
                    // Start transaction
                    transaction = await sequelize.transaction();

                    // Build update data object (only update fields that are provided)
                    const updateData = {};
                    if (kode_uang_jalan !== undefined) updateData.kode_uang_jalan = kode_uang_jalan;
                    if (id_driver !== undefined) updateData.id_driver = id_driver;
                    if (driver_name !== undefined) updateData.driver_name = driver_name;
                    if (id_unit !== undefined) updateData.id_unit = id_unit;
                    if (nopol_unit !== undefined) updateData.nopol_unit = nopol_unit;
                    if (jenis_kendaraan !== undefined) updateData.jenis_kendaraan = jenis_kendaraan;
                    if (id_helper !== undefined) updateData.id_helper = id_helper;
                    if (helper_name !== undefined) updateData.helper_name = helper_name;
                    if (bank_rek !== undefined) updateData.bank_rek = bank_rek;
                    if (rek_driver !== undefined) updateData.rek_driver = rek_driver;
                    if (bbm !== undefined) updateData.bbm = bbm;
                    if (makan !== undefined) updateData.makan = makan;
                    if (parkir !== undefined) updateData.parkir = parkir;
                    if (tol !== undefined) updateData.tol = tol;
                    if (tkbm !== undefined) updateData.tkbm = tkbm;
                    if (penyeberangan !== undefined) updateData.penyeberangan = penyeberangan;
                    if (overtonase !== undefined) updateData.overtonase = overtonase;
                    if (timbangan !== undefined) updateData.timbangan = timbangan;
                    if (pass_bandara !== undefined) updateData.pass_bandara = pass_bandara;
                    if (karantina !== undefined) updateData.karantina = karantina;
                    if (kawalan !== undefined) updateData.kawalan = kawalan;
                    if (jenis_bbm !== undefined) updateData.jenis_bbm = jenis_bbm;
                    if (bbm_liter !== undefined) updateData.bbm_liter = bbm_liter;
                    if (kota_muat !== undefined) updateData.kota_muat = kota_muat;
                    if (kota_bongkar !== undefined) updateData.kota_bongkar = kota_bongkar;
                    if (distance !== undefined) updateData.distance = distance;
                    if (jenis_uj !== undefined) updateData.jenis_uj = jenis_uj;
                    if (amount !== undefined) updateData.amount = amount;
                    if (total_semua !== undefined) updateData.total_semua = total_semua;
                    if (id_customer !== undefined) updateData.id_customer = id_customer;
                    if (nama_perusahaan !== undefined) updateData.nama_perusahaan = nama_perusahaan;
                    if (id_msm !== undefined) updateData.id_msm = id_msm;
                    if (msm !== undefined) updateData.msm = msm;
                    if (tgl_muat !== undefined) updateData.tgl_muat = tgl_muat;
                    if (id_bu !== undefined) updateData.id_bu = id_bu;
                    if (id_bu_brench !== undefined) updateData.id_bu_brench = id_bu_brench;
                    if (id_admin !== undefined) updateData.id_admin = id_admin;
                    if (is_sending !== undefined) updateData.is_sending = is_sending;
                    if (notes !== undefined) updateData.notes = notes;
                    if (remark !== undefined) updateData.remark = remark;
                    if (transfer_at !== undefined) updateData.transfer_at = transfer_at;
                    
                    // Always update updated_at
                    updateData.updated_at = new Date();

                    await models.uang_jalan_new.update(updateData, {
                        where: {
                            id_uang_jalan_race: id_uang_jalan_race
                        },
                        transaction
                    });

                    // Commit transaction
                    await transaction.commit();

                    // Get updated data
                    const updatedData = await models.uang_jalan_new.findOne({
                        where: {
                            id_uang_jalan_race: id_uang_jalan_race
                        }
                    });

                    output = {
                        status: {
                            code: 200,
                            message: 'Success update Uang Jalan New'
                        },
                        data: updatedData
                    };
                }
            }
        } else {
            output = {
                status: {
                    code: 401,
                    message: 'Unauthorized'
                }
            };
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

// Export the helper function for use in other controllers if needed
exports.generateKodeUangJalan = generateKodeUangJalan;
