const core = require('../../config/core.config');
const models = core.models();
const QRCode = require('qrcode');
const { Op } = require('sequelize');

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

/**
 * Validate geofence - check if scan location is within 20 meters of pool
 * @param {Object} pool - Pool data with latitude and longitude
 * @param {string} scanLatitude - Scan latitude
 * @param {string} scanLongitude - Scan longitude
 * @returns {Object} Validation result
 */
function validateGeofence(pool, scanLatitude, scanLongitude) {
  if (!pool.latitude || !pool.longitude || !scanLatitude || !scanLongitude) {
    return {
      valid: false,
      message: 'Koordinat pool atau scan tidak lengkap'
    };
  }

const poolLat = parseFloat(pool.latitude);
  const poolLon = parseFloat(pool.longitude);
  const scanLat = parseFloat(scanLatitude);
  const scanLon = parseFloat(scanLongitude);

  if (isNaN(poolLat) || isNaN(poolLon) || isNaN(scanLat) || isNaN(scanLon)) {
    return {
      valid: false,
      message: 'Format koordinat tidak valid'
    };
  }

  const distance = calculateDistance(poolLat, poolLon, scanLat, scanLon);
  const maxDistance = 40; // 40 meters

  return {
    valid: distance <= maxDistance,
    distance: Math.round(distance),
    maxDistance: maxDistance,
    message: distance <= maxDistance 
      ? `Scan dalam radius ${maxDistance}m (jarak: ${Math.round(distance)}m)`
      : `Scan di luar radius ${maxDistance}m (jarak: ${Math.round(distance)}m)`
  };
}

/**
 * Generate QR Code untuk Pool
 * QR Code berisi pool_code dalam format JSON
 */
exports.generatePoolQRCode = async (req, res) => {
  try {
    const { pool_code } = req.params;

    // Validasi pool exists - coba pool_code dulu, jika tidak ada coba id_pool
    let pool = await models.m_pool.findOne({
      where: { pool_code: pool_code }
    });
    
    // Jika tidak ditemukan dengan pool_code, coba dengan id_pool (untuk backward compatibility)
    if (!pool && !isNaN(pool_code)) {
      pool = await models.m_pool.findOne({
        where: { id_pool: parseInt(pool_code) }
      });
    }

    if (!pool) {
      return res.status(404).json({
        status: false,
        message: 'Pool tidak ditemukan',
      });
    }

    // Data yang akan di-encode ke QR code
    const qrData = JSON.stringify({
      type: 'POOL',
      pool_code: pool.pool_code,
      pool_name: pool.nama_pool,
      timestamp: new Date().toISOString()
    });

    // Generate QR Code sebagai Data URL (base64)
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2
    });

    res.status(200).json({
      status: true,
      message: 'QR Code berhasil di-generate',
      data: {
        pool_code: pool.pool_code,
        nama_pool: pool.nama_pool,
        alamat_pool: pool.alamat_pool,
        qr_code_data_url: qrCodeDataURL,
        qr_code_content: qrData
      }
    });
  } catch (error) {
    console.error('Error generatePoolQRCode:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal generate QR Code',
      error: error.message,
    });
  }
};

/**
 * Generate QR Code untuk semua pool
 */
exports.generateAllQRCodes = async (req, res) => {
  try {
    const pools = await models.m_pool.findAll({
      where: { status: 1 },
      order: [['nama_pool', 'ASC']]
    });

    const qrCodes = [];

    for (const pool of pools) {
      const qrData = {
        type: 'POOL',
        pool_code: pool.pool_code,
        pool_name: pool.nama_pool,
        pool_id: pool.id_pool,
        latitude: pool.latitude,
        longitude: pool.longitude,
        timestamp: new Date().toISOString()
      };

      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 2
      });

      qrCodes.push({
        pool_code: pool.pool_code,
        pool_name: pool.nama_pool,
        qr_code: qrCodeDataURL,
        qr_data: qrData
      });
    }

    res.status(200).json({
      status: true,
      message: 'Semua QR Code berhasil di-generate',
      data: {
        total: qrCodes.length,
        qr_codes: qrCodes,
        generated_at: new Date()
      }
    });

  } catch (error) {
    console.error('Error generateAllQRCodes:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal generate semua QR Code',
      error: error.message,
    });
  }
};

