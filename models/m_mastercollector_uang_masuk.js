const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_mastercollector_uang_masuk', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_status: {
      type: DataTypes.DATE,
      allowNull: false
    },
    unit_bisnis: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cabang: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    customer: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    transaction_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    transaction_no: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    custom_id: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    payment_method_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_draft: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    deposit_to_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    withholding_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    witholding_account_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    witholding_account_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    witholding_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    witholding_type: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    request: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_mastercollector_uang_masuk',
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
      {
        name: "status",
        using: "BTREE",
        fields: [
          { name: "status" },
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
        name: "date_status",
        using: "BTREE",
        fields: [
          { name: "date_status" },
        ]
      },
    ]
  });
};
