const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_tarif_mitra', {
    id_price_mitra: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_tarif_mitra: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    id_muat_kota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tujuan_kota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_kendaraan_jenis: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    jenis_kiriman: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    via: {
      type: DataTypes.ENUM('darat','laut','udara'),
      allowNull: false
    },
    tarif: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Y','N','D'),
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_bu: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_tonase: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    satuan: {
      type: DataTypes.ENUM('KG', 'TON'),
      allowNull: true
    },
    kode_surat: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_tarif_mitra',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_price_mitra" },
        ]
      },
      {
        name: "id_muat_kota",
        using: "BTREE",
        fields: [
          { name: "id_muat_kota" },
        ]
      },
      {
        name: "id_tujuan_kota",
        using: "BTREE",
        fields: [
          { name: "id_tujuan_kota" },
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
        name: "id_kendaraan_jenis",
        using: "BTREE",
        fields: [
          { name: "id_kendaraan_jenis" },
        ]
      },
      {
        name: "id_user",
        using: "BTREE",
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
};
