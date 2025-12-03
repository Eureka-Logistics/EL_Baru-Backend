const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_collector_pembayaran_vendor', {
    id_pembayaran_vendor: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_jenis: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'm_collector_jenis_pembayaran_vendor',
        key: 'id_jenis'
      }
    },
    id_bank_keluar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'm_collector_bank_keluar',
        key: 'id_bank_keluar'
      }
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mitra',
        key: 'id_mitra'
      }
    },
    nama_mitra: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    total_nominal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tgl_transfer: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_datetime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_collector_pembayaran_vendor',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pembayaran_vendor" },
        ]
      },
      {
        name: "id_jenis",
        using: "BTREE",
        fields: [
          { name: "id_jenis" },
          { name: "id_mitra" },
        ]
      },
      {
        name: "id_mitra",
        using: "BTREE",
        fields: [
          { name: "id_mitra" },
        ]
      },
      {
        name: "id_bank_keluar",
        using: "BTREE",
        fields: [
          { name: "id_bank_keluar" },
        ]
      },
    ]
  });
};
