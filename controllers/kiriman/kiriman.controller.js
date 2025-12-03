const core = require('../../config/core.config');
const db = require("../../config/db.config");
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, QueryTypes  } = require('sequelize');

exports.getKirimanData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";

    let searchCondition = "";
    const searchValue = `%${search}%`;

    if (search) {
      searchCondition = `
        AND (
          a.msm LIKE ? OR 
          d.nama_perusahaan LIKE ? OR 
          h.no_polisi LIKE ?
        )
      `;
    }

    let dateCondition = "";
    let dateParams = [];
    
    if (startDate && endDate) {
      dateCondition = "AND a.tgl_muat BETWEEN ? AND ?";
      dateParams = [startDate, endDate];
    } else if (startDate) {
      dateCondition = "AND a.tgl_muat >= ?";
      dateParams = [startDate];
    } else if (endDate) {
      dateCondition = "AND a.tgl_muat <= ?";
      dateParams = [endDate];
    }

    const sql = `
      SELECT 
        a.id_msm,
        d.kode_customer,
        d.nama_perusahaan,
        e.kota AS muat,
        f.kota AS bongkar,
        a.id_msm AS trans,
        a.msm,
        b.nama_barang,
        a.do AS sj,
        b.via,
        a.berat,
        a.qty,
        a.koli,
        a.tgl_muat,
        a.waktu_muat,
        a.waktu_bongkar,
        a.tgl_eta,
        DATEDIFF(a.tgl_eta, a.tgl_muat) AS eta,
        a.kendaraan,
        a.nopol,
        a.pickup_supir,
        a.telp,
        a.id_mitra_pickup,
        g.nama_mitra,
        h.no_polisi,
        h.id_kendaraan_jenis,
        j.nama_kendaraan_jenis,
        i.nama AS nama_driver,
        i.no_telp,
        a.keterangan,
        a.tgl_bongkar AS tgl_tiba,
        DATEDIFF(a.tgl_bongkar, a.tgl_muat) AS tgl_real_tiba,
        a.nama_kapal,
        a.kapal_berangkat,
        a.is_deleted,
        c.status,
        MAX(IF(l.action = 1, l.tgl_update, 0)) AS tgl_1,
        MAX(IF(l.action = 2, l.tgl_update, 0)) AS tgl_2,
        MAX(IF(l.action = 3, l.tgl_update, 0)) AS tgl_3,
        MAX(IF(l.action = 5, l.tgl_update, 0)) AS tgl_5,
        MAX(IF(l.action = 9, l.tgl_update, 0)) AS tgl_9

      FROM m_sm a
      INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
      INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
      INNER JOIN customer d ON d.id_customer = c.id_customer
      LEFT JOIN alamat e ON e.id = b.id_almuat
      LEFT JOIN alamat f ON f.id = b.id_albongkar
      LEFT JOIN mitra g ON g.id_mitra = a.id_mitra_pickup
      LEFT JOIN kendaraan h ON h.id = a.id_unit
      LEFT JOIN m_driver i ON i.id = a.id_driver
      LEFT JOIN kendaraan_jenis j ON j.id_kendaraan_jenis = h.id_kendaraan_jenis
      LEFT JOIN kendaraanstatus l ON l.id_msm = a.id_msm AND l.action IN ('1', '2', '3', '5', '9')

      WHERE 
        a.msm != '' 
        AND a.id_mitra_pickup != '0'
        AND a.status_pembatalan != '1'
        AND a.is_deleted != '1'
        AND c.status IN (1, 2)
        AND a.id_bu = '11'
        ${searchCondition}
        ${dateCondition}

      GROUP BY a.id_msm
      ORDER BY a.tgl_muat DESC
      LIMIT ? OFFSET ?
    `;

    const searchParams = search ? [searchValue, searchValue, searchValue] : [];
    const allParams = [...searchParams, ...dateParams, limit, offset];

    const data = await db.query(sql, allParams);

    const countSql = `
      SELECT COUNT(DISTINCT a.id_msm) AS total
      FROM m_sm a
      INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
      INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
      INNER JOIN customer d ON d.id_customer = c.id_customer
      LEFT JOIN kendaraan h ON h.id = a.id_unit
      WHERE 
        a.msm != '' 
        AND a.id_mitra_pickup != '0'
        AND a.status_pembatalan != '1'
        AND a.is_deleted != '1'
        AND c.status IN (1, 2)
        AND a.id_bu = '11'
        ${searchCondition}
        ${dateCondition}
    `;

    const countParams = [...searchParams, ...dateParams];
    const countResult = await db.query(countSql, countParams);
    const totalRecords = countResult[0]?.total || 0;

    res.status(200).json({
      draw: page,
      recordsTotal: totalRecords,
      recordsFiltered: totalRecords,
      data,
    });

  } catch (error) {
    console.error("Error in getKirimanData:", error);
    res.status(500).json({
      message: "Gagal mengambil data kiriman",
      error: error.message
    });
  }
};

