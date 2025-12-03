const core = require('../../config/core.config')
const db = require('../../config/db.config');
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, fn, col } = require('sequelize');

// Define association once at the top level
if (!models.kendaraanstatus.associations.kendaraan_info) {
  models.kendaraanstatus.belongsTo(models.kendaraan, { 
    foreignKey: 'id_kendaraan', 
    targetKey: 'id',
    as: 'kendaraan_info' 
  });
}
// Relasi kendaraan -> m_driver
if (!models.kendaraan.associations.driver) {
  models.kendaraan.belongsTo(models.m_driver, { foreignKey: 'id_driver', as: 'driver' });
}

// Define additional associations for the new query
if (!models.kendaraanstatus.associations.m_sm) {
  models.kendaraanstatus.belongsTo(models.m_sm, { 
    foreignKey: 'id_msm', 
    targetKey: 'id_msm'
  });
}

if (!models.m_sm.associations.m_pengadaan_detail) {
  models.m_sm.belongsTo(models.m_pengadaan_detail, { 
    foreignKey: 'id_mpd', 
    targetKey: 'id_mpd'
  });
}

if (!models.m_pengadaan_detail.associations.alamat_muat) {
  models.m_pengadaan_detail.belongsTo(models.alamat, { 
    foreignKey: 'id_almuat', 
    targetKey: 'id',
    as: 'alamat_muat'
  });
}

if (!models.m_pengadaan_detail.associations.alamat_bongkar) {
  models.m_pengadaan_detail.belongsTo(models.alamat, { 
    foreignKey: 'id_albongkar', 
    targetKey: 'id',
    as: 'alamat_bongkar'
  });
}

if (!models.m_pengadaan_detail.associations.m_pengadaan) {
  models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { 
    foreignKey: 'id_mp', 
    targetKey: 'id_mp'
  });
}

if (!models.m_pengadaan.associations.customer) {
  models.m_pengadaan.belongsTo(models.customer, { 
    foreignKey: 'id_customer', 
    targetKey: 'id_customer'
  });
}

// Define associations for timeline unit query - Force define without conditional checks
try {
  models.kendaraan.hasMany(models.m_sm, { 
    foreignKey: 'id_unit', 
    sourceKey: 'id',
    as: 'sm_activities'
  });
} catch (e) {
  // Association might already exist, ignore error
}

try {
  models.m_sm.belongsTo(models.kendaraan, { 
    foreignKey: 'id_unit', 
    targetKey: 'id',
    as: 'kendaraan_info'
  });
} catch (e) {
  // Association might already exist, ignore error
}

try {
  models.m_sm.hasMany(models.kendaraanstatus, { 
    foreignKey: 'id_msm', 
    sourceKey: 'id_msm',
    as: 'kendaraanstatus'
  });
} catch (e) {
  // Association might already exist, ignore error
}

if (!models.kendaraanstatus.associations.kendaraan_vendor) {
  models.kendaraanstatus.belongsTo(models.kendaraan, { 
    foreignKey: 'id_kendaraan', 
    targetKey: 'id',
    as: 'kendaraan_vendor'
  });
}

// Cache untuk kendaraan
let kendaraanCache = {
  data: null,
  timestamp: null,
  lastId: null
};

// Cache TTL dalam milidetik (5 menit)
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Get kendaraanstatus by id_kendaraan, join dengan kendaraan
 * @route GET /api/kendaraan/status/by-id-kendaraan?id_kendaraan=xxx
 */
exports.getKendaraanStatusByIdKendaraan = async (req, res) => {
  try {
    const { id_kendaraan } = req.query;
    if (!id_kendaraan) {
      return res.status(400).json({
        status: 400,
        message: 'Parameter id_kendaraan wajib diisi.'
      });
    }

    // Pastikan relasi sudah ada
    if (!models.kendaraanstatus.associations.kendaraan_info) {
      models.kendaraanstatus.belongsTo(models.kendaraan, {
        foreignKey: 'id_kendaraan',
        targetKey: 'id',
        as: 'kendaraan_info'
      });
    }


    // Ambil 10 data kendaraanstatus terbaru dari id_kendaraan
    const statusData = await models.kendaraanstatus.findAll({
      where: { id_kendaraan },
      include: [
        {
          model: models.kendaraan,
          as: 'kendaraan_info',
          attributes: [
            'id', 'code_kendaraan', 'no_polisi', 'merk_mobil', 'tahun_mobil',
            'jenis_kendaraan', 'kapasitas', 'kapasitas_maks', 'kubikasi',
            'warna_plat', 'gps_type', 'gps_device_id', 'vendor', 'jenis_kepemilikan'
          ]
        }
      ],
      order: [['tgl_update', 'DESC']],
      limit: 10
    });

    // Proses data: hapus kendaraan_info, konversi longitude/latitude ke alamat

    const axios = require('axios');
    async function getAlamatFromOpenStreet(lat, lon) {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
        const response = await axios.get(url, {
          headers: { 'User-Agent': 'EurekaLogistics/1.0' }
        });
        return response.data.display_name || null;
      } catch (err) {
        return null;
      }
    }

    const processedData = await Promise.all(statusData.map(async (item) => {
      let alamat = null;
      if (item.latitude && item.longitude) {
        alamat = await getAlamatFromOpenStreet(item.latitude, item.longitude);
      }
      const { kendaraan_info, ...rest } = item.toJSON();
      return {
        ...rest,
        alamat,
        longitude: item.longitude,
        latitude: item.latitude
      };
    }));

    return res.status(200).json({
      status: 200,
      message: 'Success get kendaraanstatus by id_kendaraan',
      total: processedData.length,
      data: processedData
    });
  } catch (error) {
    console.error('Error getKendaraanStatusByIdKendaraan:', error);
    return res.status(500).json({
      status: 500,
      message: 'Gagal mengambil data kendaraanstatus by id_kendaraan',
      error: error.message
    });
  }
};

exports.getAllKendaraan = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Cek apakah cache masih valid
    const now = Date.now();
    const isCacheValid = kendaraanCache.data && 
                        kendaraanCache.timestamp && 
                        (now - kendaraanCache.timestamp) < CACHE_TTL;

    // Jika cache valid, gunakan cache
    if (isCacheValid) {
      const cachedData = kendaraanCache.data;
      const totalData = cachedData.totalData;
      const totalPage = Math.ceil(totalData / limit);
      // Ambil data sesuai pagination dari cache
      const startIndex = offset;
      const endIndex = Math.min(startIndex + parseInt(limit), totalData);
      const order = cachedData.order.slice(startIndex, endIndex).map((item, index) => ({
        ...item,
        no: startIndex + index + 1,
        idDriver: item.idDriver ?? null,
        namaDriver: item.namaDriver ?? null
      }));

      return res.status(200).json({
        status: {
          code: 200,
          message: "Success Get Kendaraan (Cached)"
        },
        data: {
          totalData,
          totalPage,
          limit: parseInt(limit),
          currentPage: parseInt(page),
          order,
        }
      });
    }


    // Jika cache tidak valid, ambil SEMUA data dari database untuk cache
    const whereClause = {
      gps_type: {
        [Op.ne]: null
      }
    };

    // Ambil semua data untuk cache (tanpa limit dan offset), join ke driver
    const getAllData = await models.kendaraan.findAndCountAll({
      where: whereClause,
      order: [['id', 'ASC']],
      include: [
        {
          model: models.m_driver,
          as: 'driver',
          attributes: ['id', 'nama']
        }
      ]
    });

    // Update cache dengan SEMUA data
    kendaraanCache = {
      data: {
        totalData: getAllData.count,
        order: getAllData.rows.map((item, index) => ({
          id: item.id,
          code: item.code_kendaraan || "-",
          noPolisi: item.no_polisi || "-",
          idDriver: item.driver ? item.driver.id : null,
          namaDriver: item.driver ? item.driver.nama : null,
          merk: item.merk_mobil || "-",
          tahun: item.tahun_mobil || "-",
          gpsType: item.gps_type || "-",
          gpsDeviceId: item.gps_device_id || "-",
          jenisKendaraan: item.jenis_kendaraan || "-",
          jenisKepemilikan: item.jenis_kepemilikan || "-",
          vendor: item.vendor || "-",
          kapasitas: item.kapasitas,
          kapasitasMaks: item.kapasitas_maks,
          panjang: item.panjang,
          lebar: item.lebar,
          tinggi: item.tinggi,
          kubikasi: item.kubikasi,
          warnaPlat: item.warna_plat,
          status: item.status === "1" ? "Aktif" : "Nonaktif",
          tglSTNK: item.tgl_stnk,
          tglPlatNomor: item.tgl_plat_nomor,
          tglKIR: item.tgl_kir,
          tglBeli: item.tgl_beli,
        }))
      },
      timestamp: now,
      lastId: getAllData.rows.length > 0 ? Math.max(...getAllData.rows.map(row => row.id)) : null
    };

    // Ambil data sesuai pagination dari cache yang baru dibuat
    const totalData = getAllData.count;
    const totalPage = Math.ceil(totalData / limit);
    const startIndex = offset;
    const endIndex = Math.min(startIndex + parseInt(limit), totalData);
    const order = kendaraanCache.data.order.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      no: startIndex + index + 1
    }));

    return res.status(200).json({
      status: {
        code: 200,
        message: "Success Get Kendaraan"
      },
      data: {
        totalData,
        totalPage,
        limit: parseInt(limit),
        currentPage: parseInt(page),
        order,
      }
    });

  } catch (error) {
    console.error('Error fetching kendaraan:', error);
    res.status(500).json({
      status: {
        code: 500,
        message: 'Failed to fetch kendaraan data'
      }
    });
  }
};