/**
 * Scan QR Code dan Record Activity (IN/OUT)
 * Body: { pool_code, id_kendaraan, activity_type, latitude, longitude, notes, scan_by, scan_by_name }
 */
exports.scanQRCodeAndRecord = async (req, res) => {
  try {
    const { 
      pool_code, 
      id_kendaraan, 
      activity_type, 
      latitude, 
      longitude, 
      notes,
      scan_by,
      scan_by_name
    } = req.body;

    // Validasi input
    if (!pool_code || !id_kendaraan || !activity_type) {
      return res.status(400).json({
        status: false,
        message: 'pool_code, id_kendaraan, dan activity_type wajib diisi',
      });
    }

    // Convert pool_code to id_pool
    const pool = await models.m_pool.findOne({
      where: { pool_code: pool_code }
    });

    if (!pool) {
      return res.status(404).json({
        status: false,
        message: 'Pool tidak ditemukan',
      });
    }

    const id_pool = pool.id_pool;

    if (!['IN', 'OUT'].includes(activity_type)) {
      return res.status(400).json({
        status: false,
        message: 'activity_type harus IN atau OUT',
      });
    }

    // Cek kendaraan exists berdasarkan ID
    const vehicle = await models.kendaraan.findOne({
      where: { id: id_kendaraan }
    });

    if (!vehicle) {
      return res.status(404).json({
        status: false,
        message: 'Kendaraan tidak ditemukan di database',
      });
    }

    // Get last activity untuk validasi bisnis logic
    const lastActivity = await models.pool_activity_log.findOne({
      where: { 
        id_pool: id_pool,
        id_kendaraan: id_kendaraan 
      },
      order: [['created_at', 'DESC']]
    });

    // Validasi bisnis logic: tidak bisa IN jika sudah IN, tidak bisa OUT jika sudah OUT
    if (lastActivity && lastActivity.activity_type === activity_type) {
      return res.status(400).json({
        status: false,
        message: `Kendaraan sudah dalam status ${activity_type} di pool ini`,
        last_activity: {
          activity_type: lastActivity.activity_type,
          created_at: lastActivity.created_at
        }
      });
    }

    // Get user info dari request body atau token (jika ada middleware auth)
    const userId = scan_by || (req.user ? req.user.id : null);
    const userName = scan_by_name || (req.user ? req.user.nama : null);

    // Record activity
    const activity = await models.pool_activity_log.create({
      id_pool: id_pool,
      id_kendaraan: id_kendaraan,
      activity_type: activity_type,
      scan_latitude: latitude || null,
      scan_longitude: longitude || null,
      scan_by: userId,
      scan_by_name: userName,
      jenis_kendaraan: vehicle.jenis_kendaraan || null,
      notes: notes || null,
      created_at: new Date()
    });

    res.status(201).json({
      status: true,
      message: `Berhasil record aktivitas ${activity_type}`,
      data: {
        id: activity.id,
        pool_code: pool_code,
        pool_name: pool.nama_pool,
        id_kendaraan: activity.id_kendaraan,
        kode_kendaraan: vehicle.kode_kendaraan,
        no_polisi: vehicle.no_polisi,
        jenis_kendaraan: vehicle.jenis_kendaraan,
        activity_type: activity.activity_type,
        created_at: activity.created_at,
        scan_by: activity.scan_by,
        scan_by_name: activity.scan_by_name,
        scan_location: {
          latitude: activity.scan_latitude,
          longitude: activity.scan_longitude
        },
        notes: activity.notes
      }
    });
  } catch (error) {
    console.error('Error scanQRCodeAndRecord:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal record aktivitas',
      error: error.message,
    });
  }
};

/**
 * Get Current Status Kendaraan di Pool (IN atau OUT)
 */
