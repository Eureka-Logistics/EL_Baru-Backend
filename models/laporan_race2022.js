const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('laporan_race2022', {
    report_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    bu: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    cabang: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    customer: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    origin: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    destinasi: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    msm: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    via: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    koli: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    berat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tgl_muat: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nopol: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    penjualan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    msp: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mar: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    map: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'laporan_race2022',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "report_id" },
        ]
      },
      {
        name: "msp",
        using: "BTREE",
        fields: [
          { name: "msp" },
        ]
      },
      {
        name: "msm",
        using: "BTREE",
        fields: [
          { name: "msm" },
        ]
      },
    ]
  });
};
