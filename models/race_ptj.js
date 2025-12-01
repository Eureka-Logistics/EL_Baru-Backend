const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('race_ptj', {
    id_data: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      primaryKey: true
    },
    kode_transfer: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tgl_transfer: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    bulan: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    customer: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    dari: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tujuan: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nopol: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nama_driver: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    keterangan_1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    keterangan_2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nominal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bbm: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tol_dan_parkir: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lain_lain: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'race_ptj',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_data" },
        ]
      },
    ]
  });
};
