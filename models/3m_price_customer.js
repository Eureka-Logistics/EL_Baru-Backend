const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('3m_price_customer', {
    id_price: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customer: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_muat_kota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    muat_kota: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    muat_provinsi: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_tujuan_kota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tujuan_kota: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tujuan_provinsi: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    unit_type: {
      type: DataTypes.ENUM('eureka','mitra'),
      allowNull: false
    },
    vehicle_type: {
      type: DataTypes.ENUM('motor','grandmax','l300','cde','cdd','fuso','wingbox','tronton','laut','','','',''),
      allowNull: false
    },
    min: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "min unit (kg, koli, km, sewa)"
    },
    max: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "max unit (kg, koli, km, sewa)"
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "sewa, kg, koli, km"
    },
    tarif_eureka: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    diskon: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    diskon_type: {
      type: DataTypes.ENUM('amount','presentase'),
      allowNull: false,
      defaultValue: "amount"
    },
    biaya_tambahan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_jalan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tarif_net: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pic: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: '3m_price_customer',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_price" },
        ]
      },
      {
        name: "id_customer",
        using: "BTREE",
        fields: [
          { name: "id_customer" },
        ]
      },
    ]
  });
};