// Endpoint baru untuk mendapatkan semua kendaraan tanpa filter gps_type
exports.getAllKendaraanAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Ambil semua data tanpa filter gps_type
    const whereClause = {};

    // Ambil data dengan pagination langsung dari database
    const getAllData = await models.kendaraan.findAndCountAll({
      where: whereClause,
      order: [['id', 'ASC']],
      limit: parseInt(limit),
      offset: offset
    });

    // Format data response
    const order = getAllData.rows.map((item, index) => ({
      id: item.id,
      code: item.code_kendaraan || "-",
      noPolisi: item.no_polisi || "-",
      merk: item.merk_mobil || "-",
      tahun: item.tahun_mobil || "-",
      gpsType: item.gps_type || "-",
      gpsDeviceId: item.gps_device_id || "-",
      jenisKendaraan: item.jenis_kendaraan || "-",
      jenisKepemilikan: item.jenis_kepemilikan || "-",
      vendor: item.vendor || "-",
      kapasitas: item.kapasitas,
      kapasitasMaks: item.kapasitas_maks,
      panjang: item.panjang,
      lebar: item.lebar,
      tinggi: item.tinggi,
      kubikasi: item.kubikasi,
      warnaPlat: item.warna_plat,
      status: item.status === "1" ? "Aktif" : "Nonaktif",
      tglSTNK: item.tgl_stnk,
      tglPlatNomor: item.tgl_plat_nomor,
      tglKIR: item.tgl_kir,
      tglBeli: item.tgl_beli,
      no: offset + index + 1
    }));

    const totalData = getAllData.count;
    const totalPage = Math.ceil(totalData / limit);

    return res.status(200).json({
      status: {
        code: 200,
        message: "Success Get All Kendaraan (No GPS Filter)"
      },
      data: {
        totalData,
        totalPage,
        limit: parseInt(limit),
        currentPage: parseInt(page),
        order,
      }
    });

  } catch (error) {
    console.error('Error fetching all kendaraan:', error);
    res.status(500).json({
      status: {
        code: 500,
        message: 'Failed to fetch all kendaraan data'
      }
    });
  }
};

// Fungsi untuk invalidate cache (bisa dipanggil dari fungsi lain yang mengubah data)
exports.invalidateKendaraanCache = () => {
  kendaraanCache = {
    data: null,
    timestamp: null,
    lastId: null
  };
  console.log('Kendaraan cache invalidated');
};

exports.getAllKendaraanStatus = async (req, res) => {
  try {
    const { id_kendaraan, page = 1, limit = 10 } = req.query;
    const whereClause = {};

    if (id_kendaraan) {
      whereClause.id_kendaraan = id_kendaraan;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await models.kendaraanstatus.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['tgl_create', 'DESC']]
    });

    res.status(200).json({
      success: true,
      status: 200,
      totalData: count,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching kendaraan status:', error);
    res.status(500).json({
      success: false,
      status: 500,
      totalData: 0,
      message: 'Failed to fetch kendaraan status data'
    });
  }
};

exports.getStnkStatus = async (req, res) => {
  try {
    const { type = 'expired', page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let whereCondition;
    let orderBy;
    let message;

    if (type === 'expired') {
      // STNK yang sudah expired
      whereCondition = {
        tgl_stnk: {
          [Op.lt]: today,
        },
        status: '1',
        jenis_kepemilikan: { [Op.in]: ['eureka', 'eur_sewa'] },
      };
      orderBy = [['tgl_stnk', 'DESC']]; // Most recently expired first
      message = 'Kendaraan dengan STNK yang sudah expired';
    } else if (type === 'expiring_soon') {
      // STNK yang akan expired dalam 30 hari
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);
      
      whereCondition = {
        tgl_stnk: {
          [Op.between]: [today, thirtyDaysLater],
        },
        status: '1',
        jenis_kepemilikan: { [Op.in]: ['eureka', 'eur_sewa'] },
      };
      orderBy = [['tgl_stnk', 'ASC']]; // Soonest to expire first
      message = 'Kendaraan dengan STNK akan segera habis dalam 30 hari ke depan';
    } else {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Parameter type harus "expired" atau "expiring_soon"',
      });
    }

    // Use findAndCountAll to get both data and count in one query
    const result = await models.kendaraan.findAndCountAll({
      where: whereCondition,
      attributes: [
        'id', 'kode_kendaraan', 'no_polisi', 'tgl_stnk', 'merk_mobil',
        'jenis_kendaraan', 'jenis_kepemilikan', 'vendor', 'id_driver',
        'id_bu_brench', 'foto_stnk', 'status'
      ],
      order: orderBy,
      limit: parsedLimit,
      offset: offset,
      distinct: true,
      subQuery: false,
      raw: false,
    });

    // Ensure no duplicates in the result
    const seenIds = new Set();
    const finalKendaraan = result.rows.filter(kendaraan => {
      if (seenIds.has(kendaraan.id)) {
        return false;
      }
      seenIds.add(kendaraan.id);
      return true;
    });

    // Calculate pagination info
    const totalPages = Math.ceil(result.count / parsedLimit);
    const hasNextPage = parsedPage < totalPages;
    const hasPrevPage = parsedPage > 1;

    res.status(200).json({
      success: true,
      status: 200,
      message: message,
      type: type,
      totalData: finalKendaraan.length,
      totalRecords: result.count,
      pagination: {
        currentPage: parsedPage,
        totalPages: totalPages,
        limit: parsedLimit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
      },
      data: finalKendaraan,
    });
  } catch (error) {
    console.error('Error fetching STNK status data:', error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Gagal mengambil data kendaraan berdasarkan status STNK',
    });
  }
};

// Get KIR status (expired or expiring soon)
exports.getKirStatus = async (req, res) => {
  try {
    const { type = 'expired', page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let whereCondition;
    let orderBy;
    let message;

    if (type === 'expired') {
      // KIR yang sudah expired
      whereCondition = {
        tgl_kir: {
          [Op.lt]: today,
        },
        status: '1',
        jenis_kepemilikan: { [Op.in]: ['eureka', 'eur_sewa'] },
      };
      orderBy = [['tgl_kir', 'DESC']];
      message = 'Kendaraan dengan KIR yang sudah expired';
    } else if (type === 'expiring_soon') {
      // KIR yang akan expired dalam 30 hari
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);

      whereCondition = {
        tgl_kir: {
          [Op.between]: [today, thirtyDaysLater],
        },
        status: '1',
        jenis_kepemilikan: { [Op.in]: ['eureka', 'eur_sewa'] },
      };
      orderBy = [['tgl_kir', 'ASC']];
      message = 'Kendaraan dengan KIR akan segera habis dalam 30 hari ke depan';
    } else {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Parameter type harus "expired" atau "expiring_soon"',
      });
    }

    const result = await models.kendaraan.findAndCountAll({
      where: whereCondition,
      attributes: [
        'id', 'kode_kendaraan', 'no_polisi', 'tgl_kir', 'merk_mobil',
        'jenis_kendaraan', 'jenis_kepemilikan', 'vendor', 'id_driver',
        'id_bu_brench', 'status'
      ],
      order: orderBy,
      limit: parsedLimit,
      offset: offset,
      distinct: true,
      subQuery: false,
      raw: false,
    });

    const seenIds = new Set();
    const finalKendaraan = result.rows.filter(kendaraan => {
      if (seenIds.has(kendaraan.id)) {
        return false;
      }
      seenIds.add(kendaraan.id);
      return true;
    });

    const totalPages = Math.ceil(result.count / parsedLimit);
    const hasNextPage = parsedPage < totalPages;
    const hasPrevPage = parsedPage > 1;

    res.status(200).json({
      success: true,
      status: 200,
      message: message,
      type: type,
      totalData: finalKendaraan.length,
      totalRecords: result.count,
      pagination: {
        currentPage: parsedPage,
        totalPages: totalPages,
        limit: parsedLimit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
      },
      data: finalKendaraan,
    });
  } catch (error) {
    console.error('Error fetching KIR status data:', error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Gagal mengambil data kendaraan berdasarkan status KIR',
    });
  }
};

