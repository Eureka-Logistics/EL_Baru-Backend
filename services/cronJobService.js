const cron = require('node-cron');
const core = require('../config/core.config');
const gpsService = require('./gpsApiServices');
const { detectLongStops } = require('./detectStops');
const db = require('../config/db.config');
const models = core.models();
const moment = require('moment');
const { Op } = require('sequelize');

/**
 * Service for managing GPS data collection cron jobs
 */
class CronJobService {
  constructor() {
    this.isRunning = false;
    this.lastRunDate = null;
    this.testingMode = false; // Set this to true for testing every 2 minutes
    this.nomorPlatList = [
      "B 9586 TEU", "B 9107 BEV", "B 9642 BEU", "B 9689 BEU", "B 9114 BEV",
      "B 9008 BEV", "B 9103 BEV", "B 9961 BEU", "B 9959 BEU", "N 9038 UF",
      "N 9047 UF", "B 9581 TEU", "B 9956 BEU", "B 9322 BEV", "B 9288 BXU",
      "B 9110 BEV", "B 9002 BEV", "B 9645 BEU", "B 9997 BEU", "B 9105 BEV",
      "B 9007 BEV", "B 9984 BEU", "B 9112 BEV", "B 9587 BEU", "B 9408 BEV",
      "B 9409 BEV", "B 9410 BEV", "B 9411 BEV", "B 9412 BEV", "B 9506 BEV",
      "B 9507 BEV", "B 9508 BEV", "B 9509 BEV", "B 9510 BEV", "B 9010 BEV",
      "B 9814 BRV", "B 9011 BEV", "B 9006 BEV", "N 9382 UF", "N 9379 UF",
      "N 9050 UG", "B 9989 BEU", "B 9644 BEU"
    ];
  }

