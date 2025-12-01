const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ar_real', {
    id_mar: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    invoice_ar: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    kwitansi: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    kwitansi_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    customer: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    invoice_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kwitansi_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    credit_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sent_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    status_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_ar_real',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mar" },
        ]
      },
      {
        name: "invoice_ar",
        using: "BTREE",
        fields: [
          { name: "invoice_ar" },
        ]
      },
      {
        name: "kwitansi",
        using: "BTREE",
        fields: [
          { name: "kwitansi" },
        ]
      },
    ]
  });
};