exports.updateStatusKiriman = async (req, res) => {
  try {
    const {
      id_msm,                // ID utama pengiriman
      nopol,                 // No Polisi
      id_driver,             // ID driver
      kondisi_kendaraan,     // Kondisi kendaraan (e.g., "No Ready")
      berat,                 // Berat kiriman
      koli,                  // Koli
      posisi,                // Lokasi posisi saat ini
      tanggal,               // Tanggal status (format: yyyy-mm-dd)
      keterangan             // Status keterangan (e.g., "Proses Muat")
    } = req.body;

    if (!id_msm) {
      return res.status(400).json({ message: "id_msm wajib diisi." });
    }

    const sql = `
      UPDATE m_sm
      SET
        nopol = ?,
        id_driver = ?,
        kondisi_kendaraan = ?,
        berat = ?,
        koli = ?,
        posisi = ?,
        tgl_muat = ?,             -- jika ini adalah tanggal status
        keterangan = ?
      WHERE id_msm = ?
    `;

    const params = [
      nopol,
      id_driver,
      kondisi_kendaraan,
      berat,
      koli,
      posisi,
      tanggal,
      keterangan,
      id_msm
    ];

    const result = await db.query(sql, params);

    res.status(200).json({
      message: "Status kiriman berhasil diperbarui",
      data: result
    });

  } catch (error) {
    console.error("Error updateStatusKiriman:", error);
    res.status(500).json({
      message: "Gagal update status kiriman",
      error: error.message
    });
  }
};

