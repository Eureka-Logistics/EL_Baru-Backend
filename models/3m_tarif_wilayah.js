const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('3m_tarif_wilayah', {
    id_wilayah: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tariff_code: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    id_kelurahan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kelurahan: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_kecamatan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kode_kecamatan: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    kecamatan: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_kota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kode_kota: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    kota: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_provinsi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    provinsi: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    kodepos: {
      type: DataTypes.STRING(15),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: '3m_tarif_wilayah',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_wilayah" },
        ]
      },
      {
        name: "provinsi",
        using: "BTREE",
        fields: [
          { name: "id_provinsi" },
          { name: "provinsi" },
        ]
      },
      {
        name: "kota",
        using: "BTREE",
        fields: [
          { name: "id_kota" },
          { name: "kota" },
        ]
      },
      {
        name: "kecamatan",
        using: "BTREE",
        fields: [
          { name: "id_kecamatan" },
          { name: "kecamatan" },
        ]
      },
      {
        name: "kelurahan",
        using: "BTREE",
        fields: [
          { name: "id_kelurahan" },
          { name: "kelurahan" },
        ]
      },
      {
        name: "kode_kecamatan",
        using: "BTREE",
        fields: [
          { name: "kode_kecamatan" },
        ]
      },
      {
        name: "kode_kota",
        using: "BTREE",
        fields: [
          { name: "kode_kota" },
        ]
      },
    ]
  });
};
