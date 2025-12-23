const gpsService = require("../../services/gpsApiServices");
const core = require("../../config/core.config");
const { detectLongStops } = require("../../services/detectStops");

// Get all pools
exports.getPools = async (req, res) => {
  try {
    const pools = await models.m_pool.findAll({
      where: {
        status: 1,
      },
      attributes: [
        ["id_pool", "id"],
        ["nama_pool", "nama"],
        "alamat_pool",
        "latitude",
        "longitude",
        "status",
      ],
      raw: true,
    });

    res.status(200).json({
      success: true,
      status: 200,
      data: pools,
    });
  } catch (error) {
    console.error("[ERROR] getPools:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch pools data",
    });
  }
};

const db = require("../../config/db.config");

const { Op } = require("sequelize");

const models = core.models();

const moment = require("moment");

const NodeCache = require("node-cache");

const turf = require("@turf/turf");

// Cache for last position data (5 minutes TTL)
const positionCache = new NodeCache({ stdTTL: 300 });

// Cache keys for different data types
const CACHE_KEYS = {
  COMBINED_LAST_POSITION: "combined_last_position",
  TOTAL_KILAT_DATA: "total_kilat_data",
  MARGONO_DATA: "margono_data",
};

// Function to clear position cache (useful for manual cache invalidation)
const clearPositionCache = () => {
  positionCache.flushAll();
  console.log("[CACHE] Position cache cleared");
};

// Function to clear specific cache by key
const clearCacheByKey = (key) => {
  positionCache.del(key);
  console.log(`[CACHE] Cache cleared for key: ${key}`);
};

// Function to clear all GPS-related caches
const clearAllGpsCache = () => {
  Object.values(CACHE_KEYS).forEach((key) => {
    positionCache.del(key);
  });
  console.log("[CACHE] All GPS caches cleared");
};

const nomorPlatList = [
  "B 9586 TEU",

  "B 9107 BEV",

  "B 9642 BEU",

  "B 9689 BEU",

  "B 9114 BEV",

  "B 9008 BEV",

  "B 9103 BEV",

  "B 9961 BEU",

  "B 9959 BEU",

  "N 9038 UF",

  "N 9047 UF",

  "B 9581 TEU",

  "B 9956 BEU",

  "B 9322 BEV",

  "B 9288 BXU",

  "B 9110 BEV",

  "B 9002 BEV",

  "B 9645 BEU",

  "B 9997 BEU",

  "B 9105 BEV",

  "B 9007 BEV",

  "B 9984 BEU",

  "B 9112 BEV",

  "B 9587 BEU",

  "B 9408 BEV",

  "B 9409 BEV",

  "B 9410 BEV",

  "B 9411 BEV",

  "B 9412 BEV",

  "B 9506 BEV",

  "B 9507 BEV",

  "B 9508 BEV",

  "B 9509 BEV",

  "B 9510 BEV",

  "B 9010 BEV",

  "B 9814 BRV",

  "B 9011 BEV",

  "B 9006 BEV",

  "N 9382 UF",

  "N 9379 UF",

  "N 9050 UG",

  "B 9989 BEU",

  "B 9644 BEU",
];

const flatten = (data) => {
  if (Array.isArray(data) && data.length === 1 && Array.isArray(data[0])) {
    return data[0];
  }

  // Handle case where data is already an array of objects
  if (Array.isArray(data)) {
    return data;
  }

  return data;
};

// Helper function to add timeout to promises
const withTimeout = (promise, timeoutMs = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
    ),
  ]);
};

// Function to check if cache is stale based on timestamp
const isCacheStale = (cacheKey, maxAgeMinutes = 5) => {
  const cacheData = positionCache.get(cacheKey);
  if (!cacheData) return true;

  const cacheTimestamp = positionCache.getTtl(cacheKey);
  const now = Date.now();
  const maxAge = maxAgeMinutes * 60 * 1000; // Convert to milliseconds

  return now - cacheTimestamp > maxAge;
};

// Function to invalidate cache when new GPS data is received
const invalidateCacheOnDataUpdate = (dataSource = "unknown") => {
  console.log(`[CACHE] Invalidating cache due to new ${dataSource} data`);
  clearAllGpsCache();
};

// ===================== Total Kilat Functions =====================

exports.getDeviceInfo = async (req, res) => {
  try {
    const data = await gpsService.fetchDeviceInfo();

    const cleanedData = flatten(data);

    res.status(200).json({
      success: true,

      status: 200,

      data: cleanedData,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,

      status: 500,

      message: "Failed to fetch device info",
    });
  }
};

exports.getDeviceHistoryData = async (req, res) => {
  try {
    const { device_name, start_time, end_time } = req.query;

    if (!device_name || !start_time || !end_time) {
      return res.status(400).json({
        success: false,

        status: 400,

        message: "device_name, start_time, and end_time are required",
      });
    }

    const data = await gpsService.fetchDeviceHistoryData(
      device_name,
      start_time,
      end_time
    );

    const cleanedData = flatten(data);

    res.status(200).json({
      success: true,

      status: 200,

      data: cleanedData,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,

      status: 500,

      message: "Failed to fetch device history data",
    });
  }
};

exports.getLatestVehiclePosition = async (req, res) => {
  try {
    const data = await gpsService.fetchLatestVehiclePosition();

    const cleanedData = flatten(data);

    const poolNames = [
      "Pool Semarang",

      "Penerbit Erlangga (Cab. Bandung)",

      "Pool Jakarta (Jl. Mabes)",

      "Pool Surabaya",

      "Pool Bandung Sumber Sari (Bandung)",

      "Penerbit Erlangga (Cab. Palembang)",
    ];

    const poolCounts = {};

    poolNames.forEach((pool) => {
      poolCounts[pool] = cleanedData.filter((d) => d.geoName === pool).length;
    });

    res.status(200).json({
      success: true,

      status: 200,

      ...poolCounts,

      data: cleanedData,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,

      status: 500,

      message: "Failed to fetch latest vehicle position",
    });
  }
};

// exports.detectStationaryVehicles = async (req, res) => {

//   try {

//     const { device_name, start_time, end_time } = req.query;

//     if (!device_name || !start_time || !end_time) {

//       return res.status(400).json({

//         success: false,

//         status: 400,

//         message: 'device_name, start_time, and end_time are required'

//       });

//     }

//     const rawData = await gpsService.fetchDeviceHistoryData(device_name, start_time, end_time);

//     console.log('[DEBUG] Raw response:', JSON.stringify(rawData, null, 2));

//     let dataPart = [];

//     if (Array.isArray(rawData)) {

//       dataPart = rawData;

//     } else if (Array.isArray(rawData?.data)) {

//       dataPart = rawData.data;

//     } else if (Array.isArray(rawData?.data?.data)) {

//       dataPart = rawData.data.data;

//     } else {

//       return res.status(200).json({

//         success: true,

//         saved: 0,

//         message: 'No raw data from API',

//         data: []

//       });

//     }

//     const data = flatten(dataPart);

//     console.log('[DEBUG] Flattened data length:', data.length);

//     if (!Array.isArray(data) || data.length === 0) {

//       return res.status(200).json({

//         success: true,

//         saved: 0,

//         message: 'No valid GPS records found after flattening',

//         data: []

//       });

//     }

//     const stops = detectLongStops(data);

//     console.log('[DEBUG] Detected stops:', stops);

//     const result = [];

//     for (const entry of stops) {

//       const existing = await db('stationary_logs')

//         .where({

//           from_time: entry.from,

//           to_time: entry.to,

//           device_name: device_name

//         })

//         .first();

//       if (!existing) {

//         await db('stationary_logs').insert({

//           from_time: entry.from,

//           to_time: entry.to,

//           duration_hours: entry.duration_hours,

//           latitude: entry.latitude,

//           longitude: entry.longitude,

//           geo_name: entry.geoName,

//           device_name: device_name,

//           notified: false

