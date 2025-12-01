const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collector_purchase_payments_records', {
    id_purchase_payments: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    transaction_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    transaction_no: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    transaction_due_date: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    transaction_total: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    transaction_balance_due: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'collector_purchase_payments_records',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_purchase_payments" },
        ]
      },
    ]
  });
};
