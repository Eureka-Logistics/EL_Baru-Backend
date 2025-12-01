const core = require('../../config/core.config');
const models = core.models();
const db = require('../../config/db.config');
const ExcelJS = require('exceljs');
const { Op } = require('sequelize');
const moment = require('moment');

// Export Excel untuk monitoring order tanpa limit ukuran file
exports.exportExcelUnlimited = async (req, res) => {
  try {
    // Ambil parameter dari query
    const { bu, brench, mulai, selesai, vendor } = req.query;

    // Validasi parameter wajib
    if (!mulai || !selesai) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Parameter mulai dan selesai wajib diisi"
        }
      });
    }

    // Validasi format tanggal
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(mulai) || !dateRegex.test(selesai)) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Format tanggal harus yyyy-mm-dd"
        }
      });
    }

    // Set CORS headers untuk akses dari project luar
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Query SQL yang sama dengan PHP CodeIgniter
    let sql = `
      SELECT 
        a.id_msm,
        a.msm,
        DATE(a.tgl_muat) AS tgl_muat,
        b.id_unit,
        b.id_mpd,
        b.id_mp,
        c.msp,
        c.service,
        d.kota as muat,
        e.kota as bongkar,
        f.id_mitra,
        c.id_sales,
        c.top,
        a.id_bu,
        a.tgl_terima_inv,
        f.nama_mitra as pickup,
        a.pickup_nopol,
        a.pickup_supir,
        h.jenis_kepemilikan,
        h.jenis_kendaraan,
        m.nama_mitra as mitra_1,
        a.nopol,
        a.supir,
        n.nama_mitra as mitra_2,
        a.nopol_2,
        a.supir_2,
        s.code_bu_brench,
        b.harga,
        b.harga_muat,
        b.harga_bongkar,
        b.total,
        b.kendaraan,
        k.total_tagihan,
        l.no_invoice_ar,
        l.tgl_create as inv_create_date,
        p.tgl_terima_invoice,
        p.receivesj_ops,
        p.no_invoice_ap,
        p.tgl_invoice_ap as ap_create_date,
        p.no_invoice_mitra,
        u.nama_perusahaan,
        x.kendaraan_operasional,
        v.nama_lengkap as penginput_ar,
        o.subtotal as total_ap,
        0 as transaction_date,
        0 as due_date,
        0 as transaction_status_name,
        MAX(IF (r.divisi = 'operasional', r.date_added, 0)) AS 'date_ops',
        MAX(IF (r.divisi = 'ap', r.date_added, 0)) AS 'date_ap',
        MAX(IF (r.divisi = 'ar', r.date_added, 0)) AS 'date_ar',
        MAX(IF (r.tolak_user IS NOT NULL, r.tolak_tgl, 0)) AS 'date_ar_tolak',
        MAX(IF (r.divisi = 'operasional', r.diserahkan, 0)) AS 'sjsendops',
        MAX(IF (w.action = 1, w.tgl_update, 0)) AS 'tgl_1',
        MAX(IF (w.action = 2, w.tgl_update, 0)) AS 'tgl_2',
        MAX(IF (w.action = 3, w.tgl_update, 0)) AS 'tgl_3',
        MAX(IF (w.action = 5, w.tgl_update, 0)) AS 'tgl_5',
        MAX(IF (w.action = 9, w.tgl_update, 0)) AS 'tgl_9',
        a.berat,
        a.qty,
        a.koli,
        a.do,
        t.nama_lengkap as nama_sales,
        y.lead_time,
        ms.shipment
      FROM m_sm a
      INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
      INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2) 
      INNER JOIN m_status_order x ON x.id_mp = c.id_mp AND x.kendaraan_purchasing = 'Y'
      INNER JOIN customer u ON u.id_customer = c.id_customer
      LEFT JOIN alamat d ON d.id = b.id_almuat
      LEFT JOIN alamat e ON e.id = b.id_albongkar
      LEFT JOIN mitra f ON f.id_mitra = a.id_mitra_pickup
      LEFT JOIN mitra m ON m.id_mitra = a.id_mitra
      LEFT JOIN mitra n ON n.id_mitra = a.id_mitra_2
      LEFT JOIN m_driver g ON g.id = b.id_supir
      LEFT JOIN kendaraan h ON h.id = a.id_unit
      LEFT JOIN m_ar_detail k ON k.id_msm = a.id_msm
      LEFT JOIN m_ar l ON l.id_ar = k.id_ar
      LEFT JOIN m_ap_detail o ON o.id_msm = a.id_msm
      LEFT JOIN m_ap p ON p.id_ap = o.id_ap
      LEFT JOIN users t ON t.id = c.id_sales
      LEFT JOIN m_bu q ON q.id_bu = t.id_bu
      LEFT JOIN m_bu_brench s ON s.id_bu_brench = t.id_bu_brench
      LEFT JOIN m_sm_receive r ON r.id_msm = a.id_msm
      LEFT JOIN users v ON v.id = l.id_admin
      LEFT JOIN kendaraanstatus w ON w.id_msm = a.id_msm AND w.action = '9'
      LEFT JOIN m_tarif_customer z ON z.id_tarif_customer = b.id_price_customer
      LEFT JOIN m_tarif_eureka y ON y.id_tarif_eureka = z.id_tarif_eureka
      LEFT JOIN m_shipment ms ON ms.id = b.shipment
      WHERE a.status_pembatalan = 0 AND a.is_deleted = 0
      AND (a.tgl_muat BETWEEN ? AND ?)
    `;

    const replacements = [mulai, selesai];

    // Tambahkan kondisi filter berdasarkan parameter
    if (bu) {
      sql += " AND q.id_bu = ?";
      replacements.push(bu);
    }
    if (brench) {
      sql += " AND s.id_bu_brench = ?";
      replacements.push(brench);
    }
    if (vendor) {
      sql += " AND a.id_mitra_pickup = ?";
      replacements.push(vendor);
    }

    sql += " GROUP BY a.id_msm";

    // Eksekusi query menggunakan db.query
    const results = await db.query(sql, replacements);

    // Proses data seperti di PHP CodeIgniter
    const json = [];
    let no = 1;
    
    for (const key of results) {
      const aktual = (key.tgl_9 != '0' ? 
        (moment(key.tgl_9).unix() - moment(key.tgl_muat).unix()) / (60 * 60 * 24) + 1 : '0');
      
      no++;
      
      const datajson = {
        "no": no,
        "code_bu_brench": key.code_bu_brench,
        "msm": key.msm,
        "msp": key.msp,
        "customer": key.nama_perusahaan,
        "top": key.top,
        "muat": key.muat,
        "bongkar": key.bongkar,
        "kendaraan_operasional": key.kendaraan_operasional,
        "pickup": key.pickup,
        "pickup_nopol": key.pickup_nopol,
        "pickup_supir": key.pickup_supir,
        "mitra_1": key.mitra_1,
        "nopol": key.nopol,
        "jenis_kepemilikan": (!key.jenis_kepemilikan ? 'eur_oncall' : key.jenis_kepemilikan),
        "jenis_kendaraan": (!key.jenis_kendaraan ? key.kendaraan : key.jenis_kendaraan),
        "supir": key.supir,
        "mitra_2": key.mitra_2,
        "nopol_2": key.nopol_2,
        "supir_2": key.supir_2,
        "tgl_muat": key.tgl_muat,
        "harga": key.harga,
        "harga_muat": key.harga_muat,
        "harga_bongkar": key.harga_bongkar,
        "biaya_overtonase": key.biaya_overtonase,
        "biaya_multimuat": key.biaya_multimuat,
        "biaya_multidrop": key.biaya_multidrop,
        "biaya_mel": key.biaya_mel,
        "biaya_tambahan": key.biaya_tambahan,
        "biaya_lain": key.biaya_lain,
        "total": (key.no_invoice_ar !== null ? key.total_tagihan : 
                 (key.total == '0' && key.service == 'retailer' ? (key.harga * key.berat) : key.total)),
        "total_ap": key.total_ap,
        "berat": key.berat,
        "qty": key.qty,
        "koli": key.koli,
        "do_customer": key.do,
        "kode_sales": "S" + String(key.id_sales).padStart(4, '0'),
        "nama_sales": key.nama_sales,
        "tgl_1": key.tgl_1,
        "tgl_2": key.tgl_2,
        "tgl_3": key.tgl_3,
        "tgl_5": key.tgl_5,
        "tgl_9": key.tgl_9,
        "lead_time": key.lead_time,
        "aktual_kirim": aktual,
        "is_terlambat": (aktual != '0' && key.lead_time != '0' ? 
                        (key.lead_time - aktual >= 0 ? 'Tepat' : 'Terlambat') : '0'),
        "status_sj": key.date_ops,
        "sjsendops": key.sjsendops,
        "sjonap": key.date_ap,
        "tgl_terima_inv": key.tgl_terima_invoice,
        "no_invoice_ap": key.no_invoice_ap,
        "receivesj_ops": key.receivesj_ops,
        "ap_create_date": key.ap_create_date,
        "no_invoice_mitra": key.no_invoice_mitra,
        "transaction_date": key.transaction_date,
        "due_date": key.due_date,
        "transaction_status_name": key.transaction_status_name,
        "sjonar": key.date_ar,
        "date_ar_tolak": key.date_ar_tolak,
        "no_invoice_ar": key.no_invoice_ar,
        "inv_create_date": key.inv_create_date,
        "shipment": key.shipment
      };
      
      json.push(datajson);
    }

    // Buat workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Monitoring Order');

    // Set headers
    const headers = [
      'No', 'Code BU Brench', 'MSM', 'MSP', 'Customer', 'TOP', 'Muat', 'Bongkar',
      'Kendaraan Operasional', 'Pickup', 'Pickup Nopol', 'Pickup Supir', 'Mitra 1',
      'Nopol', 'Jenis Kepemilikan', 'Jenis Kendaraan', 'Supir', 'Mitra 2', 'Nopol 2',
      'Supir 2', 'Tgl Muat', 'Harga', 'Harga Muat', 'Harga Bongkar', 'Biaya Overtonase',
      'Biaya Multimuat', 'Biaya Multidrop', 'Biaya Mel', 'Biaya Tambahan', 'Biaya Lain', 'Total',
      'Total AP', 'Berat', 'Qty', 'Koli', 'DO Customer', 'Kode Sales', 'Nama Sales',
      'Tgl 1', 'Tgl 2', 'Tgl 3', 'Tgl 5', 'Tgl 9', 'Lead Time', 'Aktual Kirim',
      'Is Terlambat', 'Status SJ', 'SJ Send Ops', 'SJ On AP', 'Tgl Terima Inv',
      'No Invoice AP', 'Receive SJ Ops', 'AP Create Date', 'No Invoice Mitra',
      'Transaction Date', 'Due Date', 'Transaction Status Name', 'SJ On AR',
      'Date AR Tolak', 'No Invoice AR', 'Inv Create Date', 'Shipment'
    ];

    // Set column headers
    worksheet.columns = headers.map(header => ({
      header: header,
      key: header.toLowerCase().replace(/\s+/g, '_'),
      width: 15
    }));

    // Add data rows
    json.forEach((row, index) => {
      const excelRow = {
        no: row.no,
        code_bu_brench: row.code_bu_brench,
        msm: row.msm,
        msp: row.msp,
        customer: row.customer,
        top: row.top,
        muat: row.muat,
        bongkar: row.bongkar,
        kendaraan_operasional: row.kendaraan_operasional,
        pickup: row.pickup,
        pickup_nopol: row.pickup_nopol,
        pickup_supir: row.pickup_supir,
        mitra_1: row.mitra_1,
        nopol: row.nopol,
        jenis_kepemilikan: row.jenis_kepemilikan,
        jenis_kendaraan: row.jenis_kendaraan,
        supir: row.supir,
        mitra_2: row.mitra_2,
        nopol_2: row.nopol_2,
        supir_2: row.supir_2,
        tgl_muat: row.tgl_muat,
        harga: row.harga,
        harga_muat: row.harga_muat,
        harga_bongkar: row.harga_bongkar,
        biaya_overtonase: row.biaya_overtonase,
        biaya_multimuat: row.biaya_multimuat,
        biaya_multidrop: row.biaya_multidrop,
        biaya_mel: row.biaya_mel,
        biaya_tambahan: row.biaya_tambahan,
        biaya_lain: row.biaya_lain,
        total: row.total,
        total_ap: row.total_ap,
        berat: row.berat,
        qty: row.qty,
        koli: row.koli,
        do_customer: row.do_customer,
        kode_sales: row.kode_sales,
        nama_sales: row.nama_sales,
        tgl_1: row.tgl_1,
        tgl_2: row.tgl_2,
        tgl_3: row.tgl_3,
        tgl_5: row.tgl_5,
        tgl_9: row.tgl_9,
        lead_time: row.lead_time,
        aktual_kirim: row.aktual_kirim,
        is_terlambat: row.is_terlambat,
        status_sj: row.status_sj,
        sj_send_ops: row.sjsendops,
        sj_on_ap: row.sjonap,
        tgl_terima_inv: row.tgl_terima_inv,
        no_invoice_ap: row.no_invoice_ap,
        receive_sj_ops: row.receivesj_ops,
        ap_create_date: row.ap_create_date,
        no_invoice_mitra: row.no_invoice_mitra,
        transaction_date: row.transaction_date,
        due_date: row.due_date,
        transaction_status_name: row.transaction_status_name,
        sj_on_ar: row.sjonar,
        date_ar_tolak: row.date_ar_tolak,
        no_invoice_ar: row.no_invoice_ar,
        inv_create_date: row.inv_create_date,
        shipment: row.shipment
      };
      
      worksheet.addRow(excelRow);
    });

    // Set response headers untuk download file
    const filename = `${moment().format('YYYYMMDD')}_monitoring_bysm.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    
    // Set headers untuk menghindari limit ukuran file
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Write Excel file ke response stream
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error exportExcelUnlimited:', error);
    
    // Cek apakah response sudah dikirim
    if (!res.headersSent) {
      res.status(500).json({
        status: {
          code: 500,
          message: error.message
        }
      });
    } else {
      // Jika headers sudah dikirim, log error saja
      console.error('Headers already sent, cannot send error response');
    }
  }
};

exports.getMonitoringSJList = async (req, res) => {
  try {
    const { mulai, selesai, bu, limit, page, vendor, brench } = req.query;

    if (!mulai || !selesai) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Parameter mulai dan selesai wajib diisi"
        }
      });
    }

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNum - 1) * pageSize;

    let sql = `
      SELECT 
        a.id_msm, 
        a.msm, 
        DATE(a.tgl_muat) AS tgl_muat, 
        b.id_unit, 
        b.id_mpd, 
        b.id_mp, 
        c.msp, 
        d.kota AS muat, 
        e.kota AS bongkar, 
        f.id_mitra, 
        a.id_bu, 
        a.tgl_terima_inv, 
        f.nama_mitra AS pickup, 
        a.pickup_nopol, 
        a.pickup_supir, 
        a.berat, 
        a.qty, 
        a.koli, 
        a.ikat, 
        l.no_invoice_ar, 
        l.tgl_create AS inv_create_date, 
        p.no_invoice_ap, 
        p.tgl_invoice_ap AS ap_create_date, 
        p.no_invoice_mitra, 
        u.nama_perusahaan, 
        v.nama_lengkap AS penginput_ar, 
        MAX(IF(r.divisi = 'operasional', r.date_added, 0)) AS date_ops, 
        MAX(IF(r.divisi = 'ap',          r.date_added, 0)) AS date_ap, 
        MAX(IF(r.divisi = 'ar',          r.date_added, 0)) AS date_ar, 
        MAX(IF(r.divisi = 'operasional', r.diserahkan, 0)) AS sjsendops, 
        MAX(IF(w.action = 9, w.tgl_update, 0)) AS tgl_9 
      FROM m_sm a 
      INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd 
      INNER JOIN m_pengadaan c        ON c.id_mp = b.id_mp AND c.status IN (1,2) 
      INNER JOIN customer u           ON u.id_customer = c.id_customer 
      INNER JOIN m_status_order mso   ON mso.id_mp = c.id_mp AND mso.kendaraan_purchasing = 'Y' 
      INNER JOIN alamat d             ON d.id = b.id_almuat 
      INNER JOIN alamat e             ON e.id = b.id_albongkar 
      INNER JOIN mitra f              ON f.id_mitra = a.id_mitra_pickup 
      LEFT JOIN m_ar_detail k         ON k.id_msm = a.id_msm 
      LEFT JOIN m_ar l                ON l.id_ar = k.id_ar 
      LEFT JOIN m_ap_detail o         ON o.id_msm = a.id_msm 
      LEFT JOIN m_ap p                ON p.id_ap = o.id_ap 
      LEFT JOIN users t               ON t.id = c.id_sales 
      LEFT JOIN m_sm_receive r        ON r.id_msm = a.id_msm 
      LEFT JOIN users v               ON v.id = l.id_admin 
      LEFT JOIN kendaraanstatus w     ON w.id_msm = a.id_msm AND w.action = 9 
      WHERE a.status_pembatalan = 0 
        AND a.is_deleted = 0 
        AND (a.tgl_muat BETWEEN ? AND ?) 
    `;

    const params = [mulai, selesai];

    if (bu) {
      sql += " AND a.id_bu = ?";
      params.push(bu);
    }
    if (brench) {
      sql += " AND t.id_bu_brench = ?";
      params.push(brench);
    }
    if (vendor) {
      sql += " AND a.id_mitra_pickup = ?";
      params.push(vendor);
    }

    sql += " GROUP BY a.id_msm ORDER BY a.id_msm DESC LIMIT ? OFFSET ?";
    params.push(pageSize, offset);

    const countSql = `
      SELECT COUNT(DISTINCT a.id_msm) AS total
      FROM m_sm a 
      INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd 
      INNER JOIN m_pengadaan c        ON c.id_mp = b.id_mp AND c.status IN (1,2) 
      INNER JOIN customer u           ON u.id_customer = c.id_customer 
      INNER JOIN m_status_order mso   ON mso.id_mp = c.id_mp AND mso.kendaraan_purchasing = 'Y' 
      INNER JOIN alamat d             ON d.id = b.id_almuat 
      INNER JOIN alamat e             ON e.id = b.id_albongkar 
      INNER JOIN mitra f              ON f.id_mitra = a.id_mitra_pickup 
      LEFT JOIN m_ar_detail k         ON k.id_msm = a.id_msm 
      LEFT JOIN m_ar l                ON l.id_ar = k.id_ar 
      LEFT JOIN m_ap_detail o         ON o.id_msm = a.id_msm 
      LEFT JOIN m_ap p                ON p.id_ap = o.id_ap 
      LEFT JOIN users t               ON t.id = c.id_sales 
      LEFT JOIN m_sm_receive r        ON r.id_msm = a.id_msm 
      LEFT JOIN users v               ON v.id = l.id_admin 
      LEFT JOIN kendaraanstatus w     ON w.id_msm = a.id_msm AND w.action = 9 
      WHERE a.status_pembatalan = 0 
        AND a.is_deleted = 0 
        AND (a.tgl_muat BETWEEN ? AND ?) 
        ${bu ? ' AND a.id_bu = ?' : ''}
        ${brench ? ' AND t.id_bu_brench = ?' : ''}
        ${vendor ? ' AND a.id_mitra_pickup = ?' : ''}
    `;

    const countParams = [mulai, selesai, ...(bu ? [bu] : []), ...(brench ? [brench] : []), ...(vendor ? [vendor] : [])];
    const countRows = await db.query(countSql, countParams);
    const total = countRows?.[0]?.total ? Number(countRows[0].total) : 0;

    const rows = await db.query(sql, params);

    const data = rows.map((key, index) => {
      const aktual = (key.tgl_9 != '0' ? 
        (moment(key.tgl_9).unix() - moment(key.tgl_muat).unix()) / (60 * 60 * 24) + 1 : '0');
      return {
        no: offset + index + 1,
        id_msm: key.id_msm,
        msm: key.msm,
        tgl_muat: key.tgl_muat,
        id_unit: key.id_unit,
        id_mpd: key.id_mpd,
        id_mp: key.id_mp,
        msp: key.msp,
        muat: key.muat,
        bongkar: key.bongkar,
        id_mitra: key.id_mitra,
        id_bu: key.id_bu,
        tgl_terima_inv: key.tgl_terima_inv,
        pickup: key.pickup,
        pickup_nopol: key.pickup_nopol,
        pickup_supir: key.pickup_supir,
        berat: key.berat,
        qty: key.qty,
        koli: key.koli,
        ikat: key.ikat,
        no_invoice_ar: key.no_invoice_ar,
        inv_create_date: key.inv_create_date,
        no_invoice_ap: key.no_invoice_ap,
        ap_create_date: key.ap_create_date,
        no_invoice_mitra: key.no_invoice_mitra,
        nama_perusahaan: key.nama_perusahaan,
        penginput_ar: key.penginput_ar,
        date_ops: key.date_ops,
        date_ap: key.date_ap,
        date_ar: key.date_ar,
        sjsendops: key.sjsendops,
        tgl_9: key.tgl_9,
        aktual_kirim: aktual
      };
    });

    return res.status(200).json({
      status: { code: 200, message: "Success Get Monitoring SJ" },
      data,
      total_data: total,
      pagination: { page: pageNum, limit: pageSize, count: rows.length, total }
    });
  } catch (error) {
    return res.status(500).json({
      status: { code: 500, message: error.message }
    });
  }
}

exports.getTerimaSJ = async (req, res) => {
  try {
    const { id_msm, mulai, selesai, limit, page } = req.query;

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 50;
    const offset = (pageNum - 1) * pageSize;

    let sql = `
      SELECT 
        msr.id_sm_receive,
        msr.id_msm,
        msr.divisi,
        msr.id_user,
        msr.checklist,
        msr.no_invoice_vendor,
        msr.status,
        msr.date_added,
        msr.memo,
        msr.kepada,
        msr.diserahkan,
        msr.diserahkan_group,
        msr.tolak_user,
        msr.tolak_tgl,
        a.no_invoice_ap,
        a.tgl_terima_inv,
        u.nama_lengkap
      FROM m_sm_receive msr
      LEFT JOIN m_sm a ON a.id_msm = msr.id_msm
      LEFT JOIN users u ON u.id = msr.id_user
      WHERE 1=1
    `;

    const params = [];

    if (id_msm) {
      sql += " AND msr.id_msm = ?";
      params.push(id_msm);
    }

    if (mulai && selesai) {
      sql += " AND (msr.date_added BETWEEN ? AND ?)";
      params.push(mulai, selesai);
    }

    sql += " ORDER BY msr.date_added DESC LIMIT ? OFFSET ?";
    params.push(pageSize, offset);

    const rows = await db.query(sql, params);

    const hasil = rows.map(r => ({
      id_sm_receive: String(r.id_sm_receive),
      id_msm: String(r.id_msm),
      divisi: r.divisi,
      id_user: String(r.id_user),
      checklist: r.checklist,
      no_invoice_vendor: r.no_invoice_vendor || "",
      status: r.status,
      date_added: r.date_added ? moment(r.date_added).format('YYYY-MM-DD HH:mm:ss') : null,
      memo: r.memo || "",
      kepada: r.kepada || null,
      diserahkan: r.diserahkan || null,
      diserahkan_group: r.diserahkan_group || null,
      tolak_user: r.tolak_user || null,
      tolak_tgl: r.tolak_tgl ? moment(r.tolak_tgl).format('YYYY-MM-DD HH:mm:ss') : null,
      no_invoice_ap: r.no_invoice_ap || null,
      tgl_terima_inv: r.tgl_terima_inv || null
    }));

    const toAction = (status) => {
      if (status === 'reject') return 'Ditolak';
      if (status === 'receive') return 'Diterima';
      return 'Diproses';
    };

    const res_check = rows.map(r => ({
      id_sm_receive: String(r.id_sm_receive),
      tgl: r.date_added ? moment(r.date_added).format('YYYY-MM-DD HH:mm:ss') : null,
      siapa: r.nama_lengkap || '-',
      aksi: toAction(r.status)
    }));

    return res.status(200).json({
      status: { code: 200, message: 'Success Get Terima SJ' },
      hasil,
      res_check,
      pagination: { page: pageNum, limit: pageSize, count: rows.length }
    });
  } catch (error) {
    return res.status(500).json({
      status: { code: 500, message: error.message }
    });
  }
}

exports.submitTerimaSJ = async (req, res) => {
  try {
    const { id_msm, status, no_invoice_ap, tgl_terima_inv, memo, checklist, checkall } = req.body;
    if (!id_msm || !status) {
      return res.status(400).json({
        status: { code: 400, message: 'id_msm dan status wajib diisi' }
      });
    }

    const userRecord = await models.users.findOne({ where: { id: req.user.id } });
    const divisi = (req.user && req.user.divisi) ? req.user.divisi : (userRecord ? userRecord.divisi : null);
    const check = (divisi === 'ar') ? (checkall || '') : (checklist || '');

    let affected = 0;

    if (status === 'reject') {
      const target = await models.m_sm_receive.findOne({ where: { id_msm, kepada: divisi } });
      if (target && target.diserahkan_group) {
        const groupList = String(target.diserahkan_group).split(',').filter(Boolean);
        const idx = groupList.indexOf(String(target.id_sm_receive));
        if (idx !== -1) {
          const removedId = target.id_sm_receive;
          groupList.splice(idx, 1);
          await models.m_sm_receive.update(
            { tolak_user: req.user.id, tolak_tgl: new Date(), diserahkan: null, diserahkan_group: '' },
            { where: { id_sm_receive: removedId } }
          );
          affected += 1;
        }
        const newGroup = groupList.join(',');
        for (const id of groupList) {
          await models.m_sm_receive.update(
            { diserahkan_group: newGroup },
            { where: { id_sm_receive: id } }
          );
          affected += 1;
        }
      }
    } else {
      if (no_invoice_ap) {
        await models.m_sm.update(
          { no_invoice_ap, tgl_terima_inv },
          { where: { id_msm } }
        );
        affected += 1;
      }

      const insertData = {
        id_msm,
        divisi,
        id_user: req.user.id,
        checklist: check,
        no_invoice_vendor: no_invoice_ap || '',
        status,
        memo: memo || '',
        date_added: new Date()
      };
      await models.m_sm_receive.create(insertData);
      affected += 1;
    }

    if (affected > 0) {
      const callback = `${core.baseUrl}/monitoring/order/bysm`;
      return res.status(200).json({
        error: false,
        type: 'info',
        message: 'Data sedang di ubah, mohon tunggu...',
        divisi: divisi === 'operasional' ? 'ops' : divisi,
        date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        id_msm,
        callback
      });
    } else {
      return res.status(500).json({
        error: true,
        type: 'error',
        message: 'Terjadi kesalahan: tidak ada perubahan'
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      type: 'error',
      message: error.message
    });
  }
}

exports.getReceiveSjOps = async (req, res) => {
  try {
    const params = req.body?.params || {};
    const tgl_mulai = params.tgl_mulai;
    const tgl_akhir = params.tgl_akhir;
    const bu = params.bu;
    const brench = params.bu_brench;

    const penerima = req.user.id;

    let sql = `
      SELECT a.*, b.msm, d.msp, e.nama_perusahaan, f.nama_lengkap
      FROM m_sm_receive a
      INNER JOIN m_sm b ON b.id_msm = a.id_msm
      INNER JOIN m_pengadaan_detail c ON c.id_mpd = b.id_mpd
      LEFT JOIN m_pengadaan d ON d.id_mp = c.id_mp
      LEFT JOIN customer e ON e.id_customer = d.id_customer
      INNER JOIN users t ON t.id = d.id_sales
      INNER JOIN m_bu q ON q.id_bu = t.id_bu
      LEFT JOIN m_bu_brench s ON s.id_bu_brench = t.id_bu_brench
      INNER JOIN users f ON f.id = a.id_user
      WHERE d.status != '0' AND a.id_user = ?
    `;

    const paramsQuery = [penerima];

    if (tgl_mulai && tgl_akhir) {
      sql += ` AND a.date_added BETWEEN ? AND ?`;
      paramsQuery.push(tgl_mulai, tgl_akhir);
    }

    sql += ` AND (a.diserahkan IS NULL OR a.diserahkan = '0000-00-00')`;

    if (bu) {
      sql += ` AND q.id_bu LIKE ?`;
      paramsQuery.push(bu);
    }
    if (brench) {
      sql += ` AND s.id_bu_brench LIKE ?`;
      paramsQuery.push(brench);
    }

    sql += ` GROUP BY a.id_sm_receive ORDER BY a.id_msm DESC`;

    const rows = await db.query(sql, paramsQuery);

    const data = rows.map((key, idx) => {
      const fruits = String(key.checklist || '')
        .replace(/_/g, ' ')
        .split(',')
        .filter(Boolean);
      const checklist = fruits.map(f => `<span class='label bg-green'>${f}</span> `).join('\n');

      return {
        no: idx + 1,
        id_msm: key.id_msm,
        id_sm_receive: key.id_sm_receive,
        msm: key.msm,
        nama_perusahaan: key.nama_perusahaan,
        checklist,
        date_added: key.date_added,
        nama_lengkap: key.nama_lengkap
      };
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({
      status: { code: 500, message: error.message }
    });
  }
}

exports.submitSerahkanSJ = async (req, res) => {
  try {
    const { checkall, kepada } = req.body;
    if (!checkall || !kepada) {
      return res.status(400).json({
        status: { code: 400, message: 'checkall dan kepada wajib diisi' }
      });
    }

    const ids = String(checkall)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      return res.status(400).json({
        status: { code: 400, message: 'Daftar id_sm_receive tidak valid' }
      });
    }

    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const placeholders = ids.map(() => '?').join(',');
    const sql = `UPDATE m_sm_receive SET kepada = ?, diserahkan = ?, diserahkan_group = ? WHERE id_sm_receive IN (${placeholders})`;
    const params = [kepada, now, checkall, ...ids];

    await db.query(sql, params);

    const callback = `${core.baseUrl}/monitoring/order/print_serahkan_sj?group=${checkall}`;
    return res.status(200).json({
      error: false,
      type: 'info',
      message: 'Data sedang di ubah, mohon tunggu...',
      callback,
      date: now
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      type: 'error',
      message: error.message
    });
  }
}

exports.getMonitoringHistoryReceive = async (req, res) => {
  try {
    const { mulai, selesai, limit, page, bu, brench, mitra, user } = req.query;
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNum - 1) * pageSize;

    let sql = `
      SELECT 
        a.*, 
        b.msm, 
        d.msp, 
        e.nama_perusahaan, 
        f.nama_lengkap 
      FROM m_sm_receive a 
      INNER JOIN m_sm b ON b.id_msm = a.id_msm 
      INNER JOIN m_pengadaan_detail c ON c.id_mpd = b.id_mpd 
      LEFT JOIN m_pengadaan d ON d.id_mp = c.id_mp 
      LEFT JOIN customer e ON e.id_customer = d.id_customer 
      INNER JOIN users t ON t.id = d.id_sales 
      INNER JOIN m_bu q ON q.id_bu = t.id_bu 
      LEFT JOIN m_bu_brench s ON s.id_bu_brench = t.id_bu_brench 
      INNER JOIN users f ON f.id = a.id_user 
      WHERE b.is_deleted = 0 
    `;
    const params = [];

    if (mulai && selesai) {
      sql += ` AND a.date_added BETWEEN ? AND ?`;
      params.push(mulai, selesai);
    }

    if (bu) {
      sql += ` AND q.id_bu = ?`;
      params.push(bu);
    }
    if (brench) {
      sql += ` AND s.id_bu_brench = ?`;
      params.push(brench);
    }
    if (mitra) {
      sql += ` AND e.nama_perusahaan LIKE ?`;
      params.push(`%${mitra}%`);
    }
    if (user) {
      sql += ` AND f.nama_lengkap LIKE ?`;
      params.push(`%${user}%`);
    }

    sql += ` GROUP BY a.id_sm_receive ORDER BY a.id_sm_receive DESC LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    const rows = await db.query(sql, params);

    const countSql = `
      SELECT COUNT(DISTINCT a.id_sm_receive) AS total
      FROM m_sm_receive a 
      INNER JOIN m_sm b ON b.id_msm = a.id_msm 
      INNER JOIN m_pengadaan_detail c ON c.id_mpd = b.id_mpd 
      LEFT JOIN m_pengadaan d ON d.id_mp = c.id_mp 
      LEFT JOIN customer e ON e.id_customer = d.id_customer 
      INNER JOIN users t ON t.id = d.id_sales 
      INNER JOIN m_bu q ON q.id_bu = t.id_bu 
      LEFT JOIN m_bu_brench s ON s.id_bu_brench = t.id_bu_brench 
      INNER JOIN users f ON f.id = a.id_user 
      WHERE b.is_deleted = 0 
      ${mulai && selesai ? ' AND a.date_added BETWEEN ? AND ?' : ''}
      ${bu ? ' AND q.id_bu = ?' : ''}
      ${brench ? ' AND s.id_bu_brench = ?' : ''}
      ${mitra ? ' AND e.nama_perusahaan LIKE ?' : ''}
      ${user ? ' AND f.nama_lengkap LIKE ?' : ''}
    `;
    const countParams = [
      ...(mulai && selesai ? [mulai, selesai] : []),
      ...(bu ? [bu] : []),
      ...(brench ? [brench] : []),
      ...(mitra ? [`%${mitra}%`] : []),
      ...(user ? [`%${user}%`] : [])
    ];
    const totalRows = await db.query(countSql, countParams);
    const total = totalRows?.[0]?.total ? Number(totalRows[0].total) : 0;

    return res.status(200).json({
      status: { code: 200, message: 'Success Get Monitoring History Receive' },
      data: rows,
      total_data: total,
      pagination: { page: pageNum, limit: pageSize, count: rows.length, total }
    });
  } catch (error) {
    return res.status(500).json({ status: { code: 500, message: error.message } });
  }
}

