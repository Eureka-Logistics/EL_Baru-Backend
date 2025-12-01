const core = require('../../config/core.config');
const db = require("../../config/db.config");
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, QueryTypes  } = require('sequelize');

function buildReturHistoryText(payload) {
  const { action, no_retur, id_msm_retur, header = {}, detail = [] } = payload || {};
  const headerKeys = [
    'id_msm', 'id_customer', 'id_mitra', 'id_unit', 'id_driver',
    'date_retur', 'kategori', 'keterangan', 'foto', 'penerima',
    'alasan', 'id_pool', 'id_admin', 'pihak_dibebankan'
  ];
  const headerText = headerKeys
    .filter((k) => typeof header[k] !== 'undefined' && header[k] !== null && header[k] !== '')
    .map((k) => `${k}=${header[k]}`)
    .join(', ');

  const detailText = Array.isArray(detail) && detail.length > 0
    ? detail.map((d, i) => {
        const parts = [];
        if (typeof d.nama_barang !== 'undefined') parts.push(`${d.nama_barang}`);
        const attrs = [];
        if (typeof d.berat !== 'undefined') attrs.push(`berat ${d.berat}`);
        if (typeof d.qty !== 'undefined') attrs.push(`qty ${d.qty}`);
        if (typeof d.koli !== 'undefined') attrs.push(`koli ${d.koli}`);
        if (typeof d.nilai_barang !== 'undefined') attrs.push(`nilai ${d.nilai_barang}`);
        return `[${i + 1}] ${parts.join(' ')} (${attrs.join(', ')})`;
      }).join('; ')
    : '-';

  const headParts = [];
  if (action) headParts.push(`Aksi=${action}`);
  if (no_retur) headParts.push(`NoRetur=${no_retur}`);
  if (id_msm_retur) headParts.push(`ID=${id_msm_retur}`);

  return `${headParts.join(' | ')} | Header: ${headerText} | Detail: ${detailText}`;
}

