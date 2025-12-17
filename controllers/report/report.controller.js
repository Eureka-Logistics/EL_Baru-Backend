const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where } = require('sequelize');
const ExcelJS = require('exceljs');
const moment = require('moment');


exports.getReportSales = async (req, res) => {
    try {

        models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });

        // models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getReport = await models.m_pengadaan.findAndCountAll(
                {
                    order: [['id_mp', 'desc']],
                    limit: limit,
                    offset: offset,

                    include: [
                        {
                            model: models.m_pengadaan_detail,
                            required: true
                            // required:true,
                            // group: ['msp'],

                        },
                        {
                            model: models.users,

                            // ...req.query.filter ? {
                            //     where: {
                            //         divisi: "sales",
                            //         [Op.or]: [
                            //             {

                            //                 kode_cabang: {
                            //                     [Op.like]: `%${req.query.filter}%`
                            //                 },

                            //             },

                            //         ]
                            //     }
                            // } : {}
                        }
                    ]
                }
            )
            if (getReport.rows) {
                let no = (getReport.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getReport.rows.map((item) => {
                    const getPrice = getReport.rows.map((item) => item.m_pengadaan_details.map((i) => { return i.harga }))

                    // console.log("🚀 ~ file: report.controller.js:65 ~ result ~ getPrice:", getPrice)

                    return {
                        no: no++,
                        idmp: item.id_mp,
                        SpNumber: item.msp,
                        salesName: item.user.nama_lengkap,
                        totalPrice: core.sumArray(item.m_pengadaan_details.map((i) => { return i.harga }))








                    }
                })

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {

                        totalData: getReport.count,
                        totalPage: Math.ceil(getReport.count / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        order: result


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
        }
    }

    const errorsFromMiddleware = await customErrorMiddleware(req)

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output)
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
    }
}

