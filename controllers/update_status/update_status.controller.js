const core = require('../../config/core.config');
const db = require("../../config/db.config");
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');
const moment = require('moment');

// Helper function to generate photo URL
const generatePhotoUrl = (foto) => {
  if (!foto || foto.trim() === '') {
    return null;
  }
  return `https://api.eurekalogistics.co.id/${foto}`;
};
// exports.getDataStatusEl = async (req, res) => {
//   try {
//     const draw = parseInt(req.query.draw) || 1;
//     const start = parseInt(req.query.start) || 0;
//     const length = parseInt(req.query.length) || 10;
//     const id_bu = req.query.id_bu || '11';
//     const search = req.query.search || '';
//     const searchQuery = `%${search}%`;

//     const sql = `
//       SELECT 
//           a.id_msm,
//           d.kode_customer,
//           d.nama_perusahaan,
//           e.kota AS muat,
//           f.kota AS bongkar,
//           a.id_msm AS trans,
//           a.msm,
//           b.nama_barang,
//           a.do AS sj,
//           b.via,
//           a.berat,
//           a.qty,
//           a.koli,
//           a.tgl_muat,
//           a.waktu_muat,
//           a.waktu_bongkar,
//           a.tgl_eta,
//           DATEDIFF(a.tgl_eta, a.tgl_muat) AS eta,
//           a.kendaraan,
//           a.nopol,
//           a.pickup_supir,
//           a.telp,
//           a.id_mitra_pickup,
//           g.nama_mitra,
//           h.id AS id_kendaraan, 
//           h.no_polisi,
//           h.id_kendaraan_jenis,
//           j.nama_kendaraan_jenis,
//           i.nama AS nama_driver,
//           i.no_telp,
//           a.keterangan,
//           a.tgl_bongkar AS tgl_tiba,
//           DATEDIFF(a.tgl_bongkar, a.tgl_muat) AS tgl_real_tiba,
//           a.nama_kapal,
//           a.kapal_berangkat,
//           a.is_deleted,
//           c.status,
//           MAX(IF(l.action != 19, l.tujuan, NULL)) AS tujuan,
//           COALESCE(MAX(IF(l.action IN (1, 2, 3, 5, 9), l.action, NULL)), 1) AS action
//       FROM 
//           m_sm a
//           INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
//           INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
//           INNER JOIN customer d ON d.id_customer = c.id_customer
//           LEFT JOIN alamat e ON e.id = b.id_almuat
//           LEFT JOIN alamat f ON f.id = b.id_albongkar
//           LEFT JOIN mitra g ON g.id_mitra = a.id_mitra_pickup
//           LEFT JOIN kendaraan h ON h.id = a.id_unit
//           LEFT JOIN m_driver i ON i.id = a.id_driver
//           LEFT JOIN kendaraan_jenis j ON j.id_kendaraan_jenis = h.id_kendaraan_jenis
//           LEFT JOIN kendaraanstatus l 
//             ON l.id_msm = a.id_msm 
//             AND l.action IN (1, 2, 3, 5, 9)
//       WHERE 
//           a.msm != ''
//           AND a.id_mitra_pickup != '0'
//           AND a.status_pembatalan != '1'
//           AND a.is_deleted != '1'
//           AND c.status IN (1, 2)
//           AND a.tgl_muat >= '2025-07-17'
//           AND a.id_bu = ?
//           AND (
//             a.msm LIKE ? OR
//             d.nama_perusahaan LIKE ? OR
//             b.nama_barang LIKE ? OR
//             a.nopol LIKE ? OR
//             i.nama LIKE ?
//           )
//       GROUP BY 
//           a.id_msm
//       ORDER BY 
//           a.tgl_muat DESC
//       LIMIT ? OFFSET ?
//     `;

//     const data = await db.query(sql, [
//       id_bu,
//       searchQuery, searchQuery, searchQuery, searchQuery, searchQuery,
//       length,
//       start,
//     ]);

