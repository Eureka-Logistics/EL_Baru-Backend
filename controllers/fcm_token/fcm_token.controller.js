const { query } = require('../../config/db.config');
const admin = require('../../config/firebase');

exports.saveFcmToken = async (req, res) => {
  try {
    const { token, no_telp, nama_lengkap, id_user, id_bu } = req.body;
    const now = new Date();

    await query(
      `INSERT INTO db_fcm_token (token, no_telp, nama_lengkap, id_user, id_bu, date_created, date_modified)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       no_telp = VALUES(no_telp),
       nama_lengkap = VALUES(nama_lengkap),
       id_user = VALUES(id_user),
       id_bu = VALUES(id_bu),
       date_modified = VALUES(date_modified)`,
      [token, no_telp, nama_lengkap, id_user, id_bu, now, now]
    );

    res.json({ message: 'Token berhasil disimpan.' });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      error: err
    });
  }
};


exports.kirimNotifikasi = async (req, res) => {
  try {
    const { title, body, data } = req.body;

    const tokens = await query(`SELECT token FROM db_fcm_token`);
    // const tokens = await query(`SELECT token FROM db_fcm_token WHERE id_user = ?`, [id_user]);
    const tokenList = tokens.map(row => row.token);
    // const tokenList = ["cmX0vuF3ZBqQkYJiPtKA6U:APA91bHgL2mm531Ji-Ykz2X-xmI_Z9ay1X4oa-prN3xZMk3aNKhL6i86BuHPPPGZ4J-ettxTUGud9dlVOhxWIQ5A555b2P077Hdm28oF8hGigx8ywOxM1fc"];
    // const tokenList = ["eCLJ3UItGtBICBgg2kteVV:APA91bGLNQ_WwjUSEEqPimeaDmZ0Rxko7Y1N_zEkXR5gA7xmSW2FuM-z9IqSSJvLcmXNNZrlFZcokq24LNb6s06zyblXo6ePLQSCoMNMvwVllUQsO2fVtiU"];

    if (tokenList.length === 0) {
      return res.status(200).json({ message: 'Tidak ada token untuk dikirimi notifikasi.' });
    }

    const message = {
      notification: {
        title: title || 'Notifikasi',
        body: body || 'Ada pesan baru',
      },
      data: data || {},
      tokens: tokenList
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    res.json({
      message: 'Notifikasi berhasil dikirim.',
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      error: err
    });
  }
};
