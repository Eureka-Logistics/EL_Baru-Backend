const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CommandCenterFcmTokens = sequelize.define('CommandCenterFcmTokens', {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'FCM token untuk push notification'
    },
    user_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'User ID untuk identifikasi user'
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Nama user'
    },
    device_type: {
      type: DataTypes.ENUM('web', 'mobile', 'desktop'),
      allowNull: true,
      defaultValue: 'web',
      comment: 'Tipe device'
    },
    is_active: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: 1,
      comment: 'Status aktif token'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      comment: 'Waktu pembuatan'
    }
  }, {
    tableName: 'command_center_fcm_tokens',
    timestamps: false, // Disable automatic timestamps
    indexes: [
      {
        name: 'idx_token',
        fields: ['token']
      },
      {
        name: 'idx_user_id',
        fields: ['user_id']
      },
      {
        name: 'idx_device_type',
        fields: ['device_type']
      },
      {
        name: 'idx_is_active',
        fields: ['is_active']
      },
      {
        name: 'idx_created_at',
        fields: ['created_at']
      }
    ]
  });

  return CommandCenterFcmTokens;
};
