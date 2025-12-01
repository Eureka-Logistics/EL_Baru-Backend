const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_asset_permintaan_inventaris_spesifikasi', {
    id_spesifikasi: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code_permintaan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    merk_lama: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    type_lama: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    processor_lama: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    memory_lama: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    hdd_lama: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    motherboard_lama: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    monitor_lama: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    keyboard_lama: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    mouse_lama: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    lainnya_lama: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    merk_baru: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    type_baru: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    processor_baru: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    memory_baru: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    hdd_baru: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    motherboard_baru: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    monitor_baru: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    keyboard_baru: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mouse_baru: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    lainnya_baru: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'it_asset_permintaan_inventaris_spesifikasi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_spesifikasi" },
        ]
      },
      {
        name: "id_spesifikasi",
        using: "BTREE",
        fields: [
          { name: "id_spesifikasi" },
        ]
      },
      {
        name: "code_permintaan",
        using: "BTREE",
        fields: [
          { name: "code_permintaan" },
        ]
      },
    ]
  });
};