exports.addKendaraanStatus = async (req, res) => {
  try {
    const {
      id_kendaraan,
      no_polisi,
      id_pengemudi,
      nama_driver,
      id_msm,
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

    if (!id_kendaraan || !no_polisi || !keterangan || !memo) {
      return res.status(400).json({
        message: "Field wajib: memo, id_kendaraan, no_polisi, dan keterangan harus diisi.",
      });
    }

    const newStatus = await models.kendaraanstatus.create({
      id_kendaraan,
      no_polisi,
      id_pengemudi: id_pengemudi || 34,
      nama_driver,
      id_msm: id_msm || 0,
      kondisi_kendaraan: "Unavailable",
      action: action || 0,
      empty_load,
      keterangan,
      memo,
      customer: customer || "-",
      posisi: posisi || "",
      longitude,
      latitude,
      tujuan,
      foto,
      tgl_update: new Date(),
      tgl_create: new Date(),
      id_user: id_user || 0
    });

    return res.status(201).json({
      message: "Data kendaraan status berhasil ditambahkan",
      data: newStatus
    });

  } catch (error) {
    return res.status(500).json({
      message: "Gagal menambahkan data kendaraan status",
      error: error.message
    });
  }
};

exports.getDestinationsSummary = async (req, res) => {
  try {
    const models = core.models();
    const today = new Date();
    const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3));

    const results = await models.kendaraanstatus.findAll({
      attributes: [
        ['tujuan', 'destination'],
        [fn('COUNT', col('id')), 'unit']
      ],
      where: {
        tujuan: {
          [Op.and]: [
            { [Op.not]: null },
            { [Op.ne]: '-' }
          ]
        },
        tgl_update: {
          [Op.gte]: threeMonthsAgo
        }
      },
      group: ['tujuan'],
      order: [[fn('COUNT', col('id')), 'DESC']]
    });

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil data tujuan kendaraan 3 bulan terakhir",
      total: results.length,
      data: results
    });
  } catch (error) {
    console.error('🔥 Error getDestinationsSummary:', error);
    customErrorMiddleware(error, req, res, "Gagal mengambil data tujuan kendaraan");
  }
};

exports.getOngoingTrips = async (req, res) => {
  try {
    const today = new Date();
    const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3));

    const results = await models.kendaraanstatus.findAll({
      where: {
        action: { [Op.ne]: 19 },
        tgl_update: {
          [Op.gte]: threeMonthsAgo
        }
      },
      order: [['tgl_update', 'DESC']]
    });

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil data perjalanan yang sedang berlangsung (3 bulan terakhir)",
      total: results.length,
      data: results
    });
  } catch (error) {
    console.error('🔥 Error getOngoingTrips:', error);
    customErrorMiddleware(error, req, res, "Gagal mengambil data perjalanan aktif");
  }
};

