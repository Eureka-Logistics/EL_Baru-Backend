const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collector_purchase_invoices', {
    id_purchase_invoices: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    transaction_no: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    original_amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    reference_no: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount_receive: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    transaction_date: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    due_date: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    transaction_status_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    person_display_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'collector_purchase_invoices',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_purchase_invoices" },
        ]
      },
      {
        name: "id",
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