exports.getVehicleCurrentStatus = async (req, res) => {
  try {
    const { id_kendaraan } = req.params;

    // Get last activity untuk kendaraan ini
    const lastActivity = await models.pool_activity_log.findOne({
      where: { id_kendaraan: id_kendaraan },
      order: [['created_at', 'DESC']]
    });

    if (!lastActivity) {
      return res.status(404).json({
        status: false,
        message: 'Tidak ada history aktivitas untuk kendaraan ini',
      });
    }

    // Get pool info
    const pool = await models.m_pool.findOne({
      where: { id_pool: lastActivity.id_pool }
    });

    // Get vehicle info
    const vehicle = await models.kendaraan.findOne({
      where: { id: lastActivity.id_kendaraan }
    });

    res.status(200).json({
      status: true,
      message: 'Berhasil mendapatkan status kendaraan',
      data: {
        id_kendaraan: lastActivity.id_kendaraan,
        kode_kendaraan: vehicle ? vehicle.kode_kendaraan : null,
        no_polisi: vehicle ? vehicle.no_polisi : null,
        current_status: lastActivity.activity_type,
        pool_code: pool ? pool.pool_code : null,
        pool_name: pool ? pool.nama_pool : null,
        last_activity_time: lastActivity.created_at,
        scan_by: lastActivity.scan_by_name
      }
    });
  } catch (error) {
    console.error('Error getVehicleCurrentStatus:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal mendapatkan status kendaraan',
      error: error.message,
    });
  }
};

/**
 * Get History Log Pool Activity
 * Query params: pool_code, kode_kendaraan, activity_type, start_date, end_date
 */
exports.getPoolActivityHistory = async (req, res) => {
  try {
    const { 
      pool_code, 
      id_kendaraan, 
      activity_type, 
      start_date, 
      end_date,
      scan_by, // id driver
      search, // general search (kode_kendaraan / no_polisi / pool_code / nama_pool / scan_by_name)
      page = 1,
      limit = 50
    } = req.query;

    // Build where clause
    const whereClause = {};
    
    if (pool_code) {
      // Convert pool_code to id_pool
      const pool = await models.m_pool.findOne({
        where: { pool_code: pool_code }
      });
      if (pool) {
        whereClause.id_pool = pool.id_pool;
      }
    }
    
    if (id_kendaraan) {
      whereClause.id_kendaraan = id_kendaraan;
    }
    
    if (activity_type && ['IN', 'OUT'].includes(activity_type)) {
      whereClause.activity_type = activity_type;
    }
    
    if (scan_by) {
      whereClause.scan_by = scan_by;
    }
    
    // Filter tanggal: start_date dan end_date
    if (start_date || end_date) {
      // Jika sudah ada whereClause.created_at (misal dari filter lain), merge
      if (!whereClause.created_at) whereClause.created_at = {};
      // start_date: jam 00:00:00
      if (start_date) {
        const start = new Date(start_date);
        start.setHours(0,0,0,0);
        whereClause.created_at[Op.gte] = start;
      }
      // end_date: jam 23:59:59
      if (end_date) {
        const end = new Date(end_date);
        end.setHours(23,59,59,999);
        whereClause.created_at[Op.lte] = end;
      }
    }

    // Search across kendaraan (kode_kendaraan/no_polisi), pool (pool_code/nama_pool) and scan_by_name
    if (search && String(search).trim() !== '') {
      const q = `%${search}%`;

      // find matching kendaraan ids
      const matchingVehicles = await models.kendaraan.findAll({
        where: {
          [Op.or]: [
            { kode_kendaraan: { [Op.like]: q } },
            { no_polisi: { [Op.like]: q } }
          ]
        },
        attributes: ['id']
      });
      const vehicleIds = matchingVehicles.map(v => v.id);

      // find matching pools
      const matchingPools = await models.m_pool.findAll({
        where: {
          [Op.or]: [
            { pool_code: { [Op.like]: q } },
            { nama_pool: { [Op.like]: q } }
          ]
        },
        attributes: ['id_pool']
      });
      const poolIds = matchingPools.map(p => p.id_pool);

      const searchOr = [];
      if (vehicleIds.length) searchOr.push({ id_kendaraan: { [Op.in]: vehicleIds } });
      if (poolIds.length) searchOr.push({ id_pool: { [Op.in]: poolIds } });
      // match scan_by_name in activity log
      searchOr.push({ scan_by_name: { [Op.like]: q } });

      // Combine search OR with existing whereClause using AND so other filters still apply
      if (!whereClause[Op.and]) whereClause[Op.and] = [];
      whereClause[Op.and].push({ [Op.or]: searchOr });
    }

    const offset = (page - 1) * limit;

    // Get history with pagination
    const { count, rows } = await models.pool_activity_log.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    // Enrich data dengan info pool
    const enrichedData = await Promise.all(rows.map(async (activity) => {
      const pool = await models.m_pool.findOne({
        where: { id_pool: activity.id_pool }
      });
      
      // Get vehicle info
      const vehicle = await models.kendaraan.findOne({
        where: { id: activity.id_kendaraan }
      });

      return {
        id: activity.id,
        pool_code: pool ? pool.pool_code : null,
        pool_name: pool ? pool.nama_pool : null,
        id_kendaraan: activity.id_kendaraan,
        kode_kendaraan: vehicle ? vehicle.kode_kendaraan : null,
        no_polisi: vehicle ? vehicle.no_polisi : null,
        jenis_kendaraan: activity.jenis_kendaraan || (vehicle ? vehicle.jenis_kendaraan : null),
        activity_type: activity.activity_type,
        created_at: activity.created_at,
        scan_by: activity.scan_by,
        scan_by_name: activity.scan_by_name,
        notes: activity.notes
      };
    }));

    res.status(200).json({
      status: true,
      message: 'Berhasil mendapatkan history aktivitas',
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total_data: count,
        total_pages: Math.ceil(count / limit)
      },
      data: enrichedData
    });
  } catch (error) {
    console.error('Error getPoolActivityHistory:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal mendapatkan history aktivitas',
      error: error.message,
    });
  }
};

