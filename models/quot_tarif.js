const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quot_tarif', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sales: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    perusahaan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    muat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    bongkar: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    berat: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    kendaraan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    packing: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    rute: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    biaya_muat: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    biaya_bongkar: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    harga: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tarif: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    akunting: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    },
    tgl_akunting: {
      type: DataTypes.DATE,
      allowNull: false
    },
    direktur: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    },
    tgl_direktur: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_quot: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'quot_tarif',
    timestamps: false
  });
};
