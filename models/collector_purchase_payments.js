const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collector_purchase_payments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    transaction_no: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    transaction_status_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    transaction_status_created_at: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    transaction_date: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    person_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    transaction_type_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    original_amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'collector_purchase_payments',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