/**
 * Get All Vehicles Currently IN Pool
 */
exports.getVehiclesInPool = async (req, res) => {
  try {
    const { pool_code } = req.params;

    // Validasi pool exists - coba pool_code dulu, jika tidak ada coba id_pool
    let pool = await models.m_pool.findOne({
      where: { pool_code: pool_code }
    });
    
    // Jika tidak ditemukan dengan pool_code, coba dengan id_pool (untuk backward compatibility)
    if (!pool && !isNaN(pool_code)) {
      pool = await models.m_pool.findOne({
        where: { id_pool: parseInt(pool_code) }
      });
    }

    if (!pool) {
      return res.status(404).json({
        status: false,
        message: 'Pool tidak ditemukan',
      });
    }

    // Get all activities for this pool
    const activities = await models.pool_activity_log.findAll({
      where: { id_pool: pool.id_pool },
      order: [['id_kendaraan', 'ASC'], ['created_at', 'DESC']]
    });

    // Group by id_kendaraan dan ambil latest activity
    const vehicleStatusMap = new Map();
    activities.forEach(activity => {
      if (!vehicleStatusMap.has(activity.id_kendaraan)) {
        vehicleStatusMap.set(activity.id_kendaraan, activity);
      }
    });

    // Filter hanya yang status IN
    const vehiclesIn = Array.from(vehicleStatusMap.values())
      .filter(activity => activity.activity_type === 'IN');

    // Enrich dengan data kendaraan
    const enrichedData = await Promise.all(vehiclesIn.map(async (activity) => {
      // Get vehicle info
      const vehicle = await models.kendaraan.findOne({
        where: { id: activity.id_kendaraan }
      });

      return {
        id_kendaraan: activity.id_kendaraan,
        kode_kendaraan: vehicle ? vehicle.kode_kendaraan : null,
        no_polisi: vehicle ? vehicle.no_polisi : null,
        jenis_kendaraan: vehicle ? vehicle.jenis_kendaraan : null,
        in_time: activity.created_at,
        scan_by: activity.scan_by_name
      };
    }));

    res.status(200).json({
      status: true,
      message: 'Berhasil mendapatkan daftar kendaraan di pool',
      data: {
        pool_code: pool.pool_code,
        nama_pool: pool.nama_pool,
        total_vehicles: enrichedData.length,
        vehicles: enrichedData
      }
    });
  } catch (error) {
    console.error('Error getVehiclesInPool:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal mendapatkan daftar kendaraan',
      error: error.message,
    });
  }
};

/**
 * Check Vehicle Exists (Helper endpoint untuk debugging)
 */
exports.checkVehicleExists = async (req, res) => {
  try {
    const { id_kendaraan } = req.params;

    // Cek di table kendaraan berdasarkan ID
    const vehicle = await models.kendaraan.findOne({
      where: { id: id_kendaraan },
      attributes: ['id', 'kode_kendaraan', 'no_polisi', 'jenis_kendaraan', 'status', 'vendor', 'merk_mobil', 'tahun_mobil']
    });

    res.status(200).json({
      status: true,
      message: 'Vehicle check completed',
      data: {
        id_kendaraan: id_kendaraan,
        found: !!vehicle,
        vehicle_data: vehicle
      }
    });
  } catch (error) {
    console.error('Error checkVehicleExists:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal check vehicle',
      error: error.message,
    });
  }
};

