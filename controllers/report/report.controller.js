const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where } = require('sequelize');


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
        WHERE DATE(a.tgl_create) >= CURDATE() - INTERVAL 6 DAY
        GROUP BY b.id_bu, b.nama_lengkap  
        ORDER BY b.id_bu ASC`;

        const results = await sequelize.query(sql, {
            type: Sequelize.QueryTypes.SELECT
        });

        const data = results || [];

        output = {
            status: {
                code: 200,
                message: 'Success get Data Invoice Harian'
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