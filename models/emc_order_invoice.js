const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_order_invoice', {
    id_order_invoice: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('exp','reg'),
      allowNull: false,
      defaultValue: "exp"
    },
    payment: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "tempo"
    },
    no_invoice: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    no_faktur_pajak: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    id_faktur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    top: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ppn: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pph: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_invoice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    invoice_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    printinvoice_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    status_pajak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_lunas: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_status: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'emc_order_invoice',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_order_invoice" },
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
