const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_order_invoice_details', {
    id_oid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_order_invoice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_km: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_fee: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'emc_order_invoice_details',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_oid" },
        ]
      },
      {
        name: "id_order",
        using: "BTREE",
        fields: [
          { name: "id_order" },
        ]
      },
    ]
  });
};
