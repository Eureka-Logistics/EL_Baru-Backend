const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collector_receive_payment_record', {
    id_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    transaction_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transaction_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    transaction_no: {
      type: DataTypes.STRING(100),
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
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'collector_receive_payment_record',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_detail" },
        ]
      },
      {
        name: "transaction_id",
        using: "BTREE",
        fields: [
          { name: "transaction_id" },
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