//     const totalSql = `
//       SELECT COUNT(*) AS total
//       FROM m_sm a
//       INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
//       INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
//       INNER JOIN customer d ON d.id_customer = c.id_customer
//       LEFT JOIN m_driver i ON i.id = a.id_driver
//       WHERE a.msm != ''
//         AND a.id_mitra_pickup != '0'
//         AND a.status_pembatalan != '1'
//         AND a.is_deleted != '1'
//         AND c.status IN (1, 2)
//         AND a.tgl_muat >= '2025-07-17'
//         AND a.id_bu = ?
//         AND (
//           a.msm LIKE ? OR
//           d.nama_perusahaan LIKE ? OR
//           b.nama_barang LIKE ? OR
//           a.nopol LIKE ? OR
//           i.nama LIKE ?
//         )
//     `;

//     const totalResult = await db.query(totalSql, [
//       id_bu,
//       searchQuery, searchQuery, searchQuery, searchQuery, searchQuery,
//     ]);
//     const recordsFiltered = totalResult[0]?.total || 0;

//     const totalAllSql = `
//       SELECT COUNT(*) AS total
//       FROM m_sm a
//       INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
//       INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
//       WHERE a.msm != ''
//         AND a.id_mitra_pickup != '0'
//         AND a.status_pembatalan != '1'
//         AND a.is_deleted != '1'
//         AND c.status IN (1, 2)
//         AND a.tgl_muat >= '2025-07-17'
//         AND a.id_bu = ?
//     `;
//     const totalAllResult = await db.query(totalAllSql, [id_bu]);
//     const recordsTotal = totalAllResult[0]?.total || 0;

//     res.json({
//       draw,
//       recordsTotal,
//       recordsFiltered,
//       data,
//     });

