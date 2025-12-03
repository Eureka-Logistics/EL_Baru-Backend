const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_purch_invoice_pembayaran', {
    purch_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    invoice_no: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    mitra: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    total_transfer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tgl_transfer: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_purch_invoice_pembayaran',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "purch_id" },
        ]
      },
    ]
  });
};