  /**
   * Get all active vehicles that have GPS tracking
   * @returns {Array} Array of vehicles with GPS data
   */
  async getAllActiveVehiclesWithGPS() {
    try {
      console.log('[CRON] Fetching active vehicles with GPS...');
      
      // Get vehicles with GPS device IDs (TotalKilat system)
      const gpsKitVehicles = await models.kendaraan.findAll({
        where: {
          status: '1', // Active vehicles
          gps_device_id: {
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.ne]: '' }
            ]
          }
        },
        attributes: ['id', 'gps_device_id', 'no_polisi', 'gps_type'],
        raw: true
      });

      // Get vehicles with plate numbers that match Margono system
      const margonoVehicles = await models.kendaraan.findAll({
        where: {
          status: '1', // Active vehicles
          no_polisi: {
            [Op.in]: this.nomorPlatList
          }
        },
        attributes: ['id', 'no_polisi', 'gps_type'],
        raw: true
      });

      // Format vehicles for processing
      const vehicles = [];
      
      // Add TotalKilat vehicles
      gpsKitVehicles.forEach(vehicle => {
        vehicles.push({
          id: vehicle.id,
          identifier: vehicle.gps_device_id,
          plateNo: vehicle.no_polisi,
          type: 'gps_kit',
          source: 'TotalKilat'
        });
      });

      // Add Margono vehicles (only if not already added from TotalKilat)
      margonoVehicles.forEach(vehicle => {
        const exists = vehicles.find(v => v.plateNo === vehicle.no_polisi);
        if (!exists) {
          vehicles.push({
            id: vehicle.id,
            identifier: vehicle.no_polisi,
            plateNo: vehicle.no_polisi,
            type: 'margono',
            source: 'Margono'
          });
        }
      });

      console.log(`[CRON] Found ${vehicles.length} active vehicles with GPS (${gpsKitVehicles.length} TotalKilat, ${margonoVehicles.length} Margono)`);
      return vehicles;
    } catch (error) {
      console.error('[CRON ERROR] Failed to fetch vehicles:', error.message);
      return [];
    }
  }

  /**
   * Flatten GPS data response
   */
  flatten(data) {
    if (Array.isArray(data) && data.length === 1 && Array.isArray(data[0])) {
      return data[0];
    }
    return data;
  }

  /**
   * Get vehicle ID for database operations
   */
  async getVehicleId({ source, deviceName, plateNo }) {
    if (source === 'gps_kit' && deviceName) {
      const kendaraan = await models.kendaraan.findOne({
        where: { gps_device_id: deviceName }
      });
      return kendaraan?.id || null;
    }

    if (source === 'margono' && plateNo) {
      const kendaraan = await models.kendaraan.findOne({
        where: { no_polisi: plateNo }
      });
      return kendaraan?.id || null;
    }

    return null;
  }

  /**
   * Get plate number from device name
   */
  async getPlatNomorFromDevice(deviceName) {
    if (!deviceName) return '';
    const kendaraan = await models.kendaraan.findOne({
      where: { gps_device_id: deviceName },
      attributes: ['no_polisi']
    });
    return kendaraan?.no_polisi || '';
  }

  /**
   * Get driver information from vehicle_id
   * @param {number} vehicleId - Vehicle ID
   * @returns {Promise<Object>} - Driver information {id, name}
   */
  async getDriverInfoFromVehicle(vehicleId) {
    try {
      if (!vehicleId) return { id: null, name: null };

      const kendaraan = await models.kendaraan.findOne({
        where: { id: vehicleId },
        include: [{
          model: models.m_driver,
          as: 'id_driver_m_driver',
          attributes: ['id', 'nama']
        }],
        attributes: ['id_driver']
      });

      if (kendaraan && kendaraan.id_driver_m_driver) {
        return {
          id: kendaraan.id_driver_m_driver.id,
          name: kendaraan.id_driver_m_driver.nama
        };
      }

      return { id: null, name: null };
    } catch (error) {
      console.error('[CRON ERROR] Failed to get driver info:', error.message);
      return { id: null, name: null };
    }
  }

  /**
   * Process GPS events in batch
   */
  async processGpsEventsBatch(items, plateNo, eventType) {
    const results = {
      total: items.length,
      success: 0,
      failed: 0
    };

    if (items.length === 0) {
      return results;
    }

    try {
      const bulkData = [];
      
      for (const item of items) {
        try {
          const vehicleId = await this.getVehicleId({
            source: item.source,
            deviceName: item.deviceName,
            plateNo: item.source === 'margono' ? plateNo : null
          });

          if (!vehicleId) {
            console.warn(`[CRON SKIP] Tidak ditemukan vehicle_id untuk ${item.source === 'gps_kit' ? item.deviceName : (plateNo || 'N/A')}`);
            results.failed++;
            continue;
          }

          // Get driver information
          const driverInfo = await this.getDriverInfoFromVehicle(vehicleId);

          const platNomor = item.source === 'gps_kit'
            ? await this.getPlatNomorFromDevice(item.deviceName)
            : (plateNo || '');

          if (eventType === 'overhour') {
            bulkData.push([
              vehicleId,
              item.deviceName || '',
              platNomor,
              item.geoName || '',
              item.latitude || 0,
              item.longitude || 0,
              'overhour',
              item.from,
              item.to,
              parseFloat(item.duration_hours),
              0,
              0,
              driverInfo.id,
              driverInfo.name
            ]);
          } else if (eventType === 'overspeed') {
            bulkData.push([
              vehicleId,
              item.deviceName || '',
              platNomor,
              item.geoName || '',
              item.latitude || 0,
              item.longitude || 0,
              'overspeed',
              item.datetime,
              item.datetime,
              0,
              item.speed,
              60,
              driverInfo.id,
              driverInfo.name
            ]);
          }
          
          results.success++;
        } catch (error) {
          results.failed++;
          console.error(`[CRON ERROR] Failed to prepare ${eventType} event:`, error.message);
        }
      }

      // Perform bulk insert if we have data
      if (bulkData.length > 0) {
        const placeholders = bulkData.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
        const values = bulkData.flat();
        
        await db.query(`
          INSERT IGNORE INTO gps_event_logs (
            vehicle_id, device_name, plat_nomor, geo_name, latitude, longitude,
            event_type, from_time, to_time, duration_hours,
            speed, speed_limit, driver_id, driver_name
          ) VALUES ${placeholders}
        `, values);
        
        console.log(`[CRON BULK] Successfully inserted ${bulkData.length} ${eventType} events`);
      }

    } catch (error) {
      console.error(`[CRON BULK ERROR] Failed to insert ${eventType} events:`, error.message);
      results.failed = results.total;
      results.success = 0;
    }

    return results;
  }

  /**
   * Process single vehicle GPS history
   */
  async processSingleVehicle(vehicle, startTime, endTime) {
    const { identifier, type, plateNo, source } = vehicle;
    
    console.log(`[CRON] Processing ${source} vehicle: ${identifier}`);
    
    try {
      let gpsData = [];
      let margonoData = [];

      // Fetch data based on vehicle type
      if (type === 'gps_kit') {
        try {
          const gpsRaw = await gpsService.fetchDeviceHistoryData(identifier, startTime, endTime);
          const gpsFlattened = this.flatten(gpsRaw);

          gpsData = Array.isArray(gpsFlattened)
            ? gpsFlattened.map(item => ({
                datetime: item.datetime || item.time || item.date || '',
                mileage: item.mileage || 0,
                heading: item.heading || 0,
                speed: item.speed || 0,
                longitude: item.longitude || 0,
                latitude: item.latitude || 0,
                acc: item.acc ? 1 : 0,
                event_message: item.event_message || '',
                fuel1_volume: item.fuel1_volume || 0,
                fuel2_volume: item.fuel2_volume || 0,
                temperature: item.temperature || 0,
                geoName: item.geoName || '',
                source: 'gps_kit',
                deviceName: identifier
              }))
            : [];
        } catch (gpsError) {
          console.warn(`[CRON GPS ERROR] Failed to fetch TotalKilat data for device ${identifier}:`, gpsError.message);
          gpsData = [];
        }
      } else if (type === 'margono') {
        try {
          const margonoRaw = await gpsService.getHistoryLocation(identifier, startTime, endTime);
          margonoData = Array.isArray(margonoRaw?.Data)
            ? margonoRaw.Data.map(item => ({
                datetime: item.Time || '',
                mileage: Math.round((item.Miles || 0) / 1000),
                heading: item.Angle || 0,
                speed: item.Velocity || 0,
                longitude: item.Longitude || 0,
                latitude: item.Latitude || 0,
                acc: item.Locate ? 1 : 0,
                event_message: item.Alarm?.toString() || '',
                fuel1_volume: item.Oil || 0,
                fuel2_volume: item.LevelNum || 0,
                temperature: item.Temperature || 0,
                geoName: '',
                source: 'margono'
              }))
            : [];
        } catch (margonoError) {
          console.warn(`[CRON MARGONO ERROR] Failed to fetch Margono data for plate ${identifier}:`, margonoError.message);
          margonoData = [];
        }
      }

      // Combine and process data
      const combined = [...gpsData, ...margonoData].filter(item => item.datetime);
      combined.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

      // Detect events
      const longStops = detectLongStops(combined).filter(stop => parseFloat(stop.duration_hours) >= 3);
      const overspeedItems = combined.filter(item => item.speed > 60);

      // Process events
      const overhourResults = await this.processGpsEventsBatch(longStops, plateNo, 'overhour');
      const overspeedResults = await this.processGpsEventsBatch(overspeedItems, plateNo, 'overspeed');

      const summary = {
        identifier,
        source,
        totalRecords: combined.length,
        overhour: overhourResults,
        overspeed: overspeedResults
      };

      console.log(`[CRON] Completed ${identifier}: ${combined.length} records, ${overhourResults.success} overhour, ${overspeedResults.success} overspeed events`);
      return summary;

    } catch (error) {
      console.error(`[CRON ERROR] Failed to process vehicle ${identifier}:`, error.message);
      return {
        identifier,
        source,
        error: error.message,
        totalRecords: 0,
        overhour: { total: 0, success: 0, failed: 0 },
        overspeed: { total: 0, success: 0, failed: 0 }
      };
    }
  }

  /**
   * Run daily GPS data collection for all vehicles
   */
  async runDailyGpsCollection() {
    if (this.isRunning) {
      console.log('[CRON] GPS collection is already running, skipping...');
      return;
    }

    this.isRunning = true;
    const startTime = new Date();
    console.log(`[CRON] Starting daily GPS collection at ${startTime.toISOString()}`);

    try {
      // For testing: use today's data, for production: use yesterday's data
      const isProduction = process.env.NODE_ENV === 'production';
      const useTestingMode = this.testingMode || !isProduction;
      const targetDate = useTestingMode ? moment() : moment().subtract(1, 'day');
      const startDateTime = targetDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
      const endDateTime = targetDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

      const dateLabel = useTestingMode ? 'today (TESTING)' : 'yesterday';
      console.log(`[CRON] Processing data for ${dateLabel}: ${startDateTime} to ${endDateTime}`);

      // Get all active vehicles
      const vehicles = await this.getAllActiveVehiclesWithGPS();
      
      if (vehicles.length === 0) {
        console.log('[CRON] No active vehicles with GPS found');
        return;
      }

      // Process vehicles in batches to avoid overwhelming the system
      const batchSize = 5;
      const results = [];
      
      for (let i = 0; i < vehicles.length; i += batchSize) {
        const batch = vehicles.slice(i, i + batchSize);
        console.log(`[CRON] Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} vehicles)`);
        
        const batchPromises = batch.map(vehicle => 
          this.processSingleVehicle(vehicle, startDateTime, endDateTime)
        );
        
        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults.map(r => r.status === 'fulfilled' ? r.value : { error: r.reason }));
        
        // Wait a bit between batches to avoid overwhelming the GPS APIs
        if (i + batchSize < vehicles.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Log summary
      const totalRecords = results.reduce((sum, r) => sum + (r.totalRecords || 0), 0);
      const totalOverhour = results.reduce((sum, r) => sum + (r.overhour?.success || 0), 0);
      const totalOverspeed = results.reduce((sum, r) => sum + (r.overspeed?.success || 0), 0);
      const errors = results.filter(r => r.error).length;

      const endTime = new Date();
      const duration = Math.round((endTime - startTime) / 1000);

      console.log('='.repeat(80));
      console.log(`[CRON SUMMARY] Daily GPS Collection Completed`);
      console.log(`Duration: ${duration} seconds`);
      console.log(`Date Range: ${startDateTime} to ${endDateTime}`);
      console.log(`Vehicles Processed: ${vehicles.length}`);
      console.log(`Total GPS Records: ${totalRecords}`);
      console.log(`Overhour Events Saved: ${totalOverhour}`);
      console.log(`Overspeed Events Saved: ${totalOverspeed}`);
      console.log(`Errors: ${errors}`);
      console.log('='.repeat(80));

      this.lastRunDate = new Date();

    } catch (error) {
      console.error('[CRON ERROR] Daily GPS collection failed:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Start the cron job scheduler
   */
  startScheduler() {
    console.log('[CRON] Starting GPS data collection scheduler...');
    
    // FOR TESTING: Run every 2 minutes
    // PRODUCTION: Use '0 2 * * *' for daily at 2:00 AM
    const isProduction = process.env.NODE_ENV === 'production';
    const useTestingMode = this.testingMode || !isProduction;
    const cronExpression = useTestingMode ? '*/2 * * * *' : '0 2 * * *';
    const scheduleDescription = useTestingMode 
      ? 'every 2 minutes (TESTING MODE)' 
      : 'daily at 2:00 AM Jakarta time';
    
    const task = cron.schedule(cronExpression, () => {
      console.log(`[CRON] Triggered GPS collection - ${new Date().toISOString()}`);
      this.runDailyGpsCollection();
    }, {
      timezone: 'Asia/Jakarta'
    });

    console.log(`[CRON] Scheduler started - will run ${scheduleDescription}`);
    return task;
  }

  /**
   * Manual trigger for testing
   */
  async manualTrigger() {
    console.log('[CRON] Manual trigger initiated');
    await this.runDailyGpsCollection();
  }

  /**
   * Get cron job status
   */
  getStatus() {
    const isProduction = process.env.NODE_ENV === 'production';
    const useTestingMode = this.testingMode || !isProduction;
    const nextRun = useTestingMode 
      ? 'Every 2 minutes (TESTING MODE)' 
      : '2:00 AM daily (Asia/Jakarta)';
      
    return {
      isRunning: this.isRunning,
      lastRunDate: this.lastRunDate,
      nextRun: nextRun,
      mode: useTestingMode ? 'TESTING' : 'PRODUCTION',
      testingMode: this.testingMode
    };
  }

  /**
   * Enable/disable testing mode (2 minute intervals)
   */
  setTestingMode(enabled) {
    this.testingMode = enabled;
    console.log(`[CRON] Testing mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
    return this.testingMode;
  }
}

module.exports = new CronJobService();
