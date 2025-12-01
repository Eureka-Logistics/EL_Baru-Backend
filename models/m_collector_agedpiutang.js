const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_collector_agedpiutang', {
    piutang_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customer: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    penjualan: {
      type: DataTypes.DOUBLE(30,2),
      allowNull: false
    },
    pembayaran: {
      type: DataTypes.DOUBLE(30,2),
      allowNull: false
    },
    saldo: {
      type: DataTypes.DOUBLE(30,2),
      allowNull: false
    },
    per_30: {
      type: DataTypes.DOUBLE(30,2),
      allowNull: false
    },
    per_60: {
      type: DataTypes.DOUBLE(30,2),
      allowNull: false
    },
    per_90: {
      type: DataTypes.DOUBLE(30,2),
      allowNull: false
    },
    per_more: {
      type: DataTypes.DOUBLE(30,2),
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_collector_agedpiutang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "piutang_id" },
        ]
      },
      {
        name: "customer_id",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
          { name: "customer" },
        ]
      },
      {
        name: "customer",
        using: "BTREE",
        fields: [
          { name: "customer" },
        ]
      },
      {
        name: "date_created",
        using: "BTREE",
        fields: [
          { name: "date_created" },
        ]
      },
    ]
  });
};
