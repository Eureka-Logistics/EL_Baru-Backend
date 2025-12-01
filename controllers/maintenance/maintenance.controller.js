const core = require('../../config/core.config');
const db = require("../../config/db.config");
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, QueryTypes  } = require('sequelize');

// Helper to generate unique code_maintenance like MNT-YYYYMMDD-XXXX
async function generateUniqueCodeMaintenance(sequelize, transaction) {
  const pad = (num, size) => String(num).padStart(size, '0');
  for (let attempt = 0; attempt < 5; attempt++) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}`;
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const code = `MNT-${dateStr}-${suffix}`;
    const existRows = await sequelize.query(
      `SELECT 1 FROM repair_request WHERE code_maintenance = ? LIMIT 1`,
      {
        replacements: [code],
        type: QueryTypes.SELECT,
        transaction
      }
    );
    if (existRows.length === 0) return code;
  }
  // Fallback extremely unlikely
  return `MNT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

exports.createRepairRequest = async (req, res, next) => {
  const {
    id_unit, requested_by, username, repair_date, problem_title, odometer_km,
    location, status = 'new', priority = 'medium',
    photo_evidence, completed_at, notes
  } = req.body;

  // Validate required fields
  if (!id_unit || !requested_by || !username || !repair_date || !problem_title) {
    return res.status(400).json({ 
      message: 'Missing required fields: id_unit, requested_by, username, repair_date, problem_title' 
    });
  }

  // Start Sequelize transaction
  const sequelize = core.dbConnect();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    // Format dates properly
    const formattedRepairDate = new Date(repair_date).toISOString().slice(0, 19).replace('T', ' ');
    const formattedCompletedAt = completed_at
      ? new Date(completed_at).toISOString().slice(0, 19).replace('T', ' ')
      : null;

    // Generate unique code for this repair request
    const codeMaintenance = await generateUniqueCodeMaintenance(sequelize, transaction);

    // Validate that kendaraan exists before inserting repair request
    const kendaraanInfo = await sequelize.query(
      `SELECT id, no_polisi, id_driver FROM kendaraan WHERE id = ?`,
      {
        replacements: [id_unit],
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (kendaraanInfo.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ 
        message: `Kendaraan with id ${id_unit} not found` 
      });
    }

    // Insert repair request
    const result = await sequelize.query(
      `
      INSERT INTO repair_request (
        code_maintenance, id_unit, requested_by, username, repair_date, problem_title, odometer_km,
        location, status, priority, photo_evidence, completed_at, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      {
        replacements: [
          codeMaintenance,
          id_unit,
          requested_by,
          username,
          formattedRepairDate,
          problem_title,
          odometer_km || 0,
          location || '',
          status,
          priority,
          photo_evidence || null,
          formattedCompletedAt,
          notes || ''
        ],
        type: QueryTypes.INSERT,
        transaction
      }
    );

    const kendaraan = kendaraanInfo[0];
    
    // Get driver information if id_driver exists
    let driverName = 'Unknown Driver';
    if (kendaraan.id_driver) {
      const driverInfo = await sequelize.query(
        `SELECT id, nama FROM m_driver WHERE id = ?`,
        {
          replacements: [kendaraan.id_driver],
          type: QueryTypes.SELECT,
          transaction
        }
      );

      if (driverInfo.length > 0) {
        driverName = driverInfo[0].nama;
      }
    }

    // ...existing code...

    // Commit transaction
    await transaction.commit();

    res.status(201).json({ 
      message: 'Success create repair request and update kendaraan status!', 
      id: result[0],
      code_maintenance: codeMaintenance
    });
  } catch (err) {
    // Rollback transaction on error
    if (transaction) {
      await transaction.rollback();
    }
    
    console.error('Error in createRepairRequest:', err);
    
    // Check for specific database errors
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        message: 'Referenced record not found. Please check if the kendaraan exists.',
        error: err.message
      });
    }
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        message: 'Duplicate entry. This repair request already exists.',
        error: err.message
      });
    }

    if (err.code === 'ER_BAD_NULL_ERROR') {
      return res.status(400).json({ 
        message: 'Required field is null. Please check all required fields.',
        error: err.message
      });
    }

    if (err.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({ 
        message: 'Data too long for one or more fields. Please check field lengths.',
        error: err.message
      });
    }

    if (err.code === 'ER_WARN_DATA_TRUNCATED') {
      return res.status(400).json({ 
        message: 'Data truncated for one or more fields. Please check data types and lengths.',
        error: err.message
      });
    }
    
    // Return the actual error message
    res.status(500).json({
      message: 'Database error occurred while creating repair request',
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? {
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState,
        sqlMessage: err.sqlMessage,
        sql: err.sql
      } : null
    });
  }
};

exports.getAllRepairRequests = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;  
    const page = parseInt(req.query.page) || 1;       
    const search = req.query.search || '';

    const offset = (page - 1) * limit;

    const countResult = await db.query(`
      SELECT COUNT(*) AS total FROM repair_request rr
      LEFT JOIN kendaraan k ON rr.id_unit = k.id
      WHERE rr.problem_title LIKE ? OR rr.location LIKE ? OR rr.code_maintenance LIKE ? 
      OR k.no_polisi LIKE ?
    `, [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]);
    
    const total = countResult[0].total;

    const data = await db.query(`
      SELECT rr.*, k.no_polisi, k.jenis_kendaraan, k.merk_mobil, k.tahun_mobil
      FROM repair_request rr
      LEFT JOIN kendaraan k ON rr.id_unit = k.id
      WHERE rr.problem_title LIKE ? OR rr.location LIKE ? OR rr.code_maintenance LIKE ? 
      OR k.no_polisi LIKE ?
      ORDER BY rr.repair_request_id DESC
      LIMIT ? OFFSET ?
    `, [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, limit, offset]);

    res.status(200).json({
      total,
      page,
      limit,
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.getRepairRequestsByRequestedBy = async (req, res, next) => {
  try {
    const { requested_by } = req.params;
    const limit = parseInt(req.query.limit) || 10;  
    const page = parseInt(req.query.page) || 1;       
    const search = req.query.search || '';

    const offset = (page - 1) * limit;

    // Validate requested_by parameter
    if (!requested_by) {
      return res.status(400).json({ 
        message: 'requested_by parameter is required' 
      });
    }

    // Build search conditions
    const searchConditions = search ? 
      `AND (rr.problem_title LIKE ? OR rr.location LIKE ? OR rr.code_maintenance LIKE ? OR k.no_polisi LIKE ?)` : 
      '';

    const searchParams = search ? 
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`] : 
      [];

    // Get total count
    const countQuery = `
      SELECT COUNT(*) AS total FROM repair_request rr
      LEFT JOIN kendaraan k ON rr.id_unit = k.id
      WHERE rr.requested_by = ? ${searchConditions}
    `;
    
    const countResult = await db.query(countQuery, [requested_by, ...searchParams]);
    const total = countResult[0].total;

    // Get data with pagination
    const dataQuery = `
      SELECT rr.*, k.no_polisi, k.jenis_kendaraan, k.merk_mobil, k.tahun_mobil
      FROM repair_request rr
      LEFT JOIN kendaraan k ON rr.id_unit = k.id
      WHERE rr.requested_by = ? ${searchConditions}
      ORDER BY rr.repair_request_id DESC
      LIMIT ? OFFSET ?
    `;

    const data = await db.query(dataQuery, [requested_by, ...searchParams, limit, offset]);

    res.status(200).json({
      total,
      page,
      limit,
      requested_by,
      data
    });
  } catch (err) {
    console.error('Error in getRepairRequestsByRequestedBy:', err);
    next(err);
  }
};