/**
 * Check Driver Exists (Helper endpoint untuk debugging)
 */
exports.checkDriverExists = async (req, res) => {
  try {
    const { id_driver } = req.params;

    // Cek di table m_driver berdasarkan ID
    const driver = await models.m_driver.findOne({
      where: { id: id_driver },
      attributes: ['id', 'nama', 'no_hp', 'email', 'status']
    });

    res.status(200).json({
      status: true,
      message: 'Driver check completed',
      data: {
        id_driver: id_driver,
        found: !!driver,
        driver_data: driver
      }
    });
  } catch (error) {
    console.error('Error checkDriverExists:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal check driver',
      error: error.message,
    });
  }
};

/**
 * Check IN - Record aktivitas IN ke pool
 * Body: { pool_code, id_kendaraan, latitude, longitude, notes, scan_by, scan_by_name }
 */
exports.checkIn = async (req, res) => {
  try {
    const { 
      pool_code, 
      id_kendaraan, 
      latitude, 
      longitude, 
      notes,
      scan_by,
      scan_by_name
    } = req.body;

    // Validasi input
    if (!pool_code || !id_kendaraan) {
      return res.status(400).json({
        status: false,
        message: 'pool_code dan id_kendaraan wajib diisi',
      });
    }

    // Convert pool_code to id_pool
    const pool = await models.m_pool.findOne({
      where: { pool_code: pool_code }
    });

    if (!pool) {
      return res.status(404).json({
        status: false,
        message: 'Pool tidak ditemukan',
      });
    }

    const id_pool = pool.id_pool;

    // Validasi geofence untuk IN
    const geofenceValidation = validateGeofence(pool, latitude, longitude);
    if (!geofenceValidation.valid) {
      return res.status(400).json({
        status: false,
        message: `Validasi geofence gagal: ${geofenceValidation.message}`,
        geofence: geofenceValidation
      });
    }

    // Cek kendaraan exists berdasarkan ID
    const vehicle = await models.kendaraan.findOne({
      where: { id: id_kendaraan }
    });

    if (!vehicle) {
      return res.status(404).json({
        status: false,
        message: 'Kendaraan tidak ditemukan di database',
      });
    }

    // Get last activity untuk validasi bisnis logic
    const lastActivity = await models.pool_activity_log.findOne({
      where: { 
        id_pool: id_pool,
        id_kendaraan: id_kendaraan 
      },
      order: [['created_at', 'DESC']]
    });

    // Validasi bisnis logic: tidak bisa IN jika sudah IN
    if (lastActivity && lastActivity.activity_type === 'IN') {
      return res.status(400).json({
        status: false,
        message: 'Kendaraan sudah dalam status IN di pool ini',
        last_activity: {
          activity_type: lastActivity.activity_type,
          created_at: lastActivity.created_at
        }
      });
    }

    // Get user info dari request body atau token (jika ada middleware auth)
    const userId = scan_by || (req.user ? req.user.id : null);
    const userName = scan_by_name || (req.user ? req.user.nama : null);

    // Record activity IN
    const activity = await models.pool_activity_log.create({
      id_pool: id_pool,
      id_kendaraan: id_kendaraan,
      activity_type: 'IN',
      scan_latitude: latitude || null,
      scan_longitude: longitude || null,
      scan_by: userId,
      scan_by_name: userName,
      notes: notes || null,
      created_at: new Date()
    });

    res.status(201).json({
      status: true,
      message: 'Berhasil record aktivitas IN',
      data: {
        id: activity.id,
        pool_code: pool_code,
        pool_name: pool.nama_pool,
        id_kendaraan: activity.id_kendaraan,
        kode_kendaraan: vehicle.kode_kendaraan,
        no_polisi: vehicle.no_polisi,
        activity_type: activity.activity_type,
        created_at: activity.created_at,
        scan_by: activity.scan_by,
        scan_by_name: activity.scan_by_name,
        scan_location: {
          latitude: activity.scan_latitude,
          longitude: activity.scan_longitude
        },
        notes: activity.notes,
        previous_status: lastActivity ? lastActivity.activity_type : 'NONE',
        geofence: geofenceValidation
      }
    });
  } catch (error) {
    console.error('Error checkIn:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal record aktivitas IN',
      error: error.message,
    });
  }
};

