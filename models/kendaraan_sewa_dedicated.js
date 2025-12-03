const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kendaraan_sewa_dedicated', {
    id_sewa_dedicated: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_kendaraan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tgl_start: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tgl_end: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    no_perjanjian_kerjasama: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    harga: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tgl_create: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'kendaraan_sewa_dedicated',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_sewa_dedicated" },
        ]
      },
    ]
  });
};
