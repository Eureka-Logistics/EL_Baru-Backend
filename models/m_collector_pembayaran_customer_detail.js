const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_collector_pembayaran_customer_detail', {
    id_pembayaran_customer_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pembayaran_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_ar: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    invoice: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ket_invoice: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nominal: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    pph23: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    barangrusak: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    bebanperusahaan: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_collector_pembayaran_customer_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pembayaran_customer_detail" },
        ]
      },
      {
        name: "id_pembayaran_vendor",
        using: "BTREE",
        fields: [
          { name: "id_pembayaran_customer" },
        ]
      },
      {
        name: "id_ap",
        using: "BTREE",
        fields: [
          { name: "id_ar" },
        ]
      },
    ]
  });
};