// Get history chat/nominal for retur
exports.getsmreturhistory = async (req, res) => {
  try {
    const { id_msm_retur } = req.query;

    if (!id_msm_retur) {
      return res.status(400).json({
        success: false,
        message: 'id_msm_retur wajib diisi'
      });
    }

    // Join with users table if exists to display user name (optional)
    // Fallback to raw model fields if users not available
    let rows;
    try {
      rows = await db.query(
        `SELECT h.id_msm_retur_history, h.id_msm_retur, h.id_user, u.name as user_name, h.chat, h.nominal, h.date_added
         FROM m_sm_retur_history h
         LEFT JOIN users u ON u.id_user = h.id_user
         WHERE h.id_msm_retur = ?
         ORDER BY h.date_added DESC`,
        [id_msm_retur]
      );
    } catch (e) {
      rows = await db.query(
        `SELECT id_msm_retur_history, id_msm_retur, id_user, chat, nominal, date_added
         FROM m_sm_retur_history
         WHERE id_msm_retur = ?
         ORDER BY date_added DESC`,
        [id_msm_retur]
      );
    }

    return res.status(200).json({
      success: true,
      data: rows.map(item => ({
        id_msm_retur_history: item.id_msm_retur_history,
        id_msm_retur: item.id_msm_retur,
        id_user: item.id_user,
        user_name: item.user_name || null,
        chat: item.chat,
        nominal: item.nominal,
        date_added: item.date_added
      }))
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllRetur = async (req, res) => {
  try {
    models.m_sm_retur.belongsTo(models.m_sm, { targetKey: 'id_msm', foreignKey: 'id_msm' });
    models.m_sm_retur.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
    models.m_sm_retur.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
    models.m_sm_retur.belongsTo(models.kendaraan, { targetKey: 'id', foreignKey: 'id_unit' });
    models.kendaraan.belongsTo(models.kendaraan_jenis, { targetKey: 'id_kendaraan_jenis', foreignKey: 'id_kendaraan_jenis' });
    models.m_sm_retur.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver' });

    const draw = parseInt(req.query.draw) || 1;
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query.search || '';
    const kategori = req.query.kategori || '';
    const dateFrom = req.query.dateFrom || '';
    const dateTo = req.query.dateTo || '';
    const idCustomer = req.query.idCustomer || '';
    const idMitra = req.query.idMitra || '';
    const idDriver = req.query.idDriver || '';
    const stageParamRaw = req.query.stage || req.query.status || '';
    let stages = [];
    if (Array.isArray(stageParamRaw)) {
      stages = stageParamRaw;
    } else if (stageParamRaw) {
      stages = stageParamRaw.split(',');
    }
    stages = stages
      .map((s) => (s || '').toString().trim().toLowerCase())
      .map((v) => {
        if (v === 'new') return 'New';
        if (v === 'process' || v === 'prosess' || v === 'proses') return 'Process';
        if (v === 'done' || v === 'selesai') return 'Done';
        return null;
      })
      .filter(Boolean);

    // Build where clause for search and filters
    let whereClause = {};
    
    // Search filter
    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { no_retur: { [Op.like]: `%${search}%` } },
          { kategori: { [Op.like]: `%${search}%` } },
          { keterangan: { [Op.like]: `%${search}%` } },
          { penerima: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    // Category filter
    if (kategori) {
      whereClause = {
        ...whereClause,
        kategori: { [Op.like]: `%${kategori}%` }
      };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      whereClause = {
        ...whereClause,
        date_created: {}
      };
      
      if (dateFrom) {
        whereClause.date_created[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.date_created[Op.lte] = new Date(dateTo + ' 23:59:59');
      }
    }

    // Customer filter
    if (idCustomer) {
      whereClause = {
        ...whereClause,
        id_customer: idCustomer
      };
    }

    // Mitra filter
    if (idMitra) {
      whereClause = {
        ...whereClause,
        id_mitra: idMitra
      };
    }

    // Driver filter
    if (idDriver) {
      whereClause = {
        ...whereClause,
        id_driver: idDriver
      };
    }

    // Stage filter
    if (stages.length === 1) {
      whereClause = {
        ...whereClause,
        stage: stages[0]
      };
    } else if (stages.length > 1) {
      whereClause = {
        ...whereClause,
        stage: { [Op.in]: stages }
      };
    }

    // Get total records with search filter
    let searchWhereClause = whereClause;
    
    // If search is provided, we need to use include with where clauses for related tables
    if (search) {
      searchWhereClause = {
        [Op.or]: [
          // Search in main retur table
          { no_retur: { [Op.like]: `%${search}%` } },
          { kategori: { [Op.like]: `%${search}%` } },
          { keterangan: { [Op.like]: `%${search}%` } },
          { penerima: { [Op.like]: `%${search}%` } },
          // Search in related tables using include where
          { '$m_sm.msm$': { [Op.like]: `%${search}%` } },
          { '$customer.nama_perusahaan$': { [Op.like]: `%${search}%` } },
          { '$mitra.nama_mitra$': { [Op.like]: `%${search}%` } },
          { '$kendaraan.no_polisi$': { [Op.like]: `%${search}%` } },
          { '$m_driver.nama$': { [Op.like]: `%${search}%` } },
          { '$m_driver.no_telp$': { [Op.like]: `%${search}%` } }
        ]
      };
    }

    // For search functionality, we'll use a different approach
    let recordsTotal;
    if (search) {
      // Use raw query for better search performance across multiple tables
      let searchQuery = `
        SELECT COUNT(DISTINCT r.id_msm_retur) as total
        FROM m_sm_retur r
        LEFT JOIN m_sm ms ON r.id_msm = ms.id_msm
        LEFT JOIN customer c ON r.id_customer = c.id_customer
        LEFT JOIN mitra m ON r.id_mitra = m.id_mitra
        LEFT JOIN kendaraan k ON r.id_unit = k.id
        LEFT JOIN m_driver d ON r.id_driver = d.id
        WHERE (
          r.no_retur LIKE ? OR 
          r.kategori LIKE ? OR 
          r.keterangan LIKE ? OR 
          r.penerima LIKE ? OR
          ms.msm LIKE ? OR
          c.nama_perusahaan LIKE ? OR
          m.nama_mitra LIKE ? OR
          k.no_polisi LIKE ? OR
          d.nama LIKE ? OR
          d.no_telp LIKE ?
        )
      `;
      
      let searchParams = Array(10).fill(`%${search}%`);
      
      // Add additional filters if they exist
      if (idCustomer || idMitra || idDriver || kategori || dateFrom || dateTo || stages.length) {
        searchQuery += ` AND `;
        const additionalFilters = [];
        
        if (idCustomer) {
          additionalFilters.push(`r.id_customer = ?`);
          searchParams.push(idCustomer);
        }
        
        if (idMitra) {
          additionalFilters.push(`r.id_mitra = ?`);
          searchParams.push(idMitra);
        }
        
        if (idDriver) {
          additionalFilters.push(`r.id_driver = ?`);
          searchParams.push(idDriver);
        }
        
        if (kategori) {
          additionalFilters.push(`r.kategori LIKE ?`);
          searchParams.push(`%${kategori}%`);
        }

        if (stages.length === 1) {
          additionalFilters.push(`r.stage = ?`);
          searchParams.push(stages[0]);
        } else if (stages.length > 1) {
          additionalFilters.push(`r.stage IN (${stages.map(() => '?').join(',')})`);
          stages.forEach((s) => searchParams.push(s));
        }
        
        if (dateFrom || dateTo) {
          if (dateFrom && dateTo) {
            additionalFilters.push(`r.date_created BETWEEN ? AND ?`);
            searchParams.push(new Date(dateFrom), new Date(dateTo + ' 23:59:59'));
          } else if (dateFrom) {
            additionalFilters.push(`r.date_created >= ?`);
            searchParams.push(new Date(dateFrom));
          } else if (dateTo) {
            additionalFilters.push(`r.date_created <= ?`);
            searchParams.push(new Date(dateTo + ' 23:59:59'));
          }
        }
        
        searchQuery += additionalFilters.join(' AND ');
      }
      
      const searchResult = await db.query(searchQuery, searchParams);
      recordsTotal = searchResult[0].total;
    } else {
      // Use normal count for non-search queries
      recordsTotal = await models.m_sm_retur.count({
        where: whereClause
      });
    }

    let data;
    // Use raw query for all cases to ensure consistency
    let baseQuery = `
      SELECT DISTINCT 
        r.id_msm_retur,
        r.no_retur,
        r.id_msm,
        r.id_customer,
        r.id_mitra,
        r.id_unit,
        r.id_driver,
        r.stage,
        r.kategori,
        r.keterangan,
        r.foto,
        r.penerima,
        r.pihak_dibebankan,
        r.id_pool,
        r.id_admin,
        r.date_created,
        (
          SELECT COALESCE(SUM(rd.nilai_barang), 0)
          FROM m_sm_retur_detail rd
          WHERE rd.id_msm_retur = r.id_msm_retur
        ) AS total,
        ms.msm,
        c.nama_perusahaan as customer,
        m.nama_mitra,
        k.no_polisi,
        kj.nama_kendaraan_jenis,
        d.nama,
        d.no_telp
      FROM m_sm_retur r
      LEFT JOIN m_sm ms ON r.id_msm = ms.id_msm
      LEFT JOIN customer c ON r.id_customer = c.id_customer
      LEFT JOIN mitra m ON r.id_mitra = m.id_mitra
      LEFT JOIN kendaraan k ON r.id_unit = k.id
      LEFT JOIN kendaraan_jenis kj ON k.id_kendaraan_jenis = kj.id_kendaraan_jenis
      LEFT JOIN m_driver d ON r.id_driver = d.id
    `;
    
    let queryParams = [];
    let whereConditions = [];
    
    if (search) {
      whereConditions.push(`(
        r.no_retur LIKE ? OR 
        r.kategori LIKE ? OR 
        r.keterangan LIKE ? OR 
        r.penerima LIKE ? OR
        ms.msm LIKE ? OR
        c.nama_perusahaan LIKE ? OR
        m.nama_mitra LIKE ? OR
        k.no_polisi LIKE ? OR
        d.nama LIKE ? OR
        d.no_telp LIKE ?
      )`);
      queryParams.push(...Array(10).fill(`%${search}%`));
    }
    
    // Add additional filters
    if (idCustomer) {
      whereConditions.push(`r.id_customer = ?`);
      queryParams.push(idCustomer);
    }
    
    if (idMitra) {
      whereConditions.push(`r.id_mitra = ?`);
      queryParams.push(idMitra);
    }
    
    if (idDriver) {
      whereConditions.push(`r.id_driver = ?`);
      queryParams.push(idDriver);
    }

    if (stages.length === 1) {
      whereConditions.push(`r.stage = ?`);
      queryParams.push(stages[0]);
    } else if (stages.length > 1) {
      whereConditions.push(`r.stage IN (${stages.map(() => '?').join(',')})`);
      stages.forEach((s) => queryParams.push(s));
    }
    
    if (kategori) {
      whereConditions.push(`r.kategori LIKE ?`);
      queryParams.push(`%${kategori}%`);
    }
    
    if (dateFrom || dateTo) {
      if (dateFrom && dateTo) {
        whereConditions.push(`r.date_created BETWEEN ? AND ?`);
        queryParams.push(new Date(dateFrom), new Date(dateTo + ' 23:59:59'));
      } else if (dateFrom) {
        whereConditions.push(`r.date_created >= ?`);
        queryParams.push(new Date(dateFrom));
      } else if (dateTo) {
        whereConditions.push(`r.date_created <= ?`);
        queryParams.push(new Date(dateTo + ' 23:59:59'));
      }
    }
    
    if (whereConditions.length > 0) {
      baseQuery += ` WHERE ` + whereConditions.join(' AND ');
    }
    
    baseQuery += ` ORDER BY r.date_created DESC LIMIT ? OFFSET ?`;
    queryParams.push(length, start);
    
    const queryResult = await db.query(baseQuery, queryParams);
    data = queryResult;

    const result = data.map((item) => {
      // Handle raw query result (now used for all cases)
      return {
        id_msm_retur: item.id_msm_retur,
        no_retur: item.no_retur,
        id_msm: item.id_msm,
        id_customer: item.id_customer,
        stage: item.stage || null,
        msm: item.msm || null,
        customer: item.customer || null,
        id_mitra: item.id_mitra,
        nama_mitra: item.nama_mitra || null,
        id_unit: item.id_unit,
        no_polisi: item.no_polisi || null,
        nama_kendaraan_jenis: item.nama_kendaraan_jenis || null,
        id_driver: item.id_driver,
        nama: item.nama || null,
        no_telp: item.no_telp || null,
        kategori: item.kategori,
        keterangan: item.keterangan,
        foto: item.foto,
        penerima: item.penerima,
        pihak_dibebankan: item.pihak_dibebankan,
        id_pool: item.id_pool,
        id_admin: item.id_admin,
        date_created: item.date_created,
        total: Number(item.total) || 0,
      };
    });

    res.json({
      draw: draw,
      recordsTotal: recordsTotal,
      recordsFiltered: recordsTotal,
      data: result,
      filters: {
        search: search,
        kategori: kategori,
        stage: stages.length ? stages.join(',') : '',
        dateFrom: dateFrom,
        dateTo: dateTo,
        idCustomer: idCustomer,
        idMitra: idMitra,
        idDriver: idDriver,
        start: start,
        length: length
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};

exports.createRetur = async (req, res) => {
  try {
    const {
      id_msm,
      id_customer,
      id_mitra,
      id_unit,
      id_driver,
      date_retur,
      kategori,
      keterangan,
      foto,
      penerima,
      alasan,
      id_pool,
      id_admin,
      pihak_dibebankan,
      created_by_name,
      detail
    } = req.body;

    // Normalize optional fields to avoid undefined bindings
    const toNullIfUndefined = (v) => (typeof v === 'undefined' ? null : v);
    const kategoriX = toNullIfUndefined(kategori);
    const keteranganX = toNullIfUndefined(keterangan);
    const fotoX = toNullIfUndefined(foto);
    const penerimaX = toNullIfUndefined(penerima);
    const alasanX = toNullIfUndefined(alasan);
    const idPoolX = toNullIfUndefined(id_pool);
    const idAdminX = toNullIfUndefined(id_admin);
    const pihakDibebankanX = toNullIfUndefined(pihak_dibebankan);
    const createdByNameX = toNullIfUndefined(created_by_name);

    // Generate no_retur automatically with new format
    const no_retur = await generateNoRetur();

    if (!no_retur) {
      return res.status(500).json({
        message: "Gagal generate nomor retur",
        error: "Error generating no_retur"
      });
    }

    // Get creator user name - use provided name or lookup from database
    let createdByName = createdByNameX; // Use provided name first
    const creatorUserId = (req.user && (req.user.id_user || req.user.id))
      ? (req.user.id_user || req.user.id)
      : (id_admin || null);

    // If no name provided, try to get it from database
    if (!createdByName && creatorUserId) {
      try {
        const creatorUser = await models.users.findOne({
          where: { id: creatorUserId },
          attributes: ['nama_lengkap']
        });
        if (creatorUser) {
          createdByName = creatorUser.nama_lengkap;
        }
      } catch (e) {
        console.error('Failed to get creator name:', e.message || e);
      }
    }

    // Create retur using Sequelize model
    const returResult = await models.m_sm_retur.create({
      id_msm,
      no_retur,
      stage: 'New',
      id_customer,
      id_mitra,
      id_unit,
      id_driver,
      date_retur,
      kategori: kategoriX,
      keterangan: keteranganX,
      foto: fotoX,
      penerima: penerimaX,
      alasan: alasanX,
      id_pool: idPoolX,
      id_admin: idAdminX,
      pihak_dibebankan: pihakDibebankanX,
      date_created: new Date(),
      created_by_name: createdByName
    });

    const id_msm_retur = returResult.id_msm_retur;

    if (!id_msm_retur) {
      return res.status(500).json({
        message: "Gagal menambah data",
        error: "Gagal mendapatkan ID retur"
      });
    }

    // Create detail records using Sequelize model
    for (const item of detail) {
      const { nama_barang, berat, qty, koli, nilai_barang } = item;

      await models.m_sm_retur_detail.create({
        id_msm_retur,
        nama_barang,
        berat,
        qty,
        koli,
        nilai_barang
      });
    }

    // Create history record for this creation
    try {
      const totalNominal = Array.isArray(detail)
        ? detail.reduce((sum, d) => sum + (Number(d.nilai_barang) || 0), 0)
        : 0;


      const historyPayload = {
        action: 'CREATE_RETUR',
        no_retur,
        header: {
          id_msm,
          id_customer,
          id_mitra,
          id_unit,
          id_driver,
          date_retur,
          kategori: kategoriX,
          keterangan: keteranganX,
          foto: fotoX,
          penerima: penerimaX,
          alasan: alasanX,
          id_pool: idPoolX,
          id_admin: idAdminX,
          pihak_dibebankan: pihakDibebankanX
        },
        detail
      };

      await models.m_sm_retur_history.create({
        id_msm_retur,
        id_user: creatorUserId,
        chat: buildReturHistoryText(historyPayload),
        nominal: totalNominal,
        date_added: new Date(),
        created_by_name: createdByName
      });
    } catch (e) {
      console.error('Failed to insert m_sm_retur_history:', e.message || e);
    }

    return res.status(201).json({
      message: "Data retur berhasil ditambahkan",
      id_msm_retur,
      no_retur
    });

  } catch (error) {
    return res.status(500).json({
      message: "Gagal menambah data",
      error: error.message
    });
  }
};

// Helper function to generate no_retur automatically
async function generateNoRetur() {
  try {
    const currentYear = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of year
    
    console.log('=== GENERATING NO_RETUR ===');
    console.log('Current year:', currentYear);
    
    // Find the latest retur number for this year to continue the sequence
    const latestRetur = await db.query(
      `SELECT no_retur FROM m_sm_retur 
       WHERE no_retur LIKE ? 
       ORDER BY no_retur DESC 
       LIMIT 1`,
      [`RT${currentYear}%`]
    );

    let nextSequence = 1;
    let yearMonthPrefix = `RT${currentYear}01`; // Default to month 01

    if (latestRetur && latestRetur.length > 0 && latestRetur[0].no_retur) {
      console.log('Latest retur found:', latestRetur[0].no_retur);
      
      // Extract the month and sequence from the latest retur
      const monthPart = latestRetur[0].no_retur.substring(4, 6); // Get month (01-12)
      const sequencePart = latestRetur[0].no_retur.substring(6, 8); // Get sequence
      const currentSequence = parseInt(sequencePart, 10);
      
      console.log('Extracted month:', monthPart);
      console.log('Extracted sequence:', sequencePart, 'Parsed as:', currentSequence);
      
      if (!isNaN(currentSequence)) {
        nextSequence = currentSequence + 1;
        console.log('Next sequence will be:', nextSequence);
        
        // Use the same month as the latest retur
        yearMonthPrefix = `RT${currentYear}${monthPart}`;
        console.log('Using month from latest retur:', monthPart);
      }
    } else {
      console.log('No existing retur found for this year, starting with 01');
    }

    // Check if sequence exceeds maximum (99 for 2-digit format)
    if (nextSequence > 99) {
      throw new Error('Nomor urut retur sudah mencapai batas maksimum (99) untuk format 2 digit');
    }

    // Format the sequence with leading zeros (2 digits)
    const formattedSequence = nextSequence.toString().padStart(2, '0');
    const finalNoRetur = `${yearMonthPrefix}${formattedSequence}`;
    
    console.log('Final generated no_retur:', finalNoRetur);
    console.log('=== END GENERATING ===');
    
    return finalNoRetur;
    
  } catch (error) {
    console.error('Error generating no_retur:', error);
    return null;
  }
}

exports.getReturById = async (req, res) => {
  const id = req.params.id;
  console.log("GET RETUR BY ID:", id);

  try {
    const returHeader = await db.query(`
      SELECT 
        r.id_msm_retur,
        r.id_msm,
        r.no_retur,
        r.stage,
        r.id_customer,
        r.id_mitra,
        r.id_unit,
        r.id_driver,
        r.date_retur,
        r.kategori,
        r.keterangan,
        r.memo_accounting,
        r.foto,
        r.penerima,
        r.alasan,
        r.id_pool,
        r.id_admin,
        r.pihak_dibebankan,
        r.date_created,
        ms.msm
      FROM m_sm_retur r
      LEFT JOIN m_sm ms ON r.id_msm = ms.id_msm
      WHERE r.id_msm_retur = ?
    `, [id]);

    if (!returHeader || returHeader.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data retur tidak ditemukan",
      });
    }

    const returDetail = await db.query(`
      SELECT 
        id_msm_retur_detail,
        id_msm_retur,
        nama_barang,
        qty,
        berat,
        koli,
        nilai_barang,
        memo,
        keterangan
      FROM m_sm_retur_detail
      WHERE id_msm_retur = ?
    `, [id]);

    const retur = returHeader[0];
    retur.detail = returDetail;
    const totalNominal = Array.isArray(returDetail)
      ? returDetail.reduce((sum, d) => sum + (Number(d.nilai_barang) || 0), 0)
      : 0;
    retur.total = totalNominal;
    // include pihak_dibebankan in the returned object
    retur.pihak_dibebankan = retur.pihak_dibebankan;

    return res.status(200).json({
      success: true,
      message: "Data retur berhasil diambil",
      data: retur,
    });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};

exports.updateRetur = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_msm,
      id_customer,
      id_mitra,
      id_unit,
      id_driver,
      date_retur,
      kategori,
      keterangan,
      foto,
      penerima,
      alasan,
      id_pool,
      id_admin,
      pihak_dibebankan,
      detail
    } = req.body;

    // Normalize optional fields to avoid undefined bindings
    const toNullIfUndefined = (v) => (typeof v === 'undefined' ? null : v);
    const kategoriX = toNullIfUndefined(kategori);
    const keteranganX = toNullIfUndefined(keterangan);
    const fotoX = toNullIfUndefined(foto);
    const penerimaX = toNullIfUndefined(penerima);
    const alasanX = toNullIfUndefined(alasan);
    const idPoolX = toNullIfUndefined(id_pool);
    const idAdminX = toNullIfUndefined(id_admin);
    const pihakDibebankanX = toNullIfUndefined(pihak_dibebankan);

    await db.query(
      `UPDATE m_sm_retur SET
        id_msm = ?, id_customer = ?, id_mitra = ?, id_unit = ?, id_driver = ?,
        date_retur = ?, kategori = ?, keterangan = ?, foto = ?, penerima = ?,
        alasan = ?, id_pool = ?, id_admin = ?, pihak_dibebankan = ?
      WHERE id_msm_retur = ?`,
      [
        id_msm, id_customer, id_mitra, id_unit, id_driver,
        date_retur, kategoriX, keteranganX, fotoX, penerimaX,
        alasanX, idPoolX, idAdminX, pihakDibebankanX, id
      ]
    );

    await db.query(`DELETE FROM m_sm_retur_detail WHERE id_msm_retur = ?`, [id]);

    for (const item of detail) {
      const { nama_barang, berat, qty, koli, nilai_barang } = item;

      await db.query(
        `INSERT INTO m_sm_retur_detail (
          id_msm_retur, nama_barang, berat, qty, koli, nilai_barang
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, nama_barang, berat, qty, koli, nilai_barang]
      );
    }

    // Insert history for this update
    try {
      const totalNominal = Array.isArray(detail)
        ? detail.reduce((sum, d) => sum + (Number(d.nilai_barang) || 0), 0)
        : 0;

      const editorUserId = (req.user && (req.user.id_user || req.user.id))
        ? (req.user.id_user || req.user.id)
        : (id_admin || null);

      const historyPayload = {
        action: 'UPDATE_RETUR',
        id_msm_retur: id,
        header: {
          id_msm,
          id_customer,
          id_mitra,
          id_unit,
          id_driver,
          date_retur,
          kategori: kategoriX,
          keterangan: keteranganX,
          foto: fotoX,
          penerima: penerimaX,
          alasan: alasanX,
          id_pool: idPoolX,
          id_admin: idAdminX,
          pihak_dibebankan: pihakDibebankanX
        },
        detail
      };

      await db.query(
        `INSERT INTO m_sm_retur_history (id_msm_retur, id_user, chat, nominal, date_added)
         VALUES (?, ?, ?, ?, NOW())`,
        [
          id,
          editorUserId,
          buildReturHistoryText(historyPayload),
          totalNominal
        ]
      );
    } catch (e) {
      console.error('Failed to insert update history m_sm_retur_history:', e.message || e);
    }

    res.json({ message: "Retur berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui data", error: error.message });
  }
};

// Update only the stage of retur and append history entry
exports.updateReturStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, id_admin, created_by_name, pihak_dibebankan, keterangan, memo_accounting } = req.body;

    if (!stage) {
      return res.status(400).json({ message: "Stage wajib diisi" });
    }

    // Prepare update data
    const updateData = { stage: stage };
    
    // Add pihak_dibebankan if provided
    if (pihak_dibebankan !== undefined) {
      updateData.pihak_dibebankan = pihak_dibebankan;
    }

    // Add keterangan if provided
    if (typeof keterangan !== 'undefined') {
      updateData.keterangan = keterangan;
    }
    // Add memo_accounting if provided
    if (typeof memo_accounting !== 'undefined') {
      updateData.memo_accounting = memo_accounting;
    }

    // Update retur stage using Sequelize model
    await models.m_sm_retur.update(
      updateData,
      { where: { id_msm_retur: id } }
    );

    // Insert concise history note for stage change
    try {
      const editorUserId = (req.user && (req.user.id_user || req.user.id))
        ? (req.user.id_user || req.user.id)
        : (id_admin || null);

      // Use provided name first, otherwise lookup from database
      let editorName = created_by_name || null;
      
      if (!editorName && editorUserId) {
        try {
          const editorUser = await models.users.findOne({
            where: { id: editorUserId },
            attributes: ['nama_lengkap']
          });
          if (editorUser) {
            editorName = editorUser.nama_lengkap;
          }
        } catch (e) {
          // ignore user name fetch errors, fall back to ID only
        }
      }

      let chat = editorName
        ? `Status diubah menjadi ${stage} oleh ${editorUserId} (${editorName})`
        : `Status diubah menjadi ${stage} oleh ${editorUserId || '-'}`;
      
      // Add pihak_dibebankan info if provided
      if (pihak_dibebankan !== undefined) {
        chat += ` - Pihak dibebankan: ${pihak_dibebankan}`;
      }
      // Add keterangan info if provided
      if (typeof keterangan !== 'undefined' && keterangan !== null && keterangan !== '') {
        chat += ` - Keterangan: ${keterangan}`;
      }
      if (typeof memo_accounting !== 'undefined' && memo_accounting !== null && memo_accounting !== '') {
        chat += ` - Memo Accounting: ${memo_accounting}`;
      }
      
      await models.m_sm_retur_history.create({
        id_msm_retur: id,
        id_user: editorUserId,
        chat: chat,
        nominal: 0,
        date_added: new Date(),
        created_by_name: editorName
      });
    } catch (e) {
      console.error('Failed to insert stage update history m_sm_retur_history:', e.message || e);
    }

    const responseMessage = (() => {
      const parts = [];
      parts.push('Stage retur berhasil diperbarui');
      if (pihak_dibebankan !== undefined) parts.push('(pihak dibebankan diperbarui)');
      if (typeof keterangan !== 'undefined') parts.push('(keterangan diperbarui)');
      if (typeof memo_accounting !== 'undefined') parts.push('(memo accounting diperbarui)');
      return parts.join(' ');
    })();
    
    res.json({ message: responseMessage });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui stage", error: error.message });
  }
};

exports.deleteRetur = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM m_sm_retur_detail WHERE id_msm_retur = ?`, [id]);

    await db.query(`DELETE FROM m_sm_retur WHERE id_msm_retur = ?`, [id]);

    res.json({ message: "Data retur berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus data", error: error.message });
  }
};

exports.getReturFilters = async (req, res) => {
  try {
    const [msms, customers, kendaraans, mitras, drivers] = await Promise.all([
      models.m_sm.findAll({
        attributes: ["id_msm", "msm"],
        order: [["msm", "ASC"]],
      }),
      models.customer.findAll({
        attributes: ["id_customer", ["nama_perusahaan", "nama"]],
        order: [["nama_perusahaan", "ASC"]],
      }),
      models.kendaraan.findAll({
        attributes: ["id", "no_polisi"],
        order: [["no_polisi", "ASC"]],
      }),
      models.mitra.findAll({
        attributes: ["id_mitra", ["nama_mitra", "nama"]],
        order: [["nama_mitra", "ASC"]],
      }),
      models.m_driver.findAll({
        attributes: ["id", ["nama", "nama"]],
        order: [["nama", "ASC"]],
      }),
    ]);

    res.json({
      msm: msms.map((item) => ({ id: item.id_msm, name: item.msm })),
      customer: customers.map((item) => ({ id: item.id_customer, name: item.nama })),
      kendaraan: kendaraans.map((item) => ({ id: item.id, name: item.no_polisi })),
      mitra: mitras.map((item) => ({ id: item.id_mitra, name: item.nama })),
      driver: drivers.map((item) => ({ id: item.id, name: item.nama })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data filter",
      error: error.message,
    });
  }
};
