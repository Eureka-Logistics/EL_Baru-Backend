const cronJobService = require('../../services/cronJobService');

/**
 * Controller for GPS cron job management
 */

/**
 * Get cron job status
 */
exports.getCronStatus = async (req, res) => {
  try {
    const status = cronJobService.getStatus();
    
    res.status(200).json({
      success: true,
      status: 200,
      data: status
    });
  } catch (error) {
    console.error('[CRON CONTROLLER ERROR] Failed to get status:', error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to get cron job status',
      error: error.message
    });
  }
};

/**
 * Manual trigger for cron job (for testing)
 */
exports.manualTrigger = async (req, res) => {
  try {
    // Start the job asynchronously
    cronJobService.manualTrigger().catch(error => {
      console.error('[CRON MANUAL TRIGGER ERROR]:', error.message);
    });
    
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Manual GPS collection triggered successfully',
      note: 'Job is running in background, check logs for progress'
    });
  } catch (error) {
    console.error('[CRON CONTROLLER ERROR] Failed to trigger manual job:', error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to trigger manual GPS collection',
      error: error.message
    });
  }
};

/**
 * Manual sync for a given date range (YYYY-MM-DD to YYYY-MM-DD)
 * Body or query params: start_date, end_date
 * Idempotent via DB unique index and INSERT IGNORE in service
 */
exports.manualSyncRange = async (req, res) => {
  try {
    const start_date = req.query.start_date || req.body?.start_date;
    const end_date = req.query.end_date || req.body?.end_date || start_date;

    if (!start_date) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'start_date is required (YYYY-MM-DD)'
      });
    }

    // Trigger in background, same logic as cron but for custom range
    cronJobService.runGpsCollectionForRange(start_date, end_date).catch(error => {
      console.error('[CRON MANUAL SYNC ERROR]:', error.message);
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Manual GPS sync triggered successfully',
      range: { start_date, end_date },
      note: 'Job is running in background, check logs for progress'
    });
  } catch (error) {
    console.error('[CRON CONTROLLER ERROR] Failed to trigger manual sync:', error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to trigger manual GPS manual sync',
      error: error.message
    });
  }
};

/**
 * Get current manual sync progress
 */
exports.getManualSyncProgress = async (req, res) => {
  try {
    const progress = cronJobService.getManualSyncProgress();
    res.status(200).json({
      success: true,
      status: 200,
      data: progress
    });
  } catch (error) {
    console.error('[CRON CONTROLLER ERROR] Failed to get manual sync progress:', error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to get manual sync progress',
      error: error.message
    });
  }
};

/**
 * Get list of active vehicles that will be processed
 */
exports.getActiveVehicles = async (req, res) => {
  try {
    const vehicles = await cronJobService.getAllActiveVehiclesWithGPS();
    
    res.status(200).json({
      success: true,
      status: 200,
      total: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    console.error('[CRON CONTROLLER ERROR] Failed to get active vehicles:', error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to fetch active vehicles',
      error: error.message
    });
  }
};

/**
 * Debug database query to check vehicles
 */
exports.debugVehicles = async (req, res) => {
  const core = require('../../config/core.config');
  const models = core.models();
  const { Op } = require('sequelize');
  
  try {
    // Check all vehicles
    const allVehicles = await models.kendaraan.findAll({
      attributes: ['id', 'gps_device_id', 'no_polisi', 'gps_type', 'status'],
      limit: 10,
      raw: true
    });

    // Check active vehicles
    const activeVehicles = await models.kendaraan.findAll({
      where: { status: '1' },
      attributes: ['id', 'gps_device_id', 'no_polisi', 'gps_type', 'status'],
      limit: 10,
      raw: true
    });

    // Check vehicles with GPS device IDs
    const gpsDeviceVehicles = await models.kendaraan.findAll({
      where: {
        status: '1',
        gps_device_id: {
          [Op.ne]: null
        }
      },
      attributes: ['id', 'gps_device_id', 'no_polisi', 'gps_type', 'status'],
      limit: 10,
      raw: true
    });

    res.status(200).json({
      success: true,
      status: 200,
      data: {
        allVehicles,
        activeVehicles,
        gpsDeviceVehicles,
        totalAll: allVehicles.length,
        totalActive: activeVehicles.length,
        totalWithGPS: gpsDeviceVehicles.length
      }
    });
  } catch (error) {
    console.error('[DEBUG ERROR]:', error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Debug query failed',
      error: error.message
    });
  }
};

/**
 * Enable/disable testing mode
 */
exports.setTestingMode = async (req, res) => {
  try {
    const { enabled } = req.body;
    
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'enabled parameter must be boolean (true/false)'
      });
    }
    
    const testingMode = cronJobService.setTestingMode(enabled);
    
    res.status(200).json({
      success: true,
      status: 200,
      message: `Testing mode ${enabled ? 'enabled' : 'disabled'}`,
      data: { testingMode }
    });
  } catch (error) {
    console.error('[CRON CONTROLLER ERROR] Failed to set testing mode:', error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to set testing mode',
      error: error.message
    });
  }
};