/**
 * Check OUT - Record aktivitas OUT dari pool
 * Body: { pool_code, id_kendaraan, latitude, longitude, notes, scan_by, scan_by_name }
 */
exports.checkOut = async (req, res) => {
  try {
    const { 
      pool_code, 
      id_kendaraan, 
      latitude, 
      longitude, 
      notes,
      scan_by,
      scan_by_name
    } = req.body;

    // Validasi input
    if (!pool_code || !id_kendaraan) {
      return res.status(400).json({
        status: false,
        message: 'pool_code dan id_kendaraan wajib diisi',
      });
    }

    // Convert pool_code to id_pool
    const pool = await models.m_pool.findOne({
      where: { pool_code: pool_code }
    });

    if (!pool) {
      return res.status(404).json({
        status: false,
        message: 'Pool tidak ditemukan',
      });
    }

    const id_pool = pool.id_pool;

    // Cek kendaraan exists berdasarkan ID
    const vehicle = await models.kendaraan.findOne({
      where: { id: id_kendaraan }
    });

    if (!vehicle) {
      return res.status(404).json({
        status: false,
        message: 'Kendaraan tidak ditemukan di database',
      });
    }

    // Get last activity untuk validasi bisnis logic - cari di semua pool
    const lastActivity = await models.pool_activity_log.findOne({
      where: { 
        id_kendaraan: id_kendaraan 
      },
      order: [['created_at', 'DESC']]
    });

    // Validasi bisnis logic: tidak bisa OUT jika belum pernah IN
    if (!lastActivity) {
      return res.status(400).json({
        status: false,
        message: 'Kendaraan belum pernah check IN di pool manapun',
      });
    }

    if (lastActivity.activity_type === 'OUT') {
      return res.status(400).json({
        status: false,
        message: 'Kendaraan sudah dalam status OUT',
        last_activity: {
          activity_type: lastActivity.activity_type,
          created_at: lastActivity.created_at
        }
      });
    }

    // Validasi pool matching: OUT hanya bisa di pool yang sama dengan IN terakhir
    if (lastActivity.id_pool !== id_pool) {
      // Get pool info untuk error message
      const lastPool = await models.m_pool.findOne({
        where: { id_pool: lastActivity.id_pool }
      });
      
      return res.status(400).json({
        status: false,
        message: `Kendaraan hanya bisa OUT di pool yang sama dengan IN terakhir`,
        details: {
          current_pool: {
            id_pool: id_pool,
            pool_code: pool_code,
            pool_name: pool.nama_pool
          },
          last_in_pool: {
            id_pool: lastActivity.id_pool,
            pool_code: lastPool ? lastPool.pool_code : 'Unknown',
            pool_name: lastPool ? lastPool.nama_pool : 'Unknown'
          },
          last_activity: {
            activity_type: lastActivity.activity_type,
            created_at: lastActivity.created_at
          }
        }
      });
    }

    // Validasi geofence untuk OUT - hanya jika pool matching valid
    const geofenceValidation = validateGeofence(pool, latitude, longitude);
    if (!geofenceValidation.valid) {
      return res.status(400).json({
        status: false,
        message: `Validasi geofence gagal: ${geofenceValidation.message}`,
        geofence: geofenceValidation
      });
    }

    // Get user info dari request body atau token (jika ada middleware auth)
    const userId = scan_by || (req.user ? req.user.id : null);
    const userName = scan_by_name || (req.user ? req.user.nama : null);

    // Record activity OUT
    const activity = await models.pool_activity_log.create({
      id_pool: id_pool,
      id_kendaraan: id_kendaraan,
      activity_type: 'OUT',
      scan_latitude: latitude || null,
      scan_longitude: longitude || null,
      scan_by: userId,
      scan_by_name: userName,
      notes: notes || null,
      created_at: new Date()
    });

    res.status(201).json({
      status: true,
      message: 'Berhasil record aktivitas OUT',
      data: {
        id: activity.id,
        pool_code: pool_code,
        pool_name: pool.nama_pool,
        id_kendaraan: activity.id_kendaraan,
        kode_kendaraan: vehicle.kode_kendaraan,
        no_polisi: vehicle.no_polisi,
        activity_type: activity.activity_type,
        created_at: activity.created_at,
        scan_by: activity.scan_by,
        scan_by_name: activity.scan_by_name,
        scan_location: {
          latitude: activity.scan_latitude,
          longitude: activity.scan_longitude
        },
        notes: activity.notes,
        previous_status: lastActivity.activity_type,
        geofence: geofenceValidation
      }
    });
  } catch (error) {
    console.error('Error checkOut:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal record aktivitas OUT',
      error: error.message,
    });
  }
};