exports.getKendaraanStatusHariIni = async (req, res) => {
  try {
    const { 
      tanggal, 
      search, 
      no_polisi, 
      jenis_kepemilikan, 
      kondisi_kendaraan, 
      status,
      page = 1,
      limit = 10,
      get_all = false
    } = req.query;
    
    const filterTanggal = tanggal || new Date().toISOString().slice(0, 10);
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let kendaraanConditions = [];
    let kendaraanParams = [];
    
    if (no_polisi) {
      kendaraanConditions.push('k.no_polisi LIKE ?');
      kendaraanParams.push(`%${no_polisi}%`);
    }
    
    if (jenis_kepemilikan) {
      // Support for multiple jenis_kepemilikan values (comma-separated or array)
      const jenisKepemilikanValues = Array.isArray(jenis_kepemilikan) 
        ? jenis_kepemilikan 
        : jenis_kepemilikan.split(',').map(item => item.trim()).filter(item => item);
      
      if (jenisKepemilikanValues.length > 0) {
        const placeholders = jenisKepemilikanValues.map(() => '?').join(',');
        kendaraanConditions.push(`k.jenis_kepemilikan IN (${placeholders})`);
        kendaraanParams.push(...jenisKepemilikanValues);
      }
    }
    
    if (status) {
      kendaraanConditions.push('k.status = ?');
      kendaraanParams.push(status);
    }

    let statusConditions = [];
    let statusParams = [];
    
    if (get_all && get_all !== 'true') {
    } else if (tanggal && tanggal.trim() !== '') {
      statusConditions.push('DATE(ks.tgl_update) = ?');
      statusParams.push(tanggal);
    } else {
      // No date filter will be applied
    }
    
    if (kondisi_kendaraan) {
      statusConditions.push('ks.kondisi_kendaraan = ?');
      statusParams.push(kondisi_kendaraan);
    }

    let searchConditions = [];
    let searchParams = [];
    
    if (search) {
      searchConditions = [
        'k.no_polisi LIKE ?',
        'k.code_kendaraan LIKE ?',
        'k.merk_mobil LIKE ?',
        'k.vendor LIKE ?',
        'd.nama LIKE ?',
        'kj.nama_kendaraan_jenis LIKE ?',
        'ks.nama_driver LIKE ?',
        'ks.customer LIKE ?',
        'ks.keterangan LIKE ?',
        'ks.posisi LIKE ?'
      ];
      searchParams = Array(10).fill(`%${search}%`);
    }

    let query = `
      SELECT DISTINCT
        k.id as id_kendaraan,
        k.code_kendaraan,
        k.no_polisi,
        k.status as status_kendaraan,
        k.jenis_kepemilikan,
        k.vendor,
        k.merk_mobil,
        k.tahun_mobil,
        k.kapasitas,
        k.kapasitas_maks,
        k.kubikasi,
        kj.nama_kendaraan_jenis,
        d.nama as driver_tetap,
        d.no_telp as no_telp_driver_tetap,
        ks.id as status_id,
        ks.id_msm as id_msm,
        ms.msm as msm,
        ks.nama_driver,
        ks.customer,
        ks.keterangan,
        ks.tujuan,
        ks.posisi,
        ks.kondisi_kendaraan,
        ks.empty_load,
        ks.longitude,
        ks.latitude,
        ks.tgl_update,
        ks.tgl_create
      FROM kendaraan k
      LEFT JOIN kendaraan_jenis kj ON k.id_kendaraan_jenis = kj.id_kendaraan_jenis
      LEFT JOIN m_driver d ON k.id_driver = d.id
      LEFT JOIN (
        SELECT ks1.*
        FROM kendaraanstatus ks1
        INNER JOIN (
          SELECT id_kendaraan, MAX(tgl_update) as max_tgl_update, MAX(id) as max_status_id
          FROM kendaraanstatus
          GROUP BY id_kendaraan
        ) ks2 ON ks1.id_kendaraan = ks2.id_kendaraan 
               AND ks1.tgl_update = ks2.max_tgl_update
               AND ks1.id = ks2.max_status_id
      ) ks ON k.id = ks.id_kendaraan
      LEFT JOIN m_sm ms ON ks.id_msm = ms.id_msm
    `;

    let whereConditions = [];
    let allParams = [];

    if (kendaraanConditions.length > 0) {
      whereConditions.push(`(${kendaraanConditions.join(' AND ')})`);
      allParams.push(...kendaraanParams);
    }

    if (statusConditions.length > 0) {
      whereConditions.push(`(${statusConditions.join(' AND ')})`);
      allParams.push(...statusParams);
    }

    if (searchConditions.length > 0) {
      const searchOrCondition = `(${searchConditions.join(' OR ')})`;
      whereConditions.push(searchOrCondition);
      allParams.push(...searchParams);
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    query += ` ORDER BY k.no_polisi ASC`;
    
    if (!(get_all === true || get_all === 'true')) {
      query += ` LIMIT ? OFFSET ?`;
      allParams.push(parseInt(limit), offset);
    }

    const data = await db.query(query, allParams);

    // Tambahan: cek kendaraan yang status terakhirnya Maintenance tapi tidak ada record di hari ini
    const todayStr = new Date().toISOString().slice(0, 10);
    for (const item of data) {
      if (item.kondisi_kendaraan === 'Maintenance') {
        // Cek apakah sudah ada record kendaraanstatus di hari ini
        const cekHariIni = await db.query(
          `SELECT id FROM kendaraanstatus WHERE id_kendaraan = ? AND DATE(tgl_update) = ?`,
          [item.id_kendaraan, todayStr]
        );
        if (cekHariIni.length === 0) {
          // Insert record baru ke kendaraanstatus untuk hari ini
          await db.query(
            `INSERT INTO kendaraanstatus (
              id_kendaraan, no_polisi, id_pengemudi, nama_driver, id_msm,
              kondisi_kendaraan, action, empty_load, keterangan, memo,
              customer, posisi, tgl_update, tgl_create, id_user
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              item.id_kendaraan,
              item.no_polisi || '',
              0,
              item.nama_driver || '',
              0,
              'Maintenance',
              99,
              'Maintenance',
              item.keterangan || '',
              item.memo || '',
              item.customer || '-',
              item.posisi || '',
              new Date(),
              new Date(),
              287
            ]
          );
        }
      }
    }

    let totalCount = 0;
    // Always calculate total count for accurate pagination
    let countQuery = `
      SELECT COUNT(DISTINCT k.id) as total
      FROM kendaraan k
      LEFT JOIN kendaraan_jenis kj ON k.id_kendaraan_jenis = kj.id_kendaraan_jenis
      LEFT JOIN m_driver d ON k.id_driver = d.id
      LEFT JOIN (
        SELECT ks1.*
        FROM kendaraanstatus ks1
        INNER JOIN (
          SELECT id_kendaraan, MAX(tgl_update) as max_tgl_update, MAX(id) as max_status_id
          FROM kendaraanstatus
          GROUP BY id_kendaraan
        ) ks2 ON ks1.id_kendaraan = ks2.id_kendaraan 
               AND ks1.tgl_update = ks2.max_tgl_update
               AND ks1.id = ks2.max_status_id
      ) ks ON k.id = ks.id_kendaraan
    `;
    
    let countWhereConditions = [];
    let countParams = [];
    
    if (kendaraanConditions.length > 0) {
      countWhereConditions.push(`(${kendaraanConditions.join(' AND ')})`);
      countParams.push(...kendaraanParams);
    }
    
    if (statusConditions.length > 0) {
      countWhereConditions.push(`(${statusConditions.join(' AND ')})`);
      countParams.push(...statusParams);
    }
    
    if (searchConditions.length > 0) {
      const searchOrCondition = `(${searchConditions.join(' OR ')})`;
      countWhereConditions.push(searchOrCondition);
      countParams.push(...searchParams);
    }
    
    if (countWhereConditions.length > 0) {
      countQuery += ` WHERE ${countWhereConditions.join(' AND ')}`;
    }
    
    const countResult = await db.query(countQuery, countParams);
    totalCount = countResult[0].total;
    
    console.log('=== DEBUG QUERY ===');
    console.log('Query:', query);
    console.log('Parameters:', allParams);
    console.log('Filter Date:', filterTanggal);
    console.log('Get All:', get_all);
    console.log('Page:', page, 'Limit:', limit);
    console.log('Total Results from DB:', data.length);
    console.log('Total Count:', totalCount);
    console.log('Raw Data Sample:', data.slice(0, 3));
    console.log('=== END DEBUG ===');

    const result = data;

    let filteredResult = result;
    if (search) {
      filteredResult = result.filter(item => {
        const searchLower = search.toLowerCase();
        return (
          item.no_polisi?.toLowerCase().includes(searchLower) ||
          item.code_kendaraan?.toLowerCase().includes(searchLower) ||
          item.merk_mobil?.toLowerCase().includes(searchLower) ||
          item.vendor?.toLowerCase().includes(searchLower) ||
          item.driver_tetap?.toLowerCase().includes(searchLower) ||
          item.nama_kendaraan_jenis?.toLowerCase().includes(searchLower) ||
          item.nama_driver?.toLowerCase().includes(searchLower) ||
          item.customer?.toLowerCase().includes(searchLower) ||
          item.keterangan?.toLowerCase().includes(searchLower) ||
          item.posisi?.toLowerCase().includes(searchLower)
        );
      });
    }

    res.status(200).json({
      tanggal: get_all ? 'all' : (tanggal && tanggal.trim() !== '' ? tanggal : 'all'),
      total_kendaraan: filteredResult.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        total_pages: Math.ceil(totalCount / parseInt(limit)),
        has_next: (parseInt(page) * parseInt(limit)) < totalCount,
        has_prev: parseInt(page) > 1
      },
      filters: {
        tanggal: tanggal || '',
        search: search || '',
        no_polisi: no_polisi || '',
        jenis_kepemilikan: jenis_kepemilikan || '',
        kondisi_kendaraan: kondisi_kendaraan || '',
        status: status || '',
        get_all: (get_all === true || get_all === 'true')
      },
      data: filteredResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil data kendaraan status",
      error: error.message,
    });
  }
};

exports.getDeliveryData = async (req, res) => {
  try {
    const { page = 1, limit = 10, id_kendaraan, no_polisi, customer, tanggal, tanggal_mulai, tanggal_akhir, get_all, kondisi_kendaraan } = req.query;
    
    // Build where clause
    const whereClause = {
      action: { [Op.ne]: 19 } // Exclude action 19
    };

    // Add optional filters
    if (id_kendaraan) {
      whereClause.id_kendaraan = id_kendaraan;
    }
    if (no_polisi) {
      whereClause.no_polisi = { [Op.like]: `%${no_polisi}%` };
    }
    if (customer) {
      whereClause.customer = { [Op.like]: `%${customer}%` };
    }
    if (kondisi_kendaraan) {
      whereClause.kondisi_kendaraan = kondisi_kendaraan;
    }

    // Date filtering
    if (tanggal) {
      // Filter by specific date (YYYY-MM-DD format)
      const startDate = new Date(tanggal + ' 00:00:00');
      const endDate = new Date(tanggal + ' 23:59:59');
      whereClause.tgl_update = {
        [Op.between]: [startDate, endDate]
      };
    } else if (tanggal_mulai && tanggal_akhir) {
      // Filter by date range
      const startDate = new Date(tanggal_mulai + ' 00:00:00');
      const endDate = new Date(tanggal_akhir + ' 23:59:59');
      whereClause.tgl_update = {
        [Op.between]: [startDate, endDate]
      };
    }

    let queryOptions = {
      where: whereClause,
      attributes: [
        'id',
        'id_kendaraan',
        'no_polisi',
        'id_pengemudi',
        'nama_driver',
        'id_msm',
        'kondisi_kendaraan',
        'action',
        'empty_load',
        'keterangan',
        'memo',
        'customer',
        'posisi',
        'longitude',
        'latitude',
        'tujuan',
        'foto',
        'tgl_update',
        'tgl_create',
        'id_user'
      ],
      order: [['tgl_update', 'DESC']]
    };

    let count, rows;

    // Check if user wants all data without pagination
    if (get_all === 'true' || get_all === '1') {
      // Get all data without pagination
      const allData = await models.kendaraanstatus.findAll(queryOptions);
      count = allData.length;
      rows = allData;
    } else {
      // Use pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      queryOptions.limit = parseInt(limit);
      queryOptions.offset = offset;
      
      const result = await models.kendaraanstatus.findAndCountAll(queryOptions);
      count = result.count;
      rows = result.rows;
    }

    // Format response data
    const deliveryData = rows.map((item, index) => ({
      no: get_all === 'true' || get_all === '1' ? index + 1 : (parseInt(page) - 1) * parseInt(limit) + index + 1,
      id: item.id,
      idKendaraan: item.id_kendaraan,
      noPolisi: item.no_polisi || '-',
      idPengemudi: item.id_pengemudi,
      namaDriver: item.nama_driver || '-',
      idMsm: item.id_msm,
      kondisiKendaraan: item.kondisi_kendaraan,
      action: item.action,
      emptyLoad: item.empty_load || '-',
      keterangan: item.keterangan,
      memo: item.memo || '-',
      customer: item.customer,
      posisi: item.posisi || '-',
      longitude: item.longitude || '-',
      latitude: item.latitude || '-',
      tujuan: item.tujuan || '-',
      foto: item.foto || '-',
      tglUpdate: item.tgl_update,
      tglCreate: item.tgl_create,
      idUser: item.id_user
    }));

    const response = {
      status: {
        code: 200,
        message: "Success Get Delivery Data"
      },
      data: {
        totalData: count,
        deliveryData,
        filters: {
          tanggal: tanggal || null,
          tanggalMulai: tanggal_mulai || null,
          tanggalAkhir: tanggal_akhir || null,
          idKendaraan: id_kendaraan || null,
          noPolisi: no_polisi || null,
          customer: customer || null,
          kondisiKendaraan: kondisi_kendaraan || null
        }
      }
    };

    // Add pagination info only if not getting all data
    if (get_all !== 'true' && get_all !== '1') {
      response.data.totalPage = Math.ceil(count / limit);
      response.data.limit = parseInt(limit);
      response.data.currentPage = parseInt(page);
    } else {
      response.data.isAllData = true;
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('🔥 Error getDeliveryData:', error);
    customErrorMiddleware(error, req, res, "Gagal mengambil data delivery");
  }
};

exports.getKendaraanStatusReadyNoReady = async (req, res) => {
  console.log('=== getKendaraanStatusReadyNoReady called ===');
  try {
    const { 
      limit = 10, 
      page = 1, 
      search = '', 
      status_filter = '', 
      start_date = '', 
      end_date = '' 
    } = req.query;

    const _limit = parseInt(limit);
    const _page = parseInt(page);
    const offset = (_page - 1) * _limit;

    // Build where clause for kendaraanstatus
    let whereClause = {
      kondisi_kendaraan: {
        [Op.in]: ['Ready', 'No Ready']
      }
    };

    // Filter by specific status if provided
    if (status_filter && (status_filter === 'Ready' || status_filter === 'No Ready')) {
      whereClause.kondisi_kendaraan = status_filter;
    }

    // Add date filtering
    if (start_date && end_date) {
      whereClause.tgl_update = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    } else if (start_date) {
      whereClause.tgl_update = {
        [Op.gte]: new Date(start_date)
      };
    } else if (end_date) {
      whereClause.tgl_update = {
        [Op.lte]: new Date(end_date)
      };
    }

    // Get total count
    const totalCount = await models.kendaraanstatus.count({
      where: whereClause,
      include: [
        {
          model: models.kendaraan,
          as: 'kendaraan_info',
          required: false,
          where: search ? {
            [Op.or]: [
              { no_polisi: { [Op.like]: `%${search}%` } },
              { merk_mobil: { [Op.like]: `%${search}%` } },
              { jenis_kendaraan: { [Op.like]: `%${search}%` } }
            ]
          } : undefined
        }
      ]
    });

    // Get data with pagination and search
    const { count, rows } = await models.kendaraanstatus.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: models.kendaraan,
          as: 'kendaraan_info',
          required: false,
          attributes: [
            'jenis_kendaraan', 
            'merk_mobil', 
            'tahun_mobil', 
            'warna_plat', 
            'code_kendaraan',
            'gps_type',
            'gps_device_id'
          ]
        }
      ],
      limit: _limit,
      offset: offset,
      order: [
        [
          'kondisi_kendaraan', 
          'ASC' // Ready first, then No Ready
        ],
        ['tgl_update', 'DESC']
      ]
    });

    // Apply search filter to results if search is provided
    let filteredRows = rows;
    if (search) {
      filteredRows = rows.filter(row => {
        const kendaraan = row.kendaraan_info;
        if (!kendaraan) return false;
        
        return (
          row.no_polisi?.toLowerCase().includes(search.toLowerCase()) ||
          row.nama_driver?.toLowerCase().includes(search.toLowerCase()) ||
          kendaraan.jenis_kendaraan?.toLowerCase().includes(search.toLowerCase()) ||
          kendaraan.merk_mobil?.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    // Group data by status
    const groupedData = {
      'Ready': [],
      'No Ready': []
    };

    filteredRows.forEach(row => {
      if (groupedData[row.kondisi_kendaraan]) {
        groupedData[row.kondisi_kendaraan].push({
          id: row.id,
          id_kendaraan: row.id_kendaraan,
          no_polisi: row.no_polisi,
          id_pengemudi: row.id_pengemudi,
          nama_driver: row.nama_driver,
          kondisi_kendaraan: row.kondisi_kendaraan,
          action: row.action,
          empty_load: row.empty_load,
          keterangan: row.keterangan,
          memo: row.memo,
          customer: row.customer,
          posisi: row.posisi,
          longitude: row.longitude,
          latitude: row.latitude,
          tujuan: row.tujuan,
          foto: row.foto,
          tgl_update: row.tgl_update,
          tgl_create: row.tgl_create,
          id_user: row.id_user,
          kendaraan: row.kendaraan_info ? {
            jenis_kendaraan: row.kendaraan_info.jenis_kendaraan,
            merk_mobil: row.kendaraan_info.merk_mobil,
            tahun_mobil: row.kendaraan_info.tahun_mobil,
            warna_plat: row.kendaraan_info.warna_plat,
            code_kendaraan: row.kendaraan_info.code_kendaraan,
            gps_type: row.kendaraan_info.gps_type,
            gps_device_id: row.kendaraan_info.gps_device_id
          } : null
        });
      }
    });

    const totalData = filteredRows.length;
    const totalPage = Math.ceil(totalData / _limit);

    const output = {
      status: {
        code: 200,
        message: 'Success Get Kendaraan Status Ready & No Ready'
      },
      data: {
        totalData,
        totalPage,
        currentPage: _page,
        limit: _limit,
        summary: {
          totalReady: groupedData['Ready'].length,
          totalNoReady: groupedData['No Ready'].length
        },
        groupedData,
        allData: filteredRows
      }
    };

    res.status(200).json(output);
  } catch (error) {
    console.error('Error getKendaraanStatusReadyNoReady:', error);
    res.status(500).json({
      status: {
        code: 500,
        message: error.message
      }
    });
  }
};

exports.exportKendaraanStatusToExcel = async (req, res) => {
  console.log('=== exportKendaraanStatusToExcel called ===');
  try {
    const { 
      search = '', 
      status_filter = '', 
      start_date = '', 
      end_date = '',
      group_by = 'unit', // Default grouping by unit
      year = '2025' // Default to 2025 as per the query
    } = req.query;

    // Build where clause for kendaraanstatus
    let whereClause = {
      kondisi_kendaraan: {
        [Op.in]: ['Ready', 'No Ready']
      }
    };

    // Filter by specific status if provided
    if (status_filter && (status_filter === 'Ready' || status_filter === 'No Ready')) {
      whereClause.kondisi_kendaraan = status_filter;
    }

    // Add date filtering
    if (start_date && end_date) {
      whereClause.tgl_update = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    } else if (start_date) {
      whereClause.tgl_update = {
        [Op.gte]: new Date(start_date)
      };
    } else if (end_date) {
      whereClause.tgl_update = {
        [Op.lte]: new Date(end_date)
      };
    }

    // Get sequelize instance
    const sequelize = core.dbConnect();

    // Build query based on grouping
    let groupByClause = '';
    let orderByClause = '';
    
    switch (group_by) {
      case 'unit':
        groupByClause = '';
        orderByClause = 'ORDER BY k.id_bu_brench, k.no_polisi';
        break;
      case 'msm':
        groupByClause = 'GROUP BY ms.id_msm';
        orderByClause = 'ORDER BY ms.id_msm, k.no_polisi';
        break;
      case 'driver':
        groupByClause = 'GROUP BY ks.nama_driver';
        orderByClause = 'ORDER BY ks.nama_driver, k.no_polisi';
        break;
      case 'customer':
        groupByClause = 'GROUP BY ks.customer';
        orderByClause = 'ORDER BY ks.customer, k.no_polisi';
        break;
      default:
        groupByClause = '';
        orderByClause = 'ORDER BY k.id_bu_brench, k.no_polisi';
    }

    // Use raw query to get latest status per unit - FIXED VERSION
    const query = `
      SELECT DISTINCT
        k.id as id_unit,
        k.id_bu_brench,
        k.no_polisi,
        k.jenis_kendaraan,
        k.vendor,
        k.jenis_kepemilikan,
        ks.id as status_id,
        ks.nama_driver,
        ks.tujuan,
        ks.posisi,
        ks.customer,
        ks.keterangan,
        ks.tgl_update,
        ks.kondisi_kendaraan,
        ks.empty_load,
        ms.status as warning_status,
        ms.id_msm,
        ms.msm
      FROM kendaraan k
      INNER JOIN kendaraanstatus ks ON ks.id = (
        SELECT MAX(ks2.id)
        FROM kendaraanstatus ks2
        WHERE ks2.id_kendaraan = k.id
        AND ks2.kondisi_kendaraan IN ('Ready', 'No Ready')
        AND ks2.tgl_update = (
          SELECT MAX(ks3.tgl_update)
          FROM kendaraanstatus ks3
          WHERE ks3.id_kendaraan = k.id
          AND ks3.kondisi_kendaraan IN ('Ready', 'No Ready')
        )
      )
      LEFT JOIN m_sm ms ON ks.id_msm = ms.id_msm
      WHERE ks.kondisi_kendaraan IN ('Ready', 'No Ready')
      AND k.jenis_kepemilikan IN ('eureka', 'eur_sewa')
      ${groupByClause}
      ${orderByClause}
    `;

    const rows = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });

    // Debug: Check for duplicates
    const unitIds = rows.map(row => row.id_unit);
    const uniqueUnitIds = [...new Set(unitIds)];
    console.log(`=== Debug: Query Results ===`);
    console.log(`Filter applied: jenis_kepemilikan IN ('eureka', 'eur_sewa')`);
    console.log(`Total rows returned: ${rows.length}`);
    console.log(`Unique unit IDs: ${uniqueUnitIds.length}`);
    console.log(`Duplicate check: ${rows.length === uniqueUnitIds.length ? 'No duplicates' : 'Duplicates found'}`);
    
    if (rows.length !== uniqueUnitIds.length) {
      const duplicates = unitIds.filter((id, index) => unitIds.indexOf(id) !== index);
      console.log('Duplicate unit IDs found:', duplicates);
      
      // Show details of duplicate records
      duplicates.forEach(dupId => {
        const dupRecords = rows.filter(row => row.id_unit === dupId);
        console.log(`\nDuplicate records for ID Unit ${dupId}:`);
        dupRecords.forEach((record, idx) => {
          console.log(`  Record ${idx + 1}:`, {
            id_unit: record.id_unit,
            no_polisi: record.no_polisi,
            nama_driver: record.nama_driver,
            tgl_update: record.tgl_update,
            status_id: record.status_id
          });
        });
      });
    }
    
    // Show sample of unique records
    console.log('\nSample of unique records:');
    rows.slice(0, 5).forEach((row, idx) => {
      console.log(`  Record ${idx + 1}:`, {
        id_unit: row.id_unit,
        no_polisi: row.no_polisi,
        nama_driver: row.nama_driver,
        tgl_update: row.tgl_update
      });
    });
    console.log(`=== End Debug ===`);

    // Force remove duplicates by ID unit - FINAL SOLUTION
    const uniqueRows = [];
    const seenUnitIds = new Set();
    
    rows.forEach(row => {
      if (!seenUnitIds.has(row.id_unit)) {
        seenUnitIds.add(row.id_unit);
        uniqueRows.push(row);
      } else {
        console.log(`🚨 DUPLICATE REMOVED - ID Unit ${row.id_unit}:`, {
          no_polisi: row.no_polisi,
          nama_driver: row.nama_driver,
          tgl_update: row.tgl_update,
          status_id: row.status_id,
          keterangan: row.keterangan
        });
      }
    });
    
    console.log(`✅ FINAL RESULT: ${uniqueRows.length} unique records from ${rows.length} total rows`);
    
    // Verify no duplicates in final result
    const checkUnitIds = uniqueRows.map(row => row.id_unit);
    const checkUniqueIds = [...new Set(checkUnitIds)];
    if (checkUnitIds.length !== checkUniqueIds.length) {
      console.log(`❌ CRITICAL ERROR: Still have duplicates in final result!`);
      console.log(`Final duplicates:`, checkUnitIds.filter((id, index) => checkUnitIds.indexOf(id) !== index));
    } else {
      console.log(`✅ VERIFICATION PASSED: No duplicates in final result`);
    }

    // Apply search filter to results if search is provided
    let filteredRows = uniqueRows;
    if (search) {
      filteredRows = uniqueRows.filter(row => {
        return (
          row.no_polisi?.toLowerCase().includes(search.toLowerCase()) ||
          row.nama_driver?.toLowerCase().includes(search.toLowerCase()) ||
          row.jenis_kendaraan?.toLowerCase().includes(search.toLowerCase()) ||
          row.vendor?.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    // Final verification before creating Excel data
    const excelCheckUnitIds = filteredRows.map(row => row.id_unit);
    const excelCheckUniqueIds = [...new Set(excelCheckUnitIds)];
    console.log(`🔍 FINAL CHECK: ${filteredRows.length} rows, ${excelCheckUniqueIds.length} unique IDs`);
    
    if (excelCheckUnitIds.length !== excelCheckUniqueIds.length) {
      console.log(`❌ CRITICAL: Duplicates found in filtered data!`);
      const duplicates = excelCheckUnitIds.filter((id, index) => excelCheckUnitIds.indexOf(id) !== index);
      console.log(`Duplicate IDs:`, duplicates);
    }

    // Prepare Excel data - 1 row per unit
    const excelData = filteredRows.map((row, index) => {
      const tgl_update = new Date(row.tgl_update);
      const tahun = tgl_update.getFullYear();
      const bulan = (tgl_update.getMonth() + 1).toString().padStart(2, '0');
      const tanggal = tgl_update.getDate();
      
      // Map status to warning description
      const getWarningDescription = (status) => {
        switch (status) {
          case 1: return 'Safe';
          case 2: return 'Warning';
          case 3: return 'Danger';
          default: return 'Safe';
        }
      };
      
      return {
        'No': index + 1,
        'ID Unit': row.id_unit || '-',
        'ID Business Unit': row.id_bu_brench || '-',
        'No. Polisi': row.no_polisi || '-',
        'Vendor': row.vendor || '-',
        'Jenis Kendaraan': row.jenis_kendaraan || '-',
        'Jenis Kepemilikan': row.jenis_kepemilikan || '-',
        'Nama Driver': row.nama_driver || '-',
        'Tujuan': row.tujuan || '-',
        'Posisi': row.posisi || '-',
        'Customer': row.customer || '-',
        'Kota Muat': '-', // Will be added later if needed
        'Kota Bongkar': '-', // Will be added later if needed
        'Keterangan': row.keterangan || '-',
        'Tanggal Update': row.tgl_update ? tgl_update.toISOString().split('T')[0] : '-',
        'Count': 1,
        'Kondisi Kendaraan': row.kondisi_kendaraan || '-',
        'Code Lap Monitor': row.kondisi_kendaraan || '-',
        'Tahun': tahun,
        'Bulan': bulan,
        'Tanggal': tanggal,
        'Code Table': 1,
        'Kode Warning': row.warning_status || 1,
        'Ket Kode Warning': getWarningDescription(row.warning_status || 1),
        'Empty Load': row.empty_load || '-',
        'ID MSM': row.id_msm || '-',
        'MSM': row.msm || '-'
      };
    });

    // Return JSON response instead of Excel file
    res.status(200).json({
      status: {
        code: 200,
        message: `Success Export Kendaraan Status Data Per ${group_by.toUpperCase()} (Eureka & Eur Sewa Only)`
      },
      data: {
        totalData: excelData.length,
        exportDate: new Date().toISOString(),
        groupBy: group_by,
        columns: [
          'No', 'ID Unit', 'ID Business Unit', 'No. Polisi', 'Vendor', 'Jenis Kendaraan', 
          'Jenis Kepemilikan', 'Nama Driver', 'Tujuan', 'Posisi', 'Customer', 'Kota Muat', 
          'Kota Bongkar', 'Keterangan', 'Tanggal Update', 'Count', 'Kondisi Kendaraan', 
          'Code Lap Monitor', 'Tahun', 'Bulan', 'Tanggal', 'Code Table', 'Kode Warning', 
          'Ket Kode Warning', 'Empty Load', 'ID MSM', 'MSM'
        ],
        rows: excelData
      }
    });

  } catch (error) {
    console.error('Error exportKendaraanStatusToExcel:', error);
    res.status(500).json({
      status: {
        code: 500,
        message: error.message
      }
    });
  }
};

// Helper function to get month name
function getMonthName(monthIndex) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
}

// Timeline Unit Function - Get vehicle usage timeline data
exports.getTimelineUnit = async (req, res) => {
  try {
    const { 
      tahun = new Date().getFullYear(), 
      bulan = new Date().getMonth() + 1,
      page = 1, 
      limit = 10,
      status_filter = 'all', // 'all', 'selesai', 'sedang_berlangsung'
      jenis_kepemilikan_filter = 'all', // 'all', 'eureka', 'eur_sewa'
      search = '' // Search across MSM, NOPOL, and other fields
    } = req.query;

    const models = core.models();
    const offset = (page - 1) * limit;

    // Define associations for this query (define directly without conditional checks)
    models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
    models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
    models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
    models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat', as: 'alamat_muat' });
    models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'alamat_bongkar' });

    // Calculate date range for the month
    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 0); // Last day of the month

    // Build where conditions for status filter
    let statusWhereCondition = {};
    if (status_filter === 'selesai') {
      statusWhereCondition = { status: { [Op.in]: [2, 3, 4, 5] } }; // Completed statuses
    } else if (status_filter === 'sedang_berlangsung') {
      statusWhereCondition = { status: 1 }; // In progress status
    }

    // Build where conditions for jenis_kepemilikan filter
    let jenisKepemilikanWhereCondition = {
      jenis_kepemilikan: {
        [Op.in]: ['eureka', 'eur_sewa']
      }
    };
    if (jenis_kepemilikan_filter === 'eureka') {
      jenisKepemilikanWhereCondition = { jenis_kepemilikan: 'eureka' };
    } else if (jenis_kepemilikan_filter === 'eur_sewa') {
      jenisKepemilikanWhereCondition = { jenis_kepemilikan: 'eur_sewa' };
    }
    // If jenis_kepemilikan_filter is 'all' or any other value, keep the default condition
    
    // Debug log
    console.log('jenis_kepemilikan_filter:', jenis_kepemilikan_filter);
    console.log('jenisKepemilikanWhereCondition:', JSON.stringify(jenisKepemilikanWhereCondition, null, 2));

    // First, if there's a search term that looks like an MSM number, we'll find vehicles through m_sm
    let vehicleIdsFromMsm = [];
    if (search) {
      const msmMatches = await models.m_sm.findAll({
        where: {
          msm: { [Op.like]: `%${search}%` },
          is_deleted: false
        },
        attributes: ['id_unit'],
        distinct: true
      });
      vehicleIdsFromMsm = msmMatches.map(m => m.id_unit).filter(id => id);
    }

    // Get vehicles - apply jenis_kepemilikan filter and search
    const vehicleWhereCondition = {
      ...jenisKepemilikanWhereCondition,
      ...(search ? {
        [Op.or]: [
          { no_polisi: { [Op.like]: `%${search}%` } },
          { code_kendaraan: { [Op.like]: `%${search}%` } },
          ...(vehicleIdsFromMsm.length > 0 ? [{ id: { [Op.in]: vehicleIdsFromMsm } }] : [])
        ]
      } : {})
    };

    const vehicles = await models.kendaraan.findAll({
      attributes: [
        'id',
        'no_polisi',
        'kode_kendaraan',
        'jenis_kendaraan',
        'vendor',
        'jenis_kepemilikan'
      ],
      where: vehicleWhereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['no_polisi', 'ASC']]
    });

    // Debug log - check vehicles result
    console.log('Total vehicles found:', vehicles.length);
    console.log('Vehicles jenis_kepemilikan:', vehicles.map(v => ({ no_polisi: v.no_polisi, jenis_kepemilikan: v.jenis_kepemilikan })));

    // Get activities for each vehicle separately - ALL statuses for full month timeline
    const vehicleIds = vehicles.map(v => v.id);
    // Build activities query conditions
    let activitiesWhereCondition = {
      id_unit: {
        [Op.in]: vehicleIds
      },
      tgl_muat: {
        [Op.between]: [startDate, endDate]
      },
      is_deleted: false,
      [Op.and]: [
        { msm: { [Op.notRegexp]: '^RC' } }  // Exclude MSM that starts with RC (case insensitive)
      ]
    };

    // Add search conditions if search parameter exists
    if (search) {
      activitiesWhereCondition[Op.and].push({
        [Op.or]: [
          { msm: { [Op.like]: `%${search}%` } },
          { nopol: { [Op.like]: `%${search}%` } },
          { supir: { [Op.like]: `%${search}%` } }
        ]
      });
    }

    const activities = await models.m_sm.findAll({
      attributes: [
        'id_msm',
        'msm',
        'tgl_muat',
        'tgl_bongkar',
        'tgl_eta',
        'status',
        'status_date',
        'kendaraan',
        'nopol',
        'supir',
        'keterangan',
        'id_unit',
        'id_mpd'
      ],
      where: {
        id_unit: {
          [Op.in]: vehicleIds
        },
        tgl_muat: {
          [Op.between]: [startDate, endDate]
        },
        is_deleted: false,
        ...(search ? {
          [Op.or]: [
            { msm: { [Op.like]: `%${search}%` } },
            { nopol: { [Op.like]: `%${search}%` } },
            { supir: { [Op.like]: `%${search}%` } }
          ],
          msm: { [Op.notRegexp]: '^RC' }  // Exclude MSM that starts with RC (case insensitive)
        } : {
          msm: { [Op.notRegexp]: '^RC' }  // Exclude MSM that starts with RC (case insensitive)
        })
      },
      include: [
        {
          model: models.m_pengadaan_detail,
          required: false,
          attributes: ['id_mpd', 'id_mp', 'id_almuat', 'id_albongkar'],
          include: [
            {
              model: models.m_pengadaan,
              required: false,
              attributes: ['id_mp', 'ph', 'msp'],
              include: [
                {
                  model: models.customer,
                  required: false,
                  attributes: ['id_customer', 'nama_perusahaan']
                }
              ]
            },
            {
              model: models.alamat,
              as: 'alamat_muat',
              required: false,
              attributes: ['id', 'kota']
            },
            {
              model: models.alamat,
              as: 'alamat_bongkar',
              required: false,
              attributes: ['id', 'kota']
            }
          ]
        }
      ],
      order: [['tgl_muat', 'ASC']]
    });

    // Get kendaraanstatus for each activity
    const activityIds = activities.map(a => a.id_msm);
    const kendaraanStatuses = await models.kendaraanstatus.findAll({
      attributes: [
        'id',
        'id_msm',
        'kondisi_kendaraan',
        'action',
        'empty_load',
        'posisi',
        'tujuan',
        'tgl_update',
        'tgl_create',
        'foto'
      ],
      where: {
        id_msm: {
          [Op.in]: activityIds
        }
      }
    });

    const nonKirimanStatuses = await models.kendaraanstatus.findAll({
      attributes: [
        'id',
        'id_kendaraan',
        'id_msm',
        'kondisi_kendaraan',
        'action',
        'empty_load',
        'posisi',
        'tujuan',
        'tgl_update',
        'tgl_create',
        'keterangan',
        'customer',
        'nama_driver',
        'foto'
      ],
      where: {
        id_kendaraan: {
          [Op.in]: vehicleIds
        },
        id_msm: 0,
        tgl_update: {
          [Op.between]: [startDate, endDate]
        },
        kondisi_kendaraan: {
          [Op.in]: ['Maintenance', 'Ready'] // Include both Maintenance and Ready status
        }
      },
      order: [['tgl_update', 'ASC']]
    });

    // Get total count for pagination - apply jenis_kepemilikan filter
    const totalVehicles = await models.kendaraan.count({
      where: jenisKepemilikanWhereCondition
    });

    // Process data to create timeline structure
    const timelineData = vehicles.map(vehicle => {
      const vehicleActivities = activities.filter(activity => activity.id_unit === vehicle.id);
      const vehicleStatuses = kendaraanStatuses.filter(status => 
        vehicleActivities.some(activity => activity.id_msm === status.id_msm)
      );
      
      // Get non-kiriman statuses for this vehicle
      const vehicleNonKirimanStatuses = nonKirimanStatuses.filter(status => status.id_kendaraan === vehicle.id);
      
      // Count activities by status and action
      const completedActivities = vehicleActivities.filter(activity => {
        // Check both m_sm status and kendaraanstatus action
        const isCompletedByStatus = [2, 3, 4, 5].includes(activity.status); // Completed statuses in m_sm
        const latestStatus = vehicleStatuses
          .filter(status => status.id_msm === activity.id_msm)
          .sort((a, b) => new Date(b.tgl_update) - new Date(a.tgl_update))[0];
        const isCompletedByAction = latestStatus && [9].includes(latestStatus.action); // Success action
        return isCompletedByStatus || isCompletedByAction;
      }).length;

      const ongoingActivities = vehicleActivities.filter(activity => {
        // Check both m_sm status and kendaraanstatus action
        const isOngoingByStatus = activity.status === 1; // In progress status in m_sm
        const latestStatus = vehicleStatuses
          .filter(status => status.id_msm === activity.id_msm)
          .sort((a, b) => new Date(b.tgl_update) - new Date(a.tgl_update))[0];
        const isOngoingByAction = latestStatus && ![7, 9].includes(latestStatus.action); // Not Failed or Success
        return isOngoingByStatus || isOngoingByAction;
      }).length;

      // Create timeline activities for calendar display
      const timelineActivities = vehicleActivities.map(activity => {
        const startDate = new Date(activity.tgl_muat);
        
        // Jika tgl_bongkar kosong, gunakan tgl_muat + 3 hari
        let endDate;
        if (activity.tgl_bongkar) {
          endDate = new Date(activity.tgl_bongkar);
        } else {
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 3);
        }
        
        // Ambil action terbaru dari kendaraanstatus
        const latestStatus = vehicleStatuses
          .filter(status => status.id_msm === activity.id_msm)
          .sort((a, b) => new Date(b.tgl_update) - new Date(a.tgl_update))[0];
        
        const action = latestStatus ? latestStatus.action : 1; // Default action 1 jika tidak ada
        
        // Determine completion status based on both m_sm status and kendaraanstatus action
        const isCompletedByStatus = [2, 3, 4, 5].includes(activity.status);
        const isCompletedByAction = [9].includes(action);
        const isCompleted = isCompletedByStatus || isCompletedByAction;
        
        // Determine ongoing status
        const isOngoingByStatus = activity.status === 1;
        const isOngoingByAction = ![7, 9].includes(action);
        const isOngoing = isOngoingByStatus || isOngoingByAction;
        
        // Get customer name, route, and SO number from associations
        const pengadaanDetail = activity.m_pengadaan_detail;
        const namaPelanggan = pengadaanDetail?.m_pengadaan?.customer?.nama_perusahaan || null;
        const nomorSo = pengadaanDetail?.m_pengadaan?.ph || null;
        
        // Build route from muat and bongkar locations
        let rute = null;
        if (pengadaanDetail?.alamat_muat?.kota && pengadaanDetail?.alamat_bongkar?.kota) {
          rute = `${pengadaanDetail.alamat_muat.kota} - ${pengadaanDetail.alamat_bongkar.kota}`;
        } else if (pengadaanDetail?.alamat_muat?.kota) {
          rute = pengadaanDetail.alamat_muat.kota;
        } else if (pengadaanDetail?.alamat_bongkar?.kota) {
          rute = pengadaanDetail.alamat_bongkar.kota;
        }
        
        return {
          id_msm: activity.id_msm,
          msm: activity.msm,
          tgl_muat: activity.tgl_muat,
          tgl_bongkar: activity.tgl_bongkar || endDate.toISOString().split('T')[0],
          tgl_eta: activity.tgl_eta,
          eta_day: activity.tgl_eta ? new Date(activity.tgl_eta).getDate() : null,
          status: activity.status,
          action: action,
          status_text: getStatusText(action),
          status_date: activity.status_date,
          kendaraan: activity.kendaraan,
          nopol: activity.nopol,
          supir: activity.supir,
          keterangan: activity.keterangan,
          nama_pelanggan: namaPelanggan,
          rute: rute,
          nomor_so: nomorSo,
          start_day: startDate.getDate(),
          end_day: endDate.getDate(),
          duration_days: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1,
          is_completed: isCompleted,
          is_ongoing: isOngoing,
          kendaraanstatus: vehicleStatuses.filter(status => status.id_msm === activity.id_msm)
            .map(status => ({
              ...status.dataValues,
              foto: prependFotoUrl(status.foto)
            })),
          foto: latestStatus ? prependFotoUrl(latestStatus.foto) : null,
          is_kiriman: true
        };
      });

      const nonKirimanActivities = vehicleNonKirimanStatuses.map(status => {
        const startDate = new Date(status.tgl_update);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1); // Non-kiriman activities typically last 1 day
        
        // Generate identifier based on kondisi_kendaraan
        const activityType = status.kondisi_kendaraan === 'Maintenance' ? 'MAINTENANCE' : 'READY';
        const msmIdentifier = `${activityType}-${status.id}`;
        
        return {
          id_msm: status.id_msm,
          msm: msmIdentifier,
          tgl_muat: status.tgl_update,
          tgl_bongkar: endDate.toISOString().split('T')[0],
          tgl_eta: null,
          eta_day: null,
          status: 1, // Default status for non-kiriman
          action: status.action,
          status_text: getStatusText(status.action),
          status_date: status.tgl_update,
          kendaraan: vehicle.no_polisi,
          nopol: vehicle.no_polisi,
          supir: status.nama_driver || '',
          keterangan: status.keterangan || status.kondisi_kendaraan,
          nama_pelanggan: null, // Non-kiriman activities don't have customer
          rute: null, // Non-kiriman activities don't have route
          nomor_so: null, // Non-kiriman activities don't have SO number
          start_day: startDate.getDate(),
          end_day: endDate.getDate(),
          duration_days: 1,
          is_completed: [9].includes(status.action),
          is_ongoing: ![7, 9].includes(status.action),
          kendaraanstatus: [
            {
              ...status.dataValues,
              foto: prependFotoUrl(status.foto)
            }
          ],
          foto: prependFotoUrl(status.foto),
          is_non_kiriman: true,
          kondisi_kendaraan: status.kondisi_kendaraan,
          activity_type: activityType
        };
      });

      // Combine kiriman and non-kiriman activities
      const allTimelineActivities = [...timelineActivities, ...nonKirimanActivities]
        .sort((a, b) => new Date(a.tgl_muat) - new Date(b.tgl_muat));

      // Count non-kiriman activities
      const completedNonKiriman = vehicleNonKirimanStatuses.filter(status => [9].includes(status.action)).length;
      const ongoingNonKiriman = vehicleNonKirimanStatuses.filter(status => ![7, 9].includes(status.action)).length;

      return {
        id_kendaraan: vehicle.id,
        no_polisi: vehicle.no_polisi,
        kode_kendaraan: vehicle.kode_kendaraan,
        jenis_kendaraan: vehicle.jenis_kendaraan,
        vendor: vehicle.vendor,
        jenis_kepemilikan: vehicle.jenis_kepemilikan,
        total_aktivitas: vehicleActivities.length + vehicleNonKirimanStatuses.length,
        aktivitas_selesai: completedActivities + completedNonKiriman,
        aktivitas_berlangsung: ongoingActivities + ongoingNonKiriman,
        timeline_activities: allTimelineActivities
      };
    });

    // Calculate summary statistics
    const totalActivities = timelineData.reduce((sum, vehicle) => sum + vehicle.total_aktivitas, 0);
    const totalCompleted = timelineData.reduce((sum, vehicle) => sum + vehicle.aktivitas_selesai, 0);
    const totalOngoing = timelineData.reduce((sum, vehicle) => sum + vehicle.aktivitas_berlangsung, 0);

    const response = {
      success: true,
      message: 'Timeline unit data retrieved successfully',
      data: {
        timeline: timelineData,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(totalVehicles / limit),
          total_units: totalVehicles,
          per_page: parseInt(limit),
          showing: `Menampilkan ${offset + 1}-${Math.min(offset + parseInt(limit), totalVehicles)} dari ${totalVehicles} unit • Halaman ${parseInt(page)} dari ${Math.ceil(totalVehicles / limit)}`
        },
        summary: {
          total_units: timelineData.length,
          total_activities: totalActivities,
          completed_activities: totalCompleted,
          ongoing_activities: totalOngoing
        },
        filters: {
          tahun: parseInt(tahun),
          bulan: parseInt(bulan),
          bulan_text: getMonthName(parseInt(bulan) - 1),
          status_filter: status_filter,
          jenis_kepemilikan_filter: jenis_kepemilikan_filter,
          search: search,
          rows_per_page: parseInt(limit)
        }
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Error in getTimelineUnit:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.getAllNomorPolisi = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = {
      jenis_kepemilikan: {
        [Op.ne]: 'race'
      }
    };
    
    if (search) {
      whereClause.no_polisi = {
        [Op.like]: `%${search}%`
      };
    }

    const totalCount = await models.kendaraan.count({
      where: whereClause
    });

    const { count, rows } = await models.kendaraan.findAndCountAll({
      where: whereClause,
      attributes: [
        'id',
        'no_polisi',
        'jenis_kepemilikan'
      ],
      order: [['no_polisi', 'ASC']],
      limit: parseInt(limit),
      offset: offset
    });

    const nomorPolisiData = rows.map((item, index) => ({
      no: offset + index + 1,
      id: item.id,
      no_polisi: item.no_polisi || '-',
      jenis_kepemilikan: item.jenis_kepemilikan || '-'
    }));

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    return res.status(200).json({
      status: {
        code: 200,
        message: "Success Get Nomor Polisi Kendaraan"
      },
      data: {
        totalData: totalCount,
        totalPage: totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
        nomorPolisi: nomorPolisiData
      },
      filters: {
        search: search || '',
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error getAllNomorPolisi:', error);
    return res.status(500).json({
      status: {
        code: 500,
        message: 'Gagal mengambil data nomor polisi kendaraan'
      },
      error: error.message
    });
  }
};

// Update kendaraan data
exports.updateKendaraan = async (req, res) => {
  try {
    const {
      id,
      no_polisi,
      code_kendaraan,
      kode_kendaraan,
      merk_mobil,
      tahun_mobil,
      jenis_kendaraan,
      kapasitas,
      kapasitas_maks,
      kubikasi,
      panjang,
      lebar,
      tinggi,
      warna_plat,
      gps_type,
      gps_device_id,
      vendor,
      jenis_kepemilikan,
      status,
      tgl_stnk,
      tgl_plat_nomor,
      tgl_kir,
      tgl_beli,
      id_driver,
      id_bu_brench
    } = req.body;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: 'Parameter id wajib diisi'
      });
    }

    const kendaraan = await models.kendaraan.findByPk(id);
    if (!kendaraan) {
      return res.status(404).json({
        status: 404,
        message: 'Kendaraan tidak ditemukan'
      });
    }

    const payload = {};
    // Map allowed fields only if provided (avoid overwriting with undefined)
    const assignIfProvided = (key, value) => {
      if (value !== undefined) payload[key] = value;
    };

    assignIfProvided('no_polisi', no_polisi);
    // Support both code_kendaraan and kode_kendaraan inputs
    assignIfProvided('code_kendaraan', code_kendaraan !== undefined ? code_kendaraan : kode_kendaraan);
    assignIfProvided('kode_kendaraan', kode_kendaraan);
    assignIfProvided('merk_mobil', merk_mobil);
    assignIfProvided('tahun_mobil', tahun_mobil);
    assignIfProvided('jenis_kendaraan', jenis_kendaraan);
    assignIfProvided('kapasitas', kapasitas);
    assignIfProvided('kapasitas_maks', kapasitas_maks);
    assignIfProvided('kubikasi', kubikasi);
    assignIfProvided('panjang', panjang);
    assignIfProvided('lebar', lebar);
    assignIfProvided('tinggi', tinggi);
    assignIfProvided('warna_plat', warna_plat);
    assignIfProvided('gps_type', gps_type);
    assignIfProvided('gps_device_id', gps_device_id);
    assignIfProvided('vendor', vendor);
    assignIfProvided('jenis_kepemilikan', jenis_kepemilikan);
    assignIfProvided('status', status);
    assignIfProvided('tgl_stnk', tgl_stnk);
    assignIfProvided('tgl_plat_nomor', tgl_plat_nomor);
    assignIfProvided('tgl_kir', tgl_kir);
    assignIfProvided('tgl_beli', tgl_beli);
    assignIfProvided('id_driver', id_driver);
    assignIfProvided('id_bu_brench', id_bu_brench);

    await kendaraan.update(payload);

    // invalidate cache list to reflect updates
    try { exports.invalidateKendaraanCache(); } catch (e) {}

    return res.status(200).json({
      status: 200,
      message: 'Berhasil mengupdate data kendaraan',
      data: kendaraan
    });
  } catch (error) {
    console.error('Error updateKendaraan:', error);
    return res.status(500).json({
      status: 500,
      message: 'Gagal mengupdate data kendaraan',
      error: error.message
    });
  }
};

// Helper function to get status text from action
function getStatusText(action) {
  const actionMap = {
    1: 'On Process',
    2: 'On Pickup', 
    3: 'On Delivery',
    5: 'Unloading',
    7: 'Failed',
    9: 'Success',
    17: 'Pending Pickup',
    19: 'Doc Complete'
  };
  return actionMap[action] || 'Unknown';
}

// Helper function to prepend foto URL
function prependFotoUrl(foto) {
  if (!foto || typeof foto !== 'string' || foto.trim() === '') return null;
  if (foto.startsWith('http')) return foto;
  return `https://api.eurekalogistics.co.id/${foto.replace(/^\/+/, '')}`;
}
