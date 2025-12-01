const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_collector_agedhutang', {
    piutang_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    supplier: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pembelian: {
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
    tableName: 'm_collector_agedhutang',
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
          { name: "supplier_id" },
          { name: "supplier" },
        ]
      },
    ]
  });
};