//   } catch (error) {
//     console.error('Gagal mengambil data SM:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Gagal mengambil data SM',
//       error: error.message,
//     });
//   }
// };
// =============================================================>
exports.getDataStatusEl = async (req, res) => {
  try {
    const draw = parseInt(req.query.draw) || 1;
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;

    const id_bu = req.query.id_bu || '11';                 // BU
    const id_bu_brench = req.query.id_bu_brench || 'all';  // Cabang
    const id_jenis = req.query.id_jenis || 'all';          // Jenis kendaraan
    const id_customer = req.query.id_customer || 'all';    // Customer
    const jenis_kepemilikan = req.query.jenis_kepemilikan || 'all'; // Jenis kepemilikan kendaraan
    const start_date = req.query.start_date || moment().subtract(30, 'days').format("YYYY-MM-DD");
    const end_date = req.query.end_date || moment().format("YYYY-MM-DD");
    const sukses_pengiriman = req.query.sukses_pengiriman || '0'; // 1 = sukses, 0 = semua

    const search = req.query.search || '';
    const searchQuery = `%${search}%`;

    // Optimize date range - use start of day and end of day
    const start_datetime = start_date + ' 00:00:00';
    const end_datetime = end_date + ' 23:59:59';

    let whereClause = `
      WHERE 
          a.msm != ''
          AND a.id_mitra_pickup != '0'
          AND a.status_pembatalan != '1'
          AND a.is_deleted != '1'
          AND c.status IN (1, 2)
          AND a.tgl_muat >= ?
          AND a.tgl_muat <= ?
    `;

    let params = [start_datetime, end_datetime];

    // Filter BU - hanya tambahkan jika bukan 'all' dan bukan kosong
    if (id_bu && id_bu !== 'all' && id_bu.trim() !== '') {
      whereClause += ` AND a.id_bu = ? `;
      params.push(id_bu);
    }

    // Filter Cabang - hanya tambahkan jika bukan 'all' dan bukan kosong
    if (id_bu_brench && id_bu_brench !== 'all' && id_bu_brench.trim() !== '') {
      whereClause += ` AND a.id_bu_brench = ? `;
      params.push(id_bu_brench);
    }

    // Filter Jenis Kendaraan - hanya tambahkan jika bukan 'all' dan bukan kosong
    if (id_jenis && id_jenis !== 'all' && id_jenis.trim() !== '') {
      whereClause += ` AND j.id_kendaraan_jenis = ? `;
      params.push(id_jenis);
    }

    // Filter Customer - hanya tambahkan jika bukan 'all' dan bukan kosong
    if (id_customer && id_customer !== 'all' && id_customer.trim() !== '') {
      whereClause += ` AND c.id_customer = ? `;
      params.push(id_customer);
    }

    // Filter Jenis Kepemilikan - hanya tambahkan jika bukan 'all' dan bukan kosong
    if (jenis_kepemilikan && jenis_kepemilikan !== 'all' && jenis_kepemilikan.trim() !== '') {
      whereClause += ` AND h.jenis_kepemilikan = ? `;
      params.push(jenis_kepemilikan);
    }

    // Filter sukses pengiriman - optimized with direct JOIN instead of EXISTS
    if (sukses_pengiriman && sukses_pengiriman !== '0' && sukses_pengiriman.trim() !== '') {
      if (sukses_pengiriman === '1') {
        // Jika sukses, hanya tampilkan yang memiliki action 9 (selesai)
        whereClause += ` AND ks9.id_msm IS NOT NULL `;
      }
    }

    // Add search filter if provided - optimized with index-friendly conditions
    if (search && search.trim() !== '') {
      whereClause += `
        AND (
          a.msm LIKE ? OR
          d.nama_perusahaan LIKE ? OR
          b.nama_barang LIKE ? OR
          a.nopol LIKE ?
        )
      `;
      params.push(searchQuery, searchQuery, searchQuery, searchQuery);
    }

    // Highly optimized main query with minimal JOINs and efficient subquery
    const sql = `
      SELECT 
          a.id_msm,
          d.id_customer,
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
          h.jenis_kepemilikan,
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
          ks1.tgl_update AS tgl_1,
          ks2.tgl_update AS tgl_2,
          ks3.tgl_update AS tgl_3,
          ks5.tgl_update AS tgl_5,
          ks9.tgl_update AS tgl_9,
          ks1.foto AS foto_1,
          ks2.foto AS foto_2,
          ks3.foto AS foto_3,
          ks5.foto AS foto_5,
          ks9.foto AS foto_9
      FROM 
          m_sm a
          INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
          INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
          INNER JOIN customer d ON d.id_customer = c.id_customer
          LEFT JOIN alamat e ON e.id = b.id_almuat
          LEFT JOIN alamat f ON f.id = b.id_albongkar
          LEFT JOIN mitra g ON g.id_mitra = a.id_mitra_pickup
          LEFT JOIN kendaraan h ON h.id = a.id_unit
          LEFT JOIN m_driver i ON i.id = a.id_driver
          LEFT JOIN kendaraan_jenis j ON j.id_kendaraan_jenis = h.id_kendaraan_jenis
          LEFT JOIN kendaraanstatus ks1 ON ks1.id_msm = a.id_msm AND ks1.action = '1'
          LEFT JOIN kendaraanstatus ks2 ON ks2.id_msm = a.id_msm AND ks2.action = '2'
          LEFT JOIN kendaraanstatus ks3 ON ks3.id_msm = a.id_msm AND ks3.action = '3'
          LEFT JOIN kendaraanstatus ks5 ON ks5.id_msm = a.id_msm AND ks5.action = '5'
          LEFT JOIN kendaraanstatus ks9 ON ks9.id_msm = a.id_msm AND ks9.action = '9'
      ${whereClause}
      ORDER BY 
          a.tgl_muat DESC
      LIMIT ? OFFSET ?
    `;

    const data = await db.query(sql, [
      ...params,
      length,
      start,
    ]);

    // Process data to add photo URLs and remove original foto fields
    const processedData = data.map(item => {
      const { foto_1, foto_2, foto_3, foto_5, foto_9, ...rest } = item;
      return {
        ...rest,
        foto_url_1: generatePhotoUrl(foto_1),
        foto_url_2: generatePhotoUrl(foto_2),
        foto_url_3: generatePhotoUrl(foto_3),
        foto_url_5: generatePhotoUrl(foto_5),
        foto_url_9: generatePhotoUrl(foto_9)
      };
    });

    // Highly optimized count query - minimal JOINs for counting
    const countSql = `
      SELECT COUNT(*) AS total
      FROM m_sm a
      INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
      INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
      INNER JOIN customer d ON d.id_customer = c.id_customer
      LEFT JOIN kendaraan h ON h.id = a.id_unit
      LEFT JOIN kendaraan_jenis j ON j.id_kendaraan_jenis = h.id_kendaraan_jenis
      LEFT JOIN kendaraanstatus ks9 ON ks9.id_msm = a.id_msm AND ks9.action = '9'
      ${whereClause}
    `;

    const totalResult = await db.query(countSql, params);
    const recordsFiltered = totalResult[0]?.total || 0;

    // Highly optimized total count - minimal JOINs and efficient EXISTS
    const totalAllSql = `
      SELECT COUNT(*) AS total
      FROM m_sm a
      INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
      INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
      WHERE a.msm != ''
        AND a.id_mitra_pickup != '0'
        AND a.status_pembatalan != '1'
        AND a.is_deleted != '1'
        AND c.status IN (1, 2)
        AND a.tgl_muat >= ?
        AND a.tgl_muat <= ?
        ${id_bu && id_bu !== 'all' && id_bu.trim() !== '' ? 'AND a.id_bu = ?' : ''}
        ${id_bu_brench && id_bu_brench !== 'all' && id_bu_brench.trim() !== '' ? 'AND a.id_bu_brench = ?' : ''}
        ${id_jenis && id_jenis !== 'all' && id_jenis.trim() !== '' ? 'AND EXISTS (SELECT 1 FROM kendaraan h2 WHERE h2.id = a.id_unit AND h2.id_kendaraan_jenis = ?)' : ''}
        ${id_customer && id_customer !== 'all' && id_customer.trim() !== '' ? 'AND c.id_customer = ?' : ''}
        ${jenis_kepemilikan && jenis_kepemilikan !== 'all' && jenis_kepemilikan.trim() !== '' ? 'AND EXISTS (SELECT 1 FROM kendaraan h3 WHERE h3.id = a.id_unit AND h3.jenis_kepemilikan = ?)' : ''}
        ${sukses_pengiriman && sukses_pengiriman !== '0' && sukses_pengiriman.trim() !== '' ? 
          (sukses_pengiriman === '1' ? 'AND EXISTS (SELECT 1 FROM kendaraanstatus ks WHERE ks.id_msm = a.id_msm AND ks.action = 9)' : '') : ''}
    `;
    
    const totalAllParams = [start_datetime, end_datetime];
    if (id_bu && id_bu !== 'all' && id_bu.trim() !== '') totalAllParams.push(id_bu);
    if (id_bu_brench && id_bu_brench !== 'all' && id_bu_brench.trim() !== '') totalAllParams.push(id_bu_brench);
    if (id_jenis && id_jenis !== 'all' && id_jenis.trim() !== '') totalAllParams.push(id_jenis);
    if (id_customer && id_customer !== 'all' && id_customer.trim() !== '') totalAllParams.push(id_customer);
    if (jenis_kepemilikan && jenis_kepemilikan !== 'all' && jenis_kepemilikan.trim() !== '') totalAllParams.push(jenis_kepemilikan);
    
    const totalAllResult = await db.query(totalAllSql, totalAllParams);
    const recordsTotal = totalAllResult[0]?.total || 0;

    res.json({
      draw,
      recordsTotal,
      recordsFiltered,
      data: processedData,
    });

  } catch (error) {
    console.error('Gagal mengambil data SM:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data SM',
      error: error.message,
    });
  }
};

