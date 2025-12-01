const { query } = require('../../config/db.config');

// exports.createDarurat = async (req, res) => {
//   try {
//     const {
//       foto,
//       kategori,
//       deskripsi,
//       longitude,
//       latitude,
//       status = 'new',
//       tanggapan = ""
//     } = req.body;
//     // const foto = req.file ? req.file.filename : null;
//     const now = new Date();

//     const result = await query(
//       `INSERT INTO db_darurat 
//         (foto, kategori, deskripsi, longitude, latitude, status, tanggapan, date_created, date_modified)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [foto, kategori, deskripsi, longitude, latitude, status, tanggapan, now, now]
//     );

//     res.json({
//       message: 'Data darurat berhasil disimpan.',
//       insertId: result.insertId
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: err.message,
//       error: err
//     });
//   }
// };

exports.createDarurat = async (req, res) => {
  try {
    const {
      kategori,
      deskripsi,
      longitude,
      latitude,
      status = 'new',
      tanggapan = "",
      id_bu
    } = req.body;
    const foto = req.file ? req.file.filename : null;
    const now = new Date();

    const result = await query(
      `INSERT INTO db_darurat 
        (foto, kategori, deskripsi, longitude, latitude, status, tanggapan, id_bu, date_created, date_modified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [foto, kategori, deskripsi, longitude, latitude, status, tanggapan, id_bu, now, now]
    );

    res.json({
      message: 'Data darurat berhasil disimpan.',
      insertId: result.insertId
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      error: err
    });
  }
};

exports.getAllDarurat = async (req, res) => {
  try {
    const { id_bu, kategori, id_darurat } = req.query;

    let sql = `SELECT * FROM db_darurat`;
    let conditions = [];
    let params = [];

    if (id_bu) {
      conditions.push(`id_bu = ?`);
      params.push(id_bu);
    }

    if (kategori) {
      conditions.push(`kategori = ?`);
      params.push(kategori);
    }

    if (id_darurat) {
      conditions.push(`id_darurat = ?`);
      params.push(id_darurat);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    sql += ` ORDER BY date_created DESC`;

    const results = await query(sql, params);

    res.json({
      status: 'success',
      data: results
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      error: err
    });
  }
};

exports.updateTanggapanDarurat = async (req, res) => {
  try {
    const { id_darurat, status, tanggapan } = req.body;
    const now = new Date();

    if (!id_darurat) {
      return res.status(400).json({ status: 'error', message: 'id_darurat harus diisi' });
    }

    const validStatus = ['new', 'process', 'done', 'cancel'];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Status tidak valid' });
    }

    const sql = `
      UPDATE db_darurat
      SET status = COALESCE(?, status),
          tanggapan = COALESCE(?, tanggapan),
          date_modified = ?
      WHERE id_darurat = ?
    `;

    await query(sql, [status, tanggapan, now, id_darurat]);

    res.json({ status: 'success', message: 'Darurat berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      error: err
    });
  }
};
