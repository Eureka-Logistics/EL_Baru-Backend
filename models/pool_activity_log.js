const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pool_activity_log', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pool: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID pool (FK ke m_pool.id_pool)'
    },
    id_kendaraan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID kendaraan yang masuk/keluar pool (FK ke kendaraan.id)'
    },
    activity_type: {
      type: DataTypes.ENUM('IN', 'OUT'),
      allowNull: false,
      comment: 'Tipe aktivitas: IN = masuk pool, OUT = keluar pool'
    },
    scan_latitude: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: 'Latitude lokasi saat scan QR code'
    },
    scan_longitude: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: 'Longitude lokasi saat scan QR code'
    },
    scan_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID user yang melakukan scan'
    },
    scan_by_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Nama user yang melakukan scan'
    },
    jenis_kendaraan: {
      type: DataTypes.STRING(15),
      allowNull: true,
      comment: 'Jenis kendaraan yang di-scan (copy dari kendaraan.jenis_kendaraan)'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Catatan tambahan'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'pool_activity_log',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_pool",
        using: "BTREE",
        fields: [
          { name: "id_pool" },
        ]
      },
      {
        name: "id_kendaraan",
        using: "BTREE",
        fields: [
          { name: "id_kendaraan" },
        ]
      },
      {
        name: "created_at",
        using: "BTREE",
        fields: [
          { name: "created_at" },
        ]
      },
    ]
  });
};