exports.getDataStatusElById = async (req, res) => {
  try {
    const draw = parseInt(req.query.draw) || 1;
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const id_bu = req.query.id_bu || '11';
    const search = req.query.search || '';
    const searchQuery = `%${search}%`;
    const id_msm = req.query.id_msm;

    if (id_msm) {
      const byIdSql = `
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
            MAX(IF(l.action = 5, l.tujuan, NULL)) AS tujuan,
            MAX(IF(l.action = 1, l.tgl_update, 0)) AS tgl_1,
            MAX(IF(l.action = 2, l.tgl_update, 0)) AS tgl_2,
            MAX(IF(l.action = 3, l.tgl_update, 0)) AS tgl_3,
            MAX(IF(l.action = 5, l.tgl_update, 0)) AS tgl_5,
            MAX(IF(l.action = 9, l.tgl_update, 0)) AS tgl_9,
            MAX(IF(l.action = 1, l.foto, NULL)) AS foto_1,
            MAX(IF(l.action = 2, l.foto, NULL)) AS foto_2,
            MAX(IF(l.action = 3, l.foto, NULL)) AS foto_3,
            MAX(IF(l.action = 5, l.foto, NULL)) AS foto_5,
            MAX(IF(l.action = 9, l.foto, NULL)) AS foto_9
        FROM 
            m_sm a
            INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
            INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
            INNER JOIN customer d ON d.id_customer = c.id_customer
            LEFT JOIN alamat e ON e.id = b.id_almuat
            LEFT JOIN alamat f ON f.id = b.id_albongkar
            LEFT JOIN mitra g ON g.id_mitra = a.id_mitra_pickup
            LEFT JOIN kendaraan h ON h.id = a.id_unit
            LEFT JOIN m_driver i ON i.id = a.id_driver
            LEFT JOIN kendaraan_jenis j ON j.id_kendaraan_jenis = h.id_kendaraan_jenis
            LEFT JOIN kendaraanstatus l ON l.id_msm = a.id_msm 
                AND l.action IN ('1', '2', '3', '5', '9')
        WHERE 
            a.id_msm = ?
        GROUP BY a.id_msm
      `;
      const data = await db.query(byIdSql, [id_msm]);

      // Process data to add photo URLs and remove original foto fields
      const processedData = data.map(item => {
        const { foto_1, foto_2, foto_3, foto_5, foto_9, ...rest } = item;
        return {
          ...rest,
          foto_url_1: generatePhotoUrl(foto_1),
          foto_url_2: generatePhotoUrl(foto_2),
          foto_url_3: generatePhotoUrl(foto_3),
          foto_url_5: generatePhotoUrl(foto_5),
          foto_url_9: generatePhotoUrl(foto_9)
        };
      });

      return res.json({
        draw,
        recordsTotal: processedData.length,
        recordsFiltered: processedData.length,
        data: processedData,
      });
    }

    const sql = `...`;
    const data = await db.query(sql, [
      id_bu,
      searchQuery, searchQuery, searchQuery, searchQuery, searchQuery,
      length,
      start,
    ]);

    const totalSql = `...`;
    const totalResult = await db.query(totalSql, [
      id_bu,
      searchQuery, searchQuery, searchQuery, searchQuery, searchQuery,
    ]);
    const recordsFiltered = totalResult[0]?.total || 0;

    const totalAllSql = `...`;
    const totalAllResult = await db.query(totalAllSql, [id_bu]);
    const recordsTotal = totalAllResult[0]?.total || 0;

    res.json({
      draw,
      recordsTotal,
      recordsFiltered,
      data,
    });

  } catch (error) {
    console.error('Gagal mengambil data SM:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data SM',
      error: error.message,
    });
  }
};

