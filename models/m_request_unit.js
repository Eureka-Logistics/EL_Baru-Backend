const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_request_unit', {
    request_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    cabang: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customer: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    service: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    via: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    barang: {
      type: DataTypes.TEXT,
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
    tonase: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    packing: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tgl_pickup: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    jam_pickup: {
      type: DataTypes.TIME,
      allowNull: false
    },
    tariff: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tariff_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tariff_overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tariff_multidrop: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('new','waiting','approve','reject','pending','cancel'),
      allowNull: false,
      defaultValue: "new"
    },
    id_akt: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approve_akt: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false
    },
    approve_akt_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_purch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approve_purch: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false
    },
    approve_purch_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_request_unit',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "request_id" },
        ]
      },
      {
        name: "user",
        using: "BTREE",
        fields: [
          { name: "user" },
          { name: "cabang" },
          { name: "unit" },
          { name: "tgl_pickup" },
        ]
      },
    ]
  });
};
