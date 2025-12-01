const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collector_receive_payment', {
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
      type: DataTypes.STRING(100),
      allowNull: false
    },
    transaction_date: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    transaction_status: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    transaction_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    person_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    person_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    deposit_to_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    deposit_to_number: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    original_amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    id_jurnalid: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'collector_receive_payment',
    timestamps: false,
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