exports.exportKirimanExcel = async (req, res) => {
  try {
    const { start_date, end_date, group_by = 'sj' } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "start_date dan end_date wajib diisi"
        }
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Format tanggal harus yyyy-mm-dd"
        }
      });
    }

    // Validate group_by parameter
    const validGroupBy = ['sj', 'sm', 'customer', 'driver'];
    if (!validGroupBy.includes(group_by)) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "group_by harus salah satu dari: sj, sm, customer, driver"
        }
      });
    }

    // Build GROUP BY clause based on parameter
    let groupByClause = '';
    let orderByClause = '';
    
    switch (group_by) {
      case 'sj':
        groupByClause = 'GROUP BY a.id_msm';
        orderByClause = 'ORDER BY a.tgl_muat DESC';
        break;
      case 'sm':
        groupByClause = 'GROUP BY a.msm';
        orderByClause = 'ORDER BY a.msm, a.tgl_muat DESC';
        break;
      case 'customer':
        groupByClause = 'GROUP BY d.kode_customer';
        orderByClause = 'ORDER BY d.nama_perusahaan, a.tgl_muat DESC';
        break;
      case 'driver':
        groupByClause = 'GROUP BY i.nama';
        orderByClause = 'ORDER BY i.nama, a.tgl_muat DESC';
        break;
      default:
        groupByClause = 'GROUP BY a.id_msm';
        orderByClause = 'ORDER BY a.tgl_muat DESC';
    }

    const sql = `
      SELECT 
        a.id_msm,
        d.kode_customer,
        d.nama_perusahaan,
        e.kota AS muat,
        f.kota AS bongkar,
        a.msm,
        b.nama_barang,
        a.do AS sj,
        b.via,
        a.berat,
        a.qty,
        a.koli,
        a.tgl_muat,
        a.waktu_muat,
        a.waktu_bongkar,
        a.tgl_eta,
        DATEDIFF(a.tgl_eta, a.tgl_muat) AS eta,
        a.kendaraan,
        a.nopol,
        a.pickup_supir,
        a.telp,
        g.nama_mitra,
        h.no_polisi,
        j.nama_kendaraan_jenis,
        i.nama AS nama_driver,
        i.no_telp,
        a.keterangan,
        a.tgl_bongkar AS tgl_tiba,
        DATEDIFF(a.tgl_bongkar, a.tgl_muat) AS tgl_real_tiba,
        a.nama_kapal,
        a.kapal_berangkat,
        c.status,
        MAX(IF(l.action = 1, l.tgl_update, 0)) AS tgl_1,
        MAX(IF(l.action = 2, l.tgl_update, 0)) AS tgl_2,
        MAX(IF(l.action = 3, l.tgl_update, 0)) AS tgl_3,
        MAX(IF(l.action = 5, l.tgl_update, 0)) AS tgl_5,
        MAX(IF(l.action = 9, l.tgl_update, 0)) AS tgl_9

      FROM m_sm a
      INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
      INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
      INNER JOIN customer d ON d.id_customer = c.id_customer
      LEFT JOIN alamat e ON e.id = b.id_almuat
      LEFT JOIN alamat f ON f.id = b.id_albongkar
      LEFT JOIN mitra g ON g.id_mitra = a.id_mitra_pickup
      LEFT JOIN kendaraan h ON h.id = a.id_unit
      LEFT JOIN m_driver i ON i.id = a.id_driver
      LEFT JOIN kendaraan_jenis j ON j.id_kendaraan_jenis = h.id_kendaraan_jenis
      LEFT JOIN kendaraanstatus l ON l.id_msm = a.id_msm AND l.action IN ('1', '2', '3', '5', '9')

      WHERE 
        a.msm != '' 
        AND a.id_mitra_pickup != '0'
        AND a.status_pembatalan != '1'
        AND a.is_deleted != '1'
        AND c.status IN (1, 2)
        AND a.tgl_muat BETWEEN ? AND ?
        AND a.id_bu = '11'

      ${groupByClause}
      ${orderByClause}
    `;

    const data = await db.query(sql, [start_date, end_date]);

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: {
          code: 404,
          message: "Tidak ada data kiriman untuk periode yang dipilih"
        },
        data: {
          totalData: 0,
          exportDate: new Date().toISOString(),
          columns: [],
          rows: []
        }
      });
    }

    // Prepare Excel data with proper column mapping
    const excelData = data.map((row, index) => {
      // Safe date conversion function
      const safeDateToISO = (dateValue) => {
        if (!dateValue || dateValue === '0' || dateValue === '0000-00-00') {
          return '-';
        }
        try {
          const date = new Date(dateValue);
          if (isNaN(date.getTime())) {
            console.log(`Invalid date value for row ${index + 1}:`, dateValue);
            return '-';
          }
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.log(`Date conversion error for row ${index + 1}, value:`, dateValue, 'Error:', error.message);
          return '-';
        }
      };
      
      try {
        return {
          'No': index + 1,
          'ID MSM': row.id_msm || '-',
          'Kode Customer': row.kode_customer || '-',
          'Nama Perusahaan': row.nama_perusahaan || '-',
          'Kota Muat': row.muat || '-',
          'Kota Bongkar': row.bongkar || '-',
          'MSM': row.msm || '-',
          'Nama Barang': row.nama_barang || '-',
          'Surat Jalan': row.sj || '-',
          'Via': row.via || '-',
          'Berat': row.berat || '-',
          'Qty': row.qty || '-',
          'Koli': row.koli || '-',
          'Tanggal Muat': safeDateToISO(row.tgl_muat),
          'Waktu Muat': row.waktu_muat || '-',
          'Waktu Bongkar': row.waktu_bongkar || '-',
          'Tanggal ETA': safeDateToISO(row.tgl_eta),
          'ETA (Hari)': row.eta || '-',
          'Kendaraan': row.kendaraan || '-',
          'No Polisi': row.nopol || '-',
          'Pickup Supir': row.pickup_supir || '-',
          'Telepon': row.telp || '-',
          'Nama Mitra': row.nama_mitra || '-',
          'No Polisi Kendaraan': row.no_polisi || '-',
          'Jenis Kendaraan': row.nama_kendaraan_jenis || '-',
          'Nama Driver': row.nama_driver || '-',
          'No Telp Driver': row.no_telp || '-',
          'Keterangan': row.keterangan || '-',
          'Tanggal Tiba': safeDateToISO(row.tgl_tiba),
          'Real Tiba (Hari)': row.tgl_real_tiba || '-',
          'Nama Kapal': row.nama_kapal || '-',
          'Kapal Berangkat': row.kapal_berangkat || '-',
          'Status': row.status || '-',
          'Tanggal Status 1': safeDateToISO(row.tgl_1),
          'Tanggal Status 2': safeDateToISO(row.tgl_2),
          'Tanggal Status 3': safeDateToISO(row.tgl_3),
          'Tanggal Status 5': safeDateToISO(row.tgl_5),
          'Tanggal Status 9': safeDateToISO(row.tgl_9)
        };
      } catch (rowError) {
        console.error(`Error processing row ${index + 1}:`, rowError);
        console.error('Row data:', row);
        // Return a safe default row
        return {
          'No': index + 1,
          'ID MSM': row.id_msm || '-',
          'Kode Customer': '-',
          'Nama Perusahaan': '-',
          'Kota Muat': '-',
          'Kota Bongkar': '-',
          'MSM': '-',
          'Nama Barang': '-',
          'Surat Jalan': '-',
          'Via': '-',
          'Berat': '-',
          'Qty': '-',
          'Koli': '-',
          'Tanggal Muat': '-',
          'Waktu Muat': '-',
          'Waktu Bongkar': '-',
          'Tanggal ETA': '-',
          'ETA (Hari)': '-',
          'Kendaraan': '-',
          'No Polisi': '-',
          'Pickup Supir': '-',
          'Telepon': '-',
          'Nama Mitra': '-',
          'No Polisi Kendaraan': '-',
          'Jenis Kendaraan': '-',
          'Nama Driver': '-',
          'No Telp Driver': '-',
          'Keterangan': '-',
          'Tanggal Tiba': '-',
          'Real Tiba (Hari)': '-',
          'Nama Kapal': '-',
          'Kapal Berangkat': '-',
          'Status': '-',
          'Tanggal Status 1': '-',
          'Tanggal Status 2': '-',
          'Tanggal Status 3': '-',
          'Tanggal Status 5': '-',
          'Tanggal Status 9': '-'
        };
      }
    });

    // Return JSON response in the same format as exportKendaraanStatusToExcel
    res.status(200).json({
      status: {
        code: 200,
        message: `Success Export Kiriman Data Per ${group_by.toUpperCase()}`
      },
      data: {
        totalData: excelData.length,
        exportDate: new Date().toISOString(),
        groupBy: group_by,
        columns: [
          'No', 'ID MSM', 'Kode Customer', 'Nama Perusahaan', 'Kota Muat', 'Kota Bongkar',
          'MSM', 'Nama Barang', 'Surat Jalan', 'Via', 'Berat', 'Qty', 'Koli',
          'Tanggal Muat', 'Waktu Muat', 'Waktu Bongkar', 'Tanggal ETA', 'ETA (Hari)',
          'Kendaraan', 'No Polisi', 'Pickup Supir', 'Telepon', 'Nama Mitra',
          'No Polisi Kendaraan', 'Jenis Kendaraan', 'Nama Driver', 'No Telp Driver',
          'Keterangan', 'Tanggal Tiba', 'Real Tiba (Hari)', 'Nama Kapal', 'Kapal Berangkat',
          'Status', 'Tanggal Status 1', 'Tanggal Status 2', 'Tanggal Status 3',
          'Tanggal Status 5', 'Tanggal Status 9'
        ],
        rows: excelData
      }
    });

  } catch (error) {
    console.error("Error in exportKirimanExcel:", error);
    res.status(500).json({
      status: {
        code: 500,
        message: error.message
      }
    });
  }
};