exports.addDataStatus = async (req, res) => {
  try {
    const {
      id_kendaraan,
      no_polisi,
      id_pengemudi,
      nama_driver,
      id_msm,
      kondisi_kendaraan,
      action,
      empty_load,
      keterangan,
      memo,
      customer,
      posisi,
      longitude,
      latitude,
      tujuan,
      foto,
      source,
      id_user,
    } = req.body;

    if (!id_kendaraan || !id_msm || !action || !keterangan) {
      return res.status(400).json({
        success: false,
        message: 'Field id_kendaraan, id_msm, action, dan keterangan wajib diisi',
      });
    }

    const kendaraanstatus = await models.kendaraanstatus.create({
      id_kendaraan,
      no_polisi,
      id_pengemudi,
      nama_driver,
      id_msm,
      kondisi_kendaraan: kondisi_kendaraan || "No Ready",
      action,
      empty_load,
      keterangan,
      memo,
      customer: customer || "-",
      posisi: posisi || "",
      longitude,
      latitude,
      tujuan,
      foto,
      source: source || 'cc',
      // tgl_update: new Date(),
      tgl_update: req.body.tgl_update ? new Date(req.body.tgl_update) : new Date(),
      id_user: id_user || 0,
      tgl_create: new Date()
    });

    // Jika action = 9 (selesai), update juga field tgl_bongkar di tabel m_sm
    try {
      const actionValue = String(action);
      if ((actionValue === '9' || action === 9) && id_msm) {
        // Format tgl_create ke format MySQL DATETIME
        const tglBongkar = moment(kendaraanstatus.tgl_update).format('YYYY-MM-DD HH:mm:ss');
        const updateSql = 'UPDATE m_sm SET tgl_bongkar = ? WHERE id_msm = ?';
        await db.query(updateSql, [tglBongkar, id_msm]);
      }
    } catch (err) {
      // Jangan gagalkan pembuatan kendaraanstatus hanya karena update m_sm gagal.
      console.error('Gagal update tgl_bongkar di m_sm:', err);
    }

    res.status(201).json({
      success: true,
      message: 'Data status kendaraan berhasil dibuat',
      data: kendaraanstatus
    });
  } catch (error) {
    console.error('Gagal create kendaraanstatus:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal create kendaraanstatus',
      error: error.message
    });
  }
};