exports.getBelumKembali = async (req, res) => {
    try {
        const { opspurch, year, id_bu } = req.query;
        const sequelize = core.dbConnect();
        
        // Default tahun ke tahun saat ini jika tidak ada parameter
        const currentYear = year || new Date().getFullYear();
        const buId = id_bu || '11'; // Default id_bu ke '11' jika tidak ada parameter

        let sql = `SELECT 
            f.name_bu_brench,
            a.id_bu_brench,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 1 THEN 1 ELSE 0 END) AS qty_januari,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 1 THEN b.total END), 0) AS val_januari,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 2 THEN 1 ELSE 0 END) AS qty_februari,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 2 THEN b.total END), 0) AS val_februari,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 3 THEN 1 ELSE 0 END) AS qty_maret,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 3 THEN b.total END), 0) AS val_maret,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 4 THEN 1 ELSE 0 END) AS qty_april,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 4 THEN b.total END), 0) AS val_april,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 5 THEN 1 ELSE 0 END) AS qty_mei,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 5 THEN b.total END), 0) AS val_mei,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 6 THEN 1 ELSE 0 END) AS qty_juni,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 6 THEN b.total END), 0) AS val_juni,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 7 THEN 1 ELSE 0 END) AS qty_juli,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 7 THEN b.total END), 0) AS val_juli,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 8 THEN 1 ELSE 0 END) AS qty_agustus,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 8 THEN b.total END), 0) AS val_agustus,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 9 THEN 1 ELSE 0 END) AS qty_september,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 9 THEN b.total END), 0) AS val_september,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 10 THEN 1 ELSE 0 END) AS qty_oktober,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 10 THEN b.total END), 0) AS val_oktober,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 11 THEN 1 ELSE 0 END) AS qty_november,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 11 THEN b.total END), 0) AS val_november,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 12 THEN 1 ELSE 0 END) AS qty_desember,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 12 THEN b.total END), 0) AS val_desember
        FROM 
            m_sm a
            INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
            INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
            INNER JOIN m_status_order d ON d.id_mp = c.id_mp
            INNER JOIN m_bu_brench f ON f.id_bu_brench = a.id_bu_brench
            LEFT JOIN m_sm_receive e ON e.id_msm = a.id_msm
        WHERE d.kendaraan_purchasing = 'Y'`;

        // Filter opspurch
        if (opspurch) {
            if (opspurch === 'sendiri') {
                sql += " AND d.kendaraan_operasional = 'Y'";
            } else {
                sql += " AND d.kendaraan_operasional = 'N'";
            }
        }

        sql += ` AND c.status != 0 
            AND YEAR(a.tgl_muat) = ?
            AND e.id_sm_receive IS NULL 
            AND a.id_bu = ?
        GROUP BY 
            a.id_bu_brench, f.name_bu_brench  
        ORDER BY a.id_bu_brench ASC`;

        const results = await sequelize.query(sql, {
            replacements: [currentYear, buId],
            type: Sequelize.QueryTypes.SELECT
        });

        // Mapping bulan untuk menghitung total
        const bulanMapping = [
            'qty_januari', 'qty_februari', 'qty_maret', 'qty_april',
            'qty_mei', 'qty_juni', 'qty_juli', 'qty_agustus',
            'qty_september', 'qty_oktober', 'qty_november', 'qty_desember'
        ];

        const valMapping = [
            'val_januari', 'val_februari', 'val_maret', 'val_april',
            'val_mei', 'val_juni', 'val_juli', 'val_agustus',
            'val_september', 'val_oktober', 'val_november', 'val_desember'
        ];

        // Menambahkan total qty dan total val
        const data = (results || []).map(item => {
            const newItem = { ...item };
            
            // Hitung tot_qty (total semua qty)
            let totQty = 0;
            bulanMapping.forEach(qtyField => {
                totQty += parseFloat(newItem[qtyField] || 0);
            });
            newItem.tot_qty = totQty;
            
            // Hitung tot_val (total semua val)
            let totVal = 0;
            valMapping.forEach(valField => {
                totVal += parseFloat(newItem[valField] || 0);
            });
            newItem.tot_val = totVal;
            
            return newItem;
        });

        // Hitung total keseluruhan dari semua data
        let totalQtyKeseluruhan = 0;
        let totalValKeseluruhan = 0;
        
        data.forEach(item => {
            totalQtyKeseluruhan += parseFloat(item.tot_qty || 0);
            totalValKeseluruhan += parseFloat(item.tot_val || 0);
        });

        output = {
            status: {
                code: 200,
                message: 'Success get Data Belum Kembali'
            },
            data: data,
            total: {
                total_qty: totalQtyKeseluruhan,
                total_val: totalValKeseluruhan
            }
        };

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
}

exports.getInvoiceHarian = async (req, res) => {
    try {
        const sequelize = core.dbConnect();
        
        // Hitung tanggal range untuk optimasi index (mengganti DATE() function)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sixDaysAgo = new Date(today);
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
        
        const todayStart = today.toISOString().slice(0, 19).replace('T', ' ');
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        const todayEndStr = todayEnd.toISOString().slice(0, 19).replace('T', ' ');
        const sixDaysAgoStr = sixDaysAgo.toISOString().slice(0, 19).replace('T', ' ');

        // Query utama untuk data invoice harian - menggunakan range comparison untuk index
        let sql = `SELECT 
            b.id_bu,
            b.nama_lengkap,
            COUNT(CASE WHEN DATE(a.tgl_create) = CURDATE() THEN 1 END) AS qty_hari_ini,
            IFNULL(SUM(CASE WHEN DATE(a.tgl_create) = CURDATE() THEN a.total_penjualan END), 0) AS nilai_hari_ini,
            COUNT(CASE WHEN DATE(a.tgl_create) = CURDATE() - INTERVAL 1 DAY THEN 1 END) AS qty_h1,
            IFNULL(SUM(CASE WHEN DATE(a.tgl_create) = CURDATE() - INTERVAL 1 DAY THEN a.total_penjualan END), 0) AS nilai_h1,
            COUNT(CASE WHEN DATE(a.tgl_create) = CURDATE() - INTERVAL 2 DAY THEN 1 END) AS qty_h2,
            IFNULL(SUM(CASE WHEN DATE(a.tgl_create) = CURDATE() - INTERVAL 2 DAY THEN a.total_penjualan END), 0) AS nilai_h2,
            COUNT(CASE WHEN DATE(a.tgl_create) = CURDATE() - INTERVAL 3 DAY THEN 1 END) AS qty_h3,
            IFNULL(SUM(CASE WHEN DATE(a.tgl_create) = CURDATE() - INTERVAL 3 DAY THEN a.total_penjualan END), 0) AS nilai_h3,
            COUNT(CASE WHEN DATE(a.tgl_create) = CURDATE() - INTERVAL 4 DAY THEN 1 END) AS qty_h4,
            IFNULL(SUM(CASE WHEN DATE(a.tgl_create) = CURDATE() - INTERVAL 4 DAY THEN a.total_penjualan END), 0) AS nilai_h4,
            COUNT(CASE WHEN DATE(a.tgl_create) = CURDATE() - INTERVAL 5 DAY THEN 1 END) AS qty_h5,
            IFNULL(SUM(CASE WHEN DATE(a.tgl_create) = CURDATE() - INTERVAL 5 DAY THEN a.total_penjualan END), 0) AS nilai_h5,
            COUNT(CASE WHEN DATE(a.tgl_create) = CURDATE() - INTERVAL 6 DAY THEN 1 END) AS qty_h6,
            IFNULL(SUM(CASE WHEN DATE(a.tgl_create) = CURDATE() - INTERVAL 6 DAY THEN a.total_penjualan END), 0) AS nilai_h6
        FROM m_ar a
        INNER JOIN users b ON b.id = a.id_admin
        WHERE a.tgl_create >= ? AND a.tgl_create <= ?
        GROUP BY b.id_bu, b.nama_lengkap  
        ORDER BY b.id_bu ASC`;

        // Query untuk data Belum terinvoice - dipisah per id_bu untuk optimasi
        let sqlBelumInvoiceEL = `SELECT 
            a.id_bu, 
            YEAR(a.tgl_muat) AS tahun, 
            COUNT(DISTINCT a.id_msm) AS jml, 
            SUM(d.total) AS jumlah
        FROM m_sm a
        INNER JOIN m_sm_receive b ON b.id_msm = a.id_msm 
            AND b.divisi = 'ar' 
            AND b.status = 'receive'
        INNER JOIN m_pengadaan_detail d ON d.id_mpd = a.id_mpd
        INNER JOIN m_pengadaan e ON e.id_mp = d.id_mp AND e.status != 0
        INNER JOIN m_status_order f ON f.id_mp = e.id_mp AND f.kendaraan_purchasing = 'Y'
        WHERE a.id_bu = '11'
            AND a.msm != '' 
            AND a.msm IS NOT NULL
            AND a.tgl_muat >= '2024-01-01'
            AND NOT EXISTS (
                SELECT 1 FROM m_ar_detail c 
                WHERE c.id_msm = a.id_msm
            )
        GROUP BY a.id_bu, YEAR(a.tgl_muat)`;

        let sqlBelumInvoiceRACE = `SELECT 
            a.id_bu, 
            YEAR(a.tgl_muat) AS tahun, 
            COUNT(DISTINCT a.id_msm) AS jml, 
            SUM(d.total) AS jumlah
        FROM m_sm a
        INNER JOIN m_sm_receive b ON b.id_msm = a.id_msm 
            AND b.divisi = 'operasional' 
            AND b.diserahkan IS NOT NULL
        INNER JOIN m_pengadaan_detail d ON d.id_mpd = a.id_mpd
        INNER JOIN m_pengadaan e ON e.id_mp = d.id_mp AND e.status != 0
        INNER JOIN m_status_order f ON f.id_mp = e.id_mp AND f.kendaraan_purchasing = 'Y'
        WHERE a.id_bu = '21'
            AND a.msm != '' 
            AND a.msm IS NOT NULL
            AND a.tgl_muat >= '2024-01-01'
            AND NOT EXISTS (
                SELECT 1 FROM m_ar_detail c 
                WHERE c.id_msm = a.id_msm
            )
        GROUP BY a.id_bu, YEAR(a.tgl_muat)`;

        // Jalankan semua query secara parallel
        const [results, belumInvoiceEL, belumInvoiceRACE] = await Promise.all([
            sequelize.query(sql, { 
                replacements: [sixDaysAgoStr, todayEndStr],
                type: Sequelize.QueryTypes.SELECT 
            }),
            sequelize.query(sqlBelumInvoiceEL, {
                type: Sequelize.QueryTypes.SELECT
            }),
            sequelize.query(sqlBelumInvoiceRACE, {
                type: Sequelize.QueryTypes.SELECT
            })
        ]);

        // Gabungkan hasil belum invoice dan urutkan
        const belumInvoice = [...(belumInvoiceEL || []), ...(belumInvoiceRACE || [])]
            .sort((a, b) => {
                if (a.id_bu !== b.id_bu) return a.id_bu - b.id_bu;
                return a.tahun - b.tahun;
            });

        const data = results || [];
        
        // Hitung total invoice EL dan RACE hari ini dari data results (konsisten dengan query utama)
        let totalQtyEL = 0;
        let totalNilaiEL = 0;
        let totalQtyRACE = 0;
        let totalNilaiRACE = 0;
        
        data.forEach(item => {
            const qty = parseInt(item.qty_hari_ini || 0);
            const nilai = parseInt(item.nilai_hari_ini || 0);
            
            // id_bu bisa string atau number, handle kedua case
            const idBu = item.id_bu;
            if (idBu === '11' || idBu === 11) {
                totalQtyEL += qty;
                totalNilaiEL += nilai;
            } else if (idBu === '21' || idBu === 21) {
                totalQtyRACE += qty;
                totalNilaiRACE += nilai;
            }
        });

        output = {
            status: {
                code: 200,
                message: 'Success get Data Invoice Harian'
            },
            data: data,
            invoice_hari_ini: {
                invoice_el_hari_ini: {
                    nama: 'Invoice EL hari ini',
                    total_qty: totalQtyEL,
                    total_nilai: totalNilaiEL
                },
                invoice_race_hari_ini: {
                    nama: 'Invoice RACE hari ini',
                    total_qty: totalQtyRACE,
                    total_nilai: totalNilaiRACE
                }
            },
            belum_terinvoice: belumInvoice || []
        };

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
}

exports.getPenyerahanHarian = async (req, res) => {
    try {
        const sequelize = core.dbConnect();
        
        // Hitung tanggal range untuk optimasi index (mengganti DATE() function)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sixDaysAgo = new Date(today);
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
        
        // Hitung range untuk setiap hari (H-0 sampai H-6) untuk menghindari DATE() function
        const getDayRange = (daysAgo) => {
            const day = new Date(today);
            day.setDate(day.getDate() - daysAgo);
            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);
            return {
                start: dayStart.toISOString().slice(0, 19).replace('T', ' '),
                end: dayEnd.toISOString().slice(0, 19).replace('T', ' ')
            };
        };

        const h0 = getDayRange(0);
        const h1 = getDayRange(1);
        const h2 = getDayRange(2);
        const h3 = getDayRange(3);
        const h4 = getDayRange(4);
        const h5 = getDayRange(5);
        const h6 = getDayRange(6);
        
        const todayEndStr = h0.end;
        const sixDaysAgoStr = sixDaysAgo.toISOString().slice(0, 19).replace('T', ' ');

        // Query untuk data penyerahan harian - menggunakan range comparison tanpa DATE() function
        let sql = `SELECT 
            b.id_bu,
            b.nama_lengkap,
            COUNT(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN 1 END) AS qty_hari_ini,
            IFNULL(SUM(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN d.total END), 0) AS nilai_hari_ini,
            COUNT(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN 1 END) AS qty_h1,
            IFNULL(SUM(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN d.total END), 0) AS nilai_h1,
            COUNT(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN 1 END) AS qty_h2,
            IFNULL(SUM(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN d.total END), 0) AS nilai_h2,
            COUNT(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN 1 END) AS qty_h3,
            IFNULL(SUM(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN d.total END), 0) AS nilai_h3,
            COUNT(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN 1 END) AS qty_h4,
            IFNULL(SUM(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN d.total END), 0) AS nilai_h4,
            COUNT(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN 1 END) AS qty_h5,
            IFNULL(SUM(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN d.total END), 0) AS nilai_h5,
            COUNT(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN 1 END) AS qty_h6,
            IFNULL(SUM(CASE WHEN a.diserahkan >= ? AND a.diserahkan <= ? THEN d.total END), 0) AS nilai_h6
        FROM m_sm_receive a
        INNER JOIN users b ON b.id = a.id_user
        INNER JOIN m_sm c ON c.id_msm = a.id_msm
        INNER JOIN m_pengadaan_detail d ON d.id_mpd = c.id_mpd
        WHERE a.divisi = 'operasional' 
            AND a.diserahkan IS NOT NULL 
            AND a.diserahkan >= ? AND a.diserahkan <= ?
        GROUP BY b.id_bu, b.nama_lengkap  
        ORDER BY b.id_bu ASC`;

        const results = await sequelize.query(sql, {
            replacements: [
                h0.start, h0.end, h0.start, h0.end,  // hari ini
                h1.start, h1.end, h1.start, h1.end,  // h-1
                h2.start, h2.end, h2.start, h2.end,  // h-2
                h3.start, h3.end, h3.start, h3.end,  // h-3
                h4.start, h4.end, h4.start, h4.end,  // h-4
                h5.start, h5.end, h5.start, h5.end,  // h-5
                h6.start, h6.end, h6.start, h6.end,  // h-6
                sixDaysAgoStr, todayEndStr  // WHERE clause
            ],
            type: Sequelize.QueryTypes.SELECT
        });

        const data = results || [];

        output = {
            status: {
                code: 200,
                message: 'Success get Data Penyerahan Harian'
            },
            data: data
        };

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
}

exports.getBelumInvoice = async (req, res) => {
    try {
        const sequelize = core.dbConnect();

        let sql = `SELECT id_bu, tahun, COUNT(DISTINCT id_msm) AS jml, SUM(total) AS nilai
            FROM (
              SELECT a.id_bu, a.id_msm, YEAR(a.tgl_muat) AS tahun, d.total
              FROM m_sm a
              JOIN m_sm_receive b ON b.id_msm = a.id_msm
              JOIN m_pengadaan_detail d ON d.id_mpd = a.id_mpd
              JOIN m_pengadaan e ON e.id_mp = d.id_mp
              JOIN m_status_order f ON f.id_mp = e.id_mp
              LEFT JOIN m_ar_detail c ON c.id_msm = a.id_msm
              WHERE f.kendaraan_purchasing = 'Y' 
                AND c.id_ard IS NULL 
                AND a.msm != '' 
                AND e.status != 0 
                AND YEAR(a.tgl_muat) > 2023
                AND (
                  (a.id_bu = '11' AND b.divisi = 'ar' AND b.status = 'receive') OR
                  (a.id_bu = '21' AND b.divisi = 'operasional' AND b.diserahkan IS NOT NULL)
                )
              GROUP BY a.id_msm
            ) x
            GROUP BY id_bu, tahun
            ORDER BY id_bu, tahun`;

        const results = await sequelize.query(sql, {
            type: Sequelize.QueryTypes.SELECT
        });

        const data = results || [];

        output = {
            status: {
                code: 200,
                message: 'Success get Data Belum Invoice'
            },
            data: data
        };

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
}

exports.getApHarian = async (req, res) => {
    try {
        const sequelize = core.dbConnect();
        
        // Hitung tanggal range untuk optimasi index (mengganti DATE() function)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sixDaysAgo = new Date(today);
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
        
        // Hitung range untuk setiap hari (H-0 sampai H-6) untuk menghindari DATE() function
        const getDayRange = (daysAgo) => {
            const day = new Date(today);
            day.setDate(day.getDate() - daysAgo);
            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);
            return {
                start: dayStart.toISOString().slice(0, 19).replace('T', ' '),
                end: dayEnd.toISOString().slice(0, 19).replace('T', ' ')
            };
        };

        const h0 = getDayRange(0);
        const h1 = getDayRange(1);
        const h2 = getDayRange(2);
        const h3 = getDayRange(3);
        const h4 = getDayRange(4);
        const h5 = getDayRange(5);
        const h6 = getDayRange(6);
        
        const todayEndStr = h0.end;
        const sixDaysAgoStr = sixDaysAgo.toISOString().slice(0, 19).replace('T', ' ');

        // Query untuk data AP harian - menggunakan range comparison tanpa DATE() function
        let sql = `SELECT 
            b.id_bu,
            b.nama_lengkap,
            COUNT(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN 1 END) AS qty_hari_ini,
            IFNULL(SUM(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN a.total_keseluruhan END), 0) AS nilai_hari_ini,
            COUNT(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN 1 END) AS qty_h1,
            IFNULL(SUM(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN a.total_keseluruhan END), 0) AS nilai_h1,
            COUNT(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN 1 END) AS qty_h2,
            IFNULL(SUM(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN a.total_keseluruhan END), 0) AS nilai_h2,
            COUNT(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN 1 END) AS qty_h3,
            IFNULL(SUM(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN a.total_keseluruhan END), 0) AS nilai_h3,
            COUNT(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN 1 END) AS qty_h4,
            IFNULL(SUM(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN a.total_keseluruhan END), 0) AS nilai_h4,
            COUNT(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN 1 END) AS qty_h5,
            IFNULL(SUM(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN a.total_keseluruhan END), 0) AS nilai_h5,
            COUNT(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN 1 END) AS qty_h6,
            IFNULL(SUM(CASE WHEN a.tgl_create >= ? AND a.tgl_create <= ? THEN a.total_keseluruhan END), 0) AS nilai_h6
        FROM m_ap a
        INNER JOIN users b ON b.id = a.id_user
        WHERE a.tgl_create >= ? AND a.tgl_create <= ?
        GROUP BY b.id_bu, b.nama_lengkap  
        ORDER BY b.id_bu ASC`;

        const results = await sequelize.query(sql, {
            replacements: [
                h0.start, h0.end, h0.start, h0.end,  // hari ini
                h1.start, h1.end, h1.start, h1.end,  // h-1
                h2.start, h2.end, h2.start, h2.end,  // h-2
                h3.start, h3.end, h3.start, h3.end,  // h-3
                h4.start, h4.end, h4.start, h4.end,  // h-4
                h5.start, h5.end, h5.start, h5.end,  // h-5
                h6.start, h6.end, h6.start, h6.end,  // h-6
                sixDaysAgoStr, todayEndStr  // WHERE clause
            ],
            type: Sequelize.QueryTypes.SELECT
        });

        const data = results || [];

        output = {
            status: {
                code: 200,
                message: 'Success get Data AP Harian'
            },
            data: data
        };

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
}

exports.getBelumAp = async (req, res) => {
    try {
        const sequelize = core.dbConnect();

        let sql = `SELECT id_bu, tahun, COUNT(DISTINCT id_msm) AS jml, SUM(total) AS nilai
            FROM (
              SELECT a.id_bu, a.id_msm, YEAR(a.tgl_muat) AS tahun, d.total
              FROM m_sm a
              JOIN m_sm_receive b ON b.id_msm = a.id_msm
              JOIN m_pengadaan_detail d ON d.id_mpd = a.id_mpd
              JOIN m_pengadaan e ON e.id_mp = d.id_mp
              JOIN m_status_order f ON f.id_mp = e.id_mp
              LEFT JOIN m_ap_detail c ON c.id_msm = a.id_msm
              WHERE f.kendaraan_purchasing = 'Y' 
                AND f.kendaraan_operasional = 'N' 
                AND c.id_apd IS NULL 
                AND a.msm != '' 
                AND e.status != 0  
                AND e.top NOT IN ('KG','KE') 
                AND d.total != '0' 
                AND YEAR(a.tgl_muat) > 2023 
                AND b.tolak_user IS NULL
                AND b.divisi = 'ap' 
                AND b.status = 'receive' 
                AND a.status_pembatalan = '0'
              GROUP BY a.id_msm
            ) x
            GROUP BY id_bu, tahun
            ORDER BY id_bu, tahun`;

        const results = await sequelize.query(sql, {
            type: Sequelize.QueryTypes.SELECT
        });

        const data = results || [];

        output = {
            status: {
                code: 200,
                message: 'Success get Data Belum AP'
            },
            data: data
        };

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
}

exports.getKirimInv = async (req, res) => {
    try {
        const sequelize = core.dbConnect();
        
        // Ambil parameter id_bu dari query string
        let idBu = req.query.id_bu;
        
        // Filter BU (ikut logika lama: kalau bukan 11, pakai 21)
        let buFilter = null;
        if (idBu) {
            if (idBu === '11') {
                buFilter = '11';
            } else {
                buFilter = '21';
            }
        }

        // Query dasar: hitung jumlah invoice per BU per bulan dan per kategori status
        let sql = `SELECT
            a.id_bu,
            MONTH(a.tgl_create) AS bulan,
            COUNT(a.id_ar) AS semua_invoice,
            SUM(CASE WHEN COALESCE(d.has_diterima, 0) = 1 THEN 1 ELSE 0 END) AS diterima,
            SUM(CASE WHEN COALESCE(d.has_dikirim, 0) = 1 THEN 1 ELSE 0 END) AS dikirim,
            SUM(CASE WHEN COALESCE(d.has_diterima, 0) = 0 THEN 1 ELSE 0 END) AS belum_terima,
            SUM(CASE WHEN COALESCE(d.has_dikirim, 0) = 0 THEN 1 ELSE 0 END) AS belum_kirim
        FROM m_ar a
        LEFT JOIN (
            SELECT
                b.id_ar,
                MAX(CASE WHEN b.tgl_kirim IS NOT NULL THEN 1 ELSE 0 END) AS has_dikirim,
                MAX(CASE WHEN b.tgl_diterima IS NOT NULL THEN 1 ELSE 0 END) AS has_diterima
            FROM m_ar_followup_detail b
            JOIN m_ar_followup c ON c.id_ar_followup = b.id_ar_followup
            WHERE c.status != 'Cancel'
            GROUP BY b.id_ar
        ) d ON d.id_ar = a.id_ar
        WHERE YEAR(a.tgl_create) = YEAR(NOW())
            AND a.is_deleted IS NULL
            AND a.no_invoice_ar != ''
            AND a.no_invoice_ar IS NOT NULL`;

        // Tambahkan filter id_bu jika ada
        if (buFilter) {
            sql += ` AND a.id_bu = ?`;
        }

        sql += ` GROUP BY a.id_bu, MONTH(a.tgl_create)
            ORDER BY a.id_bu, MONTH(a.tgl_create)`;

        const queryParams = buFilter ? [buFilter] : [];
        const results = await sequelize.query(sql, {
            replacements: queryParams,
            type: Sequelize.QueryTypes.SELECT
        });

        // Map hasil query per bulan (key = nomor bulan)
        const byMonth = {};
        let buFixed = buFilter;
        
        results.forEach(row => {
            byMonth[parseInt(row.bulan)] = row;
            if (!buFixed) {
                buFixed = row.id_bu; // kalau tidak ada filter id_bu, pakai dari data pertama
            }
        });

        // Nama bulan (Jan–Des)
        const namaBulan = {
            1: 'Jan',
            2: 'Feb',
            3: 'Mar',
            4: 'Apr',
            5: 'Mei',
            6: 'Jun',
            7: 'Jul',
            8: 'Agt',
            9: 'Sep',
            10: 'Okt',
            11: 'Nov',
            12: 'Des'
        };

        // Bentuk final: 12 baris (1–12) dengan kolom:
        // No, BU, Bulan, semua_invoice, diterima, dikirim, belum_terima, belum_kirim
        const final = [];
        let no = 1;

        for (let m = 1; m <= 12; m++) {
            const row = byMonth[m] || null;

            final.push({
                No: no++,
                BU: row ? row.id_bu : buFixed,
                Bulan: namaBulan[m],
                semua_invoice: row ? parseInt(row.semua_invoice) : 0,
                diterima: row ? parseInt(row.diterima) : 0,
                dikirim: row ? parseInt(row.dikirim) : 0,
                belum_terima: row ? parseInt(row.belum_terima) : 0,
                belum_kirim: row ? parseInt(row.belum_kirim) : 0
            });
        }

        output = {
            status: {
                code: 200,
                message: 'Success get Data Kirim Invoice'
            },
            data: final
        };

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
}

exports.getLoseSalesBulanan = async (req, res) => {
    try {
        const sequelize = core.dbConnect();
        
        // Ambil parameter dari query string (opsional, default tahun saat ini dan id_bu 11)
        const year = req.query.year || new Date().getFullYear();
        const idBu = req.query.id_bu || '11';

        let sql = `SELECT 
            f.name_bu_brench,
            a.id_bu_brench,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 1 THEN 1 ELSE 0 END) AS qty_1,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 1 THEN b.total END), 0) AS val_1,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 2 THEN 1 ELSE 0 END) AS qty_2,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 2 THEN b.total END), 0) AS val_2,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 3 THEN 1 ELSE 0 END) AS qty_3,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 3 THEN b.total END), 0) AS val_3,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 4 THEN 1 ELSE 0 END) AS qty_4,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 4 THEN b.total END), 0) AS val_4,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 5 THEN 1 ELSE 0 END) AS qty_5,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 5 THEN b.total END), 0) AS val_5,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 6 THEN 1 ELSE 0 END) AS qty_6,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 6 THEN b.total END), 0) AS val_6,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 7 THEN 1 ELSE 0 END) AS qty_7,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 7 THEN b.total END), 0) AS val_7,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 8 THEN 1 ELSE 0 END) AS qty_8,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 8 THEN b.total END), 0) AS val_8,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 9 THEN 1 ELSE 0 END) AS qty_9,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 9 THEN b.total END), 0) AS val_9,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 10 THEN 1 ELSE 0 END) AS qty_10,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 10 THEN b.total END), 0) AS val_10,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 11 THEN 1 ELSE 0 END) AS qty_11,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 11 THEN b.total END), 0) AS val_11,
            SUM(CASE WHEN MONTH(a.tgl_muat) = 12 THEN 1 ELSE 0 END) AS qty_12,
            IFNULL(SUM(CASE WHEN MONTH(a.tgl_muat) = 12 THEN b.total END), 0) AS val_12
        FROM 
            m_sm a
            INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
            INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
            INNER JOIN m_status_order d ON d.id_mp = c.id_mp
            INNER JOIN m_bu_brench f ON f.id_bu_brench = a.id_bu_brench
        WHERE d.kendaraan_purchasing = 'N' 
            AND d.kendaraan_operasional = 'N'
            AND c.status != 0 
            AND YEAR(a.tgl_muat) = ?
            AND a.id_bu = ?
        GROUP BY 
            a.id_bu_brench, f.name_bu_brench  
        ORDER BY a.id_bu_brench ASC`;

        const results = await sequelize.query(sql, {
            replacements: [year, idBu],
            type: Sequelize.QueryTypes.SELECT
        });

        // Mapping bulan untuk menghitung total
        const bulanMapping = [
            'qty_1', 'qty_2', 'qty_3', 'qty_4',
            'qty_5', 'qty_6', 'qty_7', 'qty_8',
            'qty_9', 'qty_10', 'qty_11', 'qty_12'
        ];

        const valMapping = [
            'val_1', 'val_2', 'val_3', 'val_4',
            'val_5', 'val_6', 'val_7', 'val_8',
            'val_9', 'val_10', 'val_11', 'val_12'
        ];

        // Menambahkan total qty dan total val
        const data = (results || []).map(item => {
            const newItem = { ...item };
            
            // Hitung tot_qty (total semua qty)
            let totQty = 0;
            bulanMapping.forEach(qtyField => {
                totQty += parseFloat(newItem[qtyField] || 0);
            });
            newItem.tot_qty = totQty;
            
            // Hitung tot_val (total semua val)
            let totVal = 0;
            valMapping.forEach(valField => {
                totVal += parseFloat(newItem[valField] || 0);
            });
            newItem.tot_val = totVal;
            
            return newItem;
        });

        // Hitung total keseluruhan dari semua data
        let totalQtyKeseluruhan = 0;
        let totalValKeseluruhan = 0;
        
        data.forEach(item => {
            totalQtyKeseluruhan += parseFloat(item.tot_qty || 0);
            totalValKeseluruhan += parseFloat(item.tot_val || 0);
        });

        output = {
            status: {
                code: 200,
                message: 'Success get Data Lose Sales Bulanan'
            },
            data: data,
            total: {
                total_qty: totalQtyKeseluruhan,
                total_val: totalValKeseluruhan
            }
        };

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
}

exports.getUjHarian = async (req, res) => {
    try {
        const sequelize = core.dbConnect();
        
        // Hitung tanggal range untuk optimasi index (mengganti DATE() function)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sixDaysAgo = new Date(today);
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
        
        // Hitung range untuk setiap hari (H-0 sampai H-6) untuk menghindari DATE() function
        const getDayRange = (daysAgo) => {
            const day = new Date(today);
            day.setDate(day.getDate() - daysAgo);
            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);
            return {
                start: dayStart.toISOString().slice(0, 19).replace('T', ' '),
                end: dayEnd.toISOString().slice(0, 19).replace('T', ' ')
            };
        };

        const h0 = getDayRange(0);
        const h1 = getDayRange(1);
        const h2 = getDayRange(2);
        const h3 = getDayRange(3);
        const h4 = getDayRange(4);
        const h5 = getDayRange(5);
        const h6 = getDayRange(6);
        
        const todayEndStr = h0.end;
        const sixDaysAgoStr = sixDaysAgo.toISOString().slice(0, 19).replace('T', ' ');

        // Query untuk data UJ harian - menggunakan range comparison tanpa DATE() function
        let sql = `SELECT 
            c.name_bu_brench,
            COUNT(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN 1 END) AS qty_hari_ini,
            IFNULL(SUM(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN a.total_semua END), 0) AS nilai_hari_ini,
            COUNT(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN 1 END) AS qty_h1,
            IFNULL(SUM(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN a.total_semua END), 0) AS nilai_h1,
            COUNT(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN 1 END) AS qty_h2,
            IFNULL(SUM(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN a.total_semua END), 0) AS nilai_h2,
            COUNT(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN 1 END) AS qty_h3,
            IFNULL(SUM(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN a.total_semua END), 0) AS nilai_h3,
            COUNT(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN 1 END) AS qty_h4,
            IFNULL(SUM(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN a.total_semua END), 0) AS nilai_h4,
            COUNT(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN 1 END) AS qty_h5,
            IFNULL(SUM(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN a.total_semua END), 0) AS nilai_h5,
            COUNT(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN 1 END) AS qty_h6,
            IFNULL(SUM(CASE WHEN a.transfer_at >= ? AND a.transfer_at <= ? THEN a.total_semua END), 0) AS nilai_h6
        FROM uang_jalan_new a
        INNER JOIN m_bu_brench c ON c.id_bu_brench = a.id_bu_brench
        WHERE a.transfer_at >= ? AND a.transfer_at <= ?
        GROUP BY a.id_bu_brench, c.name_bu_brench`;

        const results = await sequelize.query(sql, {
            replacements: [
                h0.start, h0.end, h0.start, h0.end,  // hari ini
                h1.start, h1.end, h1.start, h1.end,  // h-1
                h2.start, h2.end, h2.start, h2.end,  // h-2
                h3.start, h3.end, h3.start, h3.end,  // h-3
                h4.start, h4.end, h4.start, h4.end,  // h-4
                h5.start, h5.end, h5.start, h5.end,  // h-5
                h6.start, h6.end, h6.start, h6.end,  // h-6
                sixDaysAgoStr, todayEndStr  // WHERE clause
            ],
            type: Sequelize.QueryTypes.SELECT
        });

        const data = results || [];

        output = {
            status: {
                code: 200,
                message: 'Success get Data UJ Harian'
            },
            data: data
        };

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
}

exports.exportExcelBelumKembali = async (req, res) => {
    try {
        const { opspurch, year, id_bu } = req.query;
        const sequelize = core.dbConnect();
        
        // Default tahun ke tahun saat ini jika tidak ada parameter
        const currentYear = year || new Date().getFullYear();
        const buId = id_bu || '11'; // Default id_bu ke '11' jika tidak ada parameter

        // Query untuk mengambil detail data belum kembali
        let sql = `SELECT 
            a.id_bu,
            a.id_bu_brench,
            f.code_bu_brench,
            f.name_bu_brench,
            a.id_msm,
            u.nama_perusahaan AS customer,
            COALESCE(m1.nama_mitra, m2.nama_mitra, '') AS mitra,
            a.msm,
            c.msp,
            DATE_FORMAT(a.tgl_muat, '%d/%m/%Y') AS tgl_muat,
            DATE_FORMAT(a.tgl_bongkar, '%d/%m/%Y') AS tgl_bongkar,
            d_alamat.kota AS kota_muat,
            e_alamat.kota AS kota_tujuan,
            a.nopol,
            a.supir AS driver,
            CASE WHEN d.kendaraan_operasional = 'Y' THEN 'Y' ELSE 'N' END AS unit_sendiri,
            b.total
        FROM 
            m_sm a
            INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
            INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
            INNER JOIN m_status_order d ON d.id_mp = c.id_mp
            INNER JOIN m_bu_brench f ON f.id_bu_brench = a.id_bu_brench
            LEFT JOIN m_sm_receive e_receive ON e_receive.id_msm = a.id_msm
            LEFT JOIN customer u ON u.id_customer = c.id_customer
            LEFT JOIN alamat d_alamat ON d_alamat.id = b.id_almuat
            LEFT JOIN alamat e_alamat ON e_alamat.id = b.id_albongkar
            LEFT JOIN mitra m1 ON m1.id_mitra = a.id_mitra
            LEFT JOIN mitra m2 ON m2.id_mitra = a.id_mitra_2
        WHERE d.kendaraan_purchasing = 'Y'`;

        // Filter opspurch
        if (opspurch) {
            if (opspurch === 'sendiri') {
                sql += " AND d.kendaraan_operasional = 'Y'";
            } else {
                sql += " AND d.kendaraan_operasional = 'N'";
            }
        }

        sql += ` AND c.status != 0 
            AND YEAR(a.tgl_muat) = ?
            AND e_receive.id_sm_receive IS NULL 
            AND a.id_bu = ?
        ORDER BY a.id_bu_brench ASC, a.id_msm ASC`;

        const results = await sequelize.query(sql, {
            replacements: [currentYear, buId],
            type: Sequelize.QueryTypes.SELECT
        });

        // Buat workbook Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Belum Kembali');

        // Set kolom headers
        worksheet.columns = [
            { header: 'No', key: 'no', width: 8 },
            { header: 'ID BU', key: 'id_bu', width: 10 },
            { header: 'ID Cabang', key: 'id_cabang', width: 12 },
            { header: 'Nama Cabang', key: 'nama_cabang', width: 30 },
            { header: 'ID MSM', key: 'id_msm', width: 12 },
            { header: 'Customer', key: 'customer', width: 40 },
            { header: 'Mitra', key: 'mitra', width: 40 },
            { header: 'MSM', key: 'msm', width: 20 },
            { header: 'MSP', key: 'msp', width: 20 },
            { header: 'Tanggal Muat', key: 'tgl_muat', width: 15 },
            { header: 'Tanggal Bongkar', key: 'tgl_bongkar', width: 15 },
            { header: 'Kota Muat', key: 'kota_muat', width: 20 },
            { header: 'Kota Tujuan', key: 'kota_tujuan', width: 20 },
            { header: 'Nopol', key: 'nopol', width: 15 },
            { header: 'Driver', key: 'driver', width: 25 },
            { header: 'Unit Sendiri', key: 'unit_sendiri', width: 12 },
            { header: 'Total', key: 'total', width: 15 }
        ];

        // Style header
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // Tambahkan data
        results.forEach((row, index) => {
            worksheet.addRow({
                no: index + 1,
                id_bu: row.id_bu,
                id_cabang: row.code_bu_brench || row.id_bu_brench,
                nama_cabang: row.name_bu_brench || '',
                id_msm: row.id_msm,
                customer: row.customer || '',
                mitra: row.mitra || '',
                msm: row.msm || '',
                msp: row.msp || '',
                tgl_muat: row.tgl_muat || '',
                tgl_bongkar: row.tgl_bongkar || '',
                kota_muat: row.kota_muat || '',
                kota_tujuan: row.kota_tujuan || '',
                nopol: row.nopol || '',
                driver: row.driver || '',
                unit_sendiri: row.unit_sendiri || 'N',
                total: parseFloat(row.total || 0)
            });
        });

        // Format kolom Total sebagai number
        worksheet.getColumn('total').numFmt = '#,##0';

        // Set response headers
        const timestamp = moment().format('YYYYMMDD_HHmmss');
        const filename = `${timestamp}_belum_kembali.xlsx`;
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Write Excel file ke response stream
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error exportExcelBelumKembali:', error);
        
        if (!res.headersSent) {
            res.status(500).json({
                status: {
                    code: 500,
                    message: error.message
                }
            });
        }
    }
}

exports.exportExcelBelumInv = async (req, res) => {
    try {
        const { year, id_bu } = req.query;
        const sequelize = core.dbConnect();

        const currentYear = year || new Date().getFullYear();
        const buId = id_bu || '21'; // default ke 21 (Race) sesuai contoh

        // Query detail belum invoice per MSM
        let sql = `SELECT
            a.id_bu,
            a.id_bu_brench,
            br.code_bu_brench,
            br.name_bu_brench,
            a.id_msm,
            cust.nama_perusahaan AS perusahaan,
            a.msm,
            pg.msp,
            DATE_FORMAT(a.tgl_muat, '%d/%m/%Y') AS tgl_muat,
            muat.kota AS kota_muat,
            bongkar.kota AS kota_bongkar,
            -- AR Terima & Penerima diambil dari receive AR (jika ada)
            DATE_FORMAT(ar_recv.date_added, '%d/%m/%Y %H:%i') AS ar_terima,
            penerima.nama_lengkap AS penerima,
            det.total AS total
        FROM
            m_sm a
            INNER JOIN m_pengadaan_detail det ON det.id_mpd = a.id_mpd
            INNER JOIN m_pengadaan pg ON pg.id_mp = det.id_mp
            INNER JOIN m_status_order st ON st.id_mp = pg.id_mp
            INNER JOIN m_bu_brench br ON br.id_bu_brench = a.id_bu_brench
            INNER JOIN m_sm_receive recv ON recv.id_msm = a.id_msm
            LEFT JOIN m_ar_detail ard ON ard.id_msm = a.id_msm
            LEFT JOIN customer cust ON cust.id_customer = pg.id_customer
            LEFT JOIN alamat muat ON muat.id = det.id_almuat
            LEFT JOIN alamat bongkar ON bongkar.id = det.id_albongkar
            LEFT JOIN m_sm_receive ar_recv ON ar_recv.id_msm = a.id_msm
                AND ar_recv.divisi = 'ar'
                AND ar_recv.status = 'receive'
            LEFT JOIN users penerima ON penerima.id = ar_recv.id_user
        WHERE
            st.kendaraan_purchasing = 'Y'
            AND ard.id_ard IS NULL
            AND a.msm != ''
            AND a.msm IS NOT NULL
            AND pg.status != 0
            AND YEAR(a.tgl_muat) = ?
            AND YEAR(a.tgl_muat) > 2023
            AND a.id_bu = ?`;

        // Kondisi berbeda untuk EL vs RACE mengikuti query getBelumInvoice
        if (buId === '11') {
            sql += ` AND recv.divisi = 'ar' AND recv.status = 'receive'`;
        } else {
            sql += ` AND recv.divisi = 'operasional' AND recv.diserahkan IS NOT NULL`;
        }

        sql += `
        GROUP BY a.id_msm
        ORDER BY a.id_bu_brench ASC, a.tgl_muat ASC, a.id_msm ASC`;

        const results = await sequelize.query(sql, {
            replacements: [currentYear, buId],
            type: Sequelize.QueryTypes.SELECT
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Belum Invoice');

        // Header sesuai contoh
        worksheet.columns = [
            { header: 'No', key: 'no', width: 6 },
            { header: 'ID BU', key: 'id_bu', width: 8 },
            { header: 'ID Cabang', key: 'id_cabang', width: 10 },
            { header: 'Nama Cabang', key: 'nama_cabang', width: 28 },
            { header: 'ID MSM', key: 'id_msm', width: 10 },
            { header: 'Perusahaan', key: 'perusahaan', width: 45 },
            { header: 'MSM', key: 'msm', width: 22 },
            { header: 'MSP', key: 'msp', width: 22 },
            { header: 'Tanggal Muat', key: 'tgl_muat', width: 15 },
            { header: 'Muat', key: 'kota_muat', width: 18 },
            { header: 'Bongkar', key: 'kota_bongkar', width: 18 },
            { header: 'AR Terima', key: 'ar_terima', width: 20 },
            { header: 'Penerima', key: 'penerima', width: 30 },
            { header: 'Total', key: 'total', width: 15 }
        ];

        // Style header
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // Isi data
        (results || []).forEach((row, idx) => {
            worksheet.addRow({
                no: idx + 1,
                id_bu: row.id_bu,
                id_cabang: row.code_bu_brench || row.id_bu_brench,
                nama_cabang: row.name_bu_brench || '',
                id_msm: row.id_msm,
                perusahaan: row.perusahaan || '',
                msm: row.msm || '',
                msp: row.msp || '',
                tgl_muat: row.tgl_muat || '',
                kota_muat: row.kota_muat || '',
                kota_bongkar: row.kota_bongkar || '',
                ar_terima: row.ar_terima || '',
                penerima: row.penerima || '',
                total: parseFloat(row.total || 0)
            });
        });

        worksheet.getColumn('total').numFmt = '#,##0';

        const filename = `${moment().format('YYYYMMDD')}_belum_inv.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exportExcelBelumInv:', error);
        if (!res.headersSent) {
            res.status(500).json({
                status: {
                    code: 500,
                    message: error.message
                }
            });
        }
    }
}

exports.exportExcelBelumAp = async (req, res) => {
    try {
        const { year, id_bu } = req.query;
        const sequelize = core.dbConnect();
        
        // Default tahun ke tahun saat ini jika tidak ada parameter
        const currentYear = year || new Date().getFullYear();
        const buId = id_bu || '21'; // Default id_bu ke '21' jika tidak ada parameter

        // Query untuk mengambil detail data belum AP
        let sql = `SELECT 
            a.id_bu,
            a.id_bu_brench,
            f.code_bu_brench,
            f.name_bu_brench,
            a.id_msm,
            a.msm,
            e.msp,
            DATE_FORMAT(a.tgl_muat, '%d/%m/%Y') AS tgl_muat,
            COALESCE(m1.nama_mitra, m2.nama_mitra, '') AS mitra,
            u.nama_perusahaan AS customer,
            DATE_FORMAT(b.date_added, '%d/%m/%Y %H:%i') AS tgl_terima,
            penerima.nama_lengkap AS penerima,
            d.total
        FROM 
            m_sm a
            INNER JOIN m_sm_receive b ON b.id_msm = a.id_msm
            INNER JOIN m_pengadaan_detail d ON d.id_mpd = a.id_mpd
            INNER JOIN m_pengadaan e ON e.id_mp = d.id_mp
            INNER JOIN m_status_order f_status ON f_status.id_mp = e.id_mp
            INNER JOIN m_bu_brench f ON f.id_bu_brench = a.id_bu_brench
            LEFT JOIN m_ap_detail c ON c.id_msm = a.id_msm
            LEFT JOIN customer u ON u.id_customer = e.id_customer
            LEFT JOIN mitra m1 ON m1.id_mitra = a.id_mitra
            LEFT JOIN mitra m2 ON m2.id_mitra = a.id_mitra_2
            LEFT JOIN users penerima ON penerima.id = b.id_user
        WHERE f_status.kendaraan_purchasing = 'Y' 
            AND f_status.kendaraan_operasional = 'N' 
            AND c.id_apd IS NULL 
            AND a.msm != '' 
            AND a.msm IS NOT NULL
            AND e.status != 0  
            AND e.top NOT IN ('KG','KE') 
            AND d.total != '0' 
            AND YEAR(a.tgl_muat) = ?
            AND YEAR(a.tgl_muat) > 2023 
            AND b.tolak_user IS NULL
            AND b.divisi = 'ap' 
            AND b.status = 'receive' 
            AND a.status_pembatalan = '0'
            AND a.id_bu = ?
        ORDER BY a.id_bu_brench ASC, a.tgl_muat ASC, a.id_msm ASC`;

        const results = await sequelize.query(sql, {
            replacements: [currentYear, buId],
            type: Sequelize.QueryTypes.SELECT
        });

        // Buat workbook Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Belum AP');

        // Set kolom headers
        worksheet.columns = [
            { header: 'No', key: 'no', width: 8 },
            { header: 'ID BU', key: 'id_bu', width: 10 },
            { header: 'ID Cabang', key: 'id_cabang', width: 12 },
            { header: 'Nama Cabang', key: 'nama_cabang', width: 25 },
            { header: 'ID MSM', key: 'id_msm', width: 12 },
            { header: 'MSM', key: 'msm', width: 20 },
            { header: 'MSP', key: 'msp', width: 25 },
            { header: 'Tanggal Muat', key: 'tgl_muat', width: 15 },
            { header: 'Mitra', key: 'mitra', width: 40 },
            { header: 'Customer', key: 'customer', width: 50 },
            { header: 'Tanggal Terima', key: 'tgl_terima', width: 20 },
            { header: 'Penerima', key: 'penerima', width: 30 },
            { header: 'Total', key: 'total', width: 15 }
        ];

        // Style header
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // Tambahkan data
        results.forEach((row, index) => {
            worksheet.addRow({
                no: index + 1,
                id_bu: row.id_bu,
                id_cabang: row.code_bu_brench || row.id_bu_brench,
                nama_cabang: row.name_bu_brench || '',
                id_msm: row.id_msm,
                msm: row.msm || '',
                msp: row.msp || '',
                tgl_muat: row.tgl_muat || '',
                mitra: row.mitra || '',
                customer: row.customer || '',
                tgl_terima: row.tgl_terima || '',
                penerima: row.penerima || '',
                total: parseFloat(row.total || 0)
            });
        });

        // Format kolom Total sebagai number
        worksheet.getColumn('total').numFmt = '#,##0';

        // Set response headers
        const timestamp = moment().format('YYYYMMDD');
        const filename = `${timestamp}_belum_ap.xlsx`;
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Write Excel file ke response stream
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error exportExcelBelumAp:', error);
        
        if (!res.headersSent) {
            res.status(500).json({
                status: {
                    code: 500,
                    message: error.message
                }
            });
        }
    }
}

exports.exportExcelBelumKirim = async (req, res) => {
    try {
        const { year, id_bu } = req.query;
        const sequelize = core.dbConnect();
        
        // Default tahun ke tahun saat ini jika tidak ada parameter
        const currentYear = year || new Date().getFullYear();

        // Query untuk mengambil data invoice yang belum dikirim
        // Belum dikirim = tgl_kirim_invoice IS NULL atau '0000-00-00' atau ''
        let sql = `SELECT 
            a.id_ar,
            a.no_invoice_ar,
            b.id_bu,
            DATE_FORMAT(a.tgl_create, '%d/%m/%Y') AS tgl_create,
            MONTH(a.tgl_create) AS bulan,
            u.nama_perusahaan,
            a.total_penjualan,
            CASE 
                WHEN a.tgl_kirim_invoice IS NULL 
                    OR a.tgl_kirim_invoice = '0000-00-00' 
                    OR a.tgl_kirim_invoice = '' 
                THEN '' 
                ELSE DATE_FORMAT(a.tgl_kirim_invoice, '%d/%m/%Y') 
            END AS tgl_kirim
        FROM 
            m_ar a
            INNER JOIN users b ON b.id = a.id_admin
            LEFT JOIN customer u ON u.id_customer = a.id_customer
        WHERE 
            YEAR(a.tgl_create) = ?
            AND (a.is_deleted IS NULL OR a.is_deleted = 0)
            AND a.no_invoice_ar != ''
            AND a.no_invoice_ar IS NOT NULL
            AND (
                a.tgl_kirim_invoice IS NULL 
                OR a.tgl_kirim_invoice = '0000-00-00' 
                OR a.tgl_kirim_invoice = ''
            )`;

        const queryParams = [currentYear];
        
        // Tambahkan filter id_bu jika ada
        if (id_bu) {
            sql += ` AND b.id_bu = ?`;
            queryParams.push(id_bu);
        }

        sql += ` ORDER BY a.tgl_create DESC, a.id_ar DESC`;
        const results = await sequelize.query(sql, {
            replacements: queryParams,
            type: Sequelize.QueryTypes.SELECT
        });

        // Buat workbook Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Belum Kirim');

        // Set kolom headers
        worksheet.columns = [
            { header: 'ID AR', key: 'id_ar', width: 12 },
            { header: 'No Invoice', key: 'no_invoice', width: 30 },
            { header: 'ID BU', key: 'id_bu', width: 10 },
            { header: 'Tanggal Create', key: 'tgl_create', width: 15 },
            { header: 'Bulan', key: 'bulan', width: 10 },
            { header: 'Nama Perusahaan', key: 'nama_perusahaan', width: 50 },
            { header: 'Total Penjualan', key: 'total_penjualan', width: 18 },
            { header: 'Tgl Kirim', key: 'tgl_kirim', width: 15 }
        ];

        // Style header
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // Tambahkan data
        results.forEach((row) => {
            worksheet.addRow({
                id_ar: row.id_ar,
                no_invoice: row.no_invoice_ar || '',
                id_bu: row.id_bu || '',
                tgl_create: row.tgl_create || '',
                bulan: row.bulan || '',
                nama_perusahaan: row.nama_perusahaan || '',
                total_penjualan: parseFloat(row.total_penjualan || 0),
                tgl_kirim: row.tgl_kirim || ''
            });
        });

        // Format kolom Total Penjualan sebagai number
        worksheet.getColumn('total_penjualan').numFmt = '#,##0';

        // Set response headers
        const timestamp = moment().format('YYYYMMDD_HHmmss');
        const filename = `belum_kirim_${timestamp}.xlsx`;
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Write Excel file ke response stream
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error exportExcelBelumKirim:', error);
        
        if (!res.headersSent) {
            res.status(500).json({
                status: {
                    code: 500,
                    message: error.message
                }
            });
        }
    }
}

// Export detail Lose Sales (kendaraan_purchasing = 'N' & kendaraan_operasional = 'N')
// Format kolom:
// No, ID BU, ID Cabang, Nama Cabang, ID MSM, CUSTOMER, MITRA, MSM, MSP,
// Tanggal Muat, Tanggal Bongkar, kota_muat, kota_tujuan, Unit Sendiri, Total
exports.exportExcelLoseSalesDetail = async (req, res) => {
    try {
        const { year, id_bu } = req.query;
        const sequelize = core.dbConnect();

        const currentYear = year || new Date().getFullYear();
        const buId = id_bu || '11'; // default EL 11 sesuai contoh

        let sql = `SELECT 
            a.id_bu,
            a.id_bu_brench,
            br.code_bu_brench,
            br.name_bu_brench,
            a.id_msm,
            cust.nama_perusahaan AS customer,
            COALESCE(m1.nama_mitra, m2.nama_mitra, '') AS mitra,
            a.msm,
            pg.msp,
            DATE_FORMAT(a.tgl_muat, '%d/%m/%Y') AS tgl_muat,
            -- jika tgl_bongkar 0000-00-00 akan jadi NULL
            CASE 
                WHEN a.tgl_bongkar IS NULL OR a.tgl_bongkar = '0000-00-00' 
                    THEN '' 
                ELSE DATE_FORMAT(a.tgl_bongkar, '%d/%m/%Y') 
            END AS tgl_bongkar,
            muat.kota AS kota_muat,
            bongkar.kota AS kota_tujuan,
            CASE WHEN st.kendaraan_operasional = 'Y' THEN 'Y' ELSE 'N' END AS unit_sendiri,
            det.total AS total
        FROM 
            m_sm a
            INNER JOIN m_pengadaan_detail det ON det.id_mpd = a.id_mpd
            INNER JOIN m_pengadaan pg ON pg.id_mp = det.id_mp
            INNER JOIN m_status_order st ON st.id_mp = pg.id_mp
            INNER JOIN m_bu_brench br ON br.id_bu_brench = a.id_bu_brench
            LEFT JOIN customer cust ON cust.id_customer = pg.id_customer
            LEFT JOIN mitra m1 ON m1.id_mitra = a.id_mitra
            LEFT JOIN mitra m2 ON m2.id_mitra = a.id_mitra_2
            LEFT JOIN alamat muat ON muat.id = det.id_almuat
            LEFT JOIN alamat bongkar ON bongkar.id = det.id_albongkar
        WHERE 
            st.kendaraan_purchasing = 'N'
            AND st.kendaraan_operasional = 'N'
            AND pg.status != 0
            AND a.msm != '' 
            AND a.msm IS NOT NULL
            AND det.total != 0
            AND YEAR(a.tgl_muat) = ?
            AND a.id_bu = ?
        ORDER BY a.id_bu_brench ASC, a.tgl_muat ASC, a.id_msm ASC`;

        const rows = await sequelize.query(sql, {
            replacements: [currentYear, buId],
            type: Sequelize.QueryTypes.SELECT
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Lose Sales Detail');

        worksheet.columns = [
            { header: 'No', key: 'no', width: 6 },
            { header: 'ID BU', key: 'id_bu', width: 8 },
            { header: 'ID Cabang', key: 'id_cabang', width: 10 },
            { header: 'Nama Cabang', key: 'nama_cabang', width: 28 },
            { header: 'ID MSM', key: 'id_msm', width: 10 },
            { header: 'CUSTOMER', key: 'customer', width: 40 },
            { header: 'MITRA', key: 'mitra', width: 40 },
            { header: 'MSM', key: 'msm', width: 20 },
            { header: 'MSP', key: 'msp', width: 20 },
            { header: 'Tanggal Muat', key: 'tgl_muat', width: 15 },
            { header: 'Tanggal Bongkar', key: 'tgl_bongkar', width: 15 },
            { header: 'kota_muat', key: 'kota_muat', width: 18 },
            { header: 'kota_tujuan', key: 'kota_tujuan', width: 18 },
            { header: 'Unit Sendiri', key: 'unit_sendiri', width: 12 },
            { header: 'Total', key: 'total', width: 15 }
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        (rows || []).forEach((r, idx) => {
            worksheet.addRow({
                no: idx + 1,
                id_bu: r.id_bu,
                id_cabang: r.code_bu_brench || r.id_bu_brench,
                nama_cabang: r.name_bu_brench || '',
                id_msm: r.id_msm,
                customer: r.customer || '',
                mitra: r.mitra || '',
                msm: r.msm || '',
                msp: r.msp || '',
                tgl_muat: r.tgl_muat || '',
                tgl_bongkar: r.tgl_bongkar || '',
                kota_muat: r.kota_muat || '',
                kota_tujuan: r.kota_tujuan || '',
                unit_sendiri: r.unit_sendiri || 'N',
                total: parseFloat(r.total || 0)
            });
        });

        worksheet.getColumn('total').numFmt = '#,##0';

        const filename = `${moment().format('YYYYMMDD')}_lose_sales_detail.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exportExcelLoseSalesDetail:', error);
        if (!res.headersSent) {
            res.status(500).json({
                status: {
                    code: 500,
                    message: error.message
                }
            });
        }
    }
}