exports.monitoringHistoryReceive = async (req, res) => {
  try {
    const draw = parseInt(req.body.draw || 1);
    const start = parseInt(req.body.start || 0);
    const length = parseInt(req.body.length || 10);
    const searchValue = req.body?.search?.value || '';
    const paramsBody = req.body?.params || {};
    const mitra = paramsBody.mitra || '';
    const bu = paramsBody.bu || '';
    const brench = paramsBody.brench || '';
    const mulai = paramsBody.mulai;
    const selesai = paramsBody.selesai;
    const id_user = paramsBody.id_user || '';

    let baseSql = `
      SELECT a.*, b.msm, d.msp, e.nama_perusahaan, f.nama_lengkap
      FROM m_sm_receive a
      INNER JOIN m_sm b ON b.id_msm = a.id_msm
      INNER JOIN m_pengadaan_detail c ON c.id_mpd = b.id_mpd
      LEFT JOIN m_pengadaan d ON d.id_mp = c.id_mp
      LEFT JOIN customer e ON e.id_customer = d.id_customer
      INNER JOIN users t ON t.id = d.id_sales
      INNER JOIN m_bu q ON q.id_bu = t.id_bu
      LEFT JOIN m_bu_brench s ON s.id_bu_brench = t.id_bu_brench
      INNER JOIN users f ON f.id = a.id_user
      WHERE b.is_deleted = 0
    `;

    const whereParts = [];
    const whereParams = [];

    if (mulai && selesai) {
      whereParts.push('a.date_added BETWEEN ? AND ?');
      whereParams.push(mulai, selesai);
    }
    if (mitra) {
      // Placeholder: kolom vendor tidak ada di join, abaikan/filter saat perlu
      // whereParts.push("h.vendor LIKE ?");
      // whereParams.push(`%${mitra}%`);
    }
    if (searchValue) {
      whereParts.push('b.msm LIKE ?');
      whereParams.push(`%${searchValue}%`);
    }
    if (bu) {
      whereParts.push('t.id_bu = ?');
      whereParams.push(bu);
    }
    if (brench) {
      whereParts.push('s.id_bu_brench = ?');
      whereParams.push(brench);
    }
    if (id_user) {
      whereParts.push('a.id_user = ?');
      whereParams.push(id_user);
    }

    if (whereParts.length) {
      baseSql += ' AND ' + whereParts.join(' AND ');
    }

    const countSql = baseSql + ' GROUP BY a.id_sm_receive';
    const countRows = await db.query(countSql, whereParams);
    const res_count = countRows.length;

    const dataSql = countSql + ' ORDER BY a.id_sm_receive DESC LIMIT ? OFFSET ?';
    const dataParams = [...whereParams, length, start];
    const resRows = await db.query(dataSql, dataParams);

    const startNo = start;
    const data = resRows.map((key, idx) => {
      const no = startNo + idx + 1;
      const diserahkanLink = key.diserahkan ? `${core.baseUrl}/monitoring/order/print_serahkan_sj?group=${key.diserahkan_group}` : '';
      return {
        no,
        msm: `<a href="${key.id_msm}"><b>${key.msm}</b> <br>${key.msp}</a>`,
        nama_perusahaan: key.nama_perusahaan,
        checklist: key.checklist,
        status: `<span class="badge bg-green">${key.status}</span>`,
        date_added: `<span id="${key.id_sm_receive}">${key.date_added}</span>`,
        memo: key.memo,
        nama_lengkap: key.nama_lengkap,
        diserahkan: key.diserahkan ? `<a class="btn btn-sm btn-primary" href="${diserahkanLink}">${key.diserahkan} <small> - Print</small></a>` : ''
      };
    });

    return res.status(200).json({
      draw,
      recordsTotal: res_count,
      recordsFiltered: res_count,
      sql: dataSql,
      data
    });
  } catch (error) {
    return res.status(500).json({ status: { code: 500, message: error.message } });
  }
}