/**
 * Auto Scan QR Code - Otomatis POST IN/OUT berdasarkan status terakhir
 * Body: { pool_code, id_kendaraan, latitude, longitude, notes, scan_by, scan_by_name }
 */
exports.autoScanQRCode = async (req, res) => {
  try {
    const { 
      pool_code, 
      id_kendaraan, 
      latitude, 
      longitude, 
      notes,
      scan_by,
      scan_by_name
    } = req.body;

    // Validasi input
    if (!pool_code || !id_kendaraan) {
      return res.status(400).json({
        status: false,
        message: 'pool_code dan id_kendaraan wajib diisi',
      });
    }

    // Convert pool_code to id_pool
    const pool = await models.m_pool.findOne({
      where: { pool_code: pool_code }
    });

    if (!pool) {
      return res.status(404).json({
        status: false,
        message: 'Pool tidak ditemukan',
      });
    }

    const id_pool = pool.id_pool;

    // Validasi geofence untuk auto scan
    const geofenceValidation = validateGeofence(pool, latitude, longitude);
    if (!geofenceValidation.valid) {
      return res.status(400).json({
        status: false,
        message: `Validasi geofence gagal: ${geofenceValidation.message}`,
        geofence: geofenceValidation
      });
    }

    // Cek kendaraan exists berdasarkan ID
    const vehicle = await models.kendaraan.findOne({
      where: { id: id_kendaraan }
    });

    if (!vehicle) {
      return res.status(404).json({
        status: false,
        message: 'Kendaraan tidak ditemukan di database',
      });
    }

    // Get last activity untuk menentukan activity_type
    const lastActivity = await models.pool_activity_log.findOne({
      where: { 
        id_pool: id_pool,
        id_kendaraan: id_kendaraan 
      },
      order: [['created_at', 'DESC']]
    });

    // Tentukan activity_type berdasarkan status terakhir
    let activity_type;
    if (!lastActivity) {
      // Jika belum ada history, default IN
      activity_type = 'IN';
    } else if (lastActivity.activity_type === 'IN') {
      // Jika terakhir IN, sekarang OUT
      activity_type = 'OUT';
    } else {
      // Jika terakhir OUT, sekarang IN
      activity_type = 'IN';
    }

    // Get user info dari request body atau token (jika ada middleware auth)
    const userId = scan_by || (req.user ? req.user.id : null);
    const userName = scan_by_name || (req.user ? req.user.nama : null);

    // Record activity
    const activity = await models.pool_activity_log.create({
      id_pool: id_pool,
      id_kendaraan: id_kendaraan,
      activity_type: activity_type,
      scan_latitude: latitude || null,
      scan_longitude: longitude || null,
      scan_by: userId,
      scan_by_name: userName,
      notes: notes || null,
      created_at: new Date()
    });

    res.status(201).json({
      status: true,
      message: `Berhasil record aktivitas ${activity_type}`,
      data: {
        id: activity.id,
        pool_code: pool_code,
        pool_name: pool.nama_pool,
        id_kendaraan: activity.id_kendaraan,
        kode_kendaraan: vehicle.kode_kendaraan,
        no_polisi: vehicle.no_polisi,
        activity_type: activity.activity_type,
        created_at: activity.created_at,
        scan_by: activity.scan_by,
        scan_by_name: activity.scan_by_name,
        scan_location: {
          latitude: activity.scan_latitude,
          longitude: activity.scan_longitude
        },
        notes: activity.notes,
        auto_determined: true,
        previous_status: lastActivity ? lastActivity.activity_type : 'NONE',
        geofence: geofenceValidation
      }
    });
  } catch (error) {
    console.error('Error autoScanQRCode:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal record aktivitas',
      error: error.message,
    });
  }
};

