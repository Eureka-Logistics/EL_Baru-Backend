const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ar_billing', {
    id_billing: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_ar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    invoice_ar: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    total_penjualan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_bayar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pph: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    beban_perusahaan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    klaim: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_bank: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    saldo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    bayar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transfer_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_bank: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    bank: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    create_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_ar_billing',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_billing" },
        ]
      },
      {
        name: "invoice_ar",
        using: "BTREE",
        fields: [
          { name: "invoice_ar" },
        ]
      },
    ]
  });
};