//         });

//         result.push({ ...entry, deviceName: device_name });

//       } else {

//         console.log(`[SKIP] Already exists in DB: ${entry.from} → ${entry.to}`);

//       }

//     }

//     res.status(200).json({

//       success: true,

//       saved: result.length,

//       data: result

//     });

//   } catch (error) {

//     console.error('[ERROR] detectStationaryVehicles:', error);

//     res.status(500).json({

//       success: false,

//       status: 500,

//       message: 'Failed to detect stationary vehicles'

//     });

//   }

// };

exports.detectStationaryVehicles = async (req, res) => {
  try {
    const { device_name, start_time, end_time } = req.query;

    if (!device_name || !start_time || !end_time) {
      return res.status(400).json({
        success: false,

        status: 400,

        message: "device_name, start_time, and end_time are required",
      });
    }

    const rawData = await gpsService.fetchDeviceHistoryData(
      device_name,
      start_time,
      end_time
    );

    console.log("[DEBUG] Raw response:", JSON.stringify(rawData, null, 2));

    let dataPart = [];

    if (Array.isArray(rawData)) {
      dataPart = rawData;
    } else if (Array.isArray(rawData?.data)) {
      dataPart = rawData.data;
    } else if (Array.isArray(rawData?.data?.data)) {
      dataPart = rawData.data.data;
    } else {
      return res.status(200).json({
        success: true,

        saved: 0,

        message: "No raw data from API",

        data: [],
      });
    }

    const data = flatten(dataPart);

    console.log("[DEBUG] Flattened data length:", data.length);

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(200).json({
        success: true,

        saved: 0,

        message: "No valid GPS records found after flattening",

        data: [],
      });
    }

    const stops = detectLongStops(data);

    const longStops = stops.filter((s) => parseFloat(s.duration_hours) >= 3);

    console.log("[DEBUG] Detected long stops >= 3 hours:", longStops);

    const result = [];

    for (const entry of longStops) {
      const existing = await db.query(
        `SELECT * FROM stationary_logs 

         WHERE from_time = ? AND to_time = ? AND device_name = ? 

         LIMIT 1`,

        [entry.from, entry.to, device_name]
      );

      if (existing.length === 0) {
        await db.query(
          `INSERT INTO stationary_logs 

           (from_time, to_time, duration_hours, latitude, longitude, geo_name, device_name, notified) 

           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

          [
            entry.from,

            entry.to,

            entry.duration_hours,

            entry.latitude,

            entry.longitude,

            entry.geoName,

            device_name,

            true,
          ]
        );

        // Invalidate cache when new stationary data is inserted
        invalidateCacheOnDataUpdate("stationary_logs");

        result.push({ ...entry, deviceName: device_name });
      } else {
        console.log(`[SKIP] Already exists in DB: ${entry.from} → ${entry.to}`);
      }
    }

    res.status(200).json({
      success: true,

      saved: result.length,

      data: result,
    });
  } catch (error) {
    console.error("[ERROR] detectStationaryVehicles:", error);

    res.status(500).json({
      success: false,

      status: 500,

      message: "Failed to detect stationary vehicles",
    });
  }
};

// ===================== Margono Functions =====================

exports.lastPositionMargono = async (req, res) => {
  try {
    const results = [];

    for (const plateNo of nomorPlatList) {
      try {
        const data = await gpsService.lastPositionMargono(plateNo);

        results.push({ plateNo, data });
      } catch (err) {
        results.push({
          plateNo,

          error: true,

          message: err.message,
        });
      }
    }

    res.status(200).json({
      success: true,

      status: 200,

      total: results.length,

      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      status: 500,

      message: "Failed to fetch Margono last position",

      error: error.message,
    });
  }
};

exports.getHistoryMargono = async (req, res) => {
  try {
    const { plateNo, from, to } = req.query;

    const result = await gpsService.getHistoryLocation(plateNo, from, to);

    const formattedData = result.Data.map((item) => ({
      datetime: item.Time,

      mileage: Math.round(item.Miles / 1000),

      heading: item.Angle,

      speed: item.Velocity,

      longitude: item.Longitude,

      latitude: item.Latitude,

      acc: item.Locate,

      event_message: item.Alarm?.toString() || "",

      fuel1_volume: item.Oil,

      fuel2_volume: item.LevelNum,

      temperature: item.Temperature,

      geoName: "",
    }));

    res.status(200).json({
      success: true,

      status: 200,

      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      status: 500,

      message: "Failed to fetch Margono history location",

      error: error.message,
    });
  }
};

// ===================== Comined Functions =====================

async function getVehicleId({ source, deviceName, plateNo }) {
  console.log("device_name:", deviceName);

  console.log("plateNo:", plateNo);

  if (source === "gps_kit" && deviceName) {
    const kendaraan = await models.kendaraan.findOne({
      where: { gps_device_id: deviceName },
    });

    return kendaraan?.id || null;
  }

  if (source === "margono" && plateNo) {
    const kendaraan = await models.kendaraan.findOne({
      where: { no_polisi: plateNo },
    });

    return kendaraan?.id || null;
  }

  return null;
}

async function getPlatNomorFromDevice(deviceName) {
  if (!deviceName) return "";

  const kendaraan = await models.kendaraan.findOne({
    where: { gps_device_id: deviceName },

    attributes: ["no_polisi"],
  });

  return kendaraan?.no_polisi || "";
}

/**
 * Get driver information from vehicle_id
 * @param {number} vehicleId - Vehicle ID
 * @returns {Promise<Object>} - Driver information {id, name}
 */
async function getDriverInfoFromVehicle(vehicleId) {
  try {
    if (!vehicleId) return { id: null, name: null };

    const kendaraan = await models.kendaraan.findOne({
      where: { id: vehicleId },
      include: [
        {
          model: models.m_driver,
          as: "id_driver_m_driver",
          attributes: ["id", "nama"],
        },
      ],
      attributes: ["id_driver"],
    });

    if (kendaraan && kendaraan.id_driver_m_driver) {
      return {
        id: kendaraan.id_driver_m_driver.id,
        name: kendaraan.id_driver_m_driver.nama,
      };
    }

    return { id: null, name: null };
  } catch (error) {
    console.error("[ERROR] Failed to get driver info:", error.message);
    return { id: null, name: null };
  }
}

/**
 * Insert overhour event to gps_event_logs table
 * @param {Object} stop - Stop data object
 * @param {string} plateNo - Plate number for Margono system
 * @returns {Promise<boolean>} - Success status
 */
async function insertOverhourEvent(stop, plateNo) {
  try {
    const vehicleId = await getVehicleId({
      source: stop.source,

      deviceName: stop.deviceName,

      plateNo: stop.source === "margono" ? plateNo : null,
    });

    if (!vehicleId) {
      console.warn(
        `[SKIP] Tidak ditemukan vehicle_id untuk ${
          stop.source === "gps_kit" ? stop.deviceName : plateNo || "N/A"
        }`
      );
      return false;
    }

    // Get driver information
    const driverInfo = await getDriverInfoFromVehicle(vehicleId);

    const platNomor =
      stop.source === "gps_kit"
        ? await getPlatNomorFromDevice(stop.deviceName)
        : plateNo || "";

    await db.query(
      `

          INSERT INTO gps_event_logs (

            vehicle_id, device_name, plat_nomor, geo_name, latitude, longitude,

            event_type, from_time, to_time, duration_hours,

            speed, speed_limit, driver_id, driver_name

          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

        `,
      [
        vehicleId,

        stop.deviceName || "",

        platNomor,
        stop.geoName || "",

        stop.latitude || 0,

        stop.longitude || 0,

        "overhour",

        stop.from,

        stop.to,

        parseFloat(stop.duration_hours),

        0,

        0,

        driverInfo.id,

        driverInfo.name,
      ]
    );

    // Invalidate cache when new GPS event is inserted
    invalidateCacheOnDataUpdate("gps_event_logs");

    console.log(
      `[INSERTED] overhour event from ${stop.from} to ${stop.to} - Driver: ${
        driverInfo.name || "N/A"
      }`
    );

    return true;
  } catch (error) {
    console.error("[ERROR] Insert overhour event failed:", error.message);
    return false;
  }
}

/**
 * Insert overspeed event to gps_event_logs table
 * @param {Object} item - GPS data item
 * @param {string} plateNo - Plate number for Margono system
 * @returns {Promise<boolean>} - Success status
 */
async function insertOverspeedEvent(item, plateNo) {
  try {
    const vehicleId = await getVehicleId({
      source: item.source,

      deviceName: item.deviceName,

      plateNo: item.source === "margono" ? plateNo : null,
    });

    if (!vehicleId) {
      console.warn(
        `[SKIP] Tidak ditemukan vehicle_id untuk ${
          item.source === "gps_kit" ? item.deviceName : plateNo || "N/A"
        }`
      );
      return false;
    }

    // Get driver information
    const driverInfo = await getDriverInfoFromVehicle(vehicleId);

    const platNomor =
      item.source === "gps_kit"
        ? await getPlatNomorFromDevice(item.deviceName)
        : plateNo || "";

    await db.query(
      `

            INSERT INTO gps_event_logs (

              vehicle_id, device_name, plat_nomor, geo_name, latitude, longitude,

              event_type, from_time, to_time, duration_hours,

              speed, speed_limit, driver_id, driver_name

            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

          `,
      [
        vehicleId,

        item.deviceName || "",

        platNomor,
        item.geoName || "",

        item.latitude || 0,

        item.longitude || 0,

        "overspeed",

        item.datetime,

        item.datetime,

        0,

        item.speed,

        60,

        driverInfo.id,

        driverInfo.name,
      ]
    );

    // Invalidate cache when new GPS event is inserted
    invalidateCacheOnDataUpdate("gps_event_logs");

    console.log(
      `[INSERTED] overspeed event at ${item.datetime} - Driver: ${
        driverInfo.name || "N/A"
      }`
    );

    return true;
  } catch (error) {
    console.error("[ERROR] Insert overspeed event failed:", error.message);
    return false;
  }
}

/**
 * Process GPS events in batch for better performance using bulk inserts
 * @param {Array} items - Array of GPS data items
 * @param {string} plateNo - Plate number for Margono system
 * @param {string} eventType - Type of event ('overhour' or 'overspeed')
 * @returns {Promise<Object>} - Processing results
 */
async function processGpsEventsBatch(items, plateNo, eventType) {
  const results = {
    total: items.length,
    success: 0,
    failed: 0,
    details: [],
  };

  if (items.length === 0) {
    return results;
  }

  console.log(
    `[BATCH] Processing ${items.length} ${eventType} events using bulk insert...`
  );

  try {
    // Prepare bulk insert data
    const bulkData = [];

    for (const item of items) {
      try {
        const vehicleId = await getVehicleId({
          source: item.source,
          deviceName: item.deviceName,
          plateNo: item.source === "margono" ? plateNo : null,
        });

        if (!vehicleId) {
          console.warn(
            `[SKIP] Tidak ditemukan vehicle_id untuk ${
              item.source === "gps_kit" ? item.deviceName : plateNo || "N/A"
            }`
          );
          results.failed++;
          continue;
        }

        // Get driver information
        const driverInfo = await getDriverInfoFromVehicle(vehicleId);

        const platNomor =
          item.source === "gps_kit"
            ? await getPlatNomorFromDevice(item.deviceName)
            : plateNo || "";

        if (eventType === "overhour") {
          bulkData.push([
            vehicleId,
            item.deviceName || "",
            platNomor,
            item.geoName || "",
            item.latitude || 0,
            item.longitude || 0,
            "overhour",
            item.from,
            item.to,
            parseFloat(item.duration_hours),
            0,
            0,
            driverInfo.id,
            driverInfo.name,
          ]);
        } else if (eventType === "overspeed") {
          bulkData.push([
            vehicleId,
            item.deviceName || "",
            platNomor,
            item.geoName || "",
            item.latitude || 0,
            item.longitude || 0,
            "overspeed",
            item.datetime,
            item.datetime,
            0,
            item.speed,
            60,
            driverInfo.id,
            driverInfo.name,
          ]);
        }

        results.success++;
      } catch (error) {
        results.failed++;
        console.error(
          `[ERROR] Failed to prepare ${eventType} event:`,
          error.message
        );
      }
    }

    // Perform bulk insert if we have data
    if (bulkData.length > 0) {
      const placeholders = bulkData
        .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .join(", ");
      const values = bulkData.flat();

      await db.query(
        `
        INSERT INTO gps_event_logs (
          vehicle_id, device_name, plat_nomor, geo_name, latitude, longitude,
          event_type, from_time, to_time, duration_hours,
          speed, speed_limit, driver_id, driver_name
        ) VALUES ${placeholders}
      `,
        values
      );

      // Invalidate cache when new GPS events are inserted in batch
      invalidateCacheOnDataUpdate(`gps_event_logs_batch_${eventType}`);

      console.log(
        `[BULK INSERT] Successfully inserted ${bulkData.length} ${eventType} events`
      );
    }
  } catch (error) {
    console.error(
      `[BULK ERROR] Failed to insert ${eventType} events:`,
      error.message
    );
    results.failed = results.total;
    results.success = 0;
  }

  console.log(
    `[BATCH] ${eventType} processing completed: ${results.success} success, ${results.failed} failed`
  );
  return results;
}

/**
 * Log GPS processing summary with structured format
 * @param {string} identifier - Vehicle identifier
 * @param {Object} summary - Processing summary
 */
function logGpsProcessingSummary(identifier, summary) {
  const timestamp = new Date().toISOString();

  console.log("=".repeat(80));
  console.log(`[GPS PROCESSING SUMMARY] ${timestamp}`);
  console.log(`Identifier: ${identifier}`);
  console.log(`Systems Queried: ${summary.systems_queried.join(", ")}`);
  console.log(`Total Records: ${summary.total_records}`);
  console.log("");
  console.log("Events Processing Results:");
  console.log(
    `  Overhour: ${summary.events_processed.overhour.success}/${summary.events_processed.overhour.total} (${summary.events_processed.overhour.failed} failed)`
  );
  console.log(
    `  Overspeed: ${summary.events_processed.overspeed.success}/${summary.events_processed.overspeed.total} (${summary.events_processed.overspeed.failed} failed)`
  );
  console.log("=".repeat(80));
}

/**
 * Get combined GPS history from both TotalKilat and Margono systems
 * @param {string} identifier - Single parameter that can be either:
 *   - Device name (numeric) for TotalKilat system
 *   - Plate number (e.g., "B 9586 TEU") for Margono system
 *   - Any other format will be tried on both systems
 * @param {string} start_time - Start time in format "YYYY-MM-DD HH:MM:SS"
 * @param {string} end_time - End time in format "YYYY-MM-DD HH:MM:SS"
 * @param {string} process_events - Whether to process GPS events (default: 'true', set to 'false' for faster response)
 *
 * Examples:
 * - TotalKilat: /gps/combined/history?identifier=113454940&start_time=2024-07-24 00:00:00&end_time=2024-07-25 17:00:00
 * - Margono: /gps/combined/history?identifier=B 9586 TEU&start_time=2024-07-24 00:00:00&end_time=2024-07-25 17:00:00
 * - Fast response (no events): /gps/combined/history?identifier=113454940&start_time=2024-07-24 00:00:00&end_time=2024-07-25 17:00:00&process_events=false
 */
exports.getCombinedHistory = async (req, res) => {
  const {
    identifier,
    start_time,
    end_time,
    process_events = "true",
  } = req.query;

  if (!identifier || !start_time || !end_time) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "identifier, start_time, and end_time are required",
    });
  }

  // Determine if identifier is a device_name (TotalKilat) or plateNo (Margono)
  // Device names are typically numeric, plate numbers have specific format
  const isDeviceName = /^\d+$/.test(identifier);
  const isPlateNo = /^[A-Z]\s+\d+\s+[A-Z]+$/.test(
    identifier.replace(/\s+/g, " ")
  );

  console.log(`[DEBUG] Identifier: "${identifier}"`);
  console.log(`[DEBUG] isDeviceName: ${isDeviceName}, isPlateNo: ${isPlateNo}`);

  let device_name, plateNo;

  if (isDeviceName) {
    // This is a device name for TotalKilat
    device_name = identifier;
    plateNo = null;
    console.log(
      `[INFO] Identifier "${identifier}" detected as TotalKilat device name`
    );
  } else if (isPlateNo) {
    // This is a plate number for Margono
    plateNo = identifier;
    device_name = null;
    console.log(
      `[INFO] Identifier "${identifier}" detected as Margono plate number`
    );
  } else {
    // Try to determine by checking both systems
    // First try as device name, then as plate number
    device_name = identifier;
    plateNo = identifier;
    console.log(
      `[INFO] Identifier "${identifier}" will be tried on both systems`
    );
  }

  try {
    let gpsData = [];
    let margonoData = [];

    // Fetch TotalKilat data only if device_name is provided
    if (device_name) {
      try {
        console.log(
          `[DEBUG] Fetching TotalKilat data for device: ${device_name}`
        );
        const gpsRaw = await gpsService.fetchDeviceHistoryData(
          device_name,
          start_time,
          end_time
        );
        console.log(`[DEBUG] Raw GPS response type:`, typeof gpsRaw);
        console.log(
          `[DEBUG] Raw GPS response:`,
          JSON.stringify(gpsRaw, null, 2)
        );

        const gpsFlattened = flatten(gpsRaw);

        console.log(`[DEBUG] Raw GPS data for device ${device_name}:`, gpsRaw);
        console.log(`[DEBUG] Flattened GPS data:`, gpsFlattened);

        // Use the same logic as getDeviceHistoryData that works
        gpsData = Array.isArray(gpsFlattened) ? gpsFlattened : [];

        // If gpsData is still nested (array of arrays), flatten it
        if (gpsData.length > 0 && Array.isArray(gpsData[0])) {
          gpsData = gpsData.flat();
        }

        // Add source and deviceName fields to each GPS item
        // Normalize odometer field if available
        gpsData = gpsData.map((item) => ({
          ...item,
          source: "gps_kit",
          deviceName: device_name,
          odometer_km:
            typeof item.mileage !== "undefined" && item.mileage !== null
              ? Number(item.mileage)
              : typeof item.odometer_km !== "undefined"
              ? Number(item.odometer_km)
              : undefined,
        }));

        console.log(`[DEBUG] Processed GPS data count:`, gpsData.length);
        if (gpsData.length > 0) {
          console.log(`[DEBUG] First GPS item:`, gpsData[0]);
          console.log(`[DEBUG] First GPS item datetime:`, gpsData[0].datetime);
          console.log(
            `[DEBUG] First GPS item datetime type:`,
            typeof gpsData[0].datetime
          );
        }
      } catch (gpsError) {
        console.warn(
          `[GPS ERROR] Failed to fetch TotalKilat data for device ${device_name}:`,
          gpsError.message
        );
        gpsData = [];
      }
    }

    // Fetch Margono data only if plateNo is provided
    if (plateNo) {
      try {
        const margonoRaw = await gpsService.getHistoryLocation(
          plateNo,
          start_time,
          end_time
        );
        margonoData = Array.isArray(margonoRaw?.Data)
          ? margonoRaw.Data.map((item) => ({
              datetime: item.Time || "",
              mileage: Math.round((item.Miles || 0) / 1000),
              heading: item.Angle || 0,
              speed: item.Velocity || 0,
              longitude: item.Longitude || 0,
              latitude: item.Latitude || 0,
              acc: item.Locate ? 1 : 0,
              event_message: item.Alarm?.toString() || "",
              fuel1_volume: item.Oil || 0,
              fuel2_volume: item.LevelNum || 0,
              temperature: item.Temperature || 0,
              geoName: "",
              source: "margono",
              odometer_km:
                typeof item.Miles !== "undefined" && item.Miles !== null
                  ? Math.round(Number(item.Miles) / 1000)
                  : undefined,
            }))
          : [];
      } catch (margonoError) {
        console.warn(
          `[MARGONO ERROR] Failed to fetch Margono data for plate ${plateNo}:`,
          margonoError.message
        );
        margonoData = [];
      }
    }

    const combined = [...gpsData, ...margonoData];
    console.log(
      `[DEBUG] Before filtering - GPS data: ${gpsData.length}, Margono data: ${margonoData.length}`
    );
    console.log(`[DEBUG] After filtering - Combined data: ${combined.length}`);
    if (
      combined.length === 0 &&
      (gpsData.length > 0 || margonoData.length > 0)
    ) {
      console.log(
        `[DEBUG] Filtering removed all items. Sample items before filter:`,
        gpsData.length > 0 ? gpsData[0] : margonoData[0]
      );
    }
    combined.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    // Detect overhour (kendaraan berhenti > 3 jam)==================================================================>
    const longStops = detectLongStops(combined).filter(
      (stop) => parseFloat(stop.duration_hours) >= 3
    );
    const overspeedItems = combined.filter((item) => item.speed > 60);

    // Process events asynchronously if enabled
    if (process_events === "true") {
      const processEventsAsync = async () => {
        try {
          // Process overhour events in batch
          const overhourResults = await processGpsEventsBatch(
            longStops,
            device_name || plateNo,
            "overhour"
          );

          // Process overspeed events in batch
          const overspeedResults = await processGpsEventsBatch(
            overspeedItems,
            device_name || plateNo,
            "overspeed"
          );

          // Log processing results
          console.log(
            `[ASYNC] Events processing completed - Overhour: ${overhourResults.success}/${overhourResults.total}, Overspeed: ${overspeedResults.success}/${overspeedResults.total}`
          );
        } catch (error) {
          console.error(
            "[ASYNC ERROR] Events processing failed:",
            error.message
          );
        }
      };

      // Start processing events in background (don't await)
      processEventsAsync();
    }
    //==============================================================================================>

    const result = [...combined];

    // Log summary of what was queried
    const summary = {
      identifier: identifier,
      systems_queried: [],
      total_records: result.length,
      events_processing:
        process_events === "true" ? "async_background" : "disabled",
      events_detected: {
        overhour: longStops.length,
        overspeed: overspeedItems.length,
      },
    };

    if (device_name) summary.systems_queried.push("TotalKilat");
    if (plateNo) summary.systems_queried.push("Margono");

    // Log basic summary (detailed logging happens in background)
    console.log(`[SUMMARY] Query completed for "${identifier}":`, summary);

    return res.status(200).json({
      success: true,

      status: 200,

      total: result.length,

      data: result,
      summary: summary,
    });
  } catch (error) {
    console.error("[ERROR] getCombinedHistory:", error);

    return res.status(500).json({
      success: false,

      status: 500,

      message: "Failed to fetch combined history",

      error: error.message,
      identifier: identifier,
      systems_attempted: {
        totalKilat: !!device_name,
        margono: !!plateNo,
      },
    });
  }
};

exports.getCombinedLastPosition = async (req, res) => {
  try {
    const cacheKey = CACHE_KEYS.COMBINED_LAST_POSITION;
    const forceRefresh = req.query.force_refresh === "true";

    // Check cache first (unless force refresh is requested)
    if (!forceRefresh) {
      const cachedData = positionCache.get(cacheKey);
      if (cachedData && !isCacheStale(cacheKey, 3)) {
        // 3 minutes max age for combined data
        return res.status(200).json({
          success: true,
          status: 200,
          total: cachedData.length,
          data: cachedData,
          cached: true,
          cache_age: Math.round(
            (Date.now() - positionCache.getTtl(cacheKey)) / 1000
          ),
        });
      }
    }

    const combinedResults = [];

    // Fetch Total Kilat data (GPS Kit) with timeout
    try {
      const totalKilatData = await withTimeout(
        gpsService.fetchLatestVehiclePosition(),
        15000
      );
      const dataTotalKilat = Array.isArray(totalKilatData)
        ? totalKilatData
        : totalKilatData?.data || [];
      const flattened = dataTotalKilat.flat();

      const formattedTotalKilat = flattened.map((item) => ({
        plateNo: item.vehicleName || "",
        deviceName: item.deviceName || "",
        datetime: item.datetime || "",
        mileage: item.mileage || 0,
        heading: item.heading || 0,
        speed: item.speed || 0,
        longitude: item.longitude || 0,
        latitude: item.latitude || 0,
        acc: item.acc || 0,
        event_message: item.event_message || "",
        geoName: item.geoName || "",
        source: "gps_kit",
      }));

      combinedResults.push(...formattedTotalKilat);
    } catch (err) {
      console.error("[ERROR] Fetch Total Kilat:", err.message);
    }

    // Fetch Margono data in parallel with timeout
    const margonoPromises = nomorPlatList.map(async (plateNo) => {
      try {
        const response = await withTimeout(
          gpsService.lastPositionMargono(plateNo),
          8000
        );

        if (response && response.Latitude && response.Longitude) {
          return {
            plateNo: response.Vehnof || plateNo,
            deviceName: "",
            datetime: "",
            mileage: parseFloat(response.Mileage || "0") / 1000,
            heading: 0,
            speed: parseFloat(response.Speed || "0"),
            longitude: parseFloat(response.Longitude || "0"),
            latitude: parseFloat(response.Latitude || "0"),
            acc: response.AccStatus === "ON" ? 1 : 0,
            event_message: "",
            geoName: "",
            source: "margono",
          };
        }
        return null;
      } catch (err) {
        if (err.message !== "Request timeout") {
          console.error(`[MARGONO ERROR] plateNo: ${plateNo}`, err.message);
        }
        return null;
      }
    });

    // Wait for all Margono requests to complete
    const margonoResults = await Promise.all(margonoPromises);

    // Filter out null results and add to combined results
    const validMargonoResults = margonoResults.filter(
      (result) => result !== null
    );
    combinedResults.push(...validMargonoResults);

    // Cache the results
    positionCache.set(cacheKey, combinedResults);

    res.status(200).json({
      success: true,
      status: 200,
      total: combinedResults.length,
      data: combinedResults,
      cached: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch combined last position",
      error: error.message,
    });
  }
};

// ===================== Odometer Summary =====================
exports.getOdometerSummary = async (req, res) => {
  try {
    let { identifier, start_time, end_time } = req.query;

    if (!identifier || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "identifier, start_time, and end_time are required",
      });
    }

    // Allow date-only input (YYYY-MM-DD)
    const isDateOnly = (v) =>
      typeof v === "string" && v.length === 10 && /\d{4}-\d{2}-\d{2}/.test(v);
    if (isDateOnly(start_time)) start_time = `${start_time} 00:00:00`;
    if (isDateOnly(end_time)) end_time = `${end_time} 23:59:59`;

    const isDeviceName = /^\d+$/.test(identifier);
    const isPlateNo = /^[A-Z]\s+\d+\s+[A-Z]+$/.test(
      identifier.replace(/\s+/g, " ")
    );

    let device_name, plateNo;
    if (isDeviceName) {
      device_name = identifier;
      plateNo = null;
    } else if (isPlateNo) {
      plateNo = identifier;
      device_name = null;
    } else {
      device_name = identifier;
      plateNo = identifier;
    }

    let gpsData = [];
    let margonoData = [];

    // TotalKilat
    if (device_name) {
      try {
        const gpsRaw = await gpsService.fetchDeviceHistoryData(
          device_name,
          start_time,
          end_time
        );
        let data = flatten(gpsRaw);
        if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
          data = data.flat();
        }
        gpsData = (Array.isArray(data) ? data : []).map((item) => ({
          datetime: item.datetime || item.time || "",
          odometer_km:
            typeof item.mileage !== "undefined" && item.mileage !== null
              ? Number(item.mileage)
              : typeof item.odometer_km !== "undefined"
              ? Number(item.odometer_km)
              : undefined,
          latitude: item.latitude || 0,
          longitude: item.longitude || 0,
          source: "gps_kit",
          deviceName: device_name,
        }));
      } catch (e) {
        gpsData = [];
      }
    }

    // Margono
    if (plateNo) {
      try {
        const margonoRaw = await gpsService.getHistoryLocation(
          plateNo,
          start_time,
          end_time
        );
        margonoData = Array.isArray(margonoRaw?.Data)
          ? margonoRaw.Data.map((item) => ({
              datetime: item.Time || "",
              odometer_km:
                typeof item.Miles !== "undefined" && item.Miles !== null
                  ? Math.round(Number(item.Miles) / 1000)
                  : undefined,
              latitude: item.Latitude || 0,
              longitude: item.Longitude || 0,
              source: "margono",
              plateNo: plateNo,
            }))
          : [];
      } catch (e) {
        margonoData = [];
      }
    }

    const combined = [...gpsData, ...margonoData]
      .filter((r) => r && r.datetime)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    const withOdo = combined.filter((r) =>
      Number.isFinite(Number(r.odometer_km))
    );

    // Build overall summary
    let overall = null;
    if (withOdo.length > 0) {
      const start = withOdo[0];
      const end = withOdo[withOdo.length - 1];
      overall = {
        start_time: start.datetime,
        start_odometer_km: Number(start.odometer_km),
        end_time: end.datetime,
        end_odometer_km: Number(end.odometer_km),
        distance_km: Math.max(
          0,
          Number(end.odometer_km) - Number(start.odometer_km)
        ),
      };
    }

    // Per-day breakdown
    const perDayMap = {};
    for (const item of withOdo) {
      const d = new Date(item.datetime);
      if (isNaN(d.getTime())) continue;
      const key = d.toISOString().slice(0, 10);
      if (!perDayMap[key]) perDayMap[key] = [];
      perDayMap[key].push(item);
    }

    const per_day = Object.entries(perDayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, arr]) => {
        const first = arr[0];
        const last = arr[arr.length - 1];
        return {
          date,
          start_time: first.datetime,
          start_odometer_km: Number(first.odometer_km),
          end_time: last.datetime,
          end_odometer_km: Number(last.odometer_km),
          distance_km: Math.max(
            0,
            Number(last.odometer_km) - Number(first.odometer_km)
          ),
        };
      });

    const summary = {
      identifier,
      systems_queried: [
        ...(device_name ? ["TotalKilat"] : []),
        ...(plateNo ? ["Margono"] : []),
      ],
      total_points: combined.length,
    };

    return res.status(200).json({
      success: true,
      status: 200,
      overall,
      per_day,
      summary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to compute odometer summary",
      error: error.message,
    });
  }
};

// Menampilkan geofence dengan radius 20 meter
exports.getGeofenceRadius = async (req, res) => {
  try {
    const geofences = await models.gps_geofence.findAll({
      where: { is_active: 1 },
    });

    const geofencesWithPolygon = geofences.map((g) => {
      const center = [parseFloat(g.longitude), parseFloat(g.latitude)];
      const circle = turf.circle(center, 20, { steps: 64, units: "meters" });

      return {
        ...g.dataValues,
        polygon: circle.geometry.coordinates[0],
      };
    });

    res.json(geofencesWithPolygon);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan", error: err.message });
  }
};

// Endpoint to clear position cache
exports.clearPositionCache = async (req, res) => {
  try {
    const { key } = req.query;

    if (key) {
      // Clear specific cache key
      clearCacheByKey(key);
      res.status(200).json({
        success: true,
        status: 200,
        message: `Cache cleared for key: ${key}`,
      });
    } else {
      // Clear all GPS caches
      clearAllGpsCache();
      res.status(200).json({
        success: true,
        status: 200,
        message: "All GPS caches cleared successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to clear position cache",
      error: error.message,
    });
  }
};

// Endpoint to get cache information
exports.getCacheInfo = async (req, res) => {
  try {
    const cacheStats = positionCache.getStats();
    const cacheKeys = positionCache.keys();

    const cacheInfo = {
      stats: cacheStats,
      keys: cacheKeys,
      key_details: cacheKeys.map((key) => ({
        key,
        ttl: positionCache.getTtl(key),
        age_seconds: Math.round(
          (Date.now() - positionCache.getTtl(key)) / 1000
        ),
        has_data: !!positionCache.get(key),
      })),
    };

    res.status(200).json({
      success: true,
      status: 200,
      data: cacheInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to get cache information",
      error: error.message,
    });
  }
};

exports.getGpsEventLogs = async (req, res) => {
  const {
    page = 1,
    limit = 50,
    start_date,
    end_date,
    search,
    status,
  } = req.query;

  try {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Validate limit to prevent excessive queries
    if (limitNum > 1000) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Limit cannot exceed 1000 records per page",
      });
    }

    const offset = (pageNum - 1) * limitNum;

    // Debug logging
    console.log("Filter params:", { start_date, end_date, search, status });

    // Check total records without filter first
    const totalRecordsWithoutFilter = await models.gps_event_logs.count();
    console.log("Total records without filter:", totalRecordsWithoutFilter);

    // Build where conditions using Sequelize
    let whereConditions = {};

    // Date filtering
    // Interpret YYYY-MM-DD as full-day in UTC (no fixed +07:00 offset)
    const isDateOnly = (v) =>
      typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
    const buildDateUTC = (dateStr, timeStr) =>
      new Date(`${dateStr}T${timeStr}Z`);
    const normalizeInput = (value, isStart) => {
      if (!value) return null;
      if (isDateOnly(value)) {
        return isStart
          ? buildDateUTC(value, "00:00:00.000")
          : buildDateUTC(value, "23:59:59.999");
      }
      // If full datetime given, assume it's already an ISO/UTC or local instant as provided
      return new Date(value);
    };
    const startInstant = normalizeInput(start_date, true);
    const endInstant = normalizeInput(end_date, false);
    if (startInstant && endInstant) {
      whereConditions.from_time = { [Op.between]: [startInstant, endInstant] };
    } else if (startInstant) {
      whereConditions.from_time = { [Op.gte]: startInstant };
    } else if (endInstant) {
      whereConditions.from_time = { [Op.lte]: endInstant };
    }

    // Search filtering
    if (search && search.trim()) {
      whereConditions[Op.or] = [
        { plat_nomor: { [Op.like]: `%${search.trim()}%` } },
        { device_name: { [Op.like]: `%${search.trim()}%` } },
        { driver_name: { [Op.like]: `%${search.trim()}%` } },
        { event_type: { [Op.like]: `%${search.trim()}%` } },
        { geo_name: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    // Status filtering
    if (
      status !== undefined &&
      status !== null &&
      String(status).trim() !== ""
    ) {
      const statusNum = parseInt(status);
      if (!isNaN(statusNum)) {
        whereConditions.status = statusNum;
      }
    }

    console.log("Where conditions:", JSON.stringify(whereConditions, null, 2));

    // Build WHERE clause for raw SQL
    const buildWhereSQL = () => {
      const conditions = [];
      const params = [];

      // Date filtering
      if (startInstant && endInstant) {
        conditions.push('gel.from_time BETWEEN ? AND ?');
        params.push(startInstant, endInstant);
      } else if (startInstant) {
        conditions.push('gel.from_time >= ?');
        params.push(startInstant);
      } else if (endInstant) {
        conditions.push('gel.from_time <= ?');
        params.push(endInstant);
      }

      // Search filtering
      if (search && search.trim()) {
        conditions.push('(gel.plat_nomor LIKE ? OR gel.device_name LIKE ? OR gel.driver_name LIKE ? OR gel.event_type LIKE ? OR gel.geo_name LIKE ?)');
        const searchPattern = `%${search.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
      }

      // Status filtering
      if (status !== undefined && status !== null && String(status).trim() !== '') {
        const statusNum = parseInt(status);
        if (!isNaN(statusNum)) {
          conditions.push('gel.status = ?');
          params.push(statusNum);
        }
      }

      // Filter jenis_kepemilikan
      conditions.push("k.jenis_kepemilikan IN ('eureka', 'eur_sewa', 'eur_oncall')");

      return { conditions, params };
    };

    const { conditions, params } = buildWhereSQL();
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count with raw SQL
    const countQuery = `
      SELECT COUNT(*) as total
      FROM gps_event_logs gel
      INNER JOIN kendaraan k ON gel.vehicle_id = k.id
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, params);
    const totalRecords = countResult[0]?.total || 0;

    console.log("Total records found:", totalRecords);

    // Get paginated data with raw SQL
    const dataQuery = `
      SELECT 
        gel.*,
        k.jenis_kepemilikan
      FROM gps_event_logs gel
      INNER JOIN kendaraan k ON gel.vehicle_id = k.id
      ${whereClause}
      ORDER BY gel.from_time DESC
      LIMIT ? OFFSET ?
    `;
    const rows = await db.query(dataQuery, [...params, limitNum, offset]);

    // Use `address` column from DB instead of reverse geocoding

    // Proses data: tambahkan field alamat, jenis_kepemilikan, tampilkan waktu apa adanya dari database
    const processedRows = await Promise.all(
      rows.map(async (item) => {
        // Use address stored in DB (column `address`) as `alamat`
        const alamat =
          item.address || item.alamat ? item.address || item.alamat : null;

        // jenis_kepemilikan already included from JOIN query
        const jenis_kepemilikan = item.jenis_kepemilikan || null;

        // Format waktu agar tampil seperti di database: 'YYYY-MM-DD HH:mm:ss'
        const formatDbTime = (val) => {
          if (!val) return val;
          // If it's already a plain string in the expected format, return it
          if (
            typeof val === "string" &&
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val)
          )
            return val;
          // Use moment to format in +07:00 to match stored DB local time
          try {
            const m = moment(val);
            if (!m.isValid()) return val;
            return m.utcOffset("+07:00").format("YYYY-MM-DD HH:mm:ss");
          } catch (e) {
            return val;
          }
        };

        const obj = { ...item };
        // Remove duplicate `address` column from DB so response only has `alamat`
        if (Object.prototype.hasOwnProperty.call(obj, "address"))
          delete obj.address;
        obj.alamat = alamat;
        obj.jenis_kepemilikan = jenis_kepemilikan;
        obj.from_time = formatDbTime(item.from_time);
        obj.to_time = formatDbTime(item.to_time);
        obj.created_at = formatDbTime(item.created_at);
        return obj;
      })
    );

    const totalPages = Math.ceil(totalRecords / limitNum);

    if (!processedRows || processedRows.length === 0) {
      return res.status(200).json({
        success: true,
        status: 200,
        message:
          start_date || end_date || search || status !== undefined
            ? `Data kosong dengan filter yang ditentukan`
            : "Tidak ada data GPS event logs",
        pagination: {
          current_page: pageNum,
          total_pages: totalPages,
          total_records: totalRecords,
          limit: limitNum,
          has_next: pageNum < totalPages,
          has_prev: pageNum > 1,
        },
        filters: {
          start_date: start_date || null,
          end_date: end_date || null,
          search: search || null,
          status:
            status !== undefined &&
            status !== null &&
            String(status).trim() !== ""
              ? parseInt(status)
              : null,
        },
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      pagination: {
        current_page: pageNum,
        total_pages: totalPages,
        total_records: totalRecords,
        limit: limitNum,
        has_next: pageNum < totalPages,
        has_prev: pageNum > 1,
      },
      filters: {
        start_date: start_date || null,
        end_date: end_date || null,
        search: search || null,
        status:
          status !== undefined &&
          status !== null &&
          String(status).trim() !== ""
            ? parseInt(status)
            : null,
      },
      data: processedRows,
    });
  } catch (error) {
    console.error("[ERROR] getGpsEventLogs:", error);

    // Handle specific database errors
    if (error.code === "ETIMEDOUT") {
      return res.status(408).json({
        success: false,
        status: 408,
        message:
          "Database connection timeout. Please try again with a smaller limit.",
        error: "Database timeout",
      });
    }

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        status: 503,
        message: "Database connection refused. Please try again later.",
        error: "Database unavailable",
      });
    }

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Database access denied",
        error: "Database access error",
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch GPS event logs",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Update status for a specific GPS event log
exports.updateGpsEventLogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Parameter id wajib diisi",
      });
    }

    if (status === undefined || status === null || isNaN(parseInt(status))) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Field status wajib berupa integer",
      });
    }

    const record = await models.gps_event_logs.findByPk(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "GPS event log tidak ditemukan",
      });
    }

    record.status = parseInt(status);
    if (note !== undefined) {
      record.note = note;
    }
    await record.save();

    // Optional: invalidate related caches
    invalidateCacheOnDataUpdate("gps_event_logs_status_update");

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Status berhasil diperbarui",
      data: record,
    });
  } catch (error) {
    console.error("[ERROR] updateGpsEventLogStatus:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Gagal memperbarui status GPS event log",
    });
  }
};

exports.getOverspeedData = async (req, res) => {
  const { start_time, end_time } = req.query;

  if (!start_time || !end_time) {
    return res.status(400).json({
      success: false,

      status: 400,

      message: "start_time and end_time are required",
    });
  }

  try {
    const rows = await db.query(
      `SELECT * FROM gps_overspeed 

       WHERE datetime BETWEEN ? AND ?

       ORDER BY datetime ASC`,

      [start_time, end_time]
    );

    console.log("DEBUG typeof rows:", typeof rows);

    console.log("DEBUG rows:", rows);

    console.log("DEBUG Array.isArray(rows):", Array.isArray(rows));

    return res.status(200).json({
      success: true,

      status: 200,

      total: rows.length,

      data: rows,
    });
  } catch (error) {
    console.error("[ERROR] getOverspeedData:", error);

    return res.status(500).json({
      success: false,

      status: 500,

      message: "Failed to fetch overspeed data",

      error: error.message,
    });
  }
};

exports.getOverHourVehicles = async (req, res) => {
  const { start_time, end_time } = req.query;

  if (!start_time || !end_time) {
    return res.status(400).json({
      success: false,

      status: 400,

      message: "start_time and end_time are required",
    });
  }

  try {
    const rows = await db.query(
      `SELECT id, device_name, geo_name, latitude, longitude, from_time, to_time, duration_hours, notified, created_at 

       FROM stationary_logs 

       WHERE duration_hours >= 3 

         AND to_time BETWEEN ? AND ?

       ORDER BY to_time DESC`,

      [start_time, end_time]
    );

    return res.status(200).json({
      success: true,

      status: 200,

      total: rows.length,

      data: rows,
    });
  } catch (error) {
    console.error("[ERROR] getOverHourVehicles:", error);

    return res.status(500).json({
      success: false,

      status: 500,

      message: "Failed to fetch over hour vehicles",

      error: error.message,
    });
  }
};

// ===================== Kafka Endpoint Functions =====================

/**
 * Get GPS history for Kafka - returns same data as getCombinedHistory but optimized for Kafka
 * This endpoint is designed to be called by Kafka consumers or cron jobs
 */
exports.getGpsHistoryForKafka = async (req, res) => {
  const {
    identifier,
    start_time,
    end_time,
    process_events = "true",
  } = req.query;

  if (!identifier || !start_time || !end_time) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "identifier, start_time, and end_time are required",
    });
  }

  try {
    // Use the existing getCombinedHistory logic but return data optimized for Kafka
    const result = await this.getCombinedHistoryLogic(
      identifier,
      start_time,
      end_time,
      process_events
    );

    // Return the same response format as getCombinedHistory
    return res.status(200).json({
      success: true,
      status: 200,
      total: result.length,
      data: result,
      kafka_optimized: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[ERROR] getGpsHistoryForKafka:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch GPS history for Kafka",
      error: error.message,
      identifier: identifier,
    });
  }
};

/**
 * Extract the core logic from getCombinedHistory for reuse
 */
exports.getCombinedHistoryLogic = async (
  identifier,
  start_time,
  end_time,
  process_events = "true"
) => {
  // Determine if identifier is a device_name (TotalKilat) or plateNo (Margono)
  const isDeviceName = /^\d+$/.test(identifier);
  const isPlateNo = /^[A-Z]\s+\d+\s+[A-Z]+$/.test(
    identifier.replace(/\s+/g, " ")
  );

  console.log(`[KAFKA DEBUG] Identifier: "${identifier}"`);
  console.log(
    `[KAFKA DEBUG] isDeviceName: ${isDeviceName}, isPlateNo: ${isPlateNo}`
  );

  let device_name, plateNo;

  if (isDeviceName) {
    device_name = identifier;
    plateNo = null;
    console.log(
      `[KAFKA INFO] Identifier "${identifier}" detected as TotalKilat device name`
    );
  } else if (isPlateNo) {
    plateNo = identifier;
    device_name = null;
    console.log(
      `[KAFKA INFO] Identifier "${identifier}" detected as Margono plate number`
    );
  } else {
    device_name = identifier;
    plateNo = identifier;
    console.log(
      `[KAFKA INFO] Identifier "${identifier}" will be tried on both systems`
    );
  }

  let gpsData = [];
  let margonoData = [];

  // Fetch TotalKilat data only if device_name is provided
  if (device_name) {
    try {
      console.log(
        `[KAFKA DEBUG] Fetching TotalKilat data for device: ${device_name}`
      );
      const gpsRaw = await gpsService.fetchDeviceHistoryData(
        device_name,
        start_time,
        end_time
      );
      const gpsFlattened = flatten(gpsRaw);

      gpsData = Array.isArray(gpsFlattened) ? gpsFlattened : [];

      if (gpsData.length > 0 && Array.isArray(gpsData[0])) {
        gpsData = gpsData.flat();
      }

      gpsData = gpsData.map((item) => ({
        ...item,
        source: "gps_kit",
        deviceName: device_name,
        odometer_km:
          typeof item.mileage !== "undefined" && item.mileage !== null
            ? Number(item.mileage)
            : typeof item.odometer_km !== "undefined"
            ? Number(item.odometer_km)
            : undefined,
      }));

      console.log(`[KAFKA DEBUG] Processed GPS data count:`, gpsData.length);
    } catch (gpsError) {
      console.warn(
        `[KAFKA GPS ERROR] Failed to fetch TotalKilat data for device ${device_name}:`,
        gpsError.message
      );
      gpsData = [];
    }
  }

  // Fetch Margono data only if plateNo is provided
  if (plateNo) {
    try {
      const margonoRaw = await gpsService.getHistoryLocation(
        plateNo,
        start_time,
        end_time
      );
      margonoData = Array.isArray(margonoRaw?.Data)
        ? margonoRaw.Data.map((item) => ({
            datetime: item.Time || "",
            mileage: Math.round((item.Miles || 0) / 1000),
            heading: item.Angle || 0,
            speed: item.Velocity || 0,
            longitude: item.Longitude || 0,
            latitude: item.Latitude || 0,
            acc: item.Locate ? 1 : 0,
            event_message: item.Alarm?.toString() || "",
            fuel1_volume: item.Oil || 0,
            fuel2_volume: item.LevelNum || 0,
            temperature: item.Temperature || 0,
            geoName: "",
            source: "margono",
            odometer_km:
              typeof item.Miles !== "undefined" && item.Miles !== null
                ? Math.round(Number(item.Miles) / 1000)
                : undefined,
          }))
        : [];
    } catch (margonoError) {
      console.warn(
        `[KAFKA MARGONO ERROR] Failed to fetch Margono data for plate ${plateNo}:`,
        margonoError.message
      );
      margonoData = [];
    }
  }

  const combined = [...gpsData, ...margonoData];
  combined.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  // Detect overhour (kendaraan berhenti > 3 jam) and overspeed events
  const longStops = detectLongStops(combined).filter(
    (stop) => parseFloat(stop.duration_hours) >= 3
  );
  const overspeedItems = combined.filter((item) => item.speed > 60);

  // Process events asynchronously if enabled
  if (process_events === "true") {
    const processEventsAsync = async () => {
      try {
        // Process overhour events in batch
        const overhourResults = await processGpsEventsBatch(
          longStops,
          device_name || plateNo,
          "overhour"
        );

        // Process overspeed events in batch
        const overspeedResults = await processGpsEventsBatch(
          overspeedItems,
          device_name || plateNo,
          "overspeed"
        );

        console.log(
          `[KAFKA ASYNC] Events processing completed - Overhour: ${overhourResults.success}/${overhourResults.total}, Overspeed: ${overspeedResults.success}/${overspeedResults.total}`
        );
      } catch (error) {
        console.error(
          "[KAFKA ASYNC ERROR] Events processing failed:",
          error.message
        );
      }
    };

    // Start processing events in background (don't await)
    processEventsAsync();
  }

  return combined;
};

/**
 * Cron job function that runs every 1 hour to collect GPS history for Kafka
 * This function will be called by a scheduler
 */
exports.kafkaCronJob = async () => {
  console.log(
    `[KAFKA CRON] Starting hourly GPS collection at ${new Date().toISOString()}`
  );

  try {
    // Get all active vehicles with GPS
    const vehicles = await getAllActiveVehiclesForKafka();

    if (vehicles.length === 0) {
      console.log("[KAFKA CRON] No active vehicles with GPS found");
      return;
    }

    // Calculate time range (last 1 hour)
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 60 * 60 * 1000); // 1 hour ago

    const startTimeStr = startTime.toISOString().slice(0, 19).replace("T", " ");
    const endTimeStr = endTime.toISOString().slice(0, 19).replace("T", " ");

    console.log(
      `[KAFKA CRON] Processing data from ${startTimeStr} to ${endTimeStr}`
    );

    // Process vehicles in batches
    const batchSize = 3; // Smaller batch size for hourly processing
    const results = [];

    for (let i = 0; i < vehicles.length; i += batchSize) {
      const batch = vehicles.slice(i, i + batchSize);
      console.log(
        `[KAFKA CRON] Processing batch ${Math.floor(i / batchSize) + 1} (${
          batch.length
        } vehicles)`
      );

      const batchPromises = batch.map(async (vehicle) => {
        try {
          const result = await this.getCombinedHistoryLogic(
            vehicle.identifier,
            startTimeStr,
            endTimeStr,
            "true"
          );

          return {
            identifier: vehicle.identifier,
            source: vehicle.source,
            totalRecords: result.length,
            success: true,
          };
        } catch (error) {
          console.error(
            `[KAFKA CRON ERROR] Failed to process vehicle ${vehicle.identifier}:`,
            error.message
          );
          return {
            identifier: vehicle.identifier,
            source: vehicle.source,
            totalRecords: 0,
            success: false,
            error: error.message,
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(
        ...batchResults.map((r) =>
          r.status === "fulfilled"
            ? r.value
            : {
                success: false,
                error: r.reason?.message || "Unknown error",
              }
        )
      );

      // Wait between batches to avoid overwhelming the system
      if (i + batchSize < vehicles.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Log summary
    const totalRecords = results.reduce(
      (sum, r) => sum + (r.totalRecords || 0),
      0
    );
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log("=".repeat(60));
    console.log(`[KAFKA CRON SUMMARY] Hourly GPS Collection Completed`);
    console.log(`Time Range: ${startTimeStr} to ${endTimeStr}`);
    console.log(`Vehicles Processed: ${vehicles.length}`);
    console.log(`Total GPS Records: ${totalRecords}`);
    console.log(`Successful: ${successful}, Failed: ${failed}`);
    console.log("=".repeat(60));
  } catch (error) {
    console.error(
      "[KAFKA CRON ERROR] Hourly GPS collection failed:",
      error.message
    );
  }
};

/**
 * Get all active vehicles for Kafka processing
 */
async function getAllActiveVehiclesForKafka() {
  try {
    const nomorPlatList = [
      "B 9586 TEU",
      "B 9107 BEV",
      "B 9642 BEU",
      "B 9689 BEU",
      "B 9114 BEV",
      "B 9008 BEV",
      "B 9103 BEV",
      "B 9961 BEU",
      "B 9959 BEU",
      "N 9038 UF",
      "N 9047 UF",
      "B 9581 TEU",
      "B 9956 BEU",
      "B 9322 BEV",
      "B 9288 BXU",
      "B 9110 BEV",
      "B 9002 BEV",
      "B 9645 BEU",
      "B 9997 BEU",
      "B 9105 BEV",
      "B 9007 BEV",
      "B 9984 BEU",
      "B 9112 BEV",
      "B 9587 BEU",
      "B 9408 BEV",
      "B 9409 BEV",
      "B 9410 BEV",
      "B 9411 BEV",
      "B 9412 BEV",
      "B 9506 BEV",
      "B 9507 BEV",
      "B 9508 BEV",
      "B 9509 BEV",
      "B 9510 BEV",
      "B 9010 BEV",
      "B 9814 BRV",
      "B 9011 BEV",
      "B 9006 BEV",
      "N 9382 UF",
      "N 9379 UF",
      "N 9050 UG",
      "B 9989 BEU",
      "B 9644 BEU",
    ];

    // Get vehicles with GPS device IDs (TotalKilat system)
    const gpsKitVehicles = await models.kendaraan.findAll({
      where: {
        status: "1",
        gps_device_id: {
          [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }],
        },
      },
      attributes: ["id", "gps_device_id", "no_polisi", "gps_type"],
      raw: true,
    });

    // Get vehicles with plate numbers that match Margono system
    const margonoVehicles = await models.kendaraan.findAll({
      where: {
        status: "1",
        no_polisi: {
          [Op.in]: nomorPlatList,
        },
      },
      attributes: ["id", "no_polisi", "gps_type"],
      raw: true,
    });

    // Format vehicles for processing
    const vehicles = [];

    // Add TotalKilat vehicles
    gpsKitVehicles.forEach((vehicle) => {
      vehicles.push({
        id: vehicle.id,
        identifier: vehicle.gps_device_id,
        plateNo: vehicle.no_polisi,
        type: "gps_kit",
        source: "TotalKilat",
      });
    });

    // Add Margono vehicles (only if not already added from TotalKilat)
    margonoVehicles.forEach((vehicle) => {
      const exists = vehicles.find((v) => v.plateNo === vehicle.no_polisi);
      if (!exists) {
        vehicles.push({
          id: vehicle.id,
          identifier: vehicle.no_polisi,
          plateNo: vehicle.no_polisi,
          type: "margono",
          source: "Margono",
        });
      }
    });

    console.log(
      `[KAFKA CRON] Found ${vehicles.length} active vehicles with GPS (${gpsKitVehicles.length} TotalKilat, ${margonoVehicles.length} Margono)`
    );
    return vehicles;
  } catch (error) {
    console.error(
      "[KAFKA CRON ERROR] Failed to fetch vehicles:",
      error.message
    );
    return [];
  }
}