// Export Excel dengan streaming untuk file yang sangat besar
exports.exportExcelStreaming = async (req, res) => {
  try {
    const { bu, brench, mulai, selesai, vendor } = req.query;

    // Validasi parameter wajib
    if (!mulai || !selesai) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Parameter mulai dan selesai wajib diisi"
        }
      });
    }

    // Set CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Set response headers untuk Excel streaming
    const filename = `${moment().format('YYYYMMDD')}_monitoring_bysm_streaming.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Buat workbook dengan streaming
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: false,
      useSharedStrings: false
    });

    const worksheet = workbook.addWorksheet('Monitoring Order');

    // Set headers
    const headers = [
      'No', 'Code BU Brench', 'MSM', 'MSP', 'Customer', 'TOP', 'Muat', 'Bongkar',
      'Kendaraan Operasional', 'Pickup', 'Pickup Nopol', 'Pickup Supir', 'Mitra 1',
      'Nopol', 'Jenis Kepemilikan', 'Jenis Kendaraan', 'Supir', 'Mitra 2', 'Nopol 2',
      'Supir 2', 'Tgl Muat', 'Harga', 'Harga Muat', 'Harga Bongkar', 'Biaya Overtonase',
      'Biaya Multimuat', 'Biaya Multidrop', 'Biaya Mel', 'Biaya Tambahan', 'Biaya Lain', 'Total',
      'Total AP', 'Berat', 'Qty', 'Koli', 'DO Customer', 'Kode Sales', 'Nama Sales',
      'Tgl 1', 'Tgl 2', 'Tgl 3', 'Tgl 5', 'Tgl 9', 'Lead Time', 'Aktual Kirim',
      'Is Terlambat', 'Status SJ', 'SJ Send Ops', 'SJ On AP', 'Tgl Terima Inv',
      'No Invoice AP', 'Receive SJ Ops', 'AP Create Date', 'No Invoice Mitra',
      'Transaction Date', 'Due Date', 'Transaction Status Name', 'SJ On AR',
      'Date AR Tolak', 'No Invoice AR', 'Inv Create Date', 'Shipment'
    ];

    // Add header row
    worksheet.addRow(headers);

    // Query dengan pagination untuk menghindari memory overflow
    const pageSize = 500;
    let offset = 0;
    let hasMoreData = true;
    let rowNumber = 1;

    while (hasMoreData) {
      // Query dengan LIMIT dan OFFSET
      let sql = `
        SELECT 
          a.id_msm,
          a.msm,
          DATE(a.tgl_muat) AS tgl_muat,
          b.id_unit,
          b.id_mpd,
          b.id_mp,
          c.msp,
          c.service,
          d.kota as muat,
          e.kota as bongkar,
          f.id_mitra,
          c.id_sales,
          c.top,
          a.id_bu,
          a.tgl_terima_inv,
          f.nama_mitra as pickup,
          a.pickup_nopol,
          a.pickup_supir,
          h.jenis_kepemilikan,
          h.jenis_kendaraan,
          m.nama_mitra as mitra_1,
          a.nopol,
          a.supir,
          n.nama_mitra as mitra_2,
          a.nopol_2,
          a.supir_2,
          s.code_bu_brench,
          b.harga,
          b.harga_muat,
          b.harga_bongkar,
          b.biaya_overtonase,
          b.biaya_multimuat,
          b.biaya_multidrop,
          b.biaya_mel,
          b.biaya_tambahan,
          b.biaya_lain,
          b.total,
          b.kendaraan,
          k.total_tagihan,
          l.no_invoice_ar,
          l.tgl_create as inv_create_date,
          p.tgl_terima_invoice,
          p.receivesj_ops,
          p.no_invoice_ap,
          p.tgl_invoice_ap as ap_create_date,
          p.no_invoice_mitra,
          u.nama_perusahaan,
          x.kendaraan_operasional,
          v.nama_lengkap as penginput_ar,
          o.subtotal as total_ap,
          0 as transaction_date,
          0 as due_date,
          0 as transaction_status_name,
          MAX(IF (r.divisi = 'operasional', r.date_added, 0)) AS 'date_ops',
          MAX(IF (r.divisi = 'ap', r.date_added, 0)) AS 'date_ap',
          MAX(IF (r.divisi = 'ar', r.date_added, 0)) AS 'date_ar',
          MAX(IF (r.tolak_user IS NOT NULL, r.tolak_tgl, 0)) AS 'date_ar_tolak',
          MAX(IF (r.divisi = 'operasional', r.diserahkan, 0)) AS 'sjsendops',
          MAX(IF (w.action = 1, w.tgl_update, 0)) AS 'tgl_1',
          MAX(IF (w.action = 2, w.tgl_update, 0)) AS 'tgl_2',
          MAX(IF (w.action = 3, w.tgl_update, 0)) AS 'tgl_3',
          MAX(IF (w.action = 5, w.tgl_update, 0)) AS 'tgl_5',
          MAX(IF (w.action = 9, w.tgl_update, 0)) AS 'tgl_9',
          a.berat,
          a.qty,
          a.koli,
          a.do,
          t.nama_lengkap as nama_sales,
          y.lead_time,
          ms.shipment
        FROM m_sm a
        INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
        INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2) 
        INNER JOIN m_status_order x ON x.id_mp = c.id_mp AND x.kendaraan_purchasing = 'Y'
        INNER JOIN customer u ON u.id_customer = c.id_customer
        LEFT JOIN alamat d ON d.id = b.id_almuat
        LEFT JOIN alamat e ON e.id = b.id_albongkar
        LEFT JOIN mitra f ON f.id_mitra = a.id_mitra_pickup
        LEFT JOIN mitra m ON m.id_mitra = a.id_mitra
        LEFT JOIN mitra n ON n.id_mitra = a.id_mitra_2
        LEFT JOIN m_driver g ON g.id = b.id_supir
        LEFT JOIN kendaraan h ON h.id = a.id_unit
        LEFT JOIN m_ar_detail k ON k.id_msm = a.id_msm
        LEFT JOIN m_ar l ON l.id_ar = k.id_ar
        LEFT JOIN m_ap_detail o ON o.id_msm = a.id_msm
        LEFT JOIN m_ap p ON p.id_ap = o.id_ap
        LEFT JOIN users t ON t.id = c.id_sales
        LEFT JOIN m_bu q ON q.id_bu = t.id_bu
        LEFT JOIN m_bu_brench s ON s.id_bu_brench = t.id_bu_brench
        LEFT JOIN m_sm_receive r ON r.id_msm = a.id_msm
        LEFT JOIN users v ON v.id = l.id_admin
        LEFT JOIN kendaraanstatus w ON w.id_msm = a.id_msm AND w.action = '9'
        LEFT JOIN m_tarif_customer z ON z.id_tarif_customer = b.id_price_customer
        LEFT JOIN m_tarif_eureka y ON y.id_tarif_eureka = z.id_tarif_eureka
        LEFT JOIN m_shipment ms ON ms.id = b.shipment
        WHERE a.status_pembatalan = 0 AND a.is_deleted = 0
        AND (a.tgl_muat BETWEEN ? AND ?)
      `;

      const replacements = [mulai, selesai];

      if (bu) {
        sql += " AND q.id_bu = ?";
        replacements.push(bu);
      }
      if (brench) {
        sql += " AND s.id_bu_brench = ?";
        replacements.push(brench);
      }
      if (vendor) {
        sql += " AND a.id_mitra_pickup = ?";
        replacements.push(vendor);
      }

      sql += " GROUP BY a.id_msm LIMIT ? OFFSET ?";
      replacements.push(pageSize, offset);

      const results = await db.query(sql, replacements);

      if (results.length === 0) {
        hasMoreData = false;
        break;
      }

      // Process dan add rows dengan real-time streaming
      for (const key of results) {
        const aktual = (key.tgl_9 != '0' ? 
          (moment(key.tgl_9).unix() - moment(key.tgl_muat).unix()) / (60 * 60 * 24) + 1 : '0');

        const excelRow = [
          rowNumber++,
          key.code_bu_brench,
          key.msm,
          key.msp,
          key.nama_perusahaan,
          key.top,
          key.muat,
          key.bongkar,
          key.kendaraan_operasional,
          key.pickup,
          key.pickup_nopol,
          key.pickup_supir,
          key.mitra_1,
          key.nopol,
          (!key.jenis_kepemilikan ? 'eur_oncall' : key.jenis_kepemilikan),
          (!key.jenis_kendaraan ? key.kendaraan : key.jenis_kendaraan),
          key.supir,
          key.mitra_2,
          key.nopol_2,
          key.supir_2,
          key.tgl_muat,
          key.harga,
          key.harga_muat,
          key.harga_bongkar,
          key.biaya_overtonase,
          key.biaya_multimuat,
          key.biaya_multidrop,
          key.biaya_mel,
          key.biaya_tambahan,
          key.biaya_lain,
          (key.no_invoice_ar !== null ? key.total_tagihan : 
           (key.total == '0' && key.service == 'retailer' ? (key.harga * key.berat) : key.total)),
          key.total_ap,
          key.berat,
          key.qty,
          key.koli,
          key.do,
          "S" + String(key.id_sales).padStart(4, '0'),
          key.nama_sales,
          key.tgl_1,
          key.tgl_2,
          key.tgl_3,
          key.tgl_5,
          key.tgl_9,
          key.lead_time,
          aktual,
          (aktual != '0' && key.lead_time != '0' ? 
           (key.lead_time - aktual >= 0 ? 'Tepat' : 'Terlambat') : '0'),
          key.date_ops,
          key.sjsendops,
          key.date_ap,
          key.tgl_terima_invoice,
          key.no_invoice_ap,
          key.receivesj_ops,
          key.ap_create_date,
          key.no_invoice_mitra,
          key.transaction_date,
          key.due_date,
          key.transaction_status_name,
          key.date_ar,
          key.date_ar_tolak,
          key.no_invoice_ar,
          key.inv_create_date,
          key.shipment
        ];

        // Add row dan commit langsung untuk real-time streaming
        const row = worksheet.addRow(excelRow);
        await row.commit();
      }

      offset += pageSize;
    }

    // WAJIB
    await worksheet.commit();

    // WAJIB
    await workbook.commit();

    // WAJIB
    res.end();

  } catch (error) {
    console.error('Error exportExcelStreaming:', error);
    
    // Cek apakah response sudah dikirim
    if (!res.headersSent) {
      res.status(500).json({
        status: {
          code: 500,
          message: error.message
        }
      });
    } else {
      // Jika headers sudah dikirim, log error saja
      console.error('Headers already sent, cannot send error response');
    }
  }
};