exports.getRepairRequestById = async (req, res, next) => {
  try {
    const data = await db.query(
      `SELECT * FROM repair_request WHERE repair_request_id = ?`,
      [req.params.id]
    );

    if (data.length === 0) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(data[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateRepairRequest = async (req, res, next) => {
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return res.status(400).json({ message: 'No fields to update' });

  try {
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `
      UPDATE repair_request 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE repair_request_id = ?
    `;

    const result = await db.query(query, [...values, req.params.id]);

    if (result[0]?.affectedRows === 0) {
      return res.status(404).json({ message: 'Not found or no change made' });
    }

    // Jika status di-update menjadi 'in_repair' atau 'completed', insert ke kendaraanstatus
    if (fields.status === 'in_repair' || fields.status === 'completed') {
      // Ambil data repair_request dan kendaraan
      const [repairRequest] = await db.query(
        `SELECT * FROM repair_request WHERE repair_request_id = ?`,
        [req.params.id]
      );
      if (repairRequest) {
        const [kendaraan] = await db.query(
          `SELECT id, no_polisi, id_driver FROM kendaraan WHERE id = ?`,
          [repairRequest.id_unit]
        );
        let driverName = 'Unknown Driver';
        if (kendaraan && kendaraan.id_driver) {
          const [driverInfo] = await db.query(
            `SELECT nama FROM m_driver WHERE id = ?`,
            [kendaraan.id_driver]
          );
          if (driverInfo) driverName = driverInfo.nama;
        }
        // Tentukan kondisi_kendaraan dan action
        let kondisi_kendaraan = 'Maintenance';
        let action = 99;
        let empty_load = 'Maintenance';
        let keterangan = `Maintenance Request: ${repairRequest.problem_title}`;
        let memo = `Priority: ${repairRequest.priority}, Location: ${repairRequest.location || 'Unknown'}`;
        if (fields.status === 'completed') {
          kondisi_kendaraan = 'Ready';
          action = 1; // misal 1 untuk ready, sesuaikan jika ada kode lain
          empty_load = 'Ready';
          keterangan = `Maintenance Completed: ${repairRequest.problem_title}`;
          memo = `Completed at: ${repairRequest.completed_at || ''}`;
        }
        await db.query(
          `INSERT INTO kendaraanstatus (
            id_kendaraan, no_polisi, id_pengemudi, nama_driver, id_msm, 
            kondisi_kendaraan, action, empty_load, keterangan, memo, 
            customer, posisi, tgl_update, tgl_create, id_user
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
          `,
          [
            kendaraan.id,
            kendaraan.no_polisi || '',
            kendaraan.id_driver || 0,
            driverName,
            0,
            kondisi_kendaraan,
            action,
            empty_load,
            keterangan,
            memo,
            '-',
            repairRequest.location || '',
            287
          ]
        );
      }
    }

    res.json({ message: 'Repair request updated successfully' });
  } catch (err) {
    next(err);
  }
};

exports.deleteRepairRequest = async (req, res, next) => {
  try {
    const result = await db.query(
      `DELETE FROM repair_request WHERE repair_request_id = ?`,
      [req.params.id]
    );

    console.log('Delete result:', result);

    const affected = result.affectedRows || (Array.isArray(result) && result[0]?.affectedRows);

    if (!affected) {
      return res.status(404).json({ message: 'Repair request not found' });
    }

    res.json({ message: 'Repair request deleted successfully' });
  } catch (err) {
    console.error('Error in deleteRepairRequest:', err);
    res.status(500).json({
      status: { code: 500, message: err.message },
      error: err,
    });
  }
};

//DETAIL
exports.getRepairRequestWithDetails = async (req, res, next) => {
  try {
    const repairRequestId = req.params.id;

    const requestRows = await db.query(
      `SELECT * FROM repair_request WHERE repair_request_id = ?`,
      [repairRequestId]
    );

    if (requestRows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const request = requestRows[0];

    const details = await db.query(
      `SELECT * FROM repair_request_detail WHERE repair_request_id = ?`,
      [repairRequestId]
    );

    const progress = await db.query(
      `SELECT * FROM repair_progress WHERE repair_request_id = ? ORDER BY created_at ASC`,
      [repairRequestId]
    );

    res.json({
      repair_request: request,
      details,
      progress,
    });
  } catch (err) {
    console.error("Get Repair Request With Details Error:", err);
    res.status(500).json({
      status: {
        code: 500,
        message: err.message
      },
      error: err
    });
  }
};

exports.addRepairDetail = async (req, res, next) => {
  const { issue_category_id, description, is_urgent = 0 } = req.body;
  const { id } = req.params;

  try {
    const checkRequest = await db.query(
      `SELECT repair_request_id FROM repair_request WHERE repair_request_id = ?`,
      [id]
    );

    if (checkRequest.length === 0) {
      return res.status(404).json({ message: 'Repair request not found' });
    }

    const insertResult = await db.query(
      `INSERT INTO repair_request_detail (repair_request_id, issue_category_id, description, is_urgent)
       VALUES (?, ?, ?, ?)`,
      [id, issue_category_id, description, is_urgent]
    );

    res.status(201).json({
      message: "Detail added",
      id: insertResult.insertId
    });

  } catch (err) {
    console.error("Insert Detail Error:", err);
    res.status(500).json({
      status: {
        code: 500,
        message: err.message
      },
      error: err
    });
  }
};

exports.deleteRepairDetail = async (req, res, next) => {
  const { detail_id } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM repair_request_detail WHERE repair_request_detail_id = ?`,
      [detail_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Detail not found" });
    }

    res.json({ message: "Detail deleted" });
  } catch (err) {
    console.error("Delete Detail Error:", err);
    next(err);
  }
};

//PROGRESS
exports.addRepairProgress = async (req, res, next) => {
  const { note, created_by, username } = req.body;
  const { id: repair_request_id } = req.params;

  try {
    if (!repair_request_id || !note || !created_by|| !username) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    const result = await db.query(
      `INSERT INTO repair_progress (repair_request_id, note, created_by, username) VALUES (?, ?, ?, ?)`,
      [repair_request_id, note, created_by, username]
    );

    const insertId = result.insertId || result[0]?.insertId;

    res.status(201).json({ message: 'Progress added', id: insertId });
  } catch (err) {
    console.error("Add Repair Progress Error:", err);
    next(err);
  }
};

exports.deleteRepairProgress = async (req, res, next) => {
  const { progress_id } = req.params;

  try {
    const [result] = await db.query(
      `DELETE FROM repair_progress WHERE repair_progress_id = ?`,
      [progress_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.json({ message: "Progress deleted" });
  } catch (err) {
    console.error("Delete Repair Progress Error:", err);
    next(err);
  }
};

exports.getRepairProgress = async (req, res) => {
  try {
    const { id } = req.params; // repair_request_id dari URL

    const query = `
      SELECT 
        id, 
        repair_request_id, 
        note, 
        created_by, 
        created_at
      FROM repair_progress
      WHERE repair_request_id = ?
      ORDER BY created_at DESC
    `;

    const result = await db.query(query, [id]);

    const output = {
      status: {
        code: 200,
        message: 'Success Get Repair Progress'
      },
      data: result
    };

    res.status(200).json(output);
  } catch (error) {
    console.error('Error getRepairProgress:', error);
    res.status(500).json({
      status: {
        code: 500,
        message: error.message
      }
    });
  }
};

exports.getAllIssueCategory = async (req, res) => {
  try {
    const { limit, page, keyword } = req.query;

    const _limit = parseInt(limit) || 10;
    const _page = parseInt(page) || 1;
    const offset = (_page - 1) * _limit;

    let whereClause = '';
    let params = [];

    if (keyword) {
      whereClause = 'WHERE issue_category_name LIKE ?';
      params.push(`%${keyword}%`);
    }

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM repair_issue_categories
      ${whereClause}
    `;
    const countResult = await db.query(countQuery, params);
    const totalData = countResult[0].total;
    const totalPage = Math.ceil(totalData / _limit);

    const dataQuery = `
      SELECT issue_category_id, issue_category_name, description, is_active, created_at, updated_at
      FROM repair_issue_categories
      ${whereClause}
      ORDER BY issue_category_id DESC
      LIMIT ? OFFSET ?
    `;

    params.push(_limit, offset);

    const rows = await db.query(dataQuery, params);

    const output = {
      status: {
        code: 200,
        message: 'Success Get Data'
      },
      data: {
        totalData,
        totalPage,
        currentPage: _page,
        limit: _limit,
        rows
      }
    };

    res.status(200).json(output);
  } catch (error) {
    console.error('Error getAllIssueCategory:', error);
    res.status(500).json({
      status: {
        code: 500,
        message: error.message
      }
    });
  }
};

// Update kondisi barang dan shipping manifest
exports.updateKondisiBarangDanShipping = async (req, res, next) => {
  const {
    id_msm, // ID dari tabel m_sm untuk update
    tgl_eta,
    do: doNumber, // Rename 'do' to avoid reserved keyword
    nama_kapal,
    kapal_berangkat,
    // Data kondisi barang untuk insert ke m_sm_kondisi_barang
    salahkirim,
    salahkirim_satuan,
    dipisah,
    dipisah_satuan,
    kurang,
    kurang_satuan,
    rusak,
    rusak_satuan,
    keterangan,
    id_admin
  } = req.body;

  // Validate required fields
  if (!id_msm) {
    return res.status(400).json({ 
      message: 'id_msm is required' 
    });
  }

  // Start Sequelize transaction
  const sequelize = core.dbConnect();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    // 1. Update tabel m_sm dengan data shipping manifest
    const updateFields = [];
    const updateValues = [];

    if (tgl_eta !== undefined) {
      updateFields.push('tgl_eta = ?');
      updateValues.push(tgl_eta);
    }
    if (doNumber !== undefined) {
      updateFields.push('do = ?');
      updateValues.push(doNumber);
    }
    if (nama_kapal !== undefined) {
      updateFields.push('nama_kapal = ?');
      updateValues.push(nama_kapal);
    }
    if (kapal_berangkat !== undefined) {
      updateFields.push('kapal_berangkat = ?');
      updateValues.push(kapal_berangkat);
    }
    if (keterangan !== undefined) {
      updateFields.push('keterangan = ?');
      updateValues.push(keterangan);
    }

    if (updateFields.length > 0) {
      // Check if m_sm record exists
      const checkSm = await sequelize.query(
        `SELECT id_msm FROM m_sm WHERE id_msm = ?`,
        {
          replacements: [id_msm],
          type: QueryTypes.SELECT,
          transaction
        }
      );

      if (checkSm.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ 
          message: `Shipping manifest with id_msm ${id_msm} not found` 
        });
      }

      // Update m_sm
      const updateQuery = `
        UPDATE m_sm 
        SET ${updateFields.join(', ')}
        WHERE id_msm = ?
      `;
      
      await sequelize.query(updateQuery, {
        replacements: [...updateValues, id_msm],
        type: QueryTypes.UPDATE,
        transaction
      });
    }

    // 2. Insert ke tabel m_sm_kondisi_barang jika ada data kondisi barang
    const hasKondisiData = salahkirim !== undefined || dipisah !== undefined || 
                          kurang !== undefined || rusak !== undefined || 
                          keterangan !== undefined;

    if (hasKondisiData) {
      // Validate required fields for kondisi barang
      if (id_admin === undefined) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: 'id_admin is required when updating kondisi barang' 
        });
      }

      // Insert ke m_sm_kondisi_barang
      const insertKondisiQuery = `
        INSERT INTO m_sm_kondisi_barang (
          id_msm, salahkirim, salahkirim_satuan, dipisah, dipisah_satuan,
          kurang, kurang_satuan, rusak, rusak_satuan, keterangan, id_admin, date_created
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const kondisiResult = await sequelize.query(insertKondisiQuery, {
        replacements: [
          id_msm,
          salahkirim || 0,
          salahkirim_satuan || 'qty',
          dipisah || 0,
          dipisah_satuan || 'qty',
          kurang || 0,
          kurang_satuan || 'qty',
          rusak || 0,
          rusak_satuan || 'qty',
          keterangan || '',
          id_admin
        ],
        type: QueryTypes.INSERT,
        transaction
      });

      console.log('Kondisi barang inserted with ID:', kondisiResult[0]);
    }

    // Commit transaction
    await transaction.commit();

    res.status(200).json({ 
      message: 'Success update shipping manifest and kondisi barang!',
      id_msm: id_msm,
      updated_fields: updateFields.length > 0 ? updateFields : 'No shipping fields updated',
      kondisi_inserted: hasKondisiData
    });

  } catch (err) {
    // Rollback transaction on error
    if (transaction) {
      await transaction.rollback();
    }
    
    console.error('Error in updateKondisiBarangDanShipping:', err);
    
    // Check for specific database errors
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        message: 'Referenced record not found. Please check if the shipping manifest exists.',
        error: err.message
      });
    }
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        message: 'Duplicate entry. This record already exists.',
        error: err.message
      });
    }

    if (err.code === 'ER_BAD_NULL_ERROR') {
      return res.status(400).json({ 
        message: 'Required field is null. Please check all required fields.',
        error: err.message
      });
    }

    if (err.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({ 
        message: 'Data too long for one or more fields. Please check field lengths.',
        error: err.message
      });
    }

    if (err.code === 'ER_WARN_DATA_TRUNCATED') {
      return res.status(400).json({ 
        message: 'Data truncated for one or more fields. Please check data types and lengths.',
        error: err.message
      });
    }
    
    // Return the actual error message
    res.status(500).json({
      message: 'Database error occurred while updating shipping manifest and kondisi barang',
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? {
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState,
        sqlMessage: err.sqlMessage,
        sql: err.sql
      } : null
    });
  }
};

// Get kondisi barang dan shipping manifest
exports.getKondisiBarangDanShipping = async (req, res, next) => {
  const { id_msm } = req.params;

  // Validate required fields
  if (!id_msm) {
    return res.status(400).json({ 
      message: 'id_msm parameter is required' 
    });
  }

  try {
    const sequelize = core.dbConnect();

    // 1. Get data shipping manifest dari m_sm
    const shippingData = await sequelize.query(
      `SELECT 
        id_msm, tgl_eta, do, nama_kapal, kapal_berangkat, keterangan,
        msm, tgl_muat, tgl_bongkar, pembungkus, berat, qty, koli,
        id_mpd, id_mitra, id_mitra_2, id_unit, id_driver
      FROM m_sm 
      WHERE id_msm = ?`,
      {
        replacements: [id_msm],
        type: QueryTypes.SELECT
      }
    );

    if (shippingData.length === 0) {
      return res.status(404).json({ 
        message: `Shipping manifest with id_msm ${id_msm} not found` 
      });
    }

    // 2. Get data kondisi barang dari m_sm_kondisi_barang
    const kondisiData = await sequelize.query(
      `SELECT 
        id_msm_kondisi, id_msm, salahkirim, salahkirim_satuan, 
        dipisah, dipisah_satuan, kurang, kurang_satuan,
        rusak, rusak_satuan, keterangan, id_admin, date_created
      FROM m_sm_kondisi_barang 
      WHERE id_msm = ?
      ORDER BY date_created DESC`,
      {
        replacements: [id_msm],
        type: QueryTypes.SELECT
      }
    );

    // 3. Get additional info if needed (optional) - Commented out because m_mpd table doesn't exist
    let additionalInfo = {};
    // if (shippingData[0].id_mpd) {
    //   const mpdInfo = await sequelize.query(
    //     `SELECT id_mpd, no_mpd, customer, alamat_pickup, alamat_delivery 
    //      FROM m_mpd 
    //      WHERE id_mpd = ?`,
    //     {
    //       replacements: [shippingData[0].id_mpd],
    //       type: QueryTypes.SELECT
    //     }
    //   );
    //   if (mpdInfo.length > 0) {
    //     additionalInfo.mpd_info = mpdInfo[0];
    //   }
    // }

    res.status(200).json({ 
      message: 'Success get shipping manifest and kondisi barang data!',
      data: {
        shipping_manifest: shippingData[0],
        kondisi_barang: kondisiData,
        additional_info: additionalInfo,
        total_kondisi_records: kondisiData.length
      }
    });

  } catch (err) {
    console.error('Error in getKondisiBarangDanShipping:', err);
    
    // Return the actual error message
    res.status(500).json({
      message: 'Database error occurred while getting shipping manifest and kondisi barang data',
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? {
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState,
        sqlMessage: err.sqlMessage,
        sql: err.sql
      } : null
    });
  }
};