exports.addDataStatusByKendaraan = async (req, res) => {
  try {
    const {
      id_kendaraan,
      no_polisi,
      id_pengemudi,
      nama_driver,
      id_msm,
      kondisi_kendaraan,
      action,
      empty_load,
      keterangan,
      memo,
      customer,
      posisi,
      longitude,
      latitude,
      tujuan,
      foto,
      id_user
    } = req.body;

    if (!id_kendaraan || !action || !keterangan) {
      return res.status(400).json({
        success: false,
        message: 'Field id_kendaraan, action, dan keterangan wajib diisi',
      });
    }

    const kendaraanstatus = await models.kendaraanstatus.create({
      id_kendaraan,
      no_polisi,
      id_pengemudi,
      nama_driver,
      id_msm: id_msm || 0,
      kondisi_kendaraan: kondisi_kendaraan || "No Ready",
      action,
      empty_load,
      keterangan,
      memo,
      customer: customer || "-",
      posisi: posisi || "",
      longitude,
      latitude,
      tujuan,
      foto,
      tgl_update: req.body.tgl_update ? new Date(req.body.tgl_update) : new Date(),
      id_user: id_user || 0,
      tgl_create: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Data status kendaraan (by id_kendaraan) berhasil dibuat',
      data: kendaraanstatus
    });
  } catch (error) {
    console.error('Gagal create kendaraanstatus (by id_kendaraan):', error);
    res.status(500).json({
      success: false,
      message: 'Gagal create kendaraanstatus (by id_kendaraan)',
      error: error.message
    });
  }
};

