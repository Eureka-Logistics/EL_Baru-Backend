const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kendaraan_jenis', {
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
    }
  }, {
    sequelize,
    tableName: 'kendaraan_jenis',
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
