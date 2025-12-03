const { query } = require('../../config/db.config');
const { commandCenterApp } = require('../../config/firebase');

exports.saveFcmToken = async (req, res) => {
  try {
    const { token, user_id, user_name, device_type } = req.body;

    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Token FCM wajib diisi'
      });
    }

    // Check if token already exists
    const existingToken = await query(
      `SELECT * FROM command_center_fcm_tokens WHERE token = ?`,
      [token]
    );

    if (existingToken.length > 0) {
      // Update existing token
      await query(
        `UPDATE command_center_fcm_tokens 
         SET user_id = ?, user_name = ?, device_type = ?, is_active = 1 
         WHERE token = ?`,
        [user_id, user_name, device_type || 'web', token]
      );
    } else {
      // Insert new token
      await query(
        `INSERT INTO command_center_fcm_tokens (token, user_id, user_name, device_type, is_active, created_at)
         VALUES (?, ?, ?, ?, 1, NOW())`,
        [token, user_id, user_name, device_type || 'web']
      );
    }

    res.json({ 
      status: 'success',
      message: 'Token FCM berhasil disimpan.' 
    });
  } catch (err) {
    console.error('Error saving FCM token:', err);
    res.status(500).json({
      status: 'error',
      message: err.message,
      error: err
    });
  }
};

// Helper function to split array into chunks
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

exports.kirimNotifikasi = async (req, res) => {
  try {
    const { title, body, data, user_id, device_type } = req.body;

    // Build query conditions
    let whereConditions = ['is_active = 1'];
    let queryParams = [];

    if (user_id) {
      whereConditions.push('user_id = ?');
      queryParams.push(user_id);
    }

    if (device_type) {
      whereConditions.push('device_type = ?');
      queryParams.push(device_type);
    }

    const whereClause = whereConditions.join(' AND ');
    
    // Get active tokens based on conditions
    const tokens = await query(
      `SELECT token FROM command_center_fcm_tokens WHERE ${whereClause}`,
      queryParams
    );
    
    const tokenList = tokens.map(row => row.token);

    if (tokenList.length === 0) {
      return res.status(200).json({ 
        status: 'info',
        message: 'Tidak ada token aktif untuk dikirimi notifikasi.',
        totalTokens: 0
      });
    }

    const message = {
      notification: {
        title: title || 'Command Center Notification',
        body: body || 'Ada pesan baru dari Command Center',
      },
      data: data || {},
    };

    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    const batchResults = [];
    const failedTokens = [];

    // If tokens exceed 500, split into batches
    if (tokenList.length > 500) {
      const tokenChunks = chunkArray(tokenList, 500);
      
      for (let i = 0; i < tokenChunks.length; i++) {
        try {
          const batchMessage = {
            ...message,
            tokens: tokenChunks[i]
          };
          
          const response = await commandCenterApp.messaging().sendEachForMulticast(batchMessage);
          
          totalSuccessCount += response.successCount;
          totalFailureCount += response.failureCount;
          
          // Collect failed tokens for cleanup
          if (response.responses) {
            response.responses.forEach((resp, index) => {
              if (!resp.success && resp.error) {
                const errorCode = resp.error.code;
                // Remove invalid tokens
                if (errorCode === 'messaging/invalid-registration-token' || 
                    errorCode === 'messaging/registration-token-not-registered') {
                  failedTokens.push(tokenChunks[i][index]);
                }
              }
            });
          }
          
          batchResults.push({
            batch: i + 1,
            tokensCount: tokenChunks[i].length,
            successCount: response.successCount,
            failureCount: response.failureCount
          });
          
          // Add small delay between batches to avoid rate limiting
          if (i < tokenChunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (batchError) {
          console.error(`Error in batch ${i + 1}:`, batchError);
          totalFailureCount += tokenChunks[i].length;
          batchResults.push({
            batch: i + 1,
            tokensCount: tokenChunks[i].length,
            successCount: 0,
            failureCount: tokenChunks[i].length,
            error: batchError.message
          });
        }
      }
    } else {
      // Single batch (500 tokens or less)
      try {
        message.tokens = tokenList;
        const response = await commandCenterApp.messaging().sendEachForMulticast(message);
        totalSuccessCount = response.successCount;
        totalFailureCount = response.failureCount;
        
        // Collect failed tokens for cleanup
        if (response.responses) {
          response.responses.forEach((resp, index) => {
            if (!resp.success && resp.error) {
              const errorCode = resp.error.code;
              // Remove invalid tokens
              if (errorCode === 'messaging/invalid-registration-token' || 
                  errorCode === 'messaging/registration-token-not-registered') {
                failedTokens.push(tokenList[index]);
              }
            }
          });
        }
        
        batchResults.push({
          batch: 1,
          tokensCount: tokenList.length,
          successCount: response.successCount,
          failureCount: response.failureCount
        });
      } catch (error) {
        console.error('Error sending notification:', error);
        totalFailureCount = tokenList.length;
        batchResults.push({
          batch: 1,
          tokensCount: tokenList.length,
          successCount: 0,
          failureCount: tokenList.length,
          error: error.message
        });
      }
    }

    // Clean up failed tokens
    if (failedTokens.length > 0) {
      try {
        const placeholders = failedTokens.map(() => '?').join(',');
        await query(
          `UPDATE command_center_fcm_tokens SET is_active = 0 WHERE token IN (${placeholders})`,
          failedTokens
        );
        console.log(`Deactivated ${failedTokens.length} invalid tokens`);
      } catch (cleanupError) {
        console.error('Error cleaning up invalid tokens:', cleanupError);
      }
    }

    res.json({
      status: 'success',
      message: 'Notifikasi berhasil dikirim.',
      totalTokens: tokenList.length,
      totalSuccessCount,
      totalFailureCount,
      batchResults,
      isBatched: tokenList.length > 500,
      cleanedUpTokens: failedTokens.length
    });
  } catch (err) {
    console.error('Error sending notification:', err);
    res.status(500).json({
      status: 'error',
      message: err.message,
      error: err
    });
  }
};

exports.getActiveTokens = async (req, res) => {
  try {
    const { user_id, device_type } = req.query;
    
    let whereConditions = ['is_active = 1'];
    let queryParams = [];

    if (user_id) {
      whereConditions.push('user_id = ?');
      queryParams.push(user_id);
    }

    if (device_type) {
      whereConditions.push('device_type = ?');
      queryParams.push(device_type);
    }

    const whereClause = whereConditions.join(' AND ');
    
    const tokens = await query(
      `SELECT id, user_id, user_name, device_type, created_at 
       FROM command_center_fcm_tokens 
       WHERE ${whereClause} 
       ORDER BY created_at DESC`,
      queryParams
    );

    res.json({
      status: 'success',
      message: 'Data token berhasil diambil',
      data: tokens,
      total: tokens.length
    });
  } catch (err) {
    console.error('Error getting tokens:', err);
    res.status(500).json({
      status: 'error',
      message: err.message,
      error: err
    });
  }
};

exports.deleteToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Token wajib diisi'
      });
    }

    await query(
      `UPDATE command_center_fcm_tokens SET is_active = 0 WHERE token = ?`,
      [token]
    );

    res.json({
      status: 'success',
      message: 'Token berhasil dihapus (dinonaktifkan)'
    });
  } catch (err) {
    console.error('Error deleting token:', err);
    res.status(500).json({
      status: 'error',
      message: err.message,
      error: err
    });
  }
};

