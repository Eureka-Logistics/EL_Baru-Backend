const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_collector_pembayaran_customer', {
    id_pembayaran_customer: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_jenis: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_bank_masuk: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nama_customer: {
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
    adminbank: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    created_datetime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_collector_pembayaran_customer',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pembayaran_customer" },
        ]
      },
      {
        name: "id_jenis",
        using: "BTREE",
        fields: [
          { name: "id_jenis" },
          { name: "id_customer" },
        ]
      },
      {
        name: "id_mitra",
        using: "BTREE",
        fields: [
          { name: "id_customer" },
        ]
      },
      {
        name: "id_bank_keluar",
        using: "BTREE",
        fields: [
          { name: "id_bank_masuk" },
        ]
      },
    ]
  });
};