/**
 * Create New Pool (Helper endpoint untuk testing)
 */
exports.createPool = async (req, res) => {
  try {
    const { 
      nama_pool, 
      alamat_pool, 
      pool_code, 
      latitude, 
      longitude 
    } = req.body;

    // Validasi input
    if (!nama_pool || !pool_code) {
      return res.status(400).json({
        status: false,
        message: 'nama_pool dan pool_code wajib diisi',
      });
    }

    // Cek apakah pool_code sudah ada
    const existingPool = await models.m_pool.findOne({
      where: { pool_code: pool_code }
    });

    if (existingPool) {
      return res.status(400).json({
        status: false,
        message: 'Pool code sudah digunakan',
      });
    }

    // Create new pool
    const newPool = await models.m_pool.create({
      nama_pool: nama_pool,
      alamat_pool: alamat_pool || null,
      pool_code: pool_code,
      latitude: latitude || null,
      longitude: longitude || null,
      status: 1
    });

    res.status(201).json({
      status: true,
      message: 'Pool berhasil dibuat',
      data: {
        id_pool: newPool.id_pool,
        pool_code: newPool.pool_code,
        nama_pool: newPool.nama_pool,
        alamat_pool: newPool.alamat_pool,
        latitude: newPool.latitude,
        longitude: newPool.longitude,
        status: newPool.status
      }
    });
  } catch (error) {
    console.error('Error createPool:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal membuat pool',
      error: error.message,
    });
  }
};

/**
 * Get Pool Statistics
 */
exports.getPoolStatistics = async (req, res) => {
  try {
    const { pool_code } = req.params;
    const { start_date, end_date } = req.query;

    // Validasi pool exists - coba pool_code dulu, jika tidak ada coba id_pool
    let pool = await models.m_pool.findOne({
      where: { pool_code: pool_code }
    });
    
    // Jika tidak ditemukan dengan pool_code, coba dengan id_pool (untuk backward compatibility)
    if (!pool && !isNaN(pool_code)) {
      pool = await models.m_pool.findOne({
        where: { id_pool: parseInt(pool_code) }
      });
    }

    if (!pool) {
      return res.status(404).json({
        status: false,
        message: 'Pool tidak ditemukan',
      });
    }

    // Build where clause
    const whereClause = { pool_code: pool_code };
    
    if (start_date || end_date) {
      whereClause.created_at = {};
      if (start_date) {
        whereClause.created_at[Op.gte] = new Date(start_date);
      }
      if (end_date) {
        whereClause.created_at[Op.lte] = new Date(end_date);
      }
    }

    // Get statistics
    const totalIn = await models.pool_activity_log.count({
      where: { ...whereClause, activity_type: 'IN' }
    });

    const totalOut = await models.pool_activity_log.count({
      where: { ...whereClause, activity_type: 'OUT' }
    });

    // Get unique vehicles
    const uniqueVehicles = await models.pool_activity_log.findAll({
      where: whereClause,
      attributes: [[models.sequelize.fn('DISTINCT', models.sequelize.col('id_kendaraan')), 'id_kendaraan']],
      raw: true
    });

    // Get current vehicles in pool
    const activities = await models.pool_activity_log.findAll({
      where: { id_pool: pool.id_pool },
      order: [['id_kendaraan', 'ASC'], ['created_at', 'DESC']]
    });

    const vehicleStatusMap = new Map();
    activities.forEach(activity => {
      if (!vehicleStatusMap.has(activity.id_kendaraan)) {
        vehicleStatusMap.set(activity.id_kendaraan, activity);
      }
    });

    const currentlyIn = Array.from(vehicleStatusMap.values())
      .filter(activity => activity.activity_type === 'IN').length;

    res.status(200).json({
      status: true,
      message: 'Berhasil mendapatkan statistik pool',
      data: {
        pool_code: pool.pool_code,
        nama_pool: pool.nama_pool,
        period: {
          start_date: start_date || 'all time',
          end_date: end_date || 'now'
        },
        statistics: {
          total_in: totalIn,
          total_out: totalOut,
          unique_vehicles: uniqueVehicles.length,
          currently_in_pool: currentlyIn
        }
      }
    });
  } catch (error) {
    console.error('Error getPoolStatistics:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal mendapatkan statistik pool',
      error: error.message,
    });
  }
};