// Test Firebase Command Center connection
exports.testConnection = async (req, res) => {
  try {
    // Test Command Center Firebase app connection
    const messaging = commandCenterApp.messaging();
    
    // Try to get app info
    const appInfo = {
      name: commandCenterApp.name,
      projectId: commandCenterApp.options.projectId,
      isConnected: true
    };

    // Try a simple operation to verify connection
    const testMessage = {
      notification: {
        title: 'Connection Test',
        body: 'Testing Firebase Command Center connection',
      },
      token: 'dummy-token-for-test' // This will fail but we can catch it
    };

    try {
      await messaging.send(testMessage);
    } catch (testError) {
      // Expected to fail with invalid token, but this confirms Firebase is working
      if (testError.code === 'messaging/invalid-registration-token' || 
          testError.code === 'messaging/registration-token-not-registered' ||
          testError.code === 'messaging/invalid-argument') {
        // This is expected - Firebase is working but token is invalid
        res.json({
          status: 'success',
          message: 'Firebase Command Center connection berhasil! ✅',
          data: {
            ...appInfo,
            testResult: 'Firebase messaging service is working (expected token validation error)',
            connectionStatus: 'CONNECTED',
            firebase: {
              app: commandCenterApp.name,
              project: commandCenterApp.options.projectId,
              credential: 'Valid service account'
            },
            timestamp: new Date().toISOString()
          }
        });
        return;
      }
      throw testError; // Unexpected error
    }

    // If we get here, something unexpected happened
    res.json({
      status: 'success', 
      message: 'Firebase Command Center connection berhasil!',
      data: {
        ...appInfo,
        testResult: 'Connection test completed successfully',
        timestamp: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('Firebase Command Center connection test failed:', err);
    res.status(500).json({
      status: 'error',
      message: 'Firebase Command Center connection gagal',
      error: {
        code: err.code,
        message: err.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Test notification to specific token
exports.testNotification = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Token harus diisi'
      });
    }

    const message = {
      notification: {
        title: 'Test Notification - Command Center',
        body: 'Ini adalah test notifikasi dari Command Center',
      },
      data: {
        test: 'true',
        timestamp: new Date().toISOString()
      },
      webpush: {
        headers: {
          'TTL': '300'
        },
        notification: {
          title: 'Test Notification - Command Center',
          body: 'Ini adalah test notifikasi dari Command Center',
          icon: '/img/elogs.jpg',
          badge: '/img/elogs.jpg',
          click_action: 'https://commandcenter.eurekalogistics.co.id'
        }
      },
      token: token
    };

    // Use Command Center Firebase app
    const messaging = commandCenterApp.messaging();
    const response = await messaging.send(message);

    res.json({
      status: 'success',
      message: 'Test notifikasi berhasil dikirim',
      messageId: response
    });
  } catch (err) {
    console.error('Error sending test notification:', err);
    res.status(500).json({
      status: 'error',
      message: err.message,
      error: err
    });
  }
};
