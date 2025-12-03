const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kendaraan_jenis_race', {
    id_kendaraan_jenis: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama_kendaraan_jenis: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: "nama_kendaraan_jenis"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bbm: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    jarak_liter: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kapasitas: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'kendaraan_jenis_race',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_kendaraan_jenis" },
        ]
      },
      {
        name: "nama_kendaraan_jenis",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nama_kendaraan_jenis" },
        ]
      },
    ]
  });
